import apply from "window-function/apply";
import { blackman, hamming, hann, triangular } from "window-function";
import { RFFT } from "fftw-js";
import { DataToProcessor, DataFromProcessor, Parameters } from "./SpectralAnalyser";
import { setTypedArray, getSubTypedArray, fftw2Amp, estimateFreq, centroid, flatness, flux, kurtosis, skewness, rolloff, slope, indexToFreq, spread, sum } from "../../../../utils/buffer";
import { ceil } from "../../../../utils/math";
import { windowEnergyFactor } from "../../../../utils/windowEnergy";

declare const sampleRate: number;
const processorID = "__JSPatcher_SpectralAnalyser";

/**
 * Some data to transfer across threads
 *
 * @class SpectralAnalyserAtoms
 */
class SpectralAnalyserAtoms {
    private readonly _sab: SharedArrayBuffer;
    private readonly _lock: Int32Array;
    private readonly _$: Uint32Array;
    private readonly _$total: Uint32Array;
    private readonly _$frame: Uint32Array;
    private readonly _$totalFrames: Uint32Array;
    /**
     * Next audio sample index to write into window
     *
     * @type {number}
     * @memberof SpectralAnalyserAtoms
     */
    get $(): number {
        return this._$[0];
    }
    set $(value: number) {
        this._$[0] = value;
    }
    /**
     * Total samples written counter
     *
     * @type {number}
     * @memberof SpectralAnalyserAtoms
     */
    get $total(): number {
        return this._$total[0];
    }
    set $total(value: number) {
        this._$total[0] = value;
    }
    /**
     * Next FFT frame index to write into fftWindow
     *
     * @type {number}
     * @memberof SpectralAnalyserAtoms
     */
    get $frame(): number {
        return this._$frame[0];
    }
    set $frame(value: number) {
        this._$frame[0] = value;
    }
    /**
     * Total FFT frames written counter
     *
     * @type {number}
     * @memberof SpectralAnalyserAtoms
     */
    get $totalFrames(): number {
        return this._$totalFrames[0];
    }
    set $totalFrames(value: number) {
        this._$totalFrames[0] = value;
    }
    /**
     * Get all atoms
     *
     * @readonly
     * @memberof SpectralAnalyserAtoms
     */
    get atoms() {
        return { $: this._$, $total: this._$total, $frame: this._$frame, $totalFrames: this._$totalFrames, lock: this._lock };
    }
    wait() {
        while (Atomics.load(this._lock, 0));
    }
    lock() {
        return Atomics.store(this._lock, 0, 1);
    }
    unlock() {
        return Atomics.store(this._lock, 0, 0);
    }
    constructor() {
        this._sab = new SharedArrayBuffer(5 * Uint32Array.BYTES_PER_ELEMENT);
        this._lock = new Int32Array(this._sab, 0, 1);
        this._$ = new Uint32Array(this._sab, 4, 1);
        this._$total = new Uint32Array(this._sab, 8, 1);
        this._$frame = new Uint32Array(this._sab, 12, 1);
        this._$totalFrames = new Uint32Array(this._sab, 16, 1);
    }
}

class SpectralAnalyserProcessor extends AudioWorkletProcessor<DataToProcessor, DataFromProcessor, Parameters> {
    static get parameterDescriptors(): AudioWorkletAudioParamDescriptor<Parameters>[] {
        return [{
            defaultValue: 1024,
            maxValue: 2 ** 32,
            minValue: 128,
            name: "windowSize"
        }, {
            defaultValue: 1024,
            maxValue: 2 ** 32,
            minValue: 1,
            name: "fftSize"
        }, {
            defaultValue: 2,
            maxValue: 32,
            minValue: 1,
            name: "fftOverlap"
        }, {
            defaultValue: 0,
            maxValue: 3,
            minValue: 0,
            name: "windowFunction"
        }];
    }
    private destroyed = false;
    /**
     * Concatenated audio data, array of channels
     *
     * @type {SharedArrayBuffer[]}
     * @memberof SpectralAnalyserProcessor
     */
    private window: SharedArrayBuffer[] = [];
    /**
     * Float32Array Buffer view of window
     *
     * @private
     * @type {Float32Array[]}
     * @memberof TemporalAnalyserProcessor
     */
    private windowF32: Float32Array[] = [];
    /**
     * Concatenated FFT amplitude data, array of channels.
     *
     * @type {SharedArrayBuffer[]}
     * @memberof SpectralAnalyserProcessor
     */
    private fftWindow: SharedArrayBuffer[] = [];
    /**
     * Float32Array Buffer view of fft window
     *
     * @private
     * @type {Float32Array[]}
     * @memberof SpectralAnalyserProcessor
     */
    private fftWindowF32: Float32Array[] = [];
    private readonly _atoms = new SpectralAnalyserAtoms();
    /**
     * Shared Data
     *
     * @memberof SpectralAnalyserProcessor
     */
    get atoms() {
        return this._atoms.atoms;
    }
    /**
     * Next audio sample index to write into window
     *
     * @memberof SpectralAnalyserProcessor
     */
    get $() {
        return this._atoms.$;
    }
    set $(value: number) {
        this._atoms.$ = value;
    }
    /**
     * Total samples written counter
     *
     * @memberof SpectralAnalyserProcessor
     */
    get $total() {
        return this._atoms.$total;
    }
    set $total(value: number) {
        this._atoms.$total = value;
    }
    /**
     * Next FFT frame index to write into fftWindow
     *
     * @memberof SpectralAnalyserProcessor
     */
    get $frame() {
        return this._atoms.$frame;
    }
    set $frame(value: number) {
        this._atoms.$frame = value;
    }
    /**
     * Total FFT frames written counter
     *
     * @memberof SpectralAnalyserProcessor
     */
    get $totalFrames() {
        return this._atoms.$totalFrames;
    }
    set $totalFrames(value: number) {
        this._atoms.$totalFrames = value;
    }
    /**
     * Total FFT frames in fftWindow
     * windowSize = (frames - 1) * fftHopSize + fftSize
     *
     * @memberof SpectralAnalyserProcessor
     */
    private frames = 0;
    /**
     * Samples that already written into window, but not analysed by FFT yet
     *
     * @memberof SpectralAnalyserProcessor
     */
    private samplesWaiting = 0;
    /**
     * FFTW.js instance
     *
     * @private
     * @memberof SpectralAnalyserProcessor
     */
    private fftw = new RFFT(1024);
    private _windowSize = 1024;
    private _fftHopSize = 512;
    private _fftSize = 1024;
    private _windowFunction = blackman;
    get fftBins() {
        return this._fftSize / 2;
    }
    /**
     * Next FFT value index to write into fftWindow
     *
     * @readonly
     * @memberof SpectralAnalyserNode
     */
    get $fft() {
        return this.$frame * this.fftBins;
    }
    constructor(options: AudioWorkletNodeOptions) {
        super(options);
        this.port.onmessage = (e) => {
            const { id } = e.data;
            if (e.data.destroy) this.destroy();
            const message = {} as DataFromProcessor;
            if (e.data.buffer) message.buffer = this.buffer;
            if (e.data.lastAmplitudes) message.lastAmplitudes = this.lastAmplitudes;
            if (e.data.allAmplitudes) message.allAmplitudes = this.allAmplitudes;
            if (e.data.amplitude) message.amplitude = this.amplitude;
            if (e.data.estimatedFreq) message.estimatedFreq = this.estimatedFreq;
            if (e.data.centroid) message.centroid = this.centroid;
            if (e.data.flatness) message.flatness = this.flatness;
            if (e.data.flux) message.flux = this.flux;
            if (e.data.kurtosis) message.kurtosis = this.kurtosis;
            if (e.data.skewness) message.skewness = this.skewness;
            if (e.data.rolloff) message.rolloff = this.rolloff;
            if (e.data.slope) message.slope = this.slope;
            if (e.data.spread) message.spread = this.spread;
            this.port.postMessage({ id, ...message });
        };
    }
    get buffer(): DataFromProcessor["buffer"] {
        const data = this.windowF32;
        const { $, $total, lock } = this.atoms;
        return { data, $, $total, lock };
    }
    get lastAmplitudes(): DataFromProcessor["lastAmplitudes"] {
        const { $frame, $totalFrames } = this;
        return { $frame, data: this.lastFrame, $totalFrames };
    }
    get allAmplitudes(): DataFromProcessor["allAmplitudes"] {
        const data = this.fftWindowF32;
        const { $frame, $totalFrames, lock } = this.atoms;
        const { frames, fftBins, fftHopSize } = this;
        return { $frame, data, frames, fftBins, fftHopSize, $totalFrames, lock };
    }
    get amplitude() {
        return this.lastFrame.map(channel => sum(channel));
    }
    get estimatedFreq() {
        return this.lastFrame.map(channel => estimateFreq(channel, sampleRate));
    }
    get centroid() {
        return this.lastFrame.map(channel => indexToFreq(centroid(channel), this.fftBins, sampleRate));
    }
    get flatness() {
        return this.lastFrame.map(channel => flatness(channel));
    }
    get flux() {
        const secondLastFrame = this.getLastFrame(2);
        return this.lastFrame.map((channel, i) => flux(channel, secondLastFrame[i]));
    }
    get kurtosis() {
        return this.lastFrame.map(channel => kurtosis(channel));
    }
    get skewness() {
        return this.lastFrame.map(channel => skewness(channel));
    }
    get rolloff() {
        return this.lastFrame.map(channel => indexToFreq(rolloff(channel), this.fftBins, sampleRate));
    }
    get slope() {
        return this.lastFrame.map(channel => slope(channel)/* / (sampleRate / 2 / this.fftBins)*/);
    }
    get spread() {
        return this.lastFrame.map(channel => spread(channel));
    }
    get lastFrame() {
        return this.getLastFrame(1);
    }
    getLastFrame(offset: number) {
        const { fftWindowF32, fftBins, $frame } = this;
        return fftWindowF32.map(window => getSubTypedArray<Float32Array>(window, fftBins, ($frame - offset) * fftBins));
    }
    get windowSize() {
        return this._windowSize;
    }
    set windowSize(sizeIn: number) {
        this._windowSize = ~~Math.min(2 ** 32, Math.max(128, sizeIn || 1024));
    }
    get fftSize() {
        return this._fftSize;
    }
    set fftSize(sizeIn: number) {
        const fftSize = ~~ceil(Math.min(this._windowSize, Math.max(2, sizeIn || 1024)), 2);
        if (fftSize !== this._fftSize) {
            this.fftw.dispose();
            this.fftw = new RFFT(fftSize);
            this.samplesWaiting = 0;
            this.$frame = 0;
            this._fftSize = fftSize;
        }
    }
    get fftOverlap() {
        return this._fftSize / this._fftHopSize;
    }
    set fftOverlap(overlapIn: number) {
        const fftOverlap = ~~Math.min(this._fftSize, Math.max(2, overlapIn));
        this._fftHopSize = ~~Math.max(1, this._fftSize / fftOverlap);
    }
    get fftHopSize() {
        return this._fftHopSize;
    }
    set fftHopSize(sizeIn: number) {
        this._fftHopSize = ~~Math.max(1, sizeIn);
    }
    set windowFunction(funcIn: number) {
        this._windowFunction = [blackman, hamming, hann, triangular][~~funcIn];
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: { [key in Parameters]: Float32Array }) {
        if (this.destroyed) return false;
        const input = inputs[0];
        this.windowSize = ~~parameters.windowSize[0];
        this.fftSize = ~~parameters.fftSize[0];
        this.fftOverlap = ~~parameters.fftOverlap[0];
        this.windowFunction = ~~parameters.windowFunction[0];
        const { windowSize, fftSize, fftHopSize, fftBins } = this;
        const frames = ~~((windowSize - fftSize) / fftHopSize) + 1;
        const fftWindowSize = frames * fftBins;
        this.frames = frames;

        if (this.window.length > input.length) {
            this.window.splice(input.length);
            this.fftWindow.splice(input.length);
            this.windowF32.splice(input.length);
            this.fftWindowF32.splice(input.length);
        }
        if (input.length === 0) return true;

        const bufferSize = Math.max(...input.map(c => c.length)) || 128;

        this._atoms.wait();
        this._atoms.lock();

        this.$ %= windowSize;
        this.$frame %= frames;
        this.$total += bufferSize;
        let { $, samplesWaiting, $frame, $totalFrames, $fft } = this;
        // Init windows
        for (let i = 0; i < input.length; i++) {
            $ = this.$;
            $fft = this.$fft;
            if (!this.window[i]) { // Initialise channel if not exist
                this.window[i] = new SharedArrayBuffer(windowSize * Float32Array.BYTES_PER_ELEMENT);
                this.fftWindow[i] = new SharedArrayBuffer(fftWindowSize * Float32Array.BYTES_PER_ELEMENT);
                this.windowF32[i] = new Float32Array(this.window[i]);
                this.fftWindowF32[i] = new Float32Array(this.fftWindow[i]);
            } else {
                if (this.windowF32[i].length !== windowSize) { // adjust window size if not corresponded
                    const oldWindow = this.window[i];
                    const oldWindowSize = oldWindow.length;
                    const window = new SharedArrayBuffer(windowSize * Float32Array.BYTES_PER_ELEMENT);
                    $ = setTypedArray(new Float32Array(window), new Float32Array(oldWindow), 0, $ - Math.min(windowSize, oldWindowSize));
                    this.window[i] = window;
                    this.windowF32[i] = new Float32Array(window);
                }
                if (this.fftWindowF32[i].length !== fftWindowSize) { // adjust fftWindow size if not corresponded
                    const oldWindow = this.fftWindow[i];
                    const oldWindowSize = oldWindow.length;
                    const window = new SharedArrayBuffer(fftWindowSize * Float32Array.BYTES_PER_ELEMENT);
                    $fft = setTypedArray(new Float32Array(window), new Float32Array(oldWindow), 0, $fft - Math.min(windowSize, oldWindowSize));
                    $frame = ~~($fft / fftBins);
                    this.fftWindow[i] = window;
                    this.fftWindowF32[i] = new Float32Array(window);
                }
            }
        }
        this.$ = $;
        this.$frame = $frame;
        // Write
        for (let i = 0; i < input.length; i++) {
            const window = this.windowF32[i];
            const channel = input[i].length ? input[i] : new Float32Array(bufferSize);
            $ = this.$;
            $frame = this.$frame;
            $totalFrames = this.$totalFrames;
            samplesWaiting = this.samplesWaiting;
            if (bufferSize > windowSize) {
                window.set(channel.subarray(bufferSize - windowSize));
                $ = 0;
                samplesWaiting = windowSize;
            } else {
                $ = setTypedArray(window, channel, $);
                samplesWaiting += bufferSize;
            }
            while (samplesWaiting >= fftHopSize) {
                if (samplesWaiting / fftHopSize < frames + 1) {
                    const trunc = new Float32Array(fftSize);
                    setTypedArray(trunc, window, 0, $ - samplesWaiting + fftHopSize - fftSize);
                    apply(trunc, this._windowFunction);
                    const ffted = this.fftw.forward(trunc);
                    const amps = fftw2Amp(ffted, windowEnergyFactor.blackman);
                    this.fftWindowF32[i].set(amps, $frame * fftBins);
                    $frame = ($frame + 1) % this.frames;
                }
                $totalFrames++;
                samplesWaiting -= fftHopSize;
            }
        }
        this.$ = $;
        this.$frame = $frame;
        this.$totalFrames = $totalFrames;
        this.samplesWaiting = samplesWaiting;
        this._atoms.unlock();
        return true;
    }
    destroy() {
        this.destroyed = true;
        this.port.close();
        this.window = [];
    }
}
registerProcessor(processorID, SpectralAnalyserProcessor);
