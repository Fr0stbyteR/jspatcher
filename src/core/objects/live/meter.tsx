import { LiveObject } from "./Base";
import { BaseAudioObject } from "../Base";
import { TMeta } from "../../types";
import { RMSRegister } from "../dsp/AudioWorklet/RMS";
import { atodb } from "../../../utils";

interface LiveMeterProps {
    orientation: "vertical" | "horizontal";
    mode: "deciBel" | "linear";
    clipSize: "normal" | "extended";
    displayRange: [number, number];
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
type LiveMeterUIState = Exclude<LiveMeterProps, "thresholdLinear" | "thresholdDB" | "windowSize" | "speedLim"> & { value: number[] };
export class LiveMeter extends BaseAudioObject<{}, {}, [], [number[]], [], LiveMeterProps, LiveMeterUIState> {
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
    }]
    static props: TMeta["props"] = {
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
        displayRange: {
            type: "object",
            default: [-70, 6],
            description: "Display Range in dB",
            isUIState: true
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
    }
    node: InstanceType<typeof RMSRegister["Node"]>;
    $requestTimer = -1;
    startRequest = () => {
        let lastRMS: number[] = [];
        const request = async () => {
            if (this.node && !this.node.destroyed) {
                const rms = await this.node.getRMS();
                if (!lastRMS.every((v, i) => v === rms[i]) || lastRMS.length !== rms.length) {
                    const result = this.getProp("mode") === "deciBel" ? rms.map(v => atodb(v)) : rms;
                    this.outlet(0, result);
                    this.updateUI({ value: result });
                    lastRMS = rms;
                }
            }
            scheduleRequest();
        };
        const scheduleRequest = () => {
            this.$requestTimer = window.setTimeout(request, this.getProp("speedLim"));
        };
        scheduleRequest();
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", async () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("postInit", async () => {
            await RMSRegister.register(this.audioCtx.audioWorklet);
            this.node = new RMSRegister.Node(this.audioCtx);
            this.applyBPF(this.node.parameters.get("windowSize"), [[this.getProp("windowSize")]]);
            this.disconnectAudioInlet();
            this.inletConnections[0] = { node: this.node, index: 0 };
            this.connectAudioInlet();
            this.startRequest();
        });
        this.on("updateProps", (props) => {
            if (props.windowSize && this.node) this.applyBPF(this.node.parameters.get("windowSize"), [[props.windowSize]]);
        });
        this.on("destroy", () => {
            window.clearTimeout(this.$requestTimer);
            if (this.node) this.node.destroy();
        });
    }
}
