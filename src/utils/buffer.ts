import { mod } from "./math";

type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array;
type TypedArrayConstructor = typeof Int8Array | typeof Uint8Array | typeof Int16Array | typeof Uint16Array | typeof Int32Array | typeof Uint32Array | typeof Uint8ClampedArray | typeof Float32Array | typeof Float64Array;
export const sum = (array: TypedArray | number[], from = 0, length = array.length) => {
    let sum = 0;
    const l = array.length;
    for (let i = 0; i < length; i++) {
        sum += array[(from + i) % l];
    }
    return sum;
};
export const mean = (array: TypedArray | number[], from = 0, length = array.length) => sum(array, from, length) / length;
export const median = (array: TypedArray | number[], from = 0, length = array.length) => {
    if (length === 0) throw new Error("trying to calculate median of empty array");
    const sortedArray = (from + length > array.length ? Array.isArray(array) ? array.slice(from).concat(array.slice(0, from + length - array.length)) : sliceBuffer(array, length, from) : array.slice(from, from + length)).sort();
    if (length % 2 === 0) return (sortedArray[length / 2 - 1] + sortedArray[length / 2]) / 2;
    return sortedArray[~~(length / 2)];
};
export const maxIndex = (array: TypedArray | number[], from = 0, length = array.length) => {
    const l = array.length;
    if (!l) return 0;
    let index = 0;
    let max = array[0];
    let i = length;
    while (i-- > 1) {
        const cur = array[(from + i) % l];
        if (cur <= max) continue;
        max = cur;
        index = i;
    }
    return index;
};
export const energy = (signal: TypedArray | number[], from = 0, length = signal.length) => {
    let sum = 0;
    let sample = 0;
    const l = signal.length;
    for (let i = 0; i < length; i++) {
        sample = signal[(from + i) % l];
        sum += sample * sample;
    }
    return sum;
};
export const rms = (signal: TypedArray | number[], from = 0, length = signal.length) => Math.sqrt(energy(signal, from, length) / signal.length);
export const absMax = (signal: TypedArray | number[], from = 0, length = signal.length) => {
    let max = 0;
    let sample = 0;
    const l = signal.length;
    for (let i = 0; i < length; i++) {
        sample = Math.abs(signal[(from + i) % l]);
        if (sample > max) max = sample;
    }
    return max;
};
export const zcr = (signal: TypedArray | number[], from = 0, length = signal.length) => {
    let zcr = 0;
    let lastPositive = true;
    let positive = true;
    const l = signal.length;
    for (let i = 0; i < length; i++) {
        positive = signal[(from + i) % l] >= 0;
        if (positive !== lastPositive) zcr++;
        lastPositive = positive;
    }
    return zcr;
};
export const centroid = (array: TypedArray | number[], from = 0, length = array.length) => {
    let weightedSum = 0;
    let weight = 0;
    let sample = 0;
    const l = array.length;
    for (let i = 0; i < length; i++) {
        sample = array[(from + i) % l];
        weightedSum += i * Math.abs(sample);
        weight += sample;
    }
    return weight === 0 ? 0 : weightedSum / weight;
};
export const conjugatedCentroid = (array: TypedArray | number[], factor: number, from = 0, length = array.length) => {
    let weightedSum = 0;
    let weight = 0;
    let sample = 0;
    const l = array.length;
    for (let i = 0; i < length; i++) {
        sample = array[(from + i) % l];
        weightedSum += (i ** factor) * Math.abs(sample);
        weight += sample;
    }
    return weight === 0 ? 0 : weightedSum / weight;
};
export const geometricMean = (array: TypedArray | number[], from = 0, length = array.length) => {
    let sum = 0;
    let sample = 0;
    const l = array.length;
    for (let i = 0; i < length; i++) {
        sample = array[(from + i) % l];
        if (sample <= 0) return 0;
        sum += Math.log(sample);
    }
    return Math.exp(sum / length);
};
export const flatness = (array: TypedArray | number[], from = 0, length = array.length) => geometricMean(array, from, length) / mean(array, from, length);
/**
 * https://essentia.upf.edu/reference/std_Flux.html
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
 * https://github.com/meyda/meyda/blob/master/src/extractors/spectralKurtosis.js=
 */
export const kurtosis = (array: TypedArray | number[], from = 0, length = array.length) => {
    const c1 = centroid(array, from, length);
    const c2 = conjugatedCentroid(array, 2, from, length);
    const c3 = conjugatedCentroid(array, 3, from, length);
    const c4 = conjugatedCentroid(array, 4, from, length);
    const numerator = -3 * c1 ** 4 + 6 * c1 * c2 - 4 * c1 * c3 + c4;
    const denominator = (c2 - c1 ** 2) ** 2;
    return numerator / denominator;
};
/**
 * https://github.com/meyda/meyda/blob/master/src/extractors/spectralSkewness.js
 */
export const skewness = (array: TypedArray | number[], from = 0, length = array.length) => {
    const c1 = centroid(array, from, length);
    const c2 = conjugatedCentroid(array, 2, from, length);
    const c3 = conjugatedCentroid(array, 3, from, length);
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
export const rolloff = (array: TypedArray | number[], from = 0, length = array.length, cutoff = 0.99) => {
    let e = energy(array, from, length);
    const threshold = (cutoff || 0.99) * e;
    let n = length - 1;
    let element;
    while (e > threshold && n >= 0) {
        element = array[(n + from) % length];
        e -= element * element;
        --n;
    }
    return n + 1;
};
export const slope = (array: TypedArray | number[], from = 0, n = array.length) => {
    const xSum = n * n / 2;
    const x2Sum = (n - 1) * n * (2 * n - 1) / 6;
    let ySum = 0;
    let xySum = 0;
    let y;
    for (let x = 0; x < n; x++) {
        y = array[(x + from) % n];
        ySum += y;
        xySum += x * y;
    }
    return (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
};
export const spread = (array: TypedArray | number[], from = 0, length = array.length) => Math.sqrt(conjugatedCentroid(array, 2, from, length)) - centroid(array, from, length) ** 2;
/**
 * Copy buffer to another, support negative offset index
 */
export const setTypedArray = <T extends TypedArray = TypedArray>(to: T, from: T, offsetTo?: number, offsetFrom?: number) => {
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
        else to.set(from.subarray($from, $fromEnd), $to);
        $to = ($to + $spillLength) % toLength;
        $from = $fromEnd % fromLength;
        spilled += $spillLength;
    }
    return $to;
};

export const getSubTypedArray = <T extends TypedArray = TypedArray>(from: T, length: number, offset = 0) => {
    const fromLength = from.length;
    const $ = mod(offset, fromLength) || 0;
    if ($ === 0 && length === fromLength) return from;
    if ($ + length < fromLength) return from.subarray($, $ + length) as T;
    const to = new (from.constructor as TypedArrayConstructor)(length) as T;
    setTypedArray(to, from, 0, $);
    return to;
};

export const sliceBuffer = <T extends TypedArray = TypedArray>(from: T, length: number, offset?: number) => {
    const fromLength = from.length;
    const $ = mod(offset, fromLength) || 0;
    if ($ === 0 && length === fromLength) return from.slice();
    if ($ + length < fromLength) return from.slice($, $ + length) as T;
    const to = new (from.constructor as TypedArrayConstructor)(length) as T;
    setTypedArray(to, from, 0, $);
    return to;
};
/**
 * http://www.fftw.org/fftw3_doc/The-Halfcomplex_002dformat-DFT.html
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
