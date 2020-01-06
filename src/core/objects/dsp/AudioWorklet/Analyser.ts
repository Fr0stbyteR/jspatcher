import { AudioWorkletRegister, DisposableAudioWorkletNode } from "./Base";
import AnalyserProcessorURL from "./Analyser.worklet.ts"; // eslint-disable-line import/extensions

type TWindowFunction = "blackman" | "hamming" | "hann" | "triangular";
export interface DataToProcessor extends DisposableAudioWorkletMessageEventDataToProcessor {
    rms?: boolean;
    buffer?: boolean;
    spectrum?: { windowFunction: TWindowFunction };
    spectra?: { windowFunction: TWindowFunction; windowSize: number };
    get?: "rms" | "buffer";
}
export interface DataFromProcessor {
    rms?: number[];
    buffer?: { startPointer: number; data: Float32Array[] };
}
export type Parameters = "windowSize";
export class AnalyserRegister extends AudioWorkletRegister {
    static registered = false;
    static processorID = "__JSPatcher_Analyser";
    static processorURL = AnalyserProcessorURL;
    static get Node() {
        const { processorID: id } = this;
        return class AnalyserNode extends DisposableAudioWorkletNode<DataFromProcessor, DataToProcessor, Parameters> {
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
