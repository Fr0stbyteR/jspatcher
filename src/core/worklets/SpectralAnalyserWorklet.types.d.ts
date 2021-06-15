type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
export interface ISpectralAnalyserProcessor extends Getters<SpectralAnalysis> {
    gets(...data: (keyof SpectralAnalysis)[]): Partial<SpectralAnalysis>;
    destroy(): void;
}
export interface ISpectralAnalyserNode {}
export type SpectralAnalyserParameters = "windowSize" | "fftSize" | "fftOverlap" | "windowFunction";
export type TWindowFunction = "blackman" | "hamming" | "hann" | "triangular";
export interface SpectralAnalysis {
    buffer: { data: Float32Array[]; $read: Uint32Array; $write: Uint32Array; $total: Uint32Array };
    lastAmplitudes: { data: Float32Array[]; $readFrame: Uint32Array; $writeFrame: Uint32Array; $totalFrames: Uint32Array };
    allAmplitudes: { data: Float32Array[]; $readFrame: Uint32Array; $writeFrame: Uint32Array; $totalFrames: Uint32Array; frames: number; dataFrames: number; fftBins: number; fftHopSize: number };
    amplitude: number[];
    estimatedFreq: number[];
    centroid: number[];
    flatness: number[];
    flux: number[];
    kurtosis: number[];
    skewness: number[];
    rolloff: number[];
    slope: number[];
    spread: number[];
}
