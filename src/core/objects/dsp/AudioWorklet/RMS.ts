import { AudioWorkletRegister, DisposableAudioWorkletNode } from "./Base";

export class RMSRegister extends AudioWorkletRegister {
    static registered = false;
    static id = "__JSPatcher__RMS";
    static processor = () => {
        /* eslint-disable no-undef */
        class RMSProcessor extends AudioWorkletProcessor {
            static get parameterDescriptors() {
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
                    if (e.data.get) this.port.postMessage({ rms: this.rms });
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
            process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: { [key: string]: Float32Array }) {
                if (this.destroyed) return false;
                const input = inputs[0];
                const windowSize = ~~parameters.windowSize[0] || 1024;
                this.$ %= windowSize;
                for (let i = 0; i < input.length; i++) {
                    const channel = input[i];
                    const bufferSize = channel.length;
                    if (!this.window[i]) this.window[i] = new Float32Array(windowSize);
                    else if (this.window[i].length !== windowSize) {
                        const oldBuffer = this.window[i];
                        const oldWindowSize = oldBuffer.length;
                        this.window[i] = new Float32Array(oldBuffer, 0, oldWindowSize > windowSize ? windowSize : oldWindowSize);
                    }
                    const window = this.window[i];
                    if (bufferSize > windowSize) {
                        window.set(channel.subarray(bufferSize - windowSize));
                        this.$ = 0;
                    } else if (this.$ + bufferSize > windowSize) {
                        const split = windowSize - this.$;
                        window.set(channel.subarray(0, split), this.$);
                        this.$ = bufferSize - split;
                        window.set(channel.subarray(0, this.$));
                    } else {
                        window.set(channel, this.$);
                        this.$ += bufferSize;
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
        registerProcessor("__JSPatcher__RMS", RMSProcessor);
    }
    static get Node() {
        const { id } = this;
        return class RMSNode extends DisposableAudioWorkletNode {
            rmsResolve: (rms: number[]) => any = () => undefined;
            rmsReject: (reason: any) => any = () => undefined;
            constructor(context: AudioContext, options?: AudioWorkletNodeOptions) {
                super(context, id, { numberOfInputs: 1, numberOfOutputs: 0 });
                this.port.onmessage = (e: MessageEvent) => {
                    if (e.data.rms && this.rmsResolve) this.rmsResolve(e.data.rms);
                };
            }
            getRMS() {
                if (this.destroyed) throw Error("The Node is destroyed.");
                const promise = new Promise<number[]>((resolve, reject) => {
                    this.rmsResolve = resolve;
                    this.rmsReject = reject;
                });
                this.port.postMessage({ get: true });
                return promise;
            }
        };
    }
}
