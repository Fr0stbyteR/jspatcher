export interface IFaustFFTProcessor {
    setProcessorParamValue(path: string, value: number): void;
    destroy(): void;
}
export interface IFaustFFTNode {}
export type FaustFFTParameters = "fftSize" | "fftOverlap" | "windowFunction";
export type TWindowFunction = "none" | "blackman" | "hamming" | "hann" | "triangular";
