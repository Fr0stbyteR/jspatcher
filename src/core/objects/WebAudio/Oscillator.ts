import JSPAudioNode from "./AudioNode";
import { TMeta, Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";
import { decodeMaxCurveFormat } from "../../../utils";

export default class Oscillator extends JSPAudioNode<OscillatorNode, {}, [Bang, string, string, OscillatorType], [null, OscillatorNode], [number, OscillatorType], { detune: number }> {
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
                type: "signal",
                description: "frequency: curve or node connection"
            }, {
                isHot: false,
                type: "signal",
                description: "detune: curve or node connection"
            }, {
                isHot: false,
                type: "string",
                description: 'type: "sine" | "square" | "sawtooth" | "triangle" | "custom"'
            }],
            outlets: [{
                type: "signal",
                description: "Node connection (1 channel)"
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
    state = { node: this.audioCtx.createOscillator() };
    inletConnections = [null, { node: this.node.frequency }, { node: this.node.detune }];
    outletConnections = [{ node: this.node, index: 0 }];
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 4;
        this.outlets = 2;
        this.node.channelInterpretation = "discrete";
        this.node.channelCountMode = "explicit";
        this.keepAlive();
        this.node.start();
        this.update((box as Box<this>).args, (box as Box<this>).props);
    }
    update(args?: [number?, OscillatorType?], props?: { detune?: number }) {
        this.updateBox(args, props);
        if (args && args.length) {
            if (typeof args[0] === "number") {
                try {
                    this.node.frequency.setValueAtTime(args[0], this.audioCtx.currentTime);
                } catch (e) {
                    this.error((e as Error).message);
                }
            }
            if (typeof args[1] === "string") {
                try {
                    this.node.type = args[1];
                } catch (e) {
                    this.error((e as Error).message);
                }
            }
        }
        if (props) {
            if (typeof props.detune === "number") {
                try {
                    this.node.detune.setValueAtTime(props.detune, this.audioCtx.currentTime);
                } catch (e) {
                    this.error((e as Error).message);
                }
            }
        }
        return this;
    }
    fn<I extends [Bang, string, string, OscillatorType], $ extends keyof Pick<I, number>>(data: I[$], inlet: $) {
        if (inlet === 0) {
            if (data instanceof Bang) this.outlet(1, this.node);
        } else {
            try {
                if (inlet === 1) {
                    const curve = decodeMaxCurveFormat(data as string);
                    JSPAudioNode.applyCurve(this.node.frequency, curve, this.audioCtx);
                } else if (inlet === 2) {
                    const curve = decodeMaxCurveFormat(data as string);
                    JSPAudioNode.applyCurve(this.node.detune, curve, this.audioCtx);
                } else if (inlet === 3) {
                    this.node.type = data as OscillatorType;
                }
            } catch (e) {
                this.error((e as Error).message);
            }
        }
        return this;
    }
}
