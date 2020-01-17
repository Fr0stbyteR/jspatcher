/* eslint-disable no-undef */
import apply from "window-function/apply";
import { blackman, hamming, hann, triangular } from "window-function";
import { RFFT } from "fftw-js";
import { DataToProcessor, DataFromProcessor, Parameters } from "./SpectralAnalyser";
import { setBuffer, getSubBuffer, fftw2Amp, estimateFreq, centroid, flatness, flux, kurtosis, skewness, rolloff, slope, indexToFreq, spread, sliceBuffer, sum } from "../../../../utils/buffer";
import { ceil } from "../../../../utils/math";
import { windowEnergyFactor } from "../../../../utils/windowEnergy";

const processorID = "__JSPatcher_SpectralAnalyser";

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
    destroyed = false;
    window: Float32Array[] = [];
    /**
     * A concat of frames, each filled with amps then phases.
     *
     * @type {Float32Array[]}
     * @memberof SpectralAnalyserProcessor
     */
    fftWindow: Float32Array[] = [];
    /**
     * Starting point index of current buffer
     *
     * @memberof SpectralAnalyserProcessor
     */
    $ = 0;
    /**
     * Total samples received
     *
     * @memberof SpectralAnalyserProcessor
     */
    $total = 0;
    /**
     * Total FFT frames calculated
     *
     * @memberof SpectralAnalyserProcessor
     */
    $totalFrames = 0;
    /**
     * Starting point index of current FFT frames
     *
     * @memberof SpectralAnalyserProcessor
     */
    $frame = 0;
    /**
     * Frames of FFT buffered
     * windowSize = (frames - 1) * fftHopSize + fftSize
     *
     * @memberof SpectralAnalyserProcessor
     */
    frames = 0;
    /**
     * Signal samples waiting for FFT
     *
     * @memberof SpectralAnalyserProcessor
     */
    samplesWaiting = 0;
    fftSize = 1024;
    fftHopSize = 512;
    fftw = new RFFT(1024);
    get fftBins() {
        return this.fftSize / 2;
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
            hopSize: this.fftHopSize,
            frameIndex: this.$totalFrames - this.frames
        };
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
        const { fftWindow, fftBins, $frame } = this;
        return fftWindow.map(window => getSubBuffer<Float32Array>(window, fftBins, ($frame - offset) * fftBins));
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: { [key in Parameters]: Float32Array }) {
        if (this.destroyed) return false;
        const input = inputs[0];
        const windowSize = ~~parameters.windowSize[0] || 1024;
        const fftSize = ceil(Math.min(windowSize, ~~parameters.fftSize[0] || 1024), 2);
        const fftBins = fftSize / 2;
        const fftOverlap = ~~parameters.fftOverlap[0] || 2;
        const windowFunction = [blackman, hamming, hann, triangular][~~parameters.windowFunction] || blackman;
        if (fftSize !== this.fftSize) {
            this.fftw.dispose();
            this.fftw = new RFFT(fftSize);
            this.samplesWaiting = 0;
            this.$frame = 0;
            this.fftSize = fftSize;
        }
        const fftHopSize = (~~fftSize / fftOverlap) || 1;
        this.fftHopSize = fftHopSize;
        const frames = ~~((windowSize - fftSize) / this.fftHopSize) + 1;
        const fftWindowSize = frames * fftBins;
        this.frames = frames;
        this.$ %= windowSize;
        this.$frame %= frames;
        if (this.window.length > input.length) {
            this.window.splice(input.length);
            this.fftWindow.splice(input.length);
        }
        if (input.length === 0) return true;
        const bufferSize = input[0].length || 128;
        this.$total += bufferSize;
        for (let i = 0; i < input.length; i++) {
            let channel = input[i];
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
            let $ = this.$;
            let samplesWaiting = this.samplesWaiting;
            if (bufferSize > windowSize) {
                window.set(channel.subarray(bufferSize - windowSize));
                $ = 0;
                samplesWaiting = windowSize;
            } else {
                setBuffer(window, channel, $);
                $ = ($ + bufferSize) % windowSize;
                samplesWaiting += bufferSize;
            }
            let { $frame, $totalFrames } = this;
            while (samplesWaiting >= fftHopSize) {
                if (samplesWaiting / fftHopSize < frames + 1) {
                    const trunc = sliceBuffer(window, fftSize, $ - samplesWaiting + fftHopSize - fftSize);
                    apply(trunc, windowFunction);
                    const ffted = this.fftw.forward(trunc);
                    const amps = fftw2Amp(ffted, windowEnergyFactor.blackman);
                    this.fftWindow[i].set(amps, $frame * fftBins);
                    $frame = ($frame + 1) % this.frames;
                }
                $totalFrames++;
                samplesWaiting -= this.fftHopSize;
            }
            if (i === input.length - 1) {
                this.$ = $;
                this.$frame = $frame;
                this.$totalFrames = $totalFrames;
                this.samplesWaiting = samplesWaiting;
            }
        }
        return true;
    }
    destroy() {
        this.destroyed = true;
        this.port.close();
        this.window = [];
    }
}
registerProcessor(processorID, SpectralAnalyserProcessor);
