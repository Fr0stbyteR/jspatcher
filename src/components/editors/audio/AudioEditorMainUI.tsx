import * as React from "react";
import { Button, Icon } from "semantic-ui-react";
import * as Color from "color-js";
import Env, { EnvOptions } from "../../../core/Env";
import AudioEditor, { AudioEditorState } from "../../../core/audio/AudioEditor";
import GainInputUI from "./GainInput";
import AudioEditorVerticalRulerUI from "./AudioEditorVerticalRulerUI";
import AudioEditorHorizontalRulerUI from "./AudioEditorHorizontalRulerUI";
import AudioEditorMainControlsUI from "./AudioEditorMainControlsUI";
import { TAudioUnit } from "../../../core/types";
import { normExp, dbtoa } from "../../../utils/math";
import { convertSampleToUnit } from "../../../utils/utils";
import "./AudioEditorMainUI.scss";

interface P extends AudioEditorState, EnvOptions {
    env: Env;
    lang: string;
    editor: AudioEditor;
    $audio: number;
}
interface S {
    fadeInExp: number;
    fadeInTo: number;
    fadeOutExp: number;
    fadeOutFrom: number;
    fade: number;
}

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

export default class AudioEditorMainUI extends React.PureComponent<P, S> {
    state: S = { fadeInExp: undefined, fadeInTo: undefined, fadeOutExp: undefined, fadeOutFrom: undefined, fade: undefined };

    refDivMain = React.createRef<HTMLDivElement>();
    refDivSelRange = React.createRef<HTMLDivElement>();
    refCanvas = React.createRef<HTMLCanvasElement>();
    paintScheduled = false;
    $paintRaf = -1;
    vRuler: Record<number, string>;
    grid: number;
    get canvas() {
        return this.refCanvas.current;
    }
    get ctx() {
        return this.refCanvas.current ? this.refCanvas.current.getContext("2d") : undefined;
    }
    fullSize(): [number, number] {
        const { canvas, ctx } = this;
        if (!ctx) return [0, 0];
        const rect = canvas.getBoundingClientRect();
        const w = ~~rect.width;
        const h = ~~rect.height;
        if (ctx.canvas.width !== w) ctx.canvas.width = w;
        if (ctx.canvas.height !== h) ctx.canvas.height = h;
        return [w, h];
    }
    paintCallback = () => {
        this.$paintRaf = (-1 * Math.round(Math.abs(60 / this.props.audioDisplayOptions.frameRate))) || -1;
        this.paintScheduled = false;
        this.paint();
    };
    noPaintCallback = () => {
        this.$paintRaf++;
        this.paintScheduled = false;
        this.schedulePaint();
    };
    schedulePaint = () => {
        if (this.paintScheduled) return;
        if (this.$paintRaf === -1) this.$paintRaf = requestAnimationFrame(this.paintCallback);
        else if (this.$paintRaf < -1) requestAnimationFrame(this.noPaintCallback);
        this.paintScheduled = true;
    };
    componentDidMount() {
        const ctx = this.ctx;
        if (!ctx) return;
        const [width, height] = this.fullSize();
        ctx.clearRect(0, 0, width, height);
        this.schedulePaint();
        this.props.editor.on("uiResized", this.schedulePaint);
    }
    componentDidUpdate() {
        this.schedulePaint();
    }
    componentWillUnmount() {
        this.props.editor.off("uiResized", this.schedulePaint);
        if (this.paintScheduled) cancelAnimationFrame(this.$paintRaf);
    }
    paint() {
        const {
            editor,
            viewRange,
            selRange,
            cursor,
            audioDisplayOptions
        } = this.props;
        const { fade, fadeInExp, fadeInTo, fadeOutExp, fadeOutFrom } = this.state;
        const {
            phosphorColor,
            hueOffset,
            seperatorColor,
            cursorColor
        } = audioDisplayOptions;
        const { audioBuffer, waveform, numberOfChannels, length } = editor;
        const { ctx } = this;
        const [width, height] = this.fullSize();

        ctx.clearRect(0, 0, width, height);

        if (!audioBuffer) return;

        const t = audioBuffer.toArray();
        if (!t.length || !t[0].length) return;
        const verticalRange = 1;

        // Vertical Range
        const yFactor = verticalRange;
        const yMin = -yFactor;
        const yMax = yFactor;
        const calcY = (v: number, i: number) => channelHeight * (i + 1 - (v - yMin) / (yMax - yMin));
        // Grids
        const gridChannels = numberOfChannels;
        const channelHeight = height / gridChannels;
        // Fades Path
        const fadeInPath: [number, number][] = [];
        const fadeOutPath: [number, number][] = [];
        const fadePath: [number, number][] = [];

        ctx.beginPath();
        ctx.setLineDash([4, 2]);
        ctx.strokeStyle = seperatorColor;
        for (let i = 1; i < gridChannels; i++) {
            ctx.moveTo(0, i * channelHeight);
            ctx.lineTo(width, i * channelHeight);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineWidth = 1;
        const channelColor: string[] = [];
        // Horizontal Range
        const [$0, $1] = viewRange; // Draw start-end
        const pixelsPerSamp = width / ($1 - $0);
        const sampsPerPixel = Math.max(1, Math.round(1 / pixelsPerSamp));
        // Iteration
        const currentWaveform = waveform.findStep(sampsPerPixel);
        for (let i = 0; i < numberOfChannels; i++) {
            ctx.save();
            const clip = new Path2D();
            clip.rect(0, i * channelHeight, width, channelHeight);
            ctx.clip(clip);
            ctx.beginPath();
            channelColor[i] = Color(phosphorColor).shiftHue(i * hueOffset).toHSL();
            ctx.strokeStyle = channelColor[i];
            ctx.fillStyle = channelColor[i];
            if (currentWaveform) {
                const sampsPerPixel = 1 / pixelsPerSamp;
                const { idx } = currentWaveform;
                const { min, max } = currentWaveform[i];
                let x = 0;
                let maxInStep;
                let minInStep;
                for (let j = 0; j < idx.length - 1; j++) {
                    const $ = idx[j];
                    if ($ > $1) break;
                    const $next = j === idx.length - 1 ? length : idx[j + 1];
                    if ($next <= $0) continue;
                    if (typeof maxInStep === "undefined") {
                        maxInStep = max[j];
                        minInStep = min[j];
                    } else {
                        if (min[j] < minInStep) minInStep = min[j];
                        if (max[j] > maxInStep) maxInStep = max[j];
                    }
                    if ($next >= $0 + sampsPerPixel * (x + 1)) {
                        let fadeFactor;
                        if (typeof fadeInTo === "number" && $ < fadeInTo) {
                            fadeFactor = normExp($ / fadeInTo, fadeInExp);
                            minInStep *= fadeFactor;
                            maxInStep *= fadeFactor;
                            if (i === 0) fadeInPath.push([x, fadeFactor]);
                        } else if (typeof fadeOutFrom === "number" && $ > fadeOutFrom) {
                            fadeFactor = normExp((length - $) / (length - fadeOutFrom), fadeOutExp);
                            minInStep *= fadeFactor;
                            maxInStep *= fadeFactor;
                            if (i === 0) fadeOutPath.push([x, fadeFactor]);
                        } else if (typeof fade === "number" && selRange && $ > selRange[0] && $ < selRange[1]) {
                            fadeFactor = dbtoa(fade);
                            minInStep *= fadeFactor;
                            maxInStep *= fadeFactor;
                            if (i === 0) fadePath.push([x, fadeFactor]);
                        }
                        let y = calcY(maxInStep, i);
                        if (x === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                        if (minInStep !== maxInStep) {
                            y = calcY(minInStep, i);
                            ctx.lineTo(x, y);
                        }
                        maxInStep = undefined;
                        x++;
                    }
                }
            } else {
                let maxInStep;
                let minInStep;
                const prev = t[i][$0 - 1] || 0;
                const prevX = -0.5 * pixelsPerSamp;
                const prevY = calcY(prev, i);
                ctx.moveTo(prevX, prevY);
                for (let j = $0; j < $1; j++) {
                    const samp = t[i][j];
                    const $step = (j - $0) % sampsPerPixel;
                    if ($step === 0) {
                        maxInStep = samp;
                        minInStep = samp;
                    } else {
                        if (samp > maxInStep) maxInStep = samp;
                        if (samp < minInStep) minInStep = samp;
                    }
                    if ($step === sampsPerPixel - 1) {
                        const x = (j - $step - $0 + 0.5) * pixelsPerSamp;
                        let fadeFactor;
                        if (typeof fadeInTo === "number" && j < fadeInTo) {
                            fadeFactor = normExp(j / fadeInTo, fadeInExp);
                            minInStep *= fadeFactor;
                            maxInStep *= fadeFactor;
                            if (i === 0) fadeInPath.push([x, fadeFactor]);
                        } else if (typeof fadeOutFrom === "number" && j > fadeOutFrom) {
                            fadeFactor = normExp((length - j) / (length - fadeOutFrom), fadeOutExp);
                            minInStep *= fadeFactor;
                            maxInStep *= fadeFactor;
                            if (i === 0) fadeOutPath.push([x, fadeFactor]);
                        } else if (typeof fade === "number" && selRange && j > selRange[0] && j < selRange[1]) {
                            fadeFactor = dbtoa(fade);
                            minInStep *= fadeFactor;
                            maxInStep *= fadeFactor;
                            if (i === 0) fadePath.push([x, fadeFactor]);
                        }
                        let y = calcY(maxInStep, i);
                        ctx.lineTo(x, y);
                        if (minInStep !== maxInStep && pixelsPerSamp < 1) {
                            y = calcY(minInStep, i);
                            ctx.lineTo(x, y);
                        }
                        if (pixelsPerSamp > 10) ctx.fillRect(x - 2, y - 2, 4, 4);
                    }
                }
                const next = t[i][$1] || 0;
                const nextX = ($1 - $0 + 0.5) * pixelsPerSamp;
                const nextY = calcY(next, i);
                ctx.lineTo(nextX, nextY);
            }
            ctx.stroke();
            ctx.restore();
        }
        // fade paths
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 1;
        if (fadeInPath.length) {
            ctx.beginPath();
            ctx.moveTo(0, height);
            fadeInPath.forEach(([x, y]) => ctx.lineTo(x, ~~(height * (1 - y))));
            ctx.lineTo(fadeInPath[fadeInPath.length - 1][0], 0);
            ctx.stroke();
        }
        if (fadeOutPath.length) {
            ctx.beginPath();
            ctx.moveTo(fadeOutPath[0][0], 0);
            fadeOutPath.forEach(([x, y]) => ctx.lineTo(x, ~~(height * (1 - y))));
            ctx.lineTo(width, height);
            ctx.stroke();
        }
        if (fadePath.length) {
            ctx.beginPath();
            fadePath.forEach(([x, y], i) => ctx[i === 0 ? "moveTo" : "lineTo"](x, ~~(height * (1 - y))));
            ctx.stroke();
        }
        // cursor
        if (cursor < $0 || cursor > $1) return;
        ctx.strokeStyle = cursorColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const cursorX = (cursor - $0) / ($1 - $0) * width;
        ctx.moveTo(cursorX, 0);
        ctx.lineTo(cursorX, height);
        ctx.stroke();
    }
    handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const { viewRange } = this.props;
        const [viewStart, viewEnd] = viewRange;
        const viewLength = viewEnd - viewStart;
        const origin = { x: e.clientX, y: e.clientY };
        const rect = e.currentTarget.getBoundingClientRect();
        const cursor = viewStart + (e.clientX - rect.left) / rect.width * viewLength;
        this.props.editor.setCursor(cursor);
        this.props.editor.setSelRange(null);
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            const x = e.clientX;
            if (x > rect.right) this.props.editor.scrollH((x - rect.right) / 1000);
            else if (x < rect.left) this.props.editor.scrollH((x - rect.left) / 1000);
            if (x === origin.x) {
                this.props.editor.setSelRange(null);
            } else {
                const { viewRange } = this.props;
                const [viewStart, viewEnd] = viewRange;
                const viewLength = viewEnd - viewStart;
                const to = viewStart + Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * viewLength;
                this.props.editor.setSelRange([cursor, to]);
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            this.props.editor.emitSelRangeToPlay();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            this.props.editor.scrollH(e.deltaX > 0 ? 0.01 : -0.01);
            return;
        }
        const { viewRange } = this.props;
        const [viewStart, viewEnd] = viewRange;
        const viewLength = viewEnd - viewStart;
        const origin = { x: e.clientX, y: e.clientY };
        const rect = e.currentTarget.getBoundingClientRect();
        const ref = viewStart + (origin.x - rect.left) / rect.width * viewLength;
        this.props.editor.zoomH(ref, e.deltaY < 0 ? 1 : -1);
    };
    handleCursorHandlerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const rect = this.refCanvas.current.getBoundingClientRect();
        const { currentTarget } = e;
        if (currentTarget.classList.contains("editor-main-vertical-ruler-area")) {
            const { viewRange } = this.props;
            const [viewStart, viewEnd] = viewRange;
            const viewLength = viewEnd - viewStart;
            const cursor = viewStart + (e.clientX - rect.left) / rect.width * viewLength;
            this.props.editor.setCursor(cursor);
        }
        if (currentTarget.classList.contains("editor-main-cursor-handler")) currentTarget.style.cursor = "grabbing";
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            const x = e.clientX;
            if (x > rect.right) this.props.editor.scrollH((x - rect.right) / 1000);
            else if (x < rect.left) this.props.editor.scrollH((x - rect.left) / 1000);
            const { viewRange } = this.props;
            const [viewStart, viewEnd] = viewRange;
            const viewLength = viewEnd - viewStart;
            const cursor = viewStart + (x - rect.left) / rect.width * viewLength;
            this.props.editor.setCursor(cursor);
        };
        const handleMouseUp = (e: MouseEvent) => {
            if (currentTarget.classList.contains("editor-main-cursor-handler")) currentTarget.style.cursor = "";
            e.stopPropagation();
            e.preventDefault();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    handleSelRangeMoveMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const origin = { x: e.clientX, y: e.clientY };
        const parentRect = this.refCanvas.current.getBoundingClientRect();
        const rect = this.refDivSelRange.current.getBoundingClientRect();
        const curLeft = rect.left - parentRect.left;
        const { length } = this.props.editor;
        const selLength = this.props.selRange[1] - this.props.selRange[0];
        this.refDivSelRange.current.style.cursor = "grabbing";
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.refDivSelRange.current && e.movementX) {
                const x = e.clientX;
                if (x > parentRect.right) this.props.editor.scrollH((x - parentRect.right) / 1000);
                else if (x < parentRect.left) this.props.editor.scrollH((x - parentRect.left) / 1000);
                const { viewRange } = this.props;
                const [viewStart, viewEnd] = viewRange;
                const viewLength = viewEnd - viewStart;
                const left = curLeft + (x - origin.x);
                const startSample = Math.max(0, Math.min(length - selLength, viewStart + left / parentRect.width * viewLength));
                const endSample = startSample + selLength;
                this.props.editor.setSelRange([startSample, endSample]);
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            this.refDivSelRange.current.style.cursor = "grab";
            this.props.editor.emitSelRangeToPlay();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    handleResizeStartMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const rect = this.refCanvas.current.getBoundingClientRect();
        const end = this.props.selRange[1];
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.refDivSelRange.current && e.movementX) {
                const x = e.clientX;
                if (x > rect.right) this.props.editor.scrollH((x - rect.right) / 1000);
                else if (x < rect.left) this.props.editor.scrollH((x - rect.left) / 1000);
                const { viewRange } = this.props;
                const [viewStart, viewEnd] = viewRange;
                const viewLength = viewEnd - viewStart;
                const start = viewStart + (x - rect.left) / rect.width * viewLength;
                this.props.editor.setSelRange([start, end]);
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            this.props.editor.emitSelRangeToPlay();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    handleResizeEndMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const rect = this.refCanvas.current.getBoundingClientRect();
        const start = this.props.selRange[0];
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.refDivSelRange.current && e.movementX) {
                const x = e.clientX;
                if (x > rect.right) this.props.editor.scrollH((x - rect.right) / 1000);
                else if (x < rect.left) this.props.editor.scrollH((x - rect.left) / 1000);
                const { viewRange } = this.props;
                const [viewStart, viewEnd] = viewRange;
                const viewLength = viewEnd - viewStart;
                const end = viewStart + (x - rect.left) / rect.width * viewLength;
                this.props.editor.setSelRange([start, end]);
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            this.props.editor.emitSelRangeToPlay();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    handleClickChannelEnabler = (i: number) => this.props.editor.setEnabledChannel(i, !this.props.enabledChannels[i]);
    handleFadeInMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const rect = this.refCanvas.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const originY = e.clientY;
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.refDivSelRange.current && (e.movementX || e.movementY)) {
                const x = e.clientX;
                const l = this.props.editor.length;
                const fadeInTo = Math.max(0, Math.min(l, (x - offsetX - rect.left) / rect.width * l));
                const fadeInExp = (e.clientY - originY) / 20;
                this.setState({ fadeInTo, fadeInExp });
            }
        };
        const handleMouseUp = async (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            const { fadeInTo: length, fadeInExp: exponent } = this.state;
            if (length) await this.props.editor.fadeIn(length, exponent);
            this.setState({ fadeInTo: undefined });
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    handleFadeOutMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const rect = this.refCanvas.current.getBoundingClientRect();
        const offsetX = rect.right - e.clientX;
        const originY = e.clientY;
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.refDivSelRange.current && (e.movementX || e.movementY)) {
                const x = e.clientX;
                const l = this.props.editor.length;
                const fadeOutFrom = Math.max(0, Math.min(l, (x + offsetX - rect.left) / rect.width * l));
                const fadeOutExp = (e.clientY - originY) / 20;
                this.setState({ fadeOutFrom, fadeOutExp });
            }
        };
        const handleMouseUp = async (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            const { fadeOutFrom: from, fadeOutExp: exponent } = this.state;
            const l = this.props.editor.length;
            if (typeof from === "number" && from !== l) await this.props.editor.fadeOut(l - from, exponent);
            this.setState({ fadeOutFrom: undefined });
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    handleFadeAdjust = (gain: number) => {
        this.setState({ fade: gain });
    };
    handleFadeChange = async (gain: number) => {
        if (gain) await this.props.editor.fade(gain);
        this.setState({ fade: undefined });
    };
    render() {
        const { env, editor, audioUnit, viewRange, audioUnitOptions, selRange, cursor, audioDisplayOptions } = this.props;
        const { bgColor } = audioDisplayOptions;
        const sampleRate = editor.sampleRate ?? env.audioCtx.sampleRate;
        const l = editor.length || 0;
        /*
        if (!this.props.editor.audio.audioBuffer) {
            return (
                <div className="editor-main">
                    <div className="editor-main-canvases">
                        <div className="editor-main-canvas-background" style={{ backgroundColor: bgColor }} />
                        <div className="editor-main-canvas-container">
                            <canvas ref={this.refCanvas} />
                        </div>
                    </div>
                    <div className="editor-map-controls">
                        <TimeInputUI samples={this.props.cursor} sampleRate={sampleRate} unit={audioUnit} {...audioUnitOptions} />
                    </div>
                </div>
            );
        }
         */
        const [viewStart, viewEnd] = viewRange;
        const viewLength = viewEnd - viewStart;
        const [selStart, selEnd] = selRange || [0, 0];
        const $selStart = (selStart - viewStart) / viewLength;
        const $selEnd = (selEnd - viewStart) / viewLength;
        const selLeft = `${$selStart * 100}%`;
        const selWidth = `${($selEnd - $selStart) * 100}%`;
        const $cursor = (cursor - viewStart) / viewLength;
        const cursorLeft = `${$cursor * 100}%`;
        const { ruler, refined } = getRuler(viewRange, audioUnit, { ...audioUnitOptions, sampleRate });
        this.vRuler = ruler;
        this.grid = refined;
        return (
            <div className="editor-main">
                <div className="editor-main-canvases">
                    <div className="editor-main-canvas-background" style={{ backgroundColor: bgColor }} />
                    <AudioEditorVerticalRulerUI ruler={this.vRuler} {...this.props} {...audioDisplayOptions} />
                    <AudioEditorHorizontalRulerUI {...this.props} {...audioDisplayOptions} />
                    <div ref={this.refDivMain} className="editor-main-canvas-container" onMouseDown={this.handleCanvasMouseDown} onWheel={this.handleWheel}>
                        <canvas ref={this.refCanvas} />
                        <div className="editor-main-selrange" style={{ left: selLeft, width: selWidth, backgroundColor: this.props.env.browser === "Gecko" ? "rgba(255, 255, 255, 0.15)" : "transparent" }} hidden={!selRange}>
                            <div className="resize-handler resize-handler-w" onMouseDown={this.handleResizeStartMouseDown} />
                            <div className="resize-handler resize-handler-e" onMouseDown={this.handleResizeEndMouseDown} />
                        </div>
                        <div className="editor-main-fades">
                            {viewStart === 0 ? <div className="editor-main-fadein-handler" onMouseDown={this.handleFadeInMouseDown}><Icon name="adjust" inverted size="small" /></div> : undefined}
                            {viewEnd === l ? <div className="editor-main-fadeout-handler" onMouseDown={this.handleFadeOutMouseDown}><Icon name="adjust" inverted size="small" /></div> : undefined}
                            {selRange ? <div className="editor-main-fade-handler" style={{ left: `${Math.max(10, Math.min(90, $selStart * 100))}%` }}><Icon name="adjust" inverted size="small" /><GainInputUI unit="dB" gain={this.state.fade || 0} onAdjust={this.handleFadeAdjust} onChange={this.handleFadeChange} /></div> : undefined}
                        </div>
                    </div>
                    <div className="editor-main-channel-enabler">
                        {
                            this.props.enabledChannels.map((enabled, i) => (
                                <div key={i} {...(enabled ? {} : { className: "disabled" })}>
                                    <span className="enable-channel">
                                        <Button active={enabled} basic={!enabled} color="grey" size="mini" onClick={() => this.handleClickChannelEnabler(i)}>{i + 1}</Button>
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                    <div className="editor-main-vertical-ruler-area" onMouseDown={this.handleCursorHandlerMouseDown}>
                        <div className="editor-main-selrange-handler" ref={this.refDivSelRange} style={{ left: selLeft, width: selWidth }} hidden={!selRange} >
                            <div className="resize-handler resize-handler-w" onMouseDown={this.handleResizeStartMouseDown} />
                            <div className="editor-main-selrange-mover" onMouseDown={this.handleSelRangeMoveMouseDown} />
                            <div className="resize-handler resize-handler-e" onMouseDown={this.handleResizeEndMouseDown} />
                        </div>
                        <div className="editor-main-cursor-handler" style={{ left: cursorLeft }} onMouseDown={this.handleCursorHandlerMouseDown} />
                    </div>
                </div>
                <AudioEditorMainControlsUI {...this.props} />
            </div>
        );
    }
}
