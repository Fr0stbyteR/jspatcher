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

/**
 * Gives OS name as follows:
 * "Windows"    for all versions of Windows,
 * "MacOS"      for all versions of Macintosh OS,
 * "Linux"      for all versions of Linux,
 * "UNIX"       for all other UNIX flavors,
 * "Unknown" indicates failure to detect the OS
 *
 * @returns {"Windows" | "MacOS" | "UNIX" | "Linux" | "Unknown"} OS name
 */
export const detectOS = (): "Windows" | "MacOS" | "UNIX" | "Linux" | "Unknown" => {
    const { appVersion } = navigator;
    if (appVersion.indexOf("Win") !== -1) return "Windows";
    if (appVersion.indexOf("Mac") !== -1) return "MacOS";
    if (appVersion.indexOf("X11") !== -1) return "UNIX";
    if (appVersion.indexOf("Linux") !== -1) return "Linux";
    return "Unknown";
};
