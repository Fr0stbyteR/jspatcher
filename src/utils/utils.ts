/* eslint-disable arrow-body-style */
import { TMIDIEvent, TBPF, TRect, TPresentationRect } from "../core/types";

export const isStringArray = (x: any): x is string[] => Array.isArray(x) && x.every(e => typeof e === "string");
export const isNumberArray = (x: any): x is number[] => Array.isArray(x) && x.every(e => typeof e === "number");
export const isTRect = (x: any): x is TRect => {
    return isNumberArray(x)
        && x.length === 4
        && x[0] >= 0
        && x[1] >= 0
        && x[2] >= 15
        && x[3] >= 15;
};
export const isTPresentationRect = (x: any): x is TPresentationRect => {
    return Array.isArray(x)
        && x.length === 4
        && x.every(v => typeof v === "number" || typeof v === "string");
};
export const isRectMovable = (x: any): x is [number, number, number | string, number | string] => {
    return isTPresentationRect(x) && typeof x[0] === "number" && typeof x[1] === "number";
};
export const isRectResizable = (x: any): x is TRect => isTRect(x);
export const isMIDIEvent = (x: any): x is TMIDIEvent => (isNumberArray(x) || x instanceof Uint8Array) && x.length === 3;
export const stringifyError = (data: any) => {
    if (typeof data === "string") return data;
    if (data instanceof Error) return data.message;
    if (typeof data === "object") return JSON.stringify(data);
    return `${data}`;
};
export const parseToPrimitive = (value: any) => {
    try {
        return JSON.parse(value);
    } catch (e) {
        return value.toString();
    }
};
export const rgbaMax2Css = (maxColor: number[]) => {
    const cssColor = [255, 255, 255, 1] as TRect;
    if (Array.isArray(maxColor)) {
        for (let i = 0; i < 3; i++) {
            if (typeof maxColor[i] === "number") cssColor[i] = Math.floor(maxColor[i] * 255);
        }
        if (typeof maxColor[3] === "number") cssColor[3] = maxColor[3];
    }
    return `rgba(${cssColor.join(",")})`;
};
/**
 * A BPF can be described as a succesion of three number tuples.
 * i.e. `1 1 0.5 2 1 1` curve mode means go to 0 immediately then go to 1 in 1s with a curve of e^0.5, then go to 2 in 1s linear.
 * The function transform the string to number[][], i.e. `[[1, 1, 0.5], [2, 1, 1]]`
 *
 * @param {TBPF} sIn
 * @returns {number[][]}
 */
export const decodeBPF = (sIn: TBPF, tupleLength: number): number[][] => {
    if (typeof sIn === "number") return [[sIn]];
    if (isNumberArray(sIn)) return [sIn];
    if (Array.isArray(sIn) && sIn.every(a => isNumberArray(a))) return sIn;
    if (typeof sIn !== "string") throw new Error("Failed to decode curve.");
    const numbers = sIn.split(" ").filter(s => !!s).map(s => +s);
    if (numbers.find(v => !isFinite(v))) throw new Error("BPF contains invalid number.");
    const tuples: number[][] = [];
    for (let i = 0; i < numbers.length; i++) {
        const $tuple = ~~(i / tupleLength);
        const $ = i % tupleLength;
        if (!tuples[$tuple]) tuples[$tuple] = [];
        tuples[$tuple][$] = numbers[i];
    }
    return tuples;
};
export const decodeCurve = (sIn: TBPF) => decodeBPF(sIn, 3);
export const decodeLine = (sIn: TBPF) => decodeBPF(sIn, 2);

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
export const selectElementRange = (e: HTMLElement) => {
    const elementIsEditable = (e: HTMLElement): e is HTMLInputElement | HTMLTextAreaElement => !!e.nodeName.match(/^(INPUT|TEXTAREA)$/i);
    const selection = window.getSelection();
    if (elementIsEditable(e)) {
        e.focus();
        e.select();
        return;
    }
    if (selection.setBaseAndExtent) {
        // Safari
        selection.setBaseAndExtent(e, 0, e, e.hasChildNodes() ? 1 : 0);
        return;
    }
    if (selection.addRange && selection.removeAllRanges && document.createRange) {
        // Mozilla or Opera 10.5+
        const range = document.createRange();
        range.selectNodeContents(e);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};
export const selectElementPos = (e: HTMLElement, pos: number) => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStart(e.childNodes[0], pos);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
};
// eslint-disable-next-line arrow-body-style
export const getPropertyDescriptor = (obj: { [key: string]: any }, key: string): PropertyDescriptor => {
    return Object.getOwnPropertyDescriptor(obj, key) || getPropertyDescriptor(Object.getPrototypeOf(obj), key);
};
export const getPropertyDescriptors = (obj: Function | { [key: string]: any }): PropertyDescriptorMap => {
    if (typeof obj === "function") return Object.getOwnPropertyDescriptors(obj);
    const proto = Object.getPrototypeOf(obj);
    if (obj !== Object.prototype && proto === Object.prototype) return Object.getOwnPropertyDescriptors(obj);
    return Object.assign(proto ? getPropertyDescriptors(proto) : {}, Object.getOwnPropertyDescriptors(obj));
};
