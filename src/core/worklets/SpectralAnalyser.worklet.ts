import apply from "window-function/apply";
import { blackman, hamming, hann, triangular } from "window-function";
import { RFFT } from "fftw-js";
import { setTypedArray, getSubTypedArray, indexToFreq, sum, centroid, estimateFreq, fftw2Amp, flatness, flux, kurtosis, rolloff, skewness, slope, spread } from "../../utils/buffer";
import { ceil } from "../../utils/math";
import { AudioWorkletGlobalScope, TypedAudioParamDescriptor } from "./TypedAudioWorklet";
import { ISpectralAnalyserProcessor, ISpectralAnalyserNode, SpectralAnalyserParameters, SpectralAnalysis } from "./SpectralAnalyserWorklet.types";
import AudioWorkletProxyProcessor from "./AudioWorkletProxyProcessor";
import { windowEnergyFactor } from "../../utils/windowEnergy";

const processorID = "__JSPatcher_SpectralAnalyser";
declare const globalThis: AudioWorkletGlobalScope & { SharedArrayBuffer: typeof SharedArrayBuffer | typeof ArrayBuffer; Atomics: typeof Atomics };
if (!globalThis.SharedArrayBuffer) globalThis.SharedArrayBuffer = ArrayBuffer;
const { registerProcessor, sampleRate } = globalThis;

/**
 * Some data to transfer across threads
 */
class SpectralAnalyserAtoms {
    private readonly _sab: SharedArrayBuffer;
    private readonly _lock: Int32Array;
    private readonly _$: Uint32Array;
    private readonly _$total: Uint32Array;
    private readonly _$frame: Uint32Array;
    private readonly _$totalFrames: Uint32Array;
    /**
     * Atomic Lock
     */
    get lock(): number {
        return globalThis.Atomics?.load?.(this._lock, 0);
    }
    set lock(value: number) {
        globalThis.Atomics?.store?.(this._lock, 0, value);
    }
    /**
     * Next audio sample index to write into window
     */
    get $(): number {
        return this._$[0];
    }
    set $(value: number) {
        this._$[0] = value;
    }
    /**
     * Total samples written counter
     */
    get $total(): number {
        return this._$total[0];
    }
    set $total(value: number) {
        this._$total[0] = value;
    }
    /**
     * Next FFT frame index to write into fftWindow
     */
    get $frame(): number {
        return this._$frame[0];
    }
    set $frame(value: number) {
        this._$frame[0] = value;
    }
    /**
     * Total FFT frames written counter
     */
    get $totalFrames(): number {
        return this._$totalFrames[0];
    }
    set $totalFrames(value: number) {
        this._$totalFrames[0] = value;
    }
    /**
     * Infinite loop until unlocked
     */
    wait() {
        while (this.lock);
    }
    /**
     * Get all atoms
     */
    get asObject() {
        return { $: this._$, $total: this._$total, $frame: this._$frame, $totalFrames: this._$totalFrames, lock: this._lock };
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
class SpectralAnalyserProcessor extends AudioWorkletProxyProcessor<ISpectralAnalyserProcessor, ISpectralAnalyserNode, SpectralAnalyserParameters> implements ISpectralAnalyserProcessor {
    static get parameterDescriptors(): TypedAudioParamDescriptor<SpectralAnalyserParameters>[] {
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
    private readonly atoms = new SpectralAnalyserAtoms();
    /**
     * Concatenated audio data, array of channels
     */
    private readonly windowSab: SharedArrayBuffer[] = [];
    /**
     * Float32Array Buffer view of window
     */
    private readonly window: Float32Array[] = [];
    /**
     * Concatenated FFT amplitude data, array of channels.
     */
    private readonly fftWindowSab: SharedArrayBuffer[] = [];
    /**
     * Float32Array Buffer view of fft window
     */
    private readonly fftWindow: Float32Array[] = [];
    /**
     * Atomic Lock
     */
    get lock() {
        return this.atoms.lock;
    }
    set lock(value: number) {
        this.atoms.lock = value;
    }
    /**
     * Next audio sample index to write into window
     */
    get $() {
        return this.atoms.$;
    }
    set $(value: number) {
        this.atoms.$ = value;
    }
    /**
     * Total samples written counter
     */
    get $total() {
        return this.atoms.$total;
    }
    set $total(value: number) {
        this.atoms.$total = value;
    }
    /**
     * Next FFT frame index to write into fftWindow
     */
    get $frame() {
        return this.atoms.$frame;
    }
    set $frame(value: number) {
        this.atoms.$frame = value;
    }
    /**
     * Total FFT frames written counter
     */
    get $totalFrames() {
        return this.atoms.$totalFrames;
    }
    set $totalFrames(value: number) {
        this.atoms.$totalFrames = value;
    }
    get fftBins() {
        return this._fftSize / 2;
    }
    /**
     * Next FFT value index to write into fftWindow
     */
    get $fft() {
        return this.$frame * this.fftBins;
    }
    get lastFrame() {
        return this.getLastFrame(1);
    }
    /**
     * Infinite loop until unlocked
     */
    wait() {
        this.atoms.wait();
    }
    getAllAmplitudes() {
        const data = this.fftWindow;
        const { $frame, $totalFrames, lock } = this.atoms.asObject;
        const { frames, fftBins, fftHopSize } = this;
        return { $frame, data, frames, fftBins, fftHopSize, $totalFrames, lock };
    }
    getAmplitude() {
        return this.lastFrame.map(channel => sum(channel));
    }
    getCentroid() {
        return this.lastFrame.map(channel => indexToFreq(centroid(channel), this.fftBins, sampleRate));
    }
    getFlatness() {
        return this.lastFrame.map(channel => flatness(channel));
    }
    getFlux() {
        const secondLastFrame = this.getLastFrame(2);
        return this.lastFrame.map((channel, i) => flux(channel, secondLastFrame[i]));
    }
    getKurtosis() {
        return this.lastFrame.map(channel => kurtosis(channel));
    }
    getSkewness() {
        return this.lastFrame.map(channel => skewness(channel));
    }
    getRolloff() {
        return this.lastFrame.map(channel => indexToFreq(rolloff(channel), this.fftBins, sampleRate));
    }
    getSlope() {
        return this.lastFrame.map(channel => slope(channel)/* / (sampleRate / 2 / this.fftBins)*/);
    }
    getSpread() {
        return this.lastFrame.map(channel => spread(channel));
    }
    getEstimatedFreq() {
        return this.lastFrame.map(channel => estimateFreq(channel, sampleRate));
    }
    getLastAmplitudes() {
        const { $frame, $totalFrames } = this;
        return { $frame, data: this.lastFrame, $totalFrames };
    }
    getLastFrame(offset: number) {
        const { fftWindow, fftBins, $frame } = this;
        return fftWindow.map(window => getSubTypedArray<Float32Array>(window, fftBins, ($frame - offset) * fftBins));
    }
    getBuffer() {
        const data = this.window;
        const { $, $total, lock } = this.atoms.asObject;
        return { data, $, $total, lock };
    }
    gets<K extends keyof SpectralAnalysis>(...analysis: K[]) {
        const result: Partial<SpectralAnalysis> = {};
        for (const key of analysis) {
            if (typeof key !== "string" || !key.length) continue;
            const method = `get${key.charAt(0).toUpperCase()}${key.slice(1)}` as `get${Capitalize<string & K>}`;
            if (this[method]) result[key] = this[method]() as SpectralAnalysis[K];
        }
        return result;
    }
    destroy() {
        this.destroyed = true;
        this._disposed = true;
    }
    /**
     * Total FFT frames in fftWindow
     * windowSize = (frames - 1) * fftHopSize + fftSize
     */
    private frames = 0;
    /**
     * Samples that already written into window, but not analysed by FFT yet
     */
    private samplesWaiting = 0;
    /**
     * FFTW.js instance
     */
    private fftw = new RFFT(1024);
    private _windowSize = 1024;
    get windowSize() {
        return this._windowSize;
    }
    set windowSize(sizeIn: number) {
        this._windowSize = ~~Math.min(2 ** 32, Math.max(128, sizeIn || 1024));
    }
    private _fftHopSize = 512;
    get fftHopSize() {
        return this._fftHopSize;
    }
    set fftHopSize(sizeIn: number) {
        this._fftHopSize = ~~Math.max(1, sizeIn);
    }
    get fftOverlap() {
        return this._fftSize / this._fftHopSize;
    }
    set fftOverlap(overlapIn: number) {
        const fftOverlap = ~~Math.min(this._fftSize, Math.max(2, overlapIn));
        this._fftHopSize = ~~Math.max(1, this._fftSize / fftOverlap);
    }
    private _fftSize = 1024;
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
    private _windowFunction = blackman;
    get windowFunction() {
        return this._windowFunction;
    }
    set windowFunction(funcIn: (i: number, N: number) => number) {
        this._windowFunction = funcIn;
    }
    setWindowFunctionFromIndex(funcIn: number) {
        this.windowFunction = [blackman, hamming, hann, triangular][~~funcIn];
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<SpectralAnalyserParameters, Float32Array>) {
        if (this.destroyed) return false;
        const input = inputs[0];
        this.windowSize = ~~parameters.windowSize[0];
        this.fftSize = ~~parameters.fftSize[0];
        this.fftOverlap = ~~parameters.fftOverlap[0];
        this.setWindowFunctionFromIndex(~~parameters.windowFunction[0]);
        const { windowSize, fftSize, fftHopSize, fftBins } = this;
        const frames = ~~((windowSize - fftSize) / fftHopSize) + 1;
        const fftWindowSize = frames * fftBins;
        this.frames = frames;

        if (this.window.length > input.length) { // Too much channels ?
            this.windowSab.splice(input.length);
            this.window.splice(input.length);
            this.fftWindowSab.splice(input.length);
            this.fftWindow.splice(input.length);
        }
        if (input.length === 0) return true;

        const bufferSize = Math.max(...input.map(c => c.length)) || 128;

        this.wait();
        this.lock = 1;

        this.$ %= windowSize;
        this.$total += bufferSize;
        this.$frame %= frames;
        let { $, samplesWaiting, $frame, $totalFrames, $fft } = this;
        // Init windows
        for (let i = 0; i < input.length; i++) {
            $ = this.$;
            $fft = this.$fft;
            if (!this.window[i]) { // Initialise channel if not exist
                this.windowSab[i] = new SharedArrayBuffer(windowSize * Float32Array.BYTES_PER_ELEMENT);
                this.window[i] = new Float32Array(this.windowSab[i]);
                this.fftWindowSab[i] = new SharedArrayBuffer(fftWindowSize * Float32Array.BYTES_PER_ELEMENT);
                this.fftWindow[i] = new Float32Array(this.fftWindowSab[i]);
            } else {
                if (this.window[i].length !== windowSize) { // adjust window size if not corresponded
                    const oldWindow = this.window[i];
                    const oldWindowSize = oldWindow.length;
                    const windowSab = new SharedArrayBuffer(windowSize * Float32Array.BYTES_PER_ELEMENT);
                    const window = new Float32Array(windowSab);
                    $ = setTypedArray(window, oldWindow, 0, $ - Math.min(windowSize, oldWindowSize));
                    this.windowSab[i] = windowSab;
                    this.window[i] = window;
                }
                if (this.fftWindow[i].length !== fftWindowSize) { // adjust fftWindow size if not corresponded
                    const oldWindow = this.fftWindow[i];
                    const oldWindowSize = oldWindow.length;
                    const window = new SharedArrayBuffer(fftWindowSize * Float32Array.BYTES_PER_ELEMENT);
                    $fft = setTypedArray(new Float32Array(window), new Float32Array(oldWindow), 0, $fft - Math.min(windowSize, oldWindowSize));
                    $frame = ~~($fft / fftBins);
                    this.fftWindowSab[i] = window;
                    this.fftWindow[i] = new Float32Array(window);
                }
            }
        }
        this.$ = $;
        this.$frame = $frame;
        // Write
        for (let i = 0; i < input.length; i++) {
            const window = this.window[i];
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
                    this.fftWindow[i].set(amps, $frame * fftBins);
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
        this.lock = 0;
        return true;
    }
}
try {
    registerProcessor(processorID, SpectralAnalyserProcessor);
} catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
}
