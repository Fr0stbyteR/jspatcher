import { LiveObject, LiveUI } from "./Base";
import { BaseObject } from "../Base";
import { TMeta } from "../../types";
import { atodb } from "../../../utils/math";
import { CanvasUI, CanvasUIState } from "../BaseUI";
import TemporalAnalyserNode from "../../worklets/TemporalAnalyser";

export interface LiveMeterProps {
    active: boolean;
    orientation: "vertical" | "horizontal";
    mode: "deciBel" | "linear";
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
    levels: number[];
}
export class LiveMeterUI extends CanvasUI<LiveMeter, {}, LiveMeterUIState> {
    state: LiveMeterUIState = {
        ...this.state,
        levels: this.object.state.levels
    };
    levels: number[] = [];
    maxValues: number[] = [];
    maxTimer: number;
    paint() {
        const {
            // width,
            // height,
            active,
            mode,
            levels,
            min,
            max,
            orientation,
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

        let [width, height] = this.fullSize();
        ctx.clearRect(0, 0, width, height);

        this.levels = levels.slice();
        if (this.levels.length === 0) this.levels = [min];
        if (this.levels.find((v, i) => typeof this.maxValues[i] === "undefined" || v > this.maxValues[i])) {
            this.maxValues = [...this.levels];
            if (this.maxTimer) window.clearTimeout(this.maxTimer);
            this.maxTimer = window.setTimeout(() => {
                this.maxValues = [...this.levels];
                this.maxTimer = undefined;
                this.schedulePaint();
            }, 1000);
        } else if (this.levels.find((v, i) => v < this.maxValues[i]) && typeof this.maxTimer === "undefined") {
            this.maxTimer = window.setTimeout(() => {
                this.maxValues = [...this.levels];
                this.maxTimer = undefined;
                this.schedulePaint();
            }, 1000);
        }
        const channels = this.levels.length;
        const clipValue = +(mode === "linear");
        if (orientation === "vertical") {
            ctx.save();
            ctx.translate(0, height);
            ctx.rotate(-Math.PI * 0.5);
            [height, width] = [width, height];
        }
        const $height = (height - channels - 1) / this.levels.length;
        ctx.fillStyle = bgColor;
        if (min >= clipValue || clipValue >= max) {
            const fgColor = min >= clipValue ? active ? overloadColor : inactiveWarmColor : active ? coldColor : inactiveColdColor;
            let $top = 0;
            this.levels.forEach((v) => {
                if (v < max) ctx.fillRect(0, $top, width, $height);
                $top += $height + 1;
            });
            $top = 0;
            ctx.fillStyle = fgColor;
            this.levels.forEach((v, i) => {
                const distance = LiveUI.getDistance({ type: "float", value: v, min, max, exponent: 0 });
                if (distance > 0) ctx.fillRect(0, $top, distance * width, $height);
                const histMax = this.maxValues[i];
                if (typeof histMax === "number" && histMax > v) {
                    const histDistance = LiveUI.getDistance({ type: "float", value: histMax, min, max, exponent: 0 });
                    ctx.fillRect(Math.min(width - 1, histDistance * width), $top, 1, $height);
                }
                $top += $height + 1;
            });
        } else {
            const clipDistance = LiveUI.getDistance({ type: "float", value: clipValue, min, max, exponent: 0 });
            const clip = width - clipDistance * width;
            const hotStop = width - clip;
            const warmStop = hotStop - 1;
            const gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, active ? coldColor : inactiveColdColor);
            gradient.addColorStop(warmStop / width, active ? warmColor : inactiveWarmColor);
            gradient.addColorStop(hotStop / width, active ? hotColor : inactiveWarmColor);
            gradient.addColorStop(1, active ? overloadColor : inactiveWarmColor);
            let $top = 0;
            this.levels.forEach((v) => {
                if (v < clipValue) ctx.fillRect(0, $top, warmStop, $height);
                if (v < max) ctx.fillRect(hotStop, $top, clip, $height);
                $top += $height + 1;
            });
            $top = 0;
            ctx.fillStyle = gradient;
            this.levels.forEach((v, i) => {
                const distance = LiveUI.getDistance({ type: "float", value: v, min, max, exponent: 0 });
                if (distance > 0) ctx.fillRect(0, $top, Math.min(warmStop, distance * width), $height);
                if (distance > clipDistance) ctx.fillRect(hotStop, $top, Math.min(clip, (distance - clipDistance) * width), $height);
                const histMax = this.maxValues[i];
                if (typeof histMax === "number" && histMax > v) {
                    const histDistance = LiveUI.getDistance({ type: "float", value: histMax, min, max, exponent: 0 });
                    if (histDistance <= clipDistance) ctx.fillRect(histDistance * width, $top, 1, $height);
                    else ctx.fillRect(Math.min(width - 1, histDistance * width), $top, 1, $height);
                }
                $top += $height + 1;
            });
        }
        if (orientation === "vertical") ctx.restore();
    }
}
export interface LiveMeterState {
    node: TemporalAnalyserNode;
    $requestTimer: number;
    levels: number[];
}

export class LiveMeter extends BaseObject<{}, LiveMeterState, [], [number[]], [], LiveMeterProps, LiveMeterUIState> {
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
            default: 0.1,
            description: "Redraw Threshold in dB"
        },
        thresholdLinear: {
            type: "number",
            default: 0.01,
            description: "Redraw Threshold in Linear"
        }
    };
    static UI = LiveMeterUI;
    state: LiveMeterState = { node: undefined, $requestTimer: -1, levels: [] };
    subscribe() {
        super.subscribe();
        const startRequest = () => {
            let lastResult: number[] = [];
            const request = async () => {
                if (this.state.node && !this.state.node.destroyed) {
                    const absMax = await this.state.node.getAbsMax();
                    const mode = this.getProp("mode");
                    const thresh = this.getProp(mode === "deciBel" ? "thresholdDB" : "thresholdLinear");
                    const result = mode === "deciBel" ? absMax.map(v => atodb(v)) : absMax;
                    if (!lastResult.every((v, i) => v === result[i] || Math.abs(v - result[i]) < thresh) || lastResult.length !== result.length) {
                        this.outlet(0, result);
                        this.setState({ levels: result });
                        this.updateUI({ levels: result });
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
            await TemporalAnalyserNode.register(this.audioCtx.audioWorklet);
            this.state.node = new TemporalAnalyserNode(this.audioCtx);
            this.applyBPF(this.state.node.parameters.get("windowSize"), [[this.getProp("windowSize")]]);
            this.disconnectAudioInlet();
            this.inletAudioConnections[0] = { node: this.state.node, index: 0 };
            this.connectAudioInlet();
            startRequest();
        });
        this.on("destroy", () => {
            window.clearTimeout(this.state.$requestTimer);
            if (this.state.node) this.state.node.destroy();
        });
    }
}
