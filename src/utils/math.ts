import { isNumberArray } from "./utils";

/**
 * Mod support wrapping with negative numbers
 */
export const mod = (x: number, y: number): number => (x % y + y) % y;
/**
 * Round a number to multiple of another
 */
export const round = (x: number, to: number): number => (Math.abs(to) < 1 ? Math.round(x * (1 / to)) / (1 / to) : Math.round(x / to) * to);
/**
 * Floor a number to multiple of another
 */
export const floor = (x: number, to: number): number => (Math.abs(to) < 1 ? Math.floor(x * (1 / to)) / (1 / to) : Math.floor(x / to) * to);
/**
 * Ceil a number to multiple of another
 */
export const ceil = (x: number, to: number): number => (Math.abs(to) < 1 ? Math.ceil(x * (1 / to)) / (1 / to) : Math.ceil(x / to) * to);
/**
 * Degree to radian
 */
export const toRad = (degrees: number): number => degrees * Math.PI / 180;
/**
 * MIDI note number to string
 */
export const toMIDI = (f: number): string => ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][(f % 12 + 12) % 12] + Math.round(f / 12 - 2);
/**
 * Linear amplitude ([0, 1]) to dB ([-Inf, 0])
 *
 * @param {number} a linear amplitude value
 * @returns {number} dB value
 */
export const atodb = (a: number): number => 20 * Math.log10(a);
/**
 * dB ([-Inf, 0]) to Linear mplitude ([0, 1])
 *
 * @param {number} db dB value
 * @returns {number} linear amplitude value
 */
export const dbtoa = (db: number): number => 10 ** (db / 20);
/**
 * De-scale a exponently scaled value
 *
 * @param {number} x normalized value to scale between ([0, 1])
 * @param {number} e exponent factor used to scale, 0 means linear, 1 does ** 1.5 curve
 * @returns {number} de-scaled value
 */
export const iNormExp = (x: number, e: number): number => Math.max(0, x) ** (1.5 ** -e);
/**
 * Scale exponently a normalized value
 *
 * @param {number} x normalized value to scale between ([0, 1])
 * @param {number} e exponent factor, 0 means linear, 1 does ** 1.5 curve
 * @returns {number} scaled value
 */
export const normExp = (x: number, e: number): number => Math.max(0, x) ** (1.5 ** e);

export const scale = (x: number, l1: number, h1: number, l2: number, h2: number) => {
    const r1 = h1 - l1;
    const r2 = h2 - l2;
    return (x - l1) / r1 * r2 + l2;
};

export const scaleClip = (x: number, l1: number, h1: number, l2: number, h2: number) => Math.max(l2, Math.min(h2, scale(x, l1, h1, l2, h2)));

// eslint-disable-next-line arrow-body-style
export const isIdentityMatrix = (x: number[][]) => {
    return Array.isArray(x)
    && x.every((row, i) => isNumberArray(row)
    && row.length === x.length
    && row.every((e, j) => e === (j === i ? 1 : 0)));
};

export const identityMatrix = (dim: number) => new Array(dim).fill(undefined).map((x, i) => new Array(dim).fill(undefined).map((y, j) => +(i === j)));
