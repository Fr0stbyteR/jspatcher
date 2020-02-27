import apply from "window-function/apply";
import { blackman, hamming, hann, triangular } from "window-function";
import { RFFT } from "fftw-js";
import { AudioWorkletRegister, DisposableAudioWorkletNode } from "./Base";
import processorURL from "./Transmitter.worklet.ts"; // eslint-disable-line import/extensions
import { DataFromProcessor, DataToProcessor, processorID } from "./Transmitter";
import { ceil } from "../../../../utils/math";
import { setTypedArray, fftw2Amp, sum, estimateFreq, indexToFreq, centroid, flatness, flux, kurtosis, skewness, rolloff, slope, spread, getSubTypedArray } from "../../../../utils/buffer";
import { windowEnergyFactor } from "../../../../utils/windowEnergy";

export type TWindowFunction = "blackman" | "hamming" | "hann" | "triangular";
export interface DataToGet {
    buffer?: boolean;
    lastAmplitudes?: boolean;
    allAmplitudes?: boolean;
    amplitude?: boolean;
    estimatedFreq?: boolean;
    centroid?: boolean;
    flatness?: boolean;
    flux?: boolean;
    kurtosis?: boolean;
    skewness?: boolean;
    rolloff?: boolean;
    slope?: boolean;
    spread?: boolean;
}
export interface DataGot {
    buffer?: { startPointer: number; data: Float32Array[]; sampleIndex: number };
    lastAmplitudes?: { startPointer: number; data: Float32Array[]; frameIndex: number };
    allAmplitudes?: { startPointer: number; data: Float32Array[]; frames: number; bins: number; hopSize: number; frameIndex: number };
    amplitude?: number[];
    estimatedFreq?: number[];
    centroid?: number[];
    flatness?: number[];
    flux?: number[];
    kurtosis?: number[];
    skewness?: number[];
    rolloff?: number[];
    slope?: number[];
    spread?: number[];
}
export type Parameters = null;
/**
 * Analyse spectral features of audio (concatenated from transmitter audio worklet processor)
 *
 * @export
 * @class SpectralAnalyserNode
 * @extends {DisposableAudioWorkletNode<DataFromProcessor, DataToProcessor, Parameters>}
 */
export class SpectralAnalyserNode extends DisposableAudioWorkletNode<DataFromProcessor, DataToProcessor, Parameters> {
    private sampleRate: number;
    /**
     * Concatenated audio data, array of channels
     *
     * @private
     * @type {Float32Array[]}
     * @memberof SpectralAnalyserNode
     */
    private window: Float32Array[] = [];
    /**
     * Next audio sample index to write into window
     *
     * @private
     * @memberof SpectralAnalyserNode
     */
    private $ = 0;
    /**
     * Total samples written counter
     *
     * @private
     * @memberof SpectralAnalyserNode
     */
    private $total = 0;
    /**
     * Concatenated FFT amplitude data, array of channels.
     *
     * @private
     * @type {Float32Array[]}
     * @memberof SpectralAnalyserNode
     */
    private fftWindow: Float32Array[] = [];
    /**
     * Total FFT frames written counter
     *
     * @private
     * @memberof SpectralAnalyserNode
     */
    private $totalFrames = 0;
    /**
     * Next FFT frame index to write into fftWindow
     *
     * @private
     * @memberof SpectralAnalyserNode
     */
    private $frame = 0;
    /**
     * Total FFT frames in fftWindow
     * windowSize = (frames - 1) * fftHopSize + fftSize
     *
     * @private
     * @memberof SpectralAnalyserNode
     */
    private frames = 0;
    /**
     * Samples that already written into window, but not analysed by FFT yet
     *
     * @private
     * @memberof SpectralAnalyserNode
     */
    private samplesWaiting = 0;
    /**
     * FFTW.js instance
     *
     * @private
     * @memberof SpectralAnalyserNode
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
    constructor(context: AudioContext) {
        super(context, processorID, { numberOfInputs: 1, numberOfOutputs: 0 });
        this.sampleRate = context.sampleRate;
        this.port.onmessage = (e: AudioWorkletMessageEvent<DataFromProcessor>) => {
            const { buffer: input } = e.data;
            if (!input) return;
            const { windowSize, fftSize, fftHopSize, fftBins } = this;
            const frames = ~~((windowSize - fftSize) / fftHopSize) + 1;
            const fftWindowSize = frames * fftBins;
            this.frames = frames;
            this.$ %= windowSize;
            this.$frame %= frames;
            if (this.window.length > input.length) { // Too much channels ?
                this.window.splice(input.length);
                this.fftWindow.splice(input.length);
            }
            if (input.length === 0) return;
            const bufferSize = Math.max(...input.map(c => c.length)) || 128;
            this.$total += bufferSize;
            let { $, samplesWaiting, $frame, $totalFrames, $fft } = this;
            // Init windows
            for (let i = 0; i < input.length; i++) {
                $ = this.$;
                $fft = this.$fft;
                if (!this.window[i]) { // Initialise channel if not exist
                    this.window[i] = new Float32Array(windowSize);
                    this.fftWindow[i] = new Float32Array(fftWindowSize);
                } else {
                    if (this.window[i].length !== windowSize) { // adjust window size if not corresponded
                        const oldWindow = this.window[i];
                        const oldWindowSize = oldWindow.length;
                        const window = new Float32Array(windowSize);
                        $ = setTypedArray(window, oldWindow, 0, $ - Math.min(windowSize, oldWindowSize));
                        this.window[i] = window;
                    }
                    if (this.fftWindow[i].length !== fftWindowSize) { // adjust fftWindow size if not corresponded
                        const oldWindow = this.fftWindow[i];
                        const oldWindowSize = oldWindow.length;
                        const window = new Float32Array(fftWindowSize);
                        $fft = setTypedArray(window, oldWindow, 0, $fft - Math.min(windowSize, oldWindowSize));
                        $frame = ~~($fft / fftBins);
                        this.fftWindow[i] = window;
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
        };
    }
    get buffer() {
        const data = this.window;
        return { data, startPointer: this.$, sampleIndex: data.length ? this.$total - data[0].length : 0 };
    }
    get lastAmplitudes() {
        return { startPointer: this.$fft, data: this.lastFrame, frameIndex: this.$totalFrames - 1 };
    }
    get allAmplitudes() {
        return {
            startPointer: this.$fft,
            data: this.fftWindow,
            frames: this.frames,
            bins: this.fftBins,
            hopSize: this._fftHopSize,
            frameIndex: this.$totalFrames - this.frames
        };
    }
    get amplitude() {
        return this.lastFrame.map(channel => sum(channel));
    }
    get estimatedFreq() {
        return this.lastFrame.map(channel => estimateFreq(channel, this.sampleRate));
    }
    get centroid() {
        return this.lastFrame.map(channel => indexToFreq(centroid(channel), this.fftBins, this.sampleRate));
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
        return this.lastFrame.map(channel => indexToFreq(rolloff(channel), this.fftBins, this.sampleRate));
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
        const { fftWindow, fftBins, $frame } = this;
        return fftWindow.map(window => getSubTypedArray<Float32Array>(window, fftBins, ($frame - offset) * fftBins));
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
    set windowFunction(funcIn: TWindowFunction) {
        this._windowFunction = { blackman, hamming, hann, triangular }[funcIn];
    }
    gets(options: DataToGet): DataGot {
        const message = {} as DataGot;
        if (options.buffer) message.buffer = this.buffer;
        if (options.lastAmplitudes) message.lastAmplitudes = this.lastAmplitudes;
        if (options.allAmplitudes) message.allAmplitudes = this.allAmplitudes;
        if (options.amplitude) message.amplitude = this.amplitude;
        if (options.estimatedFreq) message.estimatedFreq = this.estimatedFreq;
        if (options.centroid) message.centroid = this.centroid;
        if (options.flatness) message.flatness = this.flatness;
        if (options.flux) message.flux = this.flux;
        if (options.kurtosis) message.kurtosis = this.kurtosis;
        if (options.skewness) message.skewness = this.skewness;
        if (options.rolloff) message.rolloff = this.rolloff;
        if (options.slope) message.slope = this.slope;
        if (options.spread) message.spread = this.spread;
        return message;
    }
}
export class SpectralAnalyserRegister extends AudioWorkletRegister {
    static processorID = processorID;
    static processorURL = processorURL;
    static Node = SpectralAnalyserNode;
}
