export interface ISpectralAnalyserProcessor {
    getEstimatedFreq(): number[];
    getCentroid(): number[];
    getAllAmplitudes(): { $frame: Uint32Array; data: Float32Array[]; frames: number; fftBins: number; fftHopSize: number; $totalFrames: Uint32Array; lock: Int32Array }
    getLastAmplitudes(): { $frame: number; data: Float32Array[]; $totalFrames: number };
    getBuffer(): { data: Float32Array[]; $: Uint32Array; $total: Uint32Array; lock: Int32Array };
    destroy(): void;
}
export interface ISpectralAnalyserNode {}
export type SpectralAnalyserParameters = "windowSize" | "fftSize" | "fftOverlap" | "windowFunction";
