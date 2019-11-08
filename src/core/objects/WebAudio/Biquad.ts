import JSPAudioNode from "./AudioNode";
import { TMeta, Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";
import { decodeMaxCurveFormat } from "../../../utils";

type I = [Bang, string, string, string, string, BiquadFilterType];
export default class Biquad extends JSPAudioNode<BiquadFilterNode, {}, I, [null, BiquadFilterNode], [], BiquadFilterOptions> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "WebAudio BiquadFilterNode",
            inlets: [{
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
                type: "string",
                description: 'type: "lowpass" | "highpass" | "bandpass" | "lowshelf" | "highshelf" | "peaking" | "notch" | "allpass"'
            }],
            outlets: [{
                type: "signal",
                description: "Node connection (1 channel)"
            }, {
                type: "object",
                description: "Instance: BiquadFilterNode"
            }],
            args: [],
            props: [{
                name: "frequency",
                type: "number",
                description: "Initial frequency"
            }, {
                name: "detune",
                type: "number",
                description: "Initial detune"
            }, {
                name: "Q",
                type: "number",
                description: "Initial Q"
            }, {
                name: "gain",
                type: "number",
                description: "Initial gain"
            }, {
                name: "type",
                type: "string",
                description: 'Initial type: "lowpass" | "highpass" | "bandpass" | "lowshelf" | "highshelf" | "peaking" | "notch" | "allpass"'
            }]
        };
    }
    static isBiquadFilterType = (x: any): x is BiquadFilterType => ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"].indexOf(x) >= 0;
    state = { node: this.audioCtx.createBiquadFilter() };
    inletConnections = [{ node: this.node, index: 0 }, { node: this.node.frequency }, { node: this.node.detune }, { node: this.node.Q }, { node: this.node.gain }];
    outletConnections = [{ node: this.node, index: 0 }];
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 6;
        this.outlets = 2;
        this.node.channelInterpretation = "discrete";
        this.node.channelCountMode = "explicit";
        this.keepAlive();
        this.update((box as Box<this>).args, (box as Box<this>).props);
    }
    update(args?: [], props?: BiquadFilterOptions) {
        this.updateBox(args, props);
        if (props) {
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
        }
        return this;
    }
    fn<$ extends keyof Pick<I, number>>(data: I[$], inlet: $) {
        const paramMap = ["frequency", "detune", "Q", "gain"] as const;
        if (inlet === 0) {
            if (data instanceof Bang) this.outlet(1, this.node);
        } else if (inlet === 5) {
            if (Biquad.isBiquadFilterType(data)) this.node.type = data;
        } else if (inlet > 0 && inlet < 5) {
            try {
                const curve = decodeMaxCurveFormat(data as string);
                JSPAudioNode.applyCurve(this.node[paramMap[inlet - 1]], curve, this.audioCtx);
            } catch (e) {
                this.error(e.message);
            }
        }
        return this;
    }
}
