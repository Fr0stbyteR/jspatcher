type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
export interface ITemporalAnalyserProcessor extends Getters<TemporalAnalysis> {
    getEstimatedFreq(threshold?: number, probabilityThreshold?: number): number[];
    gets(...data: (keyof TemporalAnalysis)[]): Partial<TemporalAnalysis>;
    destroy(): void;
}
export interface ITemporalAnalyserNode {}
export type TemporalAnalyserParameters = "windowSize";
export interface TemporalAnalysis {
    rms: number[];
    absMax: number[];
    zcr: number[];
    buffer: { data: Float32Array[]; $read: Uint32Array; $write: Uint32Array; $total: Uint32Array };
}
