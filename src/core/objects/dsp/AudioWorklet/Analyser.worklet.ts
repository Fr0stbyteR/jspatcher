// import { RFFT } from "fftw-js";
import { DataToProcessor, DataFromProcessor, Parameters } from "./Analyser";
import { rms } from "../utils";

declare const currentFrame: number;
declare const currentTime: number;
declare const sampleRate: number;

class RMSProcessor extends AudioWorkletProcessor<DataToProcessor, DataFromProcessor, Parameters> {
    static get parameterDescriptors(): AudioWorkletAudioParamDescriptor<Parameters>[] {
        return [{
            defaultValue: 1024,
            maxValue: sampleRate * 16,
            minValue: 128,
            name: "windowSize"
        }];
    }
    destroyed: boolean;
    window: Float32Array[];
    $: number;
    constructor(options: AudioWorkletNodeOptions) {
        super(options);
        this.destroyed = false;
        this.window = [];
        this.$ = 0;
        this.port.onmessage = (e) => {
            if (e.data.destroy) this.destroy();
            else if (e.data.get === "rms") this.port.postMessage({ rms: this.rms });
            else if (e.data.get === "buffer") this.port.postMessage({ buffer: this.buffer });
        };
    }
    get rms() {
        return this.window.map(rms);
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
        for (let i = 0; i < input.length; i++) {
            let channel = input[i];
            const bufferSize = channel.length || 128;
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
        return true;
    }
    destroy() {
        this.destroyed = true;
        this.port.close();
        this.window = [];
    }
}
registerProcessor("__JSPatcher_Analyser", RMSProcessor);
