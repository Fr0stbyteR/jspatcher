// import { RFFT } from "fftw-js";
import { DataToProcessor, DataFromProcessor, Parameters } from "./TemporalAnalyser";
import { rms, zcr, setBuffer } from "../utils";

const processorID = "__JSPatcher_TemporalAnalyser";

class TemporalAnalyserProcessor extends AudioWorkletProcessor<DataToProcessor, DataFromProcessor, Parameters> {
    static get parameterDescriptors(): AudioWorkletAudioParamDescriptor<Parameters>[] {
        return [{
            defaultValue: 1024,
            maxValue: 2 ** 32,
            minValue: 128,
            name: "windowSize"
        }];
    }
    destroyed = false;
    window: Float32Array[] = [];
    /**
     * Starting point index of current buffer
     *
     * @memberof TemporalAnalyserProcessor
     */
    $ = 0;
    constructor(options: AudioWorkletNodeOptions) {
        super(options);
        this.port.onmessage = (e) => {
            const { id } = e.data;
            if (e.data.destroy) this.destroy();
            if (e.data.rms) this.port.postMessage({ id, rms: this.rms });
            if (e.data.zcr) this.port.postMessage({ id, zcr: this.zcr });
            if (e.data.buffer) this.port.postMessage({ id, buffer: this.buffer });
        };
    }
    get rms() {
        return this.window.map(rms);
    }
    get zcr() {
        return this.window.map(zcr);
    }
    get buffer() {
        return { startPointer: this.$, data: this.window };
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: { [key in Parameters]: Float32Array }) {
        if (this.destroyed) return false;
        const input = inputs[0];
        const windowSize = ~~parameters.windowSize[0] || 1024;
        this.$ %= windowSize;
        if (this.window.length > input.length) this.window.splice(input.length);
        if (input.length === 0) return true;
        const bufferSize = input[0].length || 128;
        for (let i = 0; i < input.length; i++) {
            let channel = input[i];
            if (!channel.length) channel = new Float32Array(bufferSize);
            if (!this.window[i]) {
                this.window[i] = new Float32Array(windowSize);
            } else if (this.window[i].length !== windowSize) {
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
            const window = this.window[i];
            let $ = this.$;
            if (bufferSize > windowSize) {
                window.set(channel.subarray(bufferSize - windowSize));
                $ = 0;
            } else {
                setBuffer(window, channel, $);
                $ = ($ + bufferSize) % windowSize;
            }
            if (i === input.length - 1) this.$ = $;
        }
        return true;
    }
    destroy() {
        this.destroyed = true;
        this.port.close();
        this.window = [];
    }
}
registerProcessor(processorID, TemporalAnalyserProcessor);
