import { inspect } from "util";

export const stringifyError = (data: any) => {
    if (typeof data === "string") return data;
    if (data instanceof Error) return data.stack;
    if (typeof data === "object") return inspect(data);
    return `${data}`;
};
/**
 * In Max/MSP curve~, a curve can be described as a succesion of three number tuples.
 * i.e. `0, 1 1000 0.5` means go to 0 immediately then go to 1 in 1000 ms with a curve of e^0.5.
 * The function transform the string to number[][], i.e. `[[0], [1, 1000, 0.5]]`
 *
 * @param {(string | number)} sIn Max/MSP-style curve
 * @returns {number[][]}
 */
export const decodeMaxCurveFormat = (sIn: string | number): number[][] => {
    if (typeof sIn === "number") return [[sIn]];
    if (typeof sIn !== "string") throw new Error("Failed to decode curve.");
    const tuples = sIn.split(",").filter(s => !!s);
    return tuples.map(sTuple => sTuple.split(" ").filter(s => !!s).map((s) => {
        const n = +s;
        if (isFinite(n)) return n;
        throw new Error(`Curve element: ${s} in ${sIn} is not finite.`);
    }));
};
