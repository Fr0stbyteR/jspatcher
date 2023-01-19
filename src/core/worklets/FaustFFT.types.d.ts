export interface IFaustFFTProcessor {
    destroy(): void;
}
export interface IFaustFFTNode {}
export type FaustFFTParameters = "fftSize" | "fftOverlap" | "windowFunction";
export type TWindowFunction = "none" | "blackman" | "hamming" | "hann" | "triangular";
