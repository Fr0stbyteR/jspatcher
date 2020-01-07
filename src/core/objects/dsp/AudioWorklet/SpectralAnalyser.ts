import { AudioWorkletRegister, DisposableAudioWorkletNode } from "./Base";
import processorURL from "./SpectralAnalyser.worklet.ts"; // eslint-disable-line import/extensions

type TWindowFunction = "blackman" | "hamming" | "hann" | "triangular";
export interface DataToProcessor extends DisposableAudioWorkletMessageEventDataToProcessor {
    id: number;
    buffer?: boolean;
    spectrum?: { windowFunction: TWindowFunction };
    spectra?: { windowFunction: TWindowFunction; windowSize: number; overlap: number };
}
export interface DataFromProcessor {
    id: number;
    buffer?: { startPointer: number; data: Float32Array[] };
}
export type Parameters = "windowSize" | "fftSize" | "fftOverlap" | "windowFunction";
export const processorID = "__JSPatcher_SpectralAnalyser";
export class SpectralAnalyserRegister extends AudioWorkletRegister {
    static registered = false;
    static processorID = processorID;
    static processorURL = processorURL;
    static get Node() {
        const { processorID } = this;
        return class SpectralAnalyserNode extends DisposableAudioWorkletNode<DataFromProcessor, DataToProcessor, Parameters> {
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
