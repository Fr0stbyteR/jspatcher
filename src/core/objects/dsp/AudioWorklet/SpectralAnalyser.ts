import { AudioWorkletRegister, DisposableAudioWorkletNode } from "./Base";
import processorURL from "./SpectralAnalyser.worklet.ts"; // eslint-disable-line import/extensions

export type TWindowFunction = "blackman" | "hamming" | "hann" | "triangular";
export interface DataToProcessor extends DisposableAudioWorkletMessageEventDataToProcessor {
    id: number;
    buffer?: boolean;
    lastAmplitudes?: boolean;
    allAmplitudes?: boolean;
    estimatedFreq?: boolean;
    centroid?: boolean;
    flatness?: boolean;
    flux?: boolean;
    kurtosis?: boolean;
    skewness?: boolean;
    rolloff?: boolean;
    slope?: boolean;
    spread?: boolean;
}
export interface DataFromProcessor {
    id: number;
    buffer?: { startPointer: number; data: Float32Array[]; sampleIndex: number };
    lastAmplitudes?: { startPointer: number; data: Float32Array[]; frameIndex: number };
    allAmplitudes?: { startPointer: number; data: Float32Array[]; frames: number; bins: number; hopSize: number; frameIndex: number };
    estimatedFreq?: number[];
    centroid?: number[];
    flatness?: number[];
    flux?: number[];
    kurtosis?: number[];
    skewness?: number[];
    rolloff?: number[];
    slope?: number[];
    spread?: number[];
}
export type Parameters = "windowSize" | "fftSize" | "fftOverlap" | "windowFunction";
export const processorID = "__JSPatcher_SpectralAnalyser";
export class SpectralAnalyserNode extends DisposableAudioWorkletNode<DataFromProcessor, DataToProcessor, Parameters> {
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
    gets(options: Omit<DataToProcessor, "id">) {
        if (this.destroyed) throw Error("The Node is already destroyed.");
        const promise = new Promise<DataFromProcessor>(resolve => this.resolves[this.promiseID] = resolve);
        this.port.postMessage({ id: this.promiseID++, ...options });
        return promise;
    }
}
export class SpectralAnalyserRegister extends AudioWorkletRegister {
    static processorID = processorID;
    static processorURL = processorURL;
    static Node = SpectralAnalyserNode;
}
