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
                description: "Instance: OscillatorNode"
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
    state = { node: this.patcher.state.audioCtx.createBiquadFilter() };
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
    keepAlive() {
        this.node.connect(this.patcher.state.dummyAudioNode, 0, 0);
    }
    destroy() {
        this.node.disconnect();
        return this;
    }
    update(args?: [], props?: BiquadFilterOptions) {
        this.updateBox(args, props);
        if (props) {
            if (props.frequency && typeof props.frequency === "number" && isFinite(props.frequency)) this.node.frequency.setValueAtTime(props.frequency, this.audioCtx.currentTime);
            if (props.detune && typeof props.detune === "number" && isFinite(props.detune)) this.node.detune.setValueAtTime(props.detune, this.audioCtx.currentTime);
            if (props.Q && typeof props.Q === "number" && isFinite(props.Q)) this.node.Q.setValueAtTime(props.Q, this.audioCtx.currentTime);
            if (props.gain && typeof props.gain === "number" && isFinite(props.gain)) this.node.gain.setValueAtTime(props.gain, this.audioCtx.currentTime);
            if (props.type && typeof props.type === "string" && Biquad.isBiquadFilterType(props.type)) this.node.type = props.type;
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
