import { LiveSliderProps } from "./slider";
import { LiveMeterProps } from "./meter";
import { LiveUIState, LiveUI, LiveObject, LiveObjectState } from "./Base";
import { TMeta } from "../../types";
import { RMSRegister } from "../dsp/AudioWorklet/RMS";
import { atodb, dbtoa, normExp } from "../../../utils";
import { Bang } from "../Base";

interface LiveGainProps extends Omit<LiveSliderProps, "sliderColor">, LiveMeterProps {
    metering: "postFader" | "preFader";
    interp: number;
}
interface LiveGainUIState extends Omit<LiveGainProps, "thresholdLinear" | "thresholdDB" | "windowSize" | "speedLim">, LiveUIState {
    levels: number[];
    inputBuffer: string;
}
class LiveGainUI extends LiveUI<LiveGain, LiveGainUIState> {
    static defaultSize: [number, number] = [120, 45];
    state: LiveGainUIState = {
        ...this.state,
        levels: [],
        inputBuffer: ""
    }
    className = "live-gain";
    interactionRect: number[] = [0, 0, 0, 0];
    inTouch = false;
    normLevels: number[] = [];
    maxValues: number[] = [];
    maxTimer: number;
    paint() {
        const {
            width,
            height,
            fontFamily,
            fontSize,
            fontFace,
            orientation,
            showName,
            showNumber,
            textColor,
            triBorderColor,
            triOnColor,
            triColor,
            shortName,
            levels,
            min,
            max,
            active,
            mode,
            clipSize,
            bgColor,
            coldColor,
            warmColor,
            hotColor,
            overloadColor,
            inactiveColdColor,
            inactiveWarmColor,
            inputBuffer
        } = this.state;
        const ctx = this.ctx;
        if (!ctx) return;
        const lineWidth = 0.5;
        const padding = 8;
        const distance = this.distance;
        const displayValue = inputBuffer ? inputBuffer + "_" : this.displayValue;

        ctx.canvas.width = width;
        ctx.canvas.height = height;

        ctx.clearRect(0, 0, width, height);

        this.normLevels = levels.map((v) => {
            if (mode === "deciBel") {
                if (v <= 0) return Math.max(0, (v - min) / -min);
                return 1 + Math.min(1, v / max);
            }
            return v <= 1 ? Math.max(0, v) : 2;
        });
        if (this.normLevels.length === 0) this.normLevels = [0];
        if (this.normLevels.find((v, i) => typeof this.maxValues[i] === "undefined" || v > this.maxValues[i])) {
            this.maxValues = [...this.normLevels];
            if (this.maxTimer) window.clearTimeout(this.maxTimer);
            this.maxTimer = window.setTimeout(() => {
                this.maxValues = [...this.normLevels];
                this.maxTimer = undefined;
                this.schedulePaint();
            }, 1000);
        } else if (this.normLevels.find((v, i) => v < this.maxValues[i]) && typeof this.maxTimer === "undefined") {
            this.maxTimer = window.setTimeout(() => {
                this.maxValues = [...this.normLevels];
                this.maxTimer = undefined;
                this.schedulePaint();
            }, 1000);
        }

        const channels = this.normLevels.length;
        const clip = clipSize === "normal" ? 10 : 20;
        const meterThick = 8;
        const metersThick = meterThick * (1.5 * channels - 0.5);

        if (orientation === "vertical") {
            const $top = fontSize + padding;
            const $height = height - 2 * (fontSize + padding);

            const warmStop = clip + 1;
            const hotStop = clip;
            const gradient = ctx.createLinearGradient(0, $top + $height, 0, $top);
            gradient.addColorStop(0, active ? coldColor : inactiveColdColor);
            gradient.addColorStop(($height - warmStop) / $height, active ? warmColor : inactiveWarmColor);
            gradient.addColorStop(($height - hotStop) / $height, active ? hotColor : inactiveWarmColor);
            gradient.addColorStop(1, active ? overloadColor : inactiveWarmColor);

            this.interactionRect = [
                0,
                $top,
                width,
                $height
            ];

            const left = (width - metersThick) * 0.5;
            let $left = left;
            const $width = meterThick;
            ctx.fillStyle = bgColor;
            this.normLevels.forEach((v) => {
                if (v < 1) ctx.fillRect($left, $top + warmStop, $width, $height - warmStop);
                if (v < 2) ctx.fillRect($left, $top, $width, hotStop);
                $left += $width * 1.5;
            });
            $left = left;
            ctx.fillStyle = gradient;
            this.normLevels.forEach((v, i) => {
                if (v > 0) {
                    const drawHeight = Math.min(1, v) * ($height - warmStop);
                    ctx.fillRect($left, $top + $height - drawHeight, $width, drawHeight);
                }
                if (v > 1) {
                    const drawHeight = Math.min(1, (v - 1)) * clip;
                    ctx.fillRect($left, $top + hotStop - drawHeight, $width, drawHeight);
                }
                const histMax = this.maxValues[i];
                if (typeof histMax === "number" && histMax > v) {
                    if (histMax <= 1) ctx.fillRect($left, $top + height - histMax * (height - warmStop), $width, 1);
                    else ctx.fillRect($left, $top + Math.max(0, hotStop - (histMax - 1) * clip), $width, 1);
                }
                $left += $width * 1.5;
            });

            ctx.lineWidth = 1;
            ctx.strokeStyle = triBorderColor;
            const triOrigin: [number, number] = [
                (width + metersThick) * 0.5 + lineWidth * 0.5 + 0.5,
                this.interactionRect[1] - 4 + this.interactionRect[3] * (1 - distance)
            ];
            ctx.beginPath();
            ctx.moveTo(triOrigin[0], triOrigin[1] + 4);
            ctx.lineTo(triOrigin[0] + 8, triOrigin[1]);
            ctx.lineTo(triOrigin[0] + 8, triOrigin[1] + 8);
            ctx.lineTo(triOrigin[0], triOrigin[1] + 4);
            ctx.stroke();

            ctx.fillStyle = this.inTouch ? triOnColor : triColor;
            ctx.fill();

            ctx.font = `${fontFace === "regular" ? "" : fontFace} ${fontSize}px ${fontFamily}, sans-serif`;
            ctx.textAlign = "center";
            ctx.fillStyle = textColor;
            if (showName) ctx.fillText(shortName, width * 0.5, fontSize, width);
            if (showNumber) ctx.fillText(displayValue, width * 0.5, height - 2, width);
        } else {
            const $left = padding;
            const $width = width - 2 * padding;

            const warmStop = $width - clip - 1;
            const hotStop = $width - clip;
            const gradient = ctx.createLinearGradient($left, 0, $left + $width, 0);
            gradient.addColorStop(0, active ? coldColor : inactiveColdColor);
            gradient.addColorStop(warmStop / $width, active ? warmColor : inactiveWarmColor);
            gradient.addColorStop(hotStop / $width, active ? hotColor : inactiveWarmColor);
            gradient.addColorStop(1, active ? overloadColor : inactiveWarmColor);

            this.interactionRect = [
                $left,
                fontSize + padding,
                $width,
                height - 2 * (fontSize + padding)
            ];

            const top = (height - metersThick) * 0.5;
            let $top = top;
            const $height = meterThick;
            ctx.fillStyle = bgColor;
            this.normLevels.forEach((v) => {
                if (v < 1) ctx.fillRect($left, $top, warmStop, $height);
                if (v < 2) ctx.fillRect($left + hotStop, $top, clip, $height);
                $top += $height * 1.5;
            });
            $top = top;
            ctx.fillStyle = gradient;
            this.normLevels.forEach((v, i) => {
                if (v > 0) ctx.fillRect($left, $top, Math.min(1, v) * warmStop, $height);
                if (v > 1) ctx.fillRect($left + hotStop, $top, Math.min(1, (v - 1)) * clip, $height);
                const histMax = this.maxValues[i];
                if (typeof histMax === "number" && histMax > v) {
                    if (histMax <= 1) ctx.fillRect($left + Math.min(warmStop - 1, histMax * warmStop), $top, 1, $height);
                    else ctx.fillRect($left + Math.min(width - 1, hotStop + (histMax - 1) * clip), $top, 1, $height);
                }
                $top += $height * 1.5;
            });

            ctx.lineWidth = 1;
            ctx.strokeStyle = triBorderColor;
            const triOrigin: [number, number] = [
                this.interactionRect[0] + this.interactionRect[2] * distance - 4,
                (height + metersThick) * 0.5 + lineWidth * 0.5 + 2
            ];
            ctx.beginPath();
            ctx.moveTo(triOrigin[0], triOrigin[1] + 8);
            ctx.lineTo(triOrigin[0] + 4, triOrigin[1]);
            ctx.lineTo(triOrigin[0] + 8, triOrigin[1] + 8);
            ctx.lineTo(triOrigin[0], triOrigin[1] + 8);
            ctx.stroke();

            ctx.fillStyle = this.inTouch ? triOnColor : triColor;
            ctx.fill();

            ctx.font = `${fontFace === "regular" ? "" : fontFace} ${fontSize}px ${fontFamily}, sans-serif`;
            ctx.textAlign = "center";
            ctx.fillStyle = textColor;
            if (showName) ctx.fillText(shortName, width * 0.5, fontSize, width);
            ctx.textAlign = "left";
            if (showNumber) ctx.fillText(displayValue, 4, height - 2, width);
        }
    }
    getValueFromPos(e: PointerDownEvent) {
        const { orientation, type, min, exponent } = this.state;
        const step = type === "enum" ? 1 : (this.state.step || 1);
        const totalPixels = orientation === "vertical" ? this.interactionRect[3] : this.interactionRect[2];
        const stepsCount = this.stepsCount;
        const stepPixels = totalPixels / stepsCount;
        const pixels = orientation === "vertical" ? this.interactionRect[3] - (e.y - this.interactionRect[1]) : e.x - this.interactionRect[0];
        let steps = Math.round(normExp(pixels / totalPixels, exponent) * totalPixels / stepPixels);
        steps = Math.min(stepsCount, Math.max(0, steps));
        if (type === "enum") return steps;
        if (type === "int") return Math.round(steps * step + min);
        return steps * step + min;
    }
    getValueFromDelta(e: PointerDragEvent) {
        const { type, min, max, enums, exponent, orientation } = this.state;
        const step = type === "enum" ? 1 : (this.state.step || 1);
        const totalPixels = orientation === "horizontal" ? this.interactionRect[2] : this.interactionRect[3];
        const stepsCount = this.stepsCount;
        const stepPixels = totalPixels / stepsCount;
        const prevPixels = LiveUI.getDistance({ value: e.prevValue, type, min, max, enums, exponent }) * totalPixels;
        const pixels = prevPixels + (orientation === "horizontal" ? e.x - e.fromX : e.fromY - e.y);
        let steps = Math.round(normExp(pixels / totalPixels, exponent) * totalPixels / stepPixels);
        steps = Math.min(stepsCount, Math.max(0, steps));
        if (type === "enum") return steps;
        if (type === "int") return Math.round(steps * step + min);
        return steps * step + min;
    }
    handlePointerDown = (e: PointerDownEvent) => {
        if (
            e.x < this.interactionRect[0]
            || e.x > this.interactionRect[0] + this.interactionRect[2]
            || e.y < this.interactionRect[1]
            || e.y > this.interactionRect[1] + this.interactionRect[3]
        ) return;
        if (!this.state.relative) {
            const newValue = this.getValueFromPos(e);
            if (newValue !== this.state.value) this.setValueToOutput(newValue);
        }
        this.inTouch = true;
    }
    handlePointerDrag = (e: PointerDragEvent) => {
        if (!this.inTouch) return;
        let newValue;
        if (this.state.relative) newValue = this.getValueFromDelta(e);
        else newValue = this.getValueFromPos(e);
        if (newValue !== this.state.value) this.setValueToOutput(newValue);
    }
    handlePointerUp = () => {
        this.inTouch = false;
    }
    handleKeyDown = (e: React.KeyboardEvent) => {
        if (!this.state.inputBuffer) {
            let addStep = 0;
            if (e.key === "ArrowUp" || e.key === "ArrowRight") addStep = 1;
            if (e.key === "ArrowDown" || e.key === "ArrowLeft") addStep = -1;
            if (addStep !== 0) {
                const newValue = this.object.toValidValue(this.state.value + this.state.step * addStep);
                if (newValue !== this.state.value) this.setValueToOutput(newValue);
            }
        }
        if (e.key.match(/[0-9.-]/)) {
            this.setState({ inputBuffer: this.state.inputBuffer + e.key });
            return;
        }
        if (e.key === "Backspace") {
            this.setState({ inputBuffer: this.state.inputBuffer.slice(0, -1) });
            return;
        }
        if (e.key === "Enter") {
            const newValue = this.object.toValidValue(+this.state.inputBuffer);
            this.setState({ inputBuffer: "" });
            if (newValue !== this.state.value) this.setValueToOutput(newValue);
        }
    }
    handleFocusOut = () => {
        if (this.state.inputBuffer) {
            const newValue = this.object.toValidValue(+this.state.inputBuffer);
            this.setState({ inputBuffer: "" });
            if (newValue !== this.state.value) this.setValueToOutput(newValue);
        }
        this.setState({ focus: false });
    }
}

export type LiveGainState = { rmsNode: InstanceType<typeof RMSRegister["Node"]>; bypassNode: GainNode; gainNode: GainNode; $requestTimer: number } & LiveObjectState;
export class LiveGain extends LiveObject<{}, {}, [number | Bang, number], [undefined, number, string, number[]], [number], LiveGainProps, LiveGainUIState> {
    static description = "Gain slider and monitor";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Signal in, number to set gain"
    }, {
        isHot: false,
        type: "number",
        description: "Set gain without output the value"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "signal",
        description: "Audio out"
    }, {
        type: "number",
        description: "Number value"
    }, {
        type: "string",
        description: "Display value"
    }, {
        type: "object",
        description: "Amplitude value: number[]"
    }]
    static args: TMeta["args"] = [{
        type: "number",
        optional: true,
        default: 0,
        description: "Initial value"
    }];
    static props: TMeta["props"] = {
        shortName: {
            type: "string",
            default: "live.slider",
            description: "Short name to display",
            isUIState: true
        },
        longName: {
            type: "string",
            default: "live.slider",
            description: "Long name to display",
            isUIState: true
        },
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
        step: {
            type: "number",
            default: 0.01,
            description: "Value change step",
            isUIState: true
        },
        type: {
            type: "enum",
            enums: ["enum", "float", "int"],
            default: "float",
            description: "Value type",
            isUIState: true
        },
        unitStyle: {
            type: "enum",
            enums: ["float", "int", "time", "hertz", "decibel", "%", "pan", "semitones", "midi", "custom", "native"],
            default: "decibel",
            description: "Style of unit to display",
            isUIState: true
        },
        relative: {
            type: "boolean",
            default: false,
            description: "Modify value use relative mouse move",
            isUIState: true
        },
        sliderColor: {
            type: "color",
            default: "rgba(195, 195, 195, 1)",
            description: "Slider color",
            isUIState: true
        },
        triBorderColor: {
            type: "color",
            default: "rgba(80, 80, 80, 1)",
            description: "Triangle border color",
            isUIState: true
        },
        triColor: {
            type: "color",
            default: "rgba(165, 165, 165, 1)",
            description: "Triangle color",
            isUIState: true
        },
        triOnColor: {
            type: "color",
            default: "rgba(195, 195, 195, 1)",
            description: "Triangle color while on",
            isUIState: true
        },
        textColor: {
            type: "color",
            default: "rgba(255, 255, 255, 1)",
            description: "Text color",
            isUIState: true
        },
        fontFamily: {
            type: "enum",
            enums: ["Lato", "Georgia", "Times New Roman", "Arial", "Tahoma", "Verdana", "Courier New"],
            default: "Arial",
            description: "Font family",
            isUIState: true
        },
        fontSize: {
            type: "number",
            default: 10,
            description: "Text font size",
            isUIState: true
        },
        fontFace: {
            type: "enum",
            enums: ["regular", "bold", "italic", "bold italic"],
            default: "regular",
            description: "Text style",
            isUIState: true
        },
        orientation: {
            type: "enum",
            enums: ["vertical", "horizontal"],
            default: "horizontal",
            description: "Slider orientation",
            isUIState: true
        },
        showName: {
            type: "boolean",
            default: true,
            description: "Display name",
            isUIState: true
        },
        showNumber: {
            type: "boolean",
            default: true,
            description: "Display number as text",
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
        },
        metering: {
            type: "enum",
            enums: ["postFader", "preFader"],
            default: "postFader",
            description: "Display meter pre/post fader"
        },
        interp: {
            type: "number",
            default: 0.01,
            description: "Ramp time"
        }
    }
    uiComponent = LiveGainUI;
    state: LiveGainState = {
        ...this.state,
        rmsNode: undefined,
        gainNode: this.audioCtx.createGain(),
        bypassNode: this.audioCtx.createGain(),
        $requestTimer: -1
    }
    inletConnections = [{ node: this.state.bypassNode, index: 0 }];
    outletConnections = [{ node: this.state.gainNode, index: 0 }];
    subscribe() {
        super.subscribe();
        const startRequest = () => {
            let lastResult: number[] = [];
            const request = async () => {
                if (this.state.rmsNode && !this.state.rmsNode.destroyed) {
                    const rms = await this.state.rmsNode.getRMS();
                    const mode = this.getProp("mode");
                    const thresh = this.getProp(mode === "deciBel" ? "thresholdDB" : "thresholdLinear");
                    const result = mode === "deciBel" ? rms.map(v => atodb(v)) : rms;
                    if (!lastResult.every((v, i) => v === result[i] || Math.abs(v - result[i]) < thresh) || lastResult.length !== result.length) {
                        this.outlet(3, result);
                        this.updateUI({ levels: result });
                        lastResult = result;
                    }
                }
                scheduleRequest();
            };
            const scheduleRequest = () => {
                this.state.$requestTimer = window.setTimeout(request, this.getProp("speedLim"));
            };
            scheduleRequest();
        };
        this.on("preInit", async () => {
            this.inlets = 1;
            this.outlets = 4;
        });
        this.on("updateArgs", (args) => {
            if (typeof args[0] === "number") {
                this.state.value = args[0];
                this.validateValue();
                this.updateUI({ value: this.state.value });
            }
        });
        let lastMetering: "preFader" | "postFader";
        this.on("updateProps", (props) => {
            if (props.windowSize && this.state.rmsNode) this.applyBPF(this.state.rmsNode.parameters.get("windowSize"), [[props.windowSize]]);
            if (props.metering && lastMetering !== props.metering && this.state.rmsNode) {
                if (lastMetering) {
                    if (lastMetering === "postFader") this.state.gainNode.disconnect(this.state.rmsNode);
                    else this.state.bypassNode.disconnect(this.state.rmsNode);
                }
                lastMetering = props.metering;
                if (props.metering === "preFader") this.state.bypassNode.connect(this.state.rmsNode, 0, 0);
                else this.state.gainNode.connect(this.state.rmsNode, 0, 0);
            }
        });
        this.on("postInit", async () => {
            this.applyBPF(this.state.gainNode.gain, [[dbtoa(this.state.value)]]);
            this.state.bypassNode.connect(this.state.gainNode);
            await RMSRegister.register(this.audioCtx.audioWorklet);
            this.state.rmsNode = new RMSRegister.Node(this.audioCtx);
            this.applyBPF(this.state.rmsNode.parameters.get("windowSize"), [[this.getProp("windowSize")]]);
            if (this.getProp("metering") === "preFader") this.state.bypassNode.connect(this.state.rmsNode, 0, 0);
            else this.state.gainNode.connect(this.state.rmsNode, 0, 0);
            startRequest();
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!(data instanceof Bang)) {
                    const value = +data;
                    this.state.value = value;
                    this.validateValue();
                    this.applyBPF(this.state.gainNode.gain, [[dbtoa(this.state.value), this.getProp("interp")]]);
                    this.updateUI({ value: this.state.value });
                }
                this.outletAll([, this.state.value, this.state.displayValue]);
            } else if (inlet === 1) {
                const value = +data;
                this.state.value = value;
                this.validateValue();
                this.applyBPF(this.state.gainNode.gain, [[dbtoa(this.state.value), this.getProp("interp")]]);
                this.updateUI({ value: this.state.value });
            }
        });
        this.on("changeFromUI", ({ value, displayValue }) => {
            this.state.value = value;
            this.state.displayValue = displayValue;
            this.applyBPF(this.state.gainNode.gain, [[dbtoa(this.state.value), this.getProp("interp")]]);
            this.outletAll([, this.state.value, this.state.displayValue]);
        });
        this.on("destroy", () => {
            this.state.bypassNode.disconnect();
            this.state.gainNode.disconnect();
            window.clearTimeout(this.state.$requestTimer);
            if (this.state.rmsNode) this.state.rmsNode.destroy();
        });
    }
}