import { LiveObject } from "./Base";
import { BaseAudioObject } from "../Base";
import { TMeta } from "../../types";
import { TemporalAnalyserRegister } from "../dsp/AudioWorklet/TemporalAnalyser";
import { atodb } from "../../../utils/math";
import { CanvasUI, CanvasUIState } from "../BaseUI";

export interface LiveMeterProps {
    active: boolean;
    orientation: "vertical" | "horizontal";
    mode: "deciBel" | "linear";
    clipSize: "normal" | "extended";
    min: number;
    max: number;
    thresholdLinear: number;
    thresholdDB: number;
    speedLim: number;
    frameRate: number;
    windowSize: number;
    bgColor: string;
    inactiveColdColor: string;
    inactiveWarmColor: string;
    coldColor: string;
    warmColor: string;
    hotColor: string;
    overloadColor: string;
}
interface LiveMeterUIState extends Omit<LiveMeterProps, "thresholdLinear" | "thresholdDB" | "windowSize" | "speedLim">, CanvasUIState {
    value: number[];
}
export class LiveMeterUI extends CanvasUI<LiveMeter, {}, LiveMeterUIState> {
    state: LiveMeterUIState = {
        ...this.state,
        value: []
    };
    normValues: number[] = [];
    maxValues: number[] = [];
    maxTimer: number;
    paint() {
        const {
            // width,
            // height,
            active,
            mode,
            value,
            min,
            max,
            orientation,
            clipSize,
            bgColor,
            coldColor,
            warmColor,
            hotColor,
            overloadColor,
            inactiveColdColor,
            inactiveWarmColor
        } = this.state;
        const ctx = this.ctx;
        if (!ctx) return;

        const [width, height] = this.fullSize();
        ctx.clearRect(0, 0, width, height);

        this.normValues = value.map((v) => {
            if (mode === "deciBel") {
                if (v <= 0) return Math.max(0, (v - min) / -min);
                return 1 + Math.min(1, v / max);
            }
            return v <= 1 ? Math.max(0, v) : 2;
        });
        if (this.normValues.length === 0) this.normValues = [0];
        if (this.normValues.find((v, i) => typeof this.maxValues[i] === "undefined" || v > this.maxValues[i])) {
            this.maxValues = [...this.normValues];
            if (this.maxTimer) window.clearTimeout(this.maxTimer);
            this.maxTimer = window.setTimeout(() => {
                this.maxValues = [...this.normValues];
                this.maxTimer = undefined;
                this.schedulePaint();
            }, 1000);
        } else if (this.normValues.find((v, i) => v < this.maxValues[i]) && typeof this.maxTimer === "undefined") {
            this.maxTimer = window.setTimeout(() => {
                this.maxValues = [...this.normValues];
                this.maxTimer = undefined;
                this.schedulePaint();
            }, 1000);
        }
        const channels = this.normValues.length;
        const clip = clipSize === "normal" ? 10 : 20;
        if (orientation === "horizontal") {
            const warmStop = width - clip - 1;
            const hotStop = width - clip;
            const gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, active ? coldColor : inactiveColdColor);
            gradient.addColorStop(warmStop / width, active ? warmColor : inactiveWarmColor);
            gradient.addColorStop(hotStop / width, active ? hotColor : inactiveWarmColor);
            gradient.addColorStop(1, active ? overloadColor : inactiveWarmColor);
            const $height = (height - channels - 1) / this.normValues.length;
            ctx.fillStyle = bgColor;
            let $top = 0;
            this.normValues.forEach((v) => {
                if (v < 1) ctx.fillRect(0, $top, warmStop, $height);
                if (v < 2) ctx.fillRect(hotStop, $top, clip, $height);
                $top += $height + 1;
            });
            $top = 0;
            ctx.fillStyle = gradient;
            this.normValues.forEach((v, i) => {
                if (v > 0) ctx.fillRect(0, $top, Math.min(1, v) * warmStop, $height);
                if (v > 1) ctx.fillRect(hotStop, $top, Math.min(1, (v - 1)) * clip, $height);
                const histMax = this.maxValues[i];
                if (typeof histMax === "number" && histMax > v) {
                    if (histMax <= 1) ctx.fillRect(Math.min(warmStop - 1, histMax * warmStop), $top, 1, $height);
                    else ctx.fillRect(Math.min(width - 1, hotStop + (histMax - 1) * clip), $top, 1, $height);
                }
                $top += $height + 1;
            });
        } else {
            const warmStop = clip + 1;
            const hotStop = clip;
            const gradient = ctx.createLinearGradient(0, height, 0, 0);
            gradient.addColorStop(0, active ? coldColor : inactiveColdColor);
            gradient.addColorStop((height - warmStop) / height, active ? warmColor : inactiveWarmColor);
            gradient.addColorStop((height - hotStop) / height, active ? hotColor : inactiveWarmColor);
            gradient.addColorStop(1, active ? overloadColor : inactiveWarmColor);
            const $width = (width - channels - 1) / this.normValues.length;
            ctx.fillStyle = bgColor;
            let $left = 0;
            this.normValues.forEach((v) => {
                if (v < 1) ctx.fillRect($left, warmStop, $width, height - warmStop);
                if (v < 2) ctx.fillRect($left, 0, $width, hotStop);
                $left += $width + 1;
            });
            $left = 0;
            ctx.fillStyle = gradient;
            this.normValues.forEach((v, i) => {
                if (v > 0) {
                    const drawHeight = Math.min(1, v) * (height - warmStop);
                    ctx.fillRect($left, height - drawHeight, $width, drawHeight);
                }
                if (v > 1) {
                    const drawHeight = Math.min(1, (v - 1)) * clip;
                    ctx.fillRect($left, hotStop - drawHeight, $width, drawHeight);
                }
                const histMax = this.maxValues[i];
                if (typeof histMax === "number" && histMax > v) {
                    if (histMax <= 1) ctx.fillRect($left, height - histMax * (height - warmStop), $width, 1);
                    else ctx.fillRect($left, Math.max(0, hotStop - (histMax - 1) * clip), $width, 1);
                }
                $left += $width + 1;
            });
        }
    }
}
export type LiveMeterState = { node: InstanceType<typeof TemporalAnalyserRegister["Node"]>; $requestTimer: number };
export class LiveMeter extends BaseAudioObject<{}, LiveMeterState, [], [number[]], [], LiveMeterProps, LiveMeterUIState> {
    static package = LiveObject.package;
    static author = LiveObject.author;
    static version = LiveObject.version;
    static description = "Meter";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Signal to measure"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "object",
        description: "Amplitude value: number[]"
    }];
    static props: TMeta["props"] = {
        min: {
            type: "number",
            default: -70,
            description: "Minimum value (dB)",
            isUIState: true
        },
        max: {
            type: "number",
            default: 6,
            description: "Maximum value (dB)",
            isUIState: true
        },
        active: {
            type: "boolean",
            default: true,
            description: "Active state",
            isUIState: true
        },
        bgColor: {
            type: "color",
            default: "rgb(40, 40, 40)",
            description: "Background color",
            isUIState: true
        },
        inactiveColdColor: {
            type: "color",
            default: "rgb(130, 130, 130)",
            description: "Cold color (inactive)",
            isUIState: true
        },
        inactiveWarmColor: {
            type: "color",
            default: "rgb(149, 149, 149)",
            description: "Warm color (inactive)",
            isUIState: true
        },
        coldColor: {
            type: "color",
            default: "rgb(12, 248, 100)",
            description: "Cold color (active)",
            isUIState: true
        },
        warmColor: {
            type: "color",
            default: "rgb(195, 248, 100)",
            description: "Warm color (active)",
            isUIState: true
        },
        hotColor: {
            type: "color",
            default: "rgb(255, 193, 10)",
            description: "Hot color (active)",
            isUIState: true
        },
        overloadColor: {
            type: "color",
            default: "rgb(255, 10, 10)",
            description: "Overload color (active)",
            isUIState: true
        },
        orientation: {
            type: "enum",
            enums: ["vertical", "horizontal"],
            default: "horizontal",
            description: "Meter orientation",
            isUIState: true
        },
        mode: {
            type: "enum",
            enums: ["deciBel", "linear"],
            default: "deciBel",
            description: "Display mode",
            isUIState: true
        },
        clipSize: {
            type: "enum",
            enums: ["normal", "extended"],
            default: "normal",
            description: "Size of clip display",
            isUIState: true
        },
        speedLim: {
            type: "number",
            default: 16,
            description: "Value output speed limit in ms"
        },
        frameRate: {
            type: "number",
            default: 60,
            description: "UI refresh rate",
            isUIState: true
        },
        windowSize: {
            type: "number",
            default: 1024,
            description: "RMS window size"
        },
        thresholdDB: {
            type: "number",
            default: 1,
            description: "Redraw Threshold in dB"
        },
        thresholdLinear: {
            type: "number",
            default: 0.01,
            description: "Redraw Threshold in Linear"
        }
    };
    static ui = LiveMeterUI;
    state: LiveMeterState = { node: undefined, $requestTimer: -1 };
    subscribe() {
        super.subscribe();
        const startRequest = () => {
            let lastResult: number[] = [];
            const request = async () => {
                if (this.state.node && !this.state.node.destroyed) {
                    const { rms } = await this.state.node.gets({ rms: true });
                    const mode = this.getProp("mode");
                    const thresh = this.getProp(mode === "deciBel" ? "thresholdDB" : "thresholdLinear");
                    const result = mode === "deciBel" ? rms.map(v => atodb(v)) : rms;
                    if (!lastResult.every((v, i) => v === result[i] || Math.abs(v - result[i]) < thresh) || lastResult.length !== result.length) {
                        this.outlet(0, result);
                        this.updateUI({ value: result });
                        lastResult = result;
                    }
                }
                scheduleRequest();
            };
            const scheduleRequest = () => {
                this.state.$requestTimer = window.setTimeout(request, this.getProp("speedLim"));
            };
            request();
        };
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("updateProps", (props) => {
            if (props.windowSize && this.state.node) this.applyBPF(this.state.node.parameters.get("windowSize"), [[props.windowSize]]);
        });
        this.on("postInit", async () => {
            await TemporalAnalyserRegister.register(this.audioCtx.audioWorklet);
            this.state.node = new TemporalAnalyserRegister.Node(this.audioCtx);
            this.applyBPF(this.state.node.parameters.get("windowSize"), [[this.getProp("windowSize")]]);
            this.disconnectAudioInlet();
            this.inletConnections[0] = { node: this.state.node, index: 0 };
            this.connectAudioInlet();
            startRequest();
        });
        this.on("destroy", () => {
            window.clearTimeout(this.state.$requestTimer);
            if (this.state.node) this.state.node.destroy();
        });
    }
}
