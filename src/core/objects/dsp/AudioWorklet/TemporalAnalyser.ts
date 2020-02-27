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
    buffer?: { $: Uint32Array; data: Float32Array[]; $total: Uint32Array };
}
export type Parameters = "windowSize";
export interface Atoms {
    readonly _sab: SharedArrayBuffer;
    readonly _$: Uint32Array;
    readonly _$total: Uint32Array;
    $: number;
    $total: number;
    atoms: { $: Uint32Array; $total: Uint32Array };
}
export const processorID = "__JSPatcher_TemporalAnalyser";
export class TemporalAnalyserNode extends DisposableAudioWorkletNode<DataFromProcessor, DataToProcessor, Parameters> {
    private promiseID = 0;
    private resolves: { [id: number]: (rms?: DataFromProcessor | PromiseLike<DataFromProcessor>) => any } = {};
    constructor(context: AudioContext) {
        super(context, processorID, { numberOfInputs: 1, numberOfOutputs: 0 });
        this.port.onmessage = (e: AudioWorkletMessageEvent<DataFromProcessor>) => {
            const { id } = e.data;
            delete e.data.id;
            const f = this.resolves[id];
            if (f) f(e.data);
            delete this.resolves[id];
        };
    }
    get rms() {
        return this.gets({ rms: true });
    }
    get zcr() {
        return this.gets({ zcr: true });
    }
    get buffer() {
        return this.gets({ buffer: true });
    }
    gets(options: Omit<DataToProcessor, "id">) {
        if (this.destroyed) throw Error("The Node is already destroyed.");
        const promise = new Promise<DataFromProcessor>(resolve => this.resolves[this.promiseID] = resolve);
        this.port.postMessage({ id: this.promiseID++, ...options });
        return promise;
    }
}
export class TemporalAnalyserRegister extends AudioWorkletRegister {
    static processorID = processorID;
    static processorURL = processorURL;
    static Node = TemporalAnalyserNode;
}
