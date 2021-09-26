/* eslint-disable arrow-body-style */
import type { TPatcherProps } from "../core/patcher/Patcher";
import type { TMIDIEvent, TBPF, TRect, TPresentationRect, ProjectItemType, RawPatcher, TMaxPatcher, TAudioUnit } from "../core/types";

export const uuid = () => {
    return globalThis?.crypto?.randomUUID
        ? crypto.randomUUID()
        : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
};

export const getTimestamp = () => {
    if (globalThis.performance) {
        return performance.now() + (performance.timeOrigin || performance.timing.navigationStart);
    }
    return Date.now();
};

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
export const css2RgbaMax = (color: string) => {
    const maxColor = [0.2, 0.2, 0.2, 1] as TRect;
    const matched = color.match(/rgba\((.+)\)/);
    if (!matched) return maxColor;
    const cssColor = matched[1].split(",").map(s => +s);
    for (let i = 0; i < 3; i++) {
        if (typeof cssColor[i] === "number") maxColor[i] = cssColor[i] / 255;
        if (typeof cssColor[3] === "number") maxColor[3] = cssColor[3];
    }
    return maxColor;
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
export const detectBrowserCore = () => {
    if ((window as any).chrome) return "Chromium";
    if ((window as any).InstallTrigger) return "Gecko";
    if (navigator.vendor.indexOf("Apple") !== -1) return "WebKit";
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
export const findFromAscendants = (e: HTMLElement, predict: (e: HTMLElement) => boolean) => {
    const ascendants = [];
    let parent = e.parentElement;
    while (parent !== document.body) {
        ascendants.push(parent);
        parent = parent.parentElement;
    }
    return ascendants.find(predict);
};
// eslint-disable-next-line arrow-body-style
export const getPropertyDescriptor = (obj: Record<string, any>, key: string): PropertyDescriptor => {
    return Object.getOwnPropertyDescriptor(obj, key) || getPropertyDescriptor(Object.getPrototypeOf(obj), key);
};
export const getPropertyDescriptors = (obj: Function | Record<string, any>): PropertyDescriptorMap => {
    if (typeof obj === "function") return Object.getOwnPropertyDescriptors(obj);
    const proto = Object.getPrototypeOf(obj);
    if (obj !== Object.prototype && proto === Object.prototype) return Object.getOwnPropertyDescriptors(obj);
    return Object.assign(proto ? getPropertyDescriptors(proto) : {}, Object.getOwnPropertyDescriptors(obj));
};

export const extToType = (ext: string): Exclude<ProjectItemType, "folder"> => {
    if (["jspat", "maxpat", "gendsp", "dsppat"].indexOf(ext) !== -1) return "patcher";
    if (["wav", "aif", "aiff", "mp3", "aac", "flac", "ogg", "m4a"].indexOf(ext) !== -1) return "audio";
    if (["txt", "json"].indexOf(ext) !== -1) return "text";
    if (["apng", "avif", "gif", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "webp", "bmp", "ico", "cur", "tif", "tiff"].indexOf(ext) !== -1) return "image";
    if (["mp4", "webm", "3gp"].indexOf(ext) !== -1) return "video";
    return "unknown";
};

export const max2js = (patcherIn: TMaxPatcher, mode = "max" as TPatcherProps["mode"]): RawPatcher => {
    const patcher: RawPatcher = { boxes: {}, lines: {} };
    const maxPatcher = (patcherIn as TMaxPatcher).patcher;
    patcher.props = {
        bgColor: rgbaMax2Css(maxPatcher.bgcolor),
        editingBgColor: rgbaMax2Css(maxPatcher.editing_bgcolor),
        dependencies: [],
        grid: maxPatcher.gridsize,
        openInPresentation: !!maxPatcher.openinpresentation,
        mode
    };
    const maxBoxes = maxPatcher.boxes;
    const maxLines = maxPatcher.lines;
    for (let i = 0; i < maxBoxes.length; i++) {
        const maxBox = maxBoxes[i].box;
        const numID = parseInt(maxBox.id.match(/\d+/)[0]);
        const id = "box-" + numID;
        patcher.boxes[id] = {
            id,
            inlets: maxBox.numinlets,
            outlets: maxBox.numoutlets,
            rect: maxBox.patching_rect,
            presentationRect: maxBox.presentation_rect,
            background: !!maxBox.background,
            presentation: !!maxBox.presentation,
            text: (maxBox.maxclass === "newobj" ? "" : maxBox.maxclass + " ") + (maxBox.text ? maxBox.text : "")
        };
    }
    for (let i = 0; i < maxLines.length; i++) {
        const lineArgs = maxLines[i].patchline;
        const id = "line-" + i;
        patcher.lines[id] = {
            id,
            src: [lineArgs.source[0].replace(/obj/, "box"), lineArgs.source[1]],
            dest: [lineArgs.destination[0].replace(/obj/, "box"), lineArgs.destination[1]]
        };
    }
    return patcher;
};

export const js2max = (patcherIn: RawPatcher): TMaxPatcher => {
    const maxPatcher: TMaxPatcher["patcher"] = {
        boxes: [],
        lines: [],
        rect: undefined,
        bgcolor: css2RgbaMax(patcherIn.props.bgColor),
        editing_bgcolor: css2RgbaMax(patcherIn.props.editingBgColor),
        gridsize: patcherIn.props.grid,
        openinpresentation: +patcherIn.props.openInPresentation
    };
    for (const id in patcherIn.boxes) {
        const box = patcherIn.boxes[id];
        const numID = parseInt(id.match(/\d+/)[0]);
        maxPatcher.boxes.push({
            box: {
                id: `obj-${numID}`,
                maxclass: "newobj",
                numinlets: box.inlets,
                numoutlets: box.outlets,
                patching_rect: box.rect,
                presentation: +box.presentation,
                background: +box.background,
                text: box.text
            }
        });
    }
    for (const id in patcherIn.lines) {
        const line = patcherIn.lines[id];
        maxPatcher.lines.push({
            patchline: {
                source: [line.src[0].replace(/box/, "obj"), line.src[1]],
                destination: [line.dest[0].replace(/box/, "obj"), line.dest[1]]
            }
        });
    }
    return { patcher: maxPatcher };
};

export const convertSampleToUnit = (sample: number, unit: TAudioUnit, { sampleRate = 48000, bpm = 60, beatsPerMeasure = 4, division = 16 }) => {
    if (unit === "sample") return { unit, str: sample.toString(), value: sample, values: [sample] };
    const milliseconds = sample * 1000 / sampleRate;
    const roundedMs = Math.round(milliseconds);
    if (unit === "measure") {
        const dpms = bpm * division / 60000;
        const totalDivisions = dpms * milliseconds;
        const roundedTotalDivisions = dpms * milliseconds;
        const divisions = ~~(roundedTotalDivisions % division);
        const beats = ~~(roundedTotalDivisions / division) % beatsPerMeasure + 1;
        const measure = ~~(roundedTotalDivisions / beatsPerMeasure / division) + 1;
        const str = `${measure}:${beats}.${divisions.toString().padStart(2, "0")}`;
        return { unit, str, value: totalDivisions / division, values: [measure, beats, divisions] };
    }
    // if (unit === "time")
    const ms = roundedMs % 1000;
    const s = ~~(roundedMs / 1000) % 60;
    const min = ~~(roundedMs / 60000) % 60;
    const h = ~~(roundedMs / 3600000);
    const str = !min ? `${s}.${ms.toString().padStart(3, "0")}`
        : !h ? `${min}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`
            : `${h}:${min.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
    return { unit, str, value: milliseconds / 1000, values: [h, min, s, ms] };
};
export const MEASURE_UNIT_REGEX = /^((\d+):)?(\d+)\.?(\d+)?$/;
export const TIME_UNIT_REGEX = /^((\d+):)??((\d+):)?(\d+)\.?(\d+)?$/;
export const convertUnitToSample = (str: string, unit: TAudioUnit, { sampleRate = 48000, bpm = 60, beatsPerMeasure = 4, division = 16 }) => {
    if (unit === "sample") return +str || 0;
    if (unit === "measure") {
        const matched = str.match(MEASURE_UNIT_REGEX);
        if (!matched) throw new Error(`String ${str} cannot be parsed to ${unit}`);
        const [, , measureIn, beatsIn, divisionsIn] = matched;
        const bps = bpm / 60;
        const samplesPerBeat = sampleRate / bps;
        let measures = +measureIn || 0;
        let beats = +beatsIn || 0;
        let divisions = +divisionsIn || 0;
        beats += ~~(divisions / division);
        divisions %= division;
        measures += ~~(beats / beatsPerMeasure);
        beats %= beatsPerMeasure;
        return (measures * beatsPerMeasure + beats + divisions / division) * samplesPerBeat;
    }
    const matched = str.match(TIME_UNIT_REGEX);
    if (!matched) throw new Error(`String ${str} cannot be parsed to ${unit}`);
    const [, , hIn, , minIn, sIn, msIn] = matched;
    let h = +hIn || 0;
    let min = +minIn || 0;
    let s = +sIn || 0;
    let ms = +msIn || 0;
    s += ~~(ms / 1000);
    ms %= 1000;
    min += ~~(s / 60);
    s %= 60;
    h += ~~(min / 60);
    min %= 60;
    return (h * 3600 + min * 60 + s + ms / 1000) * sampleRate;
};

export const ab2sab = (ab: SharedArrayBuffer | ArrayBuffer) => {
    if (ab instanceof ArrayBuffer) return ab;
    const sab = new SharedArrayBuffer(ab.byteLength);
    const ui8ab = new Uint8Array(ab);
    const ui8sab = new Uint8Array(sab);
    for (let i = 0; i < ui8ab.length; i++) {
        ui8sab[i] = ui8ab[i];
    }
    return sab;
};

export const sab2ab = (sab: SharedArrayBuffer | ArrayBuffer) => {
    if (sab instanceof SharedArrayBuffer) return sab;
    const ab = new ArrayBuffer(sab.byteLength);
    const ui8ab = new Uint8Array(ab);
    const ui8sab = new Uint8Array(sab);
    for (let i = 0; i < ui8sab.length; i++) {
        ui8ab[i] = ui8sab[i];
    }
    return ab;
};
export const ab2str = (buf: ArrayBuffer) => {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
};

export const str2ab = (str: string) => {
    const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    const bufView = new Uint16Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
};

export const getFactors = (n: number) => {
    const factors = [1];
    let i = 2;
    while (i < Math.sqrt(n)) {
        if (n % i === 0) factors.push(i, n / i);
        i++;
    }
    return factors.sort((a, b) => a - b);
};

export const getRuler = (range: [number, number], unit: TAudioUnit, { sampleRate = 48000, bpm = 60, beatsPerMeasure = 4, division = 16 }) => {
    const ruler: Record<number, string> = {};
    const length = range[1] - range[0];
    let coarse: number;
    let refined: number;
    if (unit === "sample") {
        const steps = [1, 2, 5];
        let mag = 1;
        let step = 0;
        do {
            const grid = steps[step] * mag;
            if (step + 1 < steps.length) {
                step++;
            } else {
                step = 0;
                mag *= 10;
            }
            if (!coarse && length / grid <= 10) coarse = grid;
            if (!refined && length / grid <= 50) refined = grid;
        } while (!coarse || !refined);
    } else if (unit === "measure") {
        const bps = bpm / 60;
        const samplesPerBeat = sampleRate / bps;
        const divisionFactors = getFactors(division);
        const beatsFactors = getFactors(beatsPerMeasure);
        const measureFactors = [1, 2, 5];
        let actualUnit: "division" | "beat" | "measure" = "division";
        let mag = 1;
        let step = 0;
        do {
            const grid = actualUnit === "division"
                ? samplesPerBeat * divisionFactors[step] / division
                : actualUnit === "beat"
                    ? samplesPerBeat * beatsFactors[step]
                    : samplesPerBeat * measureFactors[step] * mag * beatsPerMeasure;
            if (actualUnit === "division") {
                if (step + 1 < divisionFactors.length) {
                    step++;
                } else {
                    actualUnit = "beat";
                    step = 0;
                }
            } else if (actualUnit === "beat") {
                if (step + 1 < beatsFactors.length) {
                    step++;
                } else {
                    actualUnit = "measure";
                    step = 0;
                }
            } else {
                if (step + 1 < measureFactors.length) {
                    step++;
                } else {
                    step = 0;
                    mag *= 10;
                }
            }
            if (!coarse && length / grid <= 10) coarse = grid;
            if (!refined && length / grid <= 50) refined = grid;
        } while (!coarse || !refined);
    } else {
        const msFactors = [1, 2, 5, 10, 20, 50, 100, 200, 500];
        const sFactors = getFactors(60);
        const minFactors = sFactors;
        const hFactors = [1, 2, 5];
        let actualUnit: "ms" | "s" | "min" | "h" = "ms";
        let mag = 1;
        let step = 0;
        do {
            const grid = actualUnit === "ms"
                ? sampleRate * msFactors[step] / 1000
                : actualUnit === "s"
                    ? sampleRate * sFactors[step]
                    : actualUnit === "min"
                        ? sampleRate * minFactors[step] * 60
                        : sampleRate * hFactors[step] * mag * 60;
            if (actualUnit === "ms") {
                if (step + 1 < msFactors.length) {
                    step++;
                } else {
                    actualUnit = "s";
                    step = 0;
                }
            } else if (actualUnit === "s") {
                if (step + 1 < sFactors.length) {
                    step++;
                } else {
                    actualUnit = "min";
                    step = 0;
                }
            } else if (actualUnit === "min") {
                if (step + 1 < minFactors.length) {
                    step++;
                } else {
                    actualUnit = "h";
                    step = 0;
                }
            } else {
                if (step + 1 < hFactors.length) {
                    step++;
                } else {
                    step = 0;
                    mag *= 10;
                }
            }
            if (!coarse && length / grid <= 10) coarse = grid;
            if (!refined && length / grid <= 50) refined = grid;
        } while (!coarse || !refined);
    }
    let m = ~~(range[0] / refined);
    if (m * refined < range[0]) m++;
    while (m * refined < range[1]) {
        const t = m * refined;
        if (t && t % coarse < 0.001 || coarse - t % coarse < 0.001) {
            ruler[t] = unit === "sample" ? t.toString() : convertSampleToUnit(t, unit, { sampleRate, bpm, beatsPerMeasure, division }).str.replace(/\.[0.]+$/, "");
        } else {
            ruler[t] = "";
        }
        m++;
    }
    return { ruler, coarse, refined };
};
