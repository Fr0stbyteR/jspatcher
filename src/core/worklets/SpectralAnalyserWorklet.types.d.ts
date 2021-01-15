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
    buffer: { data: Float32Array[]; $: Uint32Array; $total: Uint32Array; lock: Int32Array };
    lastAmplitudes: { $frame: number; data: Float32Array[]; $totalFrames: number };
    allAmplitudes: { $frame: Uint32Array; data: Float32Array[]; frames: number; fftBins: number; fftHopSize: number; $totalFrames: Uint32Array; lock: Int32Array };
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
