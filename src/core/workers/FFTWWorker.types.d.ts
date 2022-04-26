import type { TWindowFunction } from "../types";

interface IFreqDomainData {
    amplitude: Float32Array;
    phase: Float32Array;
}

export type TFreqDomainDataFrames = IFreqDomainData[];
export interface IFFTWWorker {
    init(): Promise<true>;
    forward(array: Float32Array): Float32Array;
    forwards(array: Float32Array, fftSize: number, overlaps: number, windowFunctionId: TWindowFunction): TFreqDomainDataFrames;
    forwardsAmpMatrix(array: Float32Array, fftSize: number, overlaps: number, windowFunctionId: TWindowFunction): {
        matrix: Float32Array;
        output: TFreqDomainDataFrames;
    };
    inverse(array: Float32Array): Float32Array;
    inverses(input: TFreqDomainDataFrames, overlaps: number, lengthIn?: number): Float32Array;
}
