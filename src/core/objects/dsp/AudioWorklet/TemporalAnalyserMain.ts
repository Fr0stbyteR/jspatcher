import { AudioWorkletRegister } from "./Base";
import processorURL from "./Transmitter.worklet.ts"; // eslint-disable-line import/extensions
import { TransmitterNode } from "./Transmitter";
import { rms, zcr } from "../../../../utils/buffer";

export interface DataToGet {
    rms?: boolean;
    zcr?: boolean;
    buffer?: boolean;
}
export interface DataGot {
    rms: number[];
    zcr: number[];
    buffer?: { startPointer: number; data: Float32Array[]; sampleIndex: number };
}
export type Parameters = "windowSize";
export const processorID = "__JSPatcher_Transmitter";
export class TemporalAnalyserNode extends TransmitterNode {
    get rms() {
        return this.window.map(rms);
    }
    get zcr() {
        return this.window.map(zcr);
    }
    gets(options: DataToGet): DataGot {
        const message = {} as DataGot;
        if (options.rms) message.rms = this.rms;
        if (options.zcr) message.zcr = this.zcr;
        if (options.buffer) message.buffer = this.buffer;
        return message;
    }
}
export class TemporalAnalyserRegister extends AudioWorkletRegister {
    static processorID = processorID;
    static processorURL = processorURL;
    static Node = TemporalAnalyserNode;
}
