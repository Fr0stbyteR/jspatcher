import { AudioWorkletRegister, DisposableAudioWorkletNode } from "./Base";
import processorURL from "./TemporalAnalyser.worklet.ts"; // eslint-disable-line import/extensions

export interface DataToProcessor extends DisposableAudioWorkletMessageEventDataToProcessor {
    id: number;
    rms?: boolean;
    zcr?: boolean;
    buffer?: boolean;
}
export interface DataFromProcessor {
    id: number;
    rms?: number[];
    zcr?: number[];
    buffer?: { startPointer: number; data: Float32Array[] };
}
export type Parameters = "windowSize";
export const processorID = "__JSPatcher_TemporalAnalyser";
export class TemporalAnalyserRegister extends AudioWorkletRegister {
    static processorID = processorID;
    static processorURL = processorURL;
    static get Node() {
        const { processorID } = this;
        return class TemporalAnalyserNode extends DisposableAudioWorkletNode<DataFromProcessor, DataToProcessor, Parameters> {
            promiseID = 0;
            resolves: { [id: number]: (rms?: DataFromProcessor | PromiseLike<DataFromProcessor>) => any } = {};
            constructor(context: AudioContext, options?: AudioWorkletNodeOptions) {
                super(context, processorID, { numberOfInputs: 1, numberOfOutputs: 0 });
                this.port.onmessage = (e: AudioWorkletMessageEvent<DataFromProcessor>) => {
                    const f = this.resolves[e.data.id];
                    if (f) f(e.data);
                    delete this.resolves[e.data.id];
                };
            }
            getRMS() {
                return this.gets({ rms: true });
            }
            getZCR() {
                return this.gets({ zcr: true });
            }
            getBuffer() {
                return this.gets({ buffer: true });
            }
            gets(options: Omit<DataToProcessor, "id">) {
                if (this.destroyed) throw Error("The Node is already destroyed.");
                const promise = new Promise<DataFromProcessor>(resolve => this.resolves[this.promiseID] = resolve);
                this.port.postMessage({ id: this.promiseID++, ...options });
                return promise;
            }
        };
    }
}