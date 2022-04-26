/* eslint-disable no-new */
import { instantiateFFTWModule, FFTWModule, FFTW } from "@shren/fftw-js/dist/esm-bundle";
import apply from "window-function/apply";
import * as WindowFunction from "window-function";
import ProxyWorker from "./ProxyWorker";
import windowEnergyFactor from "../../utils/windowEnergy";
import type { IFFTWWorker, TFreqDomainDataFrames } from "./FFTWWorker.types";
import type { TWindowFunction } from "../types";
import { atodb } from "../../utils/math";

const SharedArrayBuffer = globalThis.ArrayBuffer || globalThis.SharedArrayBuffer;

class FFTWWorker extends ProxyWorker<IFFTWWorker> implements IFFTWWorker {
    fftwModule: FFTWModule;
    fftw: FFTW;
    private get FFT1D() {
        return this.fftw.r2r.FFT1D;
    }
    async init(): Promise<true> {
        this.fftwModule = await instantiateFFTWModule();
        this.fftw = new FFTW(this.fftwModule);
        return true;
    }
    forward(array: Float32Array) {
        const fft = new this.FFT1D(array.length);
        const result = fft.forward(array);
        fft.dispose();
        return result;
    }
    inverse(array: Float32Array) {
        const fft = new this.FFT1D(array.length);
        const result = fft.inverse(array);
        fft.dispose();
        return result;
    }
    forwards(array: Float32Array, fftSize: number, overlaps: number, windowFunctionId?: TWindowFunction) {
        const windowFunction = windowFunctionId ? WindowFunction[windowFunctionId] : null;
        const currentWindowEnergyFactor = windowFunctionId ? windowEnergyFactor[windowFunctionId] : 1;
        const hopSize = fftSize / overlaps;
        let $start = -fftSize + hopSize;
        let $end = hopSize;
        const { length } = array;
        const paddedInput = new Float32Array(fftSize);
        let input: Float32Array;
        const fft = new this.FFT1D(fftSize);
        const output: TFreqDomainDataFrames = [];
        let real = 0;
        let imag = 0;
        while ($end < length + fftSize) {
            if ($start < 0) {
                if ($end > length) {
                    paddedInput.set(array, -$start);
                } else {
                    paddedInput.set(array.subarray(0, fftSize + $start), -$start);
                }
                input = paddedInput;
            } else {
                if ($end > length) {
                    paddedInput.fill(0);
                    paddedInput.set(array.subarray($start, length));
                    input = paddedInput;
                } else {
                    input = array.slice($start, $end);
                }
            }
            if (windowFunction) apply(input, windowFunction);
            const fftResult = fft.forward(input);
            const amplitudeSab = new SharedArrayBuffer((fftSize / 2 + 1) * Float32Array.BYTES_PER_ELEMENT);
            const phaseSab = new SharedArrayBuffer((fftSize / 2 + 1) * Float32Array.BYTES_PER_ELEMENT);
            const amplitude = new Float32Array(amplitudeSab);
            const phase = new Float32Array(phaseSab);
            for (let i = 0; i <= fftSize / 2; i++) {
                real = fftResult[i];
                imag = (i === 0 || i === fftSize / 2) ? 0 : fftResult[fftSize - i];
                amplitude[i] = Math.hypot(real, imag) / fftSize * currentWindowEnergyFactor / overlaps;
                phase[i] = Math.atan2(imag, real);
            }
            output.push({ amplitude, phase });
            $start += hopSize;
            $end += hopSize;
        }
        fft.dispose();
        return output;
    }
    forwardsAmpMatrix(array: Float32Array, fftSize: number, overlaps: number, windowFunctionId?: TWindowFunction) {
        const output = this.forwards(array, fftSize, overlaps, windowFunctionId);
        const ampSize = fftSize / 2 + 1;
        const length = (output.length - overlaps) * ampSize;
        const matrixSab = new SharedArrayBuffer(length * Float32Array.BYTES_PER_ELEMENT);
        const matrix = new Float32Array(matrixSab);
        let $ = 0;
        for (let i = 0; i < output.length; i++) {
            for (let j = 0; j < ampSize; j++) {
                for (let k = 1 - overlaps; k <= 0; k++) {
                    $ = (i + k) * ampSize + j;
                    if ($ >= 0 && $ < length) matrix[$] += output[i].amplitude[j];
                }
            }
        }
        for (let i = 0; i < matrix.length; i++) {
            matrix[i] = atodb(matrix[i]);
        }
        return { matrix, output };
    }
    inverses(input: TFreqDomainDataFrames, overlaps: number, lengthIn?: number) {
        const frames = input.length;
        if (!frames) return null;
        const fftSize = (input[0].amplitude.length - 1) * 2;
        const hopSize = fftSize / overlaps;
        let $start = hopSize - fftSize;
        let $end = hopSize;
        let $frame = 0;
        const length = lengthIn || (frames - overlaps + 1) * hopSize;
        const fft = new this.FFT1D(fftSize);
        let ifftResult: Float32Array;
        const outputSab = new SharedArrayBuffer(length * Float32Array.BYTES_PER_ELEMENT);
        const output = new Float32Array(outputSab);
        while ($end < length + fftSize) {
            const { amplitude, phase } = input[$frame];
            const ifftInput = new Float32Array(fftSize);
            for (let i = 0; i < amplitude.length; i++) {
                const real = amplitude[i] * Math.cos(phase[i]);
                ifftInput[i] = real;
                if (i === 0 || i === fftSize / 2) continue;
                ifftInput[fftSize - i] = amplitude[i] * Math.sin(phase[i]);
            }
            ifftResult = fft.inverse(ifftInput);
            if ($start < 0) {
                for (let i = -$start; i < Math.min(length - $start, fftSize); i++) {
                    output[$start + i] += ifftResult[i];
                }
            } else {
                for (let i = 0; i < Math.min(length - $start, fftSize); i++) {
                    output[$start + i] += ifftResult[i];
                }
            }
            $start += hopSize;
            $end += hopSize;
            $frame++;
        }
        fft.dispose();
        return output;
    }
}

new FFTWWorker();
