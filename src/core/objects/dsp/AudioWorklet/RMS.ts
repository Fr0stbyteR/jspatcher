import { AudioWorkletRegister, DisposableAudioWorkletNode } from "./Base";

export interface DataToProcessor extends DisposableAudioWorkletMessageEventDataToProcessor {
    get?: "rms" | "buffer";
}
export interface DataFromProcessor {
    rms?: number[];
    buffer?: { startPointer: number; data: Float32Array[] };
}
export type Parameters = "windowSize";
export class RMSRegister extends AudioWorkletRegister {
    static registered = false;
    static id = "__JSPatcher_RMS";
    static processor = () => {
        /* eslint-disable no-undef */
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
                const rms: number[] = [];
                for (let i = 0; i < this.window.length; i++) {
                    const channel = this.window[i];
                    let sum = 0;
                    let sample = 0;
                    const length = channel.length;
                    for (let j = 0; j < length; j++) {
                        sample = channel[j];
                        sum += sample * sample;
                    }
                    rms[i] = Math.sqrt(sum / length);
                }
                return rms;
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
        registerProcessor("__JSPatcher_RMS", RMSProcessor);
    }
    static get Node() {
        const { id } = this;
        return class RMSNode extends DisposableAudioWorkletNode<DataFromProcessor, DataToProcessor> {
            rmsResolves: ((rms?: number[] | PromiseLike<number[]>) => any)[] = [];
            constructor(context: AudioContext, options?: AudioWorkletNodeOptions) {
                super(context, id, { numberOfInputs: 1, numberOfOutputs: 0 });
                this.port.onmessage = (e: AudioWorkletMessageEvent<DataFromProcessor>) => {
                    if (e.data.rms) {
                        this.rmsResolves.forEach(f => f(e.data.rms));
                        this.rmsResolves = [];
                    }
                };
            }
            getRMS() {
                if (this.destroyed) throw Error("The Node is destroyed.");
                const promise = new Promise<number[]>(resolve => this.rmsResolves.push(resolve));
                this.port.postMessage({ get: "rms" });
                return promise;
            }
        };
    }
}
