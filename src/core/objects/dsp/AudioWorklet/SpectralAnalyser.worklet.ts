/* eslint-disable no-undef */
import apply from "window-function/apply";
import { blackman } from "window-function";
import { RFFT } from "fftw-js";
import { DataToProcessor, DataFromProcessor, Parameters } from "./SpectralAnalyser";
import { setBuffer, getSubBuffer, fftw2Amp, estimateFreq } from "../../../../utils/buffer";
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
     * @memberof TemporalAnalyserProcessor
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
    $frames = 0;
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
            if (e.data.buffer) this.port.postMessage({ id, buffer: this.buffer });
            if (e.data.estimatedFreq) this.port.postMessage({ id, estimatedFreq: this.estimatedFreq });
        };
    }
    get buffer() {
        return { startPointer: this.$, data: this.window };
    }
    get estimatedFreq() {
        const { fftWindow, fftBins, $frame } = this;
        return fftWindow.map((window) => {
            const lastFrame = getSubBuffer<Float32Array>(window, fftBins, ($frame - 1) * fftBins);
            return estimateFreq(lastFrame, sampleRate);
        });
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: { [key in Parameters]: Float32Array }) {
        if (this.destroyed) return false;
        const input = inputs[0];
        const windowSize = ~~parameters.windowSize[0] || 1024;
        const fftSize = ceil(Math.min(windowSize, ~~parameters.fftSize[0] || 1024), 2);
        const fftBins = fftSize / 2;
        const fftOverlap = ~~parameters.fftOverlap[0] || 2;
        if (fftSize !== this.fftSize) {
            this.fftw.dispose();
            this.fftw = new RFFT(fftSize);
            this.samplesWaiting = 0;
        }
        this.fftSize = fftSize;
        const fftHopSize = (~~fftSize / fftOverlap) || 1;
        this.fftHopSize = fftHopSize;
        const frames = ~~((windowSize - fftSize) / this.fftHopSize) + 1;
        const fftWindowSize = frames * fftBins;
        this.frames = frames;
        this.$ %= windowSize;
        this.$frame %= frames;
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
            let $frame = this.$frame;
            while (samplesWaiting >= fftHopSize) {
                if (samplesWaiting / fftHopSize < frames + 1) {
                    const trunc = getSubBuffer(window, fftSize, $ - samplesWaiting + fftHopSize - fftSize);
                    apply(trunc, blackman);
                    const ffted = this.fftw.forward(trunc);
                    const amps = fftw2Amp(ffted, windowEnergyFactor.blackman);
                    this.fftWindow[i].set(amps, $frame * fftBins);
                    $frame = ($frame + 1) % this.frames;
                }
                samplesWaiting -= this.fftHopSize;
            }
            if (i === input.length - 1) {
                this.$ = $;
                this.$frame = $frame;
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
