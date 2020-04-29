/**
 * Mod support wrapping with negative numbers
 */
export const mod = (x: number, y: number): number => (x % y + y) % y;
/**
 * Round a number to multiple of another
 */
export const round = (x: number, to: number): number => Math.round(x / to) * to;
/**
 * Floor a number to multiple of another
 */
export const floor = (x: number, to: number): number => Math.floor(x / to) * to;
/**
 * Ceil a number to multiple of another
 */
export const ceil = (x: number, to: number): number => Math.ceil(x / to) * to;
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
