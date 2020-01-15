export type DataToProcessor = DisposableAudioWorkletMessageEventDataToProcessor;
export interface DataFromProcessor {
    bufferIndex: number;
    buffer: Float32Array[];
}
export type Parameters = null;
export const processorID = "__JSPatcher_Transmitter";
