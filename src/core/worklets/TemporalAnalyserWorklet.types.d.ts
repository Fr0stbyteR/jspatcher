export interface ITemporalAnalyserProcessor {
    getRMS(): number[];
    getAbsMax(): number[];
    getZCR(): number[];
    getEstimatedFreq(threshold?: number, probabilityThreshold?: number): number[];
    getBuffer(): { data: Float32Array[]; $: Uint32Array; $total: Uint32Array; lock: Int32Array };
    destroy(): void;
}
export interface ITemporalAnalyserNode {}
export type TemporalAnalyserParameters = "windowSize";
