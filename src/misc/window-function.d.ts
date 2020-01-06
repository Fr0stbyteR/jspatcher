
declare module "window-function" {
    export function bartlett(i: number, N: number): number;
    export function bartlettHann(i: number, N: number): number;
    export function blackman(i: number, N: number): number;
    export function blackmanHarris(i: number, N: number): number;
    export function blackmanNuttall(i: number, N: number): number;
    export function cosine(i: number, N: number): number;
    export function exactBlackman(i: number, N: number): number;
    export function flatTop(i: number, N: number): number;
    export function gaussian(i: number, N: number, sigma: number): number;
    export function hamming(i: number, N: number): number;
    export function hann(i: number, N: number): number;
    export function lanczos(i: number, N: number): number;
    export function nuttall(i: number, N: number): number;
    export function rectangular(i: number, N: number): number;
    export function triangular(i: number, N: number): number;
    export function tukey(i: number, N: number, alpha: number): number;
    export function welch(i: number, N: number): number;
}

declare module "window-function/apply" {
    export default function apply(array: ArrayLike<number>, fn: (i: number, N: number, ...args: number[]) => number, ...args: number[]): ArrayLike<number>;
}

declare module "window-function/generate" {
    export default function generate(fn: (i: number, N: number, ...args: number[]) => number, n: number, ...args: number[]): ArrayLike<number>;
}
