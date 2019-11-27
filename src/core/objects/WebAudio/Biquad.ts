import JSPAudioNode from "./AudioNode";
import { Bang } from "../Base";
import { decodeCurve } from "../../../utils";
import { TMeta, TCurve } from "../../types";

type I = [Bang, TCurve, TCurve, TCurve, TCurve, BiquadFilterType];
export default class Biquad extends JSPAudioNode<BiquadFilterNode, {}, I, [null, BiquadFilterNode], [], BiquadFilterOptions> {
    static description = "WebAudio BiquadFilterNode";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Node connection (1 channel), bang to output BiquadFilterNode instance"
    }, {
        isHot: false,
        type: "signal",
        description: "frequency: curve or node connection"
    }, {
        isHot: false,
        type: "signal",
        description: "detune: curve or node connection"
    }, {
        isHot: false,
        type: "signal",
        description: "Q: curve or node connection"
    }, {
        isHot: false,
        type: "signal",
        description: "gain: curve or node connection"
    }, {
        isHot: false,
        type: "enum",
        enums: ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"],
        description: 'type: "lowpass" | "highpass" | "bandpass" | "lowshelf" | "highshelf" | "peaking" | "notch" | "allpass"'
    }];
    static outlets: TMeta["outlets"] = [{
        type: "signal",
        description: "Node connection (1 channel)"
    }, {
        type: "object",
        description: "Instance: BiquadFilterNode"
    }];
    static props: TMeta["props"] = {
        frequency: {
            type: "number",
            default: 350,
            description: "Initial frequency"
        },
        detune: {
            type: "number",
            default: 100,
            description: "Initial detune"
        },
        Q: {
            type: "number",
            default: 100,
            description: "Initial Q"
        },
        gain: {
            type: "number",
            default: 25,
            description: "Initial gain"
        },
        type: {
            type: "enum",
            enums: ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"],
            default: "lowpass",
            description: 'Initial type: "lowpass" | "highpass" | "bandpass" | "lowshelf" | "highshelf" | "peaking" | "notch" | "allpass"'
        }
    };
    static isBiquadFilterType = (x: any): x is BiquadFilterType => ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"].indexOf(x) >= 0;
    state = { node: this.audioCtx.createBiquadFilter() };
    inletConnections = [{ node: this.node, index: 0 }, { node: this.node.frequency }, { node: this.node.detune }, { node: this.node.Q }, { node: this.node.gain }];
    outletConnections = [{ node: this.node, index: 0 }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 6;
            this.outlets = 2;
            this.node.channelInterpretation = "discrete";
            this.node.channelCountMode = "explicit";
            this.keepAlive();
        });
        this.on("updateProps", (props) => {
            const paramMap = ["frequency", "detune", "Q", "gain"] as const;
            paramMap.forEach((key) => {
                try {
                    if (typeof props[key] === "number") this.node[key].setValueAtTime(props[key], this.audioCtx.currentTime);
                } catch (e) {
                    this.error(e.message);
                }
            });
            if (typeof props.type === "string") {
                try {
                    this.node.type = props.type;
                } catch (e) {
                    this.error(e.message);
                }
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            const paramMap = ["frequency", "detune", "Q", "gain"] as const;
            if (inlet === 0) {
                if (data instanceof Bang) this.outlet(1, this.node);
            } else if (inlet === 5) {
                if (Biquad.isBiquadFilterType(data)) this.node.type = data;
            } else if (inlet > 0 && inlet < 5) {
                try {
                    const curve = decodeCurve(data as TCurve);
                    JSPAudioNode.applyCurve(this.node[paramMap[inlet - 1]], curve, this.audioCtx);
                } catch (e) {
                    this.error(e.message);
                }
            }
        });
    }
}
