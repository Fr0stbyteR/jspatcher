import apply from "window-function/apply";
import { blackman, hamming, hann, triangular } from "window-function";
import { RFFT } from "fftw-js";
import { AudioWorkletRegister, DisposableAudioWorkletNode } from "./Base";
import processorURL from "./Transmitter.worklet.ts"; // eslint-disable-line import/extensions
import { DataFromProcessor, DataToProcessor, processorID } from "./Transmitter";
import { ceil } from "../../../../utils/math";
import { setBuffer, sliceBuffer, fftw2Amp, sum, estimateFreq, indexToFreq, centroid, flatness, flux, kurtosis, skewness, rolloff, slope, spread, getSubBuffer } from "../../../../utils/buffer";
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
export class SpectralAnalyserNode extends DisposableAudioWorkletNode<DataFromProcessor, DataToProcessor, Parameters> {
    window: Float32Array[] = [];
    $ = 0;
    $total = 0;
    fftWindow: Float32Array[] = [];
    $totalFrames = 0;
    $frame = 0;
    frames = 0;
    samplesWaiting = 0;
    fftw = new RFFT(1024);
    sampleRate = 48000;
    _windowSize = 1024;
    _fftHopSize = 512;
    _fftSize = 1024;
    _windowFunction = blackman;
    get fftBins() {
        return this._fftSize / 2;
    }
    constructor(context: AudioContext, options?: AudioWorkletNodeOptions) {
        super(context, processorID, { numberOfInputs: 1, numberOfOutputs: 0 });
        this.sampleRate = context.sampleRate;
        this.port.onmessage = (e: AudioWorkletMessageEvent<DataFromProcessor>) => {
            const { buffer } = e.data;
            if (buffer) {
                const windowSize = this.windowSize;
                const fftSize = this.fftSize;
                const fftBins = fftSize / 2;
                const fftHopSize = this.fftHopSize;
                const frames = ~~((windowSize - fftSize) / this._fftHopSize) + 1;
                const fftWindowSize = frames * fftBins;
                this.frames = frames;
                this.$ %= windowSize;
                this.$frame %= frames;
                if (this.window.length > buffer.length) {
                    this.window.splice(buffer.length);
                    this.fftWindow.splice(buffer.length);
                }
                if (buffer.length === 0) return;
                const bufferSize = buffer[0].length || 128;
                this.$total += bufferSize;
                let { $, samplesWaiting, $frame, $totalFrames } = this;
                for (let i = 0; i < buffer.length; i++) {
                    let channel = buffer[i];
                    if (!channel.length) channel = new Float32Array(bufferSize);
                    if (!this.window[i]) {
                        this.window[i] = new Float32Array(windowSize);
                        this.fftWindow[i] = new Float32Array(fftWindowSize);
                    } else {
                        if (this.window[i].length !== windowSize) {
                            const oldWindow = this.window[i];
                            const oldWindowSize = oldWindow.length;
                            const window = new Float32Array(windowSize);
                            if (oldWindowSize > windowSize) {
                                window.set(oldWindow.subarray(oldWindowSize - windowSize));
                                this.$ = 0;
                            } else {
                                window.set(oldWindow);
                            }
                            this.window[i] = window;
                        }
                        if (this.fftWindow[i].length !== fftWindowSize) {
                            const oldWindow = this.fftWindow[i];
                            const oldWindowSize = oldWindow.length;
                            const window = new Float32Array(fftWindowSize);
                            if (oldWindowSize > fftWindowSize) {
                                window.set(oldWindow.subarray(oldWindowSize - fftWindowSize));
                                this.$ = 0;
                            } else {
                                window.set(oldWindow);
                            }
                            this.fftWindow[i] = window;
                        }
                    }
                    const window = this.window[i];
                    $ = this.$;
                    samplesWaiting = this.samplesWaiting;
                    if (bufferSize > windowSize) {
                        window.set(channel.subarray(bufferSize - windowSize));
                        $ = 0;
                        samplesWaiting = windowSize;
                    } else {
                        setBuffer(window, channel, $);
                        $ = ($ + bufferSize) % windowSize;
                        samplesWaiting += bufferSize;
                    }
                    $frame = this.$frame;
                    $totalFrames = this.$totalFrames;
                    while (samplesWaiting >= fftHopSize) {
                        if (samplesWaiting / fftHopSize < frames + 1) {
                            const trunc = sliceBuffer(window, fftSize, $ - samplesWaiting + fftHopSize - fftSize);
                            apply(trunc, this._windowFunction);
                            const ffted = this.fftw.forward(trunc);
                            const amps = fftw2Amp(ffted, windowEnergyFactor.blackman);
                            this.fftWindow[i].set(amps, $frame * fftBins);
                            $frame = ($frame + 1) % this.frames;
                        }
                        $totalFrames++;
                        samplesWaiting -= this._fftHopSize;
                    }
                }
                this.$ = $;
                this.$frame = $frame;
                this.$totalFrames = $totalFrames;
                this.samplesWaiting = samplesWaiting;
            }
        };
    }
    get buffer() {
        const data = this.window;
        return { data, startPointer: this.$, sampleIndex: data.length ? this.$total - data[0].length : 0 };
    }
    get lastAmplitudes() {
        return { startPointer: this.$frame * this.fftBins, data: this.lastFrame, frameIndex: this.$totalFrames - 1 };
    }
    get allAmplitudes() {
        return {
            startPointer: this.$frame * this.fftBins,
            data: this.fftWindow,
            frames: this.frames,
            bins: this.fftBins,
            hopSize: this._fftHopSize,
            frameIndex: this.$frame - this.frames
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
        return fftWindow.map(window => getSubBuffer<Float32Array>(window, fftBins, ($frame - offset) * fftBins));
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
