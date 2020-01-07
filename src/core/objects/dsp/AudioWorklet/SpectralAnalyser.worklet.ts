import { RFFT } from "fftw-js";
import { DataToProcessor, DataFromProcessor, Parameters } from "./SpectralAnalyser";

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
    constructor(options: AudioWorkletNodeOptions) {
        super(options);
        this.port.onmessage = (e) => {
            const { id } = e.data;
            if (e.data.destroy) this.destroy();
            if (e.data.buffer) this.port.postMessage({ id, buffer: this.buffer });
        };
    }
    get buffer() {
        return { startPointer: this.$, data: this.window };
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: { [key in Parameters]: Float32Array }) {
        if (this.destroyed) return false;
        const input = inputs[0];
        const windowSize = ~~parameters.windowSize[0] || 1024;
        const fftSize = ~~parameters.fftSize[0] || 1024;
        const fftOverlap = ~~parameters.fftOverlap[0] || 2;
        if (fftSize !== this.fftSize) this.fftw = new RFFT(fftSize);
        this.fftSize = fftSize;
        this.fftHopSize = (~~fftSize / fftOverlap) || 1;
        this.$ %= windowSize;
        if (input.length === 0) return true;
        const bufferSize = input[0].length || 128;
        this.$total += bufferSize;
        for (let i = 0; i < input.length; i++) {
            let channel = input[i];
            if (!channel.length) channel = new Float32Array(bufferSize);
            if (!this.window[i]) this.window[i] = new Float32Array(windowSize);
            else if (this.window[i].length !== windowSize) {
                const oldWindow = this.window[i];
                const oldWindowSize = oldWindow.length;
                this.window[i] = new Float32Array(windowSize);
                this.window[i].set(oldWindowSize > windowSize ? oldWindow.subarray(0, windowSize) : oldWindow);
            }
            const window = this.window[i];
            let $ = this.$;
            if (bufferSize > windowSize) {
                window.set(channel.subarray(bufferSize - windowSize));
                $ = 0;
            } else if (this.$ + bufferSize > windowSize) {
                const split = windowSize - $;
                window.set(channel.subarray(0, split), this.$);
                $ = bufferSize - split;
                window.set(channel.subarray(0, this.$));
            } else {
                window.set(channel, $);
                $ += bufferSize;
            }
            if (i === input.length - 1) this.$ = $;
        }
        this.samplesWaiting += bufferSize;
        return true;
    }
    destroy() {
        this.destroyed = true;
        this.port.close();
        this.window = [];
    }
}
registerProcessor(processorID, SpectralAnalyserProcessor);
