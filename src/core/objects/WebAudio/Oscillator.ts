import JSPAudioNode from "./AudioNode";
import { TMeta, Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";
import { decodeMaxCurveFormat } from "../../../utils";

export default class Oscillator extends JSPAudioNode<OscillatorNode, {}, [Bang, string, string, OscillatorType], [null, OscillatorNode], [number, string], { detune: number }> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "WebAudio OscillatorNode",
            inlets: [{
                isHot: true,
                type: "bang",
                description: "Output OscillatorNode instance"
            }, {
                isHot: false,
                type: "string",
                description: "frequency: curve"
            }, {
                isHot: false,
                type: "string",
                description: "detune: curve"
            }, {
                isHot: false,
                type: "string",
                description: 'type: "sine" | "square" | "sawtooth" | "triangle" | "custom"'
            }],
            outlets: [{
                type: "signal",
                description: "Node connection"
            }, {
                type: "object",
                description: "Instance: OscillatorNode"
            }],
            args: [{
                type: "number",
                optional: true,
                description: "Initial frequency"
            }, {
                type: "string",
                optional: true,
                description: 'Initial type: "sine" | "square" | "sawtooth" | "triangle" | "custom"'
            }],
            props: [{
                name: "detune",
                type: "number",
                description: "Initial detune"
            }]
        };
    }
    static isOscillatorType = (x: any): x is OscillatorType => x === "sine" || x === "square" || x === "sawtooth" || x === "triangle" || x === "custom";
    state = { node: this.patcher._state.audioCtx.createOscillator() };
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 3;
        this.outlets = 2;
        this.keepAlive();
        this.update((box as Box<this>).parsed.args, (box as Box<this>).parsed.props);
        this.node.start();
    }
    keepAlive() {
        this.node.connect(this.patcher._state.dummyAudioNode, 0, 0);
    }
    update(args: [number, string], props: { detune?: number }) {
        if (args && args.length) {
            if (args[0] && typeof args[0] === "number" && isFinite(args[0])) this.node.frequency.setValueAtTime(args[0], this.audioCtx.currentTime);
            if (args[1] && typeof args[1] === "string" && Oscillator.isOscillatorType(args[1])) this.node.type = args[1];
        }
        if (props) {
            if (props.detune && typeof props.detune === "number" && isFinite(props.detune)) this.node.detune.setValueAtTime(props.detune, this.audioCtx.currentTime);
        }
        return this;
    }
    fn<$ extends number>(data: [Bang, string, string, OscillatorType][$], inlet: $) {
        if (inlet === 0) {
            if (data instanceof Bang) this.outlet(1, this.node);
        } else if (inlet === 1) {
            try {
                const curve = decodeMaxCurveFormat(data as string);
                JSPAudioNode.applyCurve(this.node.frequency, curve, this.audioCtx);
            } catch (e) {
                this.error(e.message);
            }
        } else if (inlet === 1) {
            try {
                const curve = decodeMaxCurveFormat(data as string);
                JSPAudioNode.applyCurve(this.node.frequency, curve, this.audioCtx);
            } catch (e) {
                this.error(e.message);
            }
        } else if (inlet === 2) {
            if (Oscillator.isOscillatorType(data)) this.node.type = data;
        }
        return this;
    }
}
