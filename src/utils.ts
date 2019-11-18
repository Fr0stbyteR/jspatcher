import { inspect } from "util";
import { EventEmitter } from "events";

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
export class MappedEventEmitter<M> {
    private readonly _emitter = new EventEmitter();
    addListener<K extends keyof M>(event: K, listener: (e: M[K]) => void) {
        return this._emitter.addListener(event as string, listener);
    }
    on<K extends keyof M>(event: K, listener: (e: M[K]) => void) {
        return this._emitter.on(event as string, listener);
    }
    once<K extends keyof M>(event: K, listener: (e: M[K]) => void) {
        return this._emitter.once(event as string, listener);
    }
    prependListener<K extends keyof M>(event: K, listener: (e: M[K]) => void) {
        return this._emitter.prependListener(event as string, listener);
    }
    prependOnceListener<K extends keyof M>(event: K, listener: (e: M[K]) => void) {
        return this._emitter.prependOnceListener(event as string, listener);
    }
    removeListener<K extends keyof M>(event: K, listener: (e: M[K]) => void) {
        return this._emitter.removeListener(event as string, listener);
    }
    off<K extends keyof M>(event: K, listener: (e: M[K]) => void) {
        return this._emitter.off(event as string, listener);
    }
    removeAllListeners(event?: keyof M) {
        return this._emitter.removeAllListeners(event as string);
    }
    setMaxListeners(n: number) {
        return this._emitter.setMaxListeners(n);
    }
    getMaxListeners() {
        return this._emitter.getMaxListeners();
    }
    listeners(event: keyof M) {
        return this._emitter.listeners(event as string);
    }
    rawListeners(event: keyof M) {
        return this._emitter.rawListeners(event as string);
    }
    emit<K extends keyof M>(event: K, e?: M[K]) {
        return this._emitter.emit(event as string, e);
    }
    eventNames() {
        return this._emitter.eventNames();
    }
    listenerCount(type: keyof M) {
        return this._emitter.listenerCount(type as string);
    }
}
export const isStringArray = (x: any): x is string[] => Array.isArray(x) && x.every(e => typeof e === "string");
export const isNumberArray = (x: any): x is number[] => Array.isArray(x) && x.every(e => typeof e === "number");
export const toMIDI = (f: number) => ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][(f % 12 + 12) % 12] + Math.round(f / 12 - 2);
export const toRad = (degrees: number) => degrees * Math.PI / 180;
export const atodb = (a: number) => 20 * Math.log10(a);
export const dbtoa = (db: number) => 10 ** (db / 20);
export const roundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number | number[]) => {
    const radii = [0, 0, 0, 0];
    if (typeof radius === "number") radii.fill(radius);
    else radius.forEach((v, i) => radii[i] = v);
    ctx.beginPath();
    ctx.moveTo(x + radii[0], y);
    ctx.lineTo(x + width - radii[1], y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radii[1]);
    ctx.lineTo(x + width, y + height - radii[2]);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radii[2], y + height);
    ctx.lineTo(x + radii[3], y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radii[3]);
    ctx.lineTo(x, y + radii[0]);
    ctx.quadraticCurveTo(x, y, x + radii[0], y);
    ctx.closePath();
    ctx.stroke();
};
export const fillRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number | number[]) => {
    const radii = [0, 0, 0, 0];
    if (typeof radius === "number") radii.fill(radius);
    else radius.forEach((v, i) => radii[i] = v);
    ctx.beginPath();
    ctx.moveTo(x + radii[0], y);
    ctx.lineTo(x + width - radii[1], y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radii[1]);
    ctx.lineTo(x + width, y + height - radii[2]);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radii[2], y + height);
    ctx.lineTo(x + radii[3], y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radii[3]);
    ctx.lineTo(x, y + radii[0]);
    ctx.quadraticCurveTo(x, y, x + radii[0], y);
    ctx.closePath();
    ctx.fill();
};
