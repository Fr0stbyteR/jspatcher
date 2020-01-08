import { mod } from "../../../utils/math";

export const energy = (signal: Float32Array) => {
    let sum = 0;
    let sample = 0;
    for (let i = 0; i < signal.length; i++) {
        sample = signal[i];
        sum += sample * sample;
    }
    return sum;
};
export const rms = (signal: Float32Array) => Math.sqrt(energy(signal) / signal.length);
export const zcr = (signal: Float32Array) => {
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
type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array;
type TypedArrayConstructor = typeof Int8Array | typeof Uint8Array | typeof Int16Array | typeof Uint16Array | typeof Int32Array | typeof Uint32Array | typeof Uint8ClampedArray | typeof Float32Array | typeof Float64Array;
export const setBuffer = (to: TypedArray, from: TypedArray, offsetTo?: number, offsetFrom?: number) => {
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
export const getSubBuffer = (from: TypedArray, length: number, offset?: number) => {
    const fromLength = from.length;
    const $ = mod(offset, fromLength) || 0;
    if ($ === 0 && length === fromLength) return from;
    if ($ + length < fromLength) return from.subarray($, $ + length);
    const to = new (from.constructor as TypedArrayConstructor)(length);
    return setBuffer(to, from, 0, $);
};
/**
 * http://www.fftw.org/fftw3_doc/The-Halfcomplex_002dformat-DFT.html
 *
 * @param {Float32Array} from
 */
export const fftw2Amp = (from: Float32Array) => {
    const { length } = from;
    const amps = new Float32Array(length / 2);
    for (let i = 0; i < length / 2; i++) {
        const real = from[i];
        const imag = (i === 0 || i === length / 2 - 1) ? 0 : from[length - i];
        amps[i] = (real * real + imag * imag) ** 0.5 / length * 2.38328;
    }
    return amps;
};
