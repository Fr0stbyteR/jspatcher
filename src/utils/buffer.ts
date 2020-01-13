import { mod } from "./math";

type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array;
type TypedArrayConstructor = typeof Int8Array | typeof Uint8Array | typeof Int16Array | typeof Uint16Array | typeof Int32Array | typeof Uint32Array | typeof Uint8ClampedArray | typeof Float32Array | typeof Float64Array;
export const sum = (array: TypedArray | number[]) => {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum;
};
export const mean = (array: TypedArray | number[]) => sum(array) / array.length;
export const median = (array: TypedArray | number[]) => {
    const length = array.length;
    if (length === 0) throw new Error("trying to calculate median of empty array");
    const sortedArray = array.slice().sort();
    if (length % 2 === 0) return (sortedArray[length / 2 - 1] + sortedArray[length / 2]) / 2;
    return sortedArray[~~(length / 2)];
};
export const maxIndex = (array: TypedArray | number[]) => {
    if (!array.length) return 0;
    let index = 0;
    let max = array[0];
    let i = array.length;
    while (i-- > 1) {
        const cur = array[i];
        if (cur <= max) continue;
        max = cur;
        index = i;
    }
    return index;
};
export const energy = (signal: TypedArray | number[]) => {
    let sum = 0;
    let sample = 0;
    for (let i = 0; i < signal.length; i++) {
        sample = signal[i];
        sum += sample * sample;
    }
    return sum;
};
export const rms = (signal: TypedArray | number[]) => Math.sqrt(energy(signal) / signal.length);
export const zcr = (signal: TypedArray | number[]) => {
    let zcr = 0;
    let lastPositive = true;
    let positive = true;
    for (let i = 0; i < signal.length; i++) {
        positive = signal[i] >= 0;
        if (positive !== lastPositive) zcr++;
        lastPositive = positive;
    }
    return zcr;
};
export const centroid = (array: TypedArray | number[]) => {
    let weightedSum = 0;
    let weight = 0;
    for (let i = 0; i < array.length; i++) {
        weightedSum += i * Math.abs(array[i]);
        weight += array[i];
    }
    return weight === 0 ? 0 : weightedSum / weight;
};
export const conjugatedCentroid = (array: TypedArray | number[], factor: number) => {
    let weightedSum = 0;
    let weight = 0;
    for (let i = 0; i < array.length; i++) {
        weightedSum += (i ** factor) * Math.abs(array[i]);
        weight += array[i];
    }
    return weight === 0 ? 0 : weightedSum / weight;
};
export const geometricMean = (array: TypedArray | number[]) => {
    const length = array.length;
    let sum = 0;
    let sample = 0;
    for (let i = 0; i < length; i++) {
        sample = array[i];
        if (sample <= 0) return 0;
        sum += Math.log(array[i]);
    }
    return Math.exp(sum / length);
};
export const flatness = (array: TypedArray | number[]) => geometricMean(array) / mean(array);
/**
 * https://essentia.upf.edu/reference/std_Flux.html
 *
 * @param {TypedArray} cur
 * @param {TypedArray} prev
 * @param {("L1" | "L2")} [norm]
 * @param {boolean} [halfRectify]
 * @returns
 */
export const flux = (cur: TypedArray | number[], prev: TypedArray | number[], norm?: "L1" | "L2", halfRectify?: boolean) => {
    let flux = 0;
    if (norm === "L2") {
        if (halfRectify === true) { // L2 + halfRectify
            for (let i = 0; i < cur.length; i++) {
                const diff = cur[i] - prev[i];
                if (diff < 0) continue;
                flux += diff * diff;
            }
            return Math.sqrt(flux);
        }
        for (let i = 0; i < cur.length; i++) { // L2 not halfRectify
            const diff = cur[i] - prev[i];
            flux += diff * diff;
        }
        return Math.sqrt(flux);
    }
    if (halfRectify === true) { // L1 + halfRectify
        for (let i = 0; i < cur.length; i++) {
            const diff = cur[i] - prev[i];
            if (diff < 0) continue;
            flux += diff;
        }
        return flux;
    }
    for (let i = 0; i < cur.length; i++) { // L1 not halfRectify
        const diff = cur[i] - prev[i];
        flux += Math.abs(diff);
    }
    return flux;
};
/**
 * https://github.com/meyda/meyda/blob/master/src/extractors/spectralKurtosis.js
 *
 * @param {TypedArray} array
 */
export const kurtosis = (array: TypedArray | number[]) => {
    const c1 = centroid(array);
    const c2 = conjugatedCentroid(array, 2);
    const c3 = conjugatedCentroid(array, 3);
    const c4 = conjugatedCentroid(array, 4);
    const numerator = -3 * c1 ** 4 + 6 * c1 * c2 - 4 * c1 * c3 + c4;
    const denominator = (c2 - c1 ** 2) ** 2;
    return numerator / denominator;
};
/**
 * https://github.com/meyda/meyda/blob/master/src/extractors/spectralSkewness.js
 *
 * @param {TypedArray} array
 */
export const skewness = (array: TypedArray | number[]) => {
    const c1 = centroid(array);
    const c2 = conjugatedCentroid(array, 2);
    const c3 = conjugatedCentroid(array, 3);
    const numerator = 2 * c1 ** 3 - 3 * c1 * c2 + c3;
    const denominator = (c2 - c1 ** 2) ** 1.5;
    return numerator / denominator;
};
/**
 * https://essentia.upf.edu/reference/std_RollOff.html
 *
 * @param {TypedArray} array
 * @param {number} [cutoff] Between 0 - 1
 * @returns
 */
export const rolloff = (array: TypedArray | number[], cutoff?: number) => {
    const length = array.length;
    let e = energy(array);
    const threshold = (cutoff || 0.99) * e;
    let n = length - 1;
    while (e > threshold && n >= 0) {
        const element = array[n];
        e -= element * element;
        --n;
    }
    return n + 1;
};
export const slope = (array: TypedArray | number[]) => {
    const n = array.length;
    const xSum = n * n / 2;
    const x2Sum = (n - 1) * n * (2 * n - 1) / 6;
    let ySum = 0;
    let xySum = 0;
    for (let x = 0; x < n; x++) {
        const y = array[x];
        ySum += y;
        xySum += x * y;
    }
    return (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
};
export const spread = (array: TypedArray | number[]) => Math.sqrt(conjugatedCentroid(array, 2)) - centroid(array) ** 2;
// eslint-disable-next-line arrow-parens
export const setBuffer = <T extends TypedArray = TypedArray>(to: T, from: T, offsetTo?: number, offsetFrom?: number) => {
    const toLength = to.length;
    const fromLength = from.length;
    const spillLength = Math.min(toLength, fromLength);
    let spilled = 0;
    let $to = mod(offsetTo, toLength) || 0;
    let $from = mod(offsetFrom, fromLength) || 0;
    while (spilled < spillLength) {
        const $spillLength = Math.min(spillLength - spilled, toLength - $to, fromLength - $from);
        const $fromEnd = $from + $spillLength;
        if ($from === 0 && $fromEnd === fromLength) to.set(from, $to);
        to.set(from.subarray($from, $fromEnd), $to);
        $to %= $to + $spillLength;
        $from %= $fromEnd;
        spilled += $spillLength;
    }
    return to;
};
// eslint-disable-next-line arrow-parens
export const getSubBuffer = <T extends TypedArray = TypedArray>(from: T, length: number, offset?: number) => {
    const fromLength = from.length;
    const $ = mod(offset, fromLength) || 0;
    if ($ === 0 && length === fromLength) return from;
    if ($ + length < fromLength) return from.subarray($, $ + length) as T;
    const to = new (from.constructor as TypedArrayConstructor)(length);
    return setBuffer(to, from, 0, $) as T;
};
// eslint-disable-next-line arrow-parens
export const sliceBuffer = <T extends TypedArray = TypedArray>(from: T, length: number, offset?: number) => {
    const fromLength = from.length;
    const $ = mod(offset, fromLength) || 0;
    if ($ === 0 && length === fromLength) return from.slice();
    if ($ + length < fromLength) return from.slice($, $ + length) as T;
    const to = new (from.constructor as TypedArrayConstructor)(length);
    return setBuffer(to, from, 0, $) as T;
};
/**
 * http://www.fftw.org/fftw3_doc/The-Halfcomplex_002dformat-DFT.html
 *
 * @param {Float32Array} from
 */
export const fftw2Amp = (from: Float32Array, windowEnergyFactor: number) => {
    const { length } = from;
    const amps = new Float32Array(length / 2);
    for (let i = 0; i < length / 2; i++) {
        const real = from[i];
        const imag = (i === 0 || i === length / 2 - 1) ? 0 : from[length - i];
        amps[i] = (real * real + imag * imag) ** 0.5 / length * windowEnergyFactor;
    }
    return amps;
};
export const estimateFreq = (amps: Float32Array, sampleRate: number) => indexToFreq(maxIndex(amps), amps.length, sampleRate);
export const indexToFreq = (i: number, fftBins: number, sampleRate: number) => (i % fftBins) / fftBins * sampleRate / 2;
