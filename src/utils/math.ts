/**
 * Mod support wrapping with negative numbers
 *
 * @param {number} x
 * @param {number} y
 */
export const mod = (x: number, y: number) => (x % y + y) % y;
/**
 * Round a number to multiple of another
 *
 * @param {number} x
 * @param {number} to
 * @returns
 */
export const round = (x: number, to: number) => Math.round(x / to) * to;
/**
 * Floor a number to multiple of another
 *
 * @param {number} x
 * @param {number} to
 * @returns
 */
export const floor = (x: number, to: number) => Math.floor(x / to) * to;
/**
 * Ceil a number to multiple of another
 *
 * @param {number} x
 * @param {number} to
 * @returns
 */
export const ceil = (x: number, to: number) => Math.ceil(x / to) * to;
export const toRad = (degrees: number) => degrees * Math.PI / 180;
export const toMIDI = (f: number) => ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][(f % 12 + 12) % 12] + Math.round(f / 12 - 2);
export const atodb = (a: number) => 20 * Math.log10(a);
export const dbtoa = (db: number) => 10 ** (db / 20);
export const iNormExp = (x: number, e: number) => Math.max(0, x) ** (1.5 ** -e);
export const normExp = (x: number, e: number) => Math.max(0, x) ** (1.5 ** e);
