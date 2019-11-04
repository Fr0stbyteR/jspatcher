import JSPAudioNode from "./AudioNode";
import { TMeta, Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";
import { decodeMaxCurveFormat } from "../../../utils";

export default class Gain extends JSPAudioNode<GainNode, {}, [Bang, string], [null, GainNode], [number]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "WebAudio GainNode",
            inlets: [{
                isHot: true,
                type: "signal",
                description: "Node connection, bang to output GainNode instance"
            }, {
                isHot: false,
                type: "signal",
                description: "gain: curve or node connection"
            }],
            outlets: [{
                type: "signal",
                description: "Node connection"
            }, {
                type: "object",
                description: "Instance: GainNode"
            }],
            args: [{
                type: "number",
                optional: true,
                description: "Initial gain"
            }],
            props: []
        };
    }
    state = { node: this.patcher._state.audioCtx.createGain() };
    inletConnections = [{ node: this.state.node, index: 0 }, { node: this.state.node.gain }];
    outletConnections = [{ node: this.state.node, index: 0 }];
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 2;
        this.outlets = 2;
        this.node.channelInterpretation = "discrete";
        this.node.channelCountMode = "explicit";
        this.update((box as Box<this>).args);
    }
    keepAlive() {
        this.node.connect(this.patcher._state.dummyAudioNode, 0, 0);
    }
    destroy() {
        this.node.disconnect();
        return this;
    }
    update(args?: [number?]) {
        this.updateBox(args);
        if (args && args.length) {
            if (args[0] && typeof args[0] === "number" && isFinite(args[0])) this.node.gain.setValueAtTime(args[0], this.audioCtx.currentTime);
        }
        return this;
    }
    fn<I extends [Bang, string, string, OscillatorType], $ extends keyof Pick<I, number>>(data: I[$], inlet: $) {
        if (inlet === 0) {
            if (data instanceof Bang) this.outlet(1, this.node);
        } else if (inlet === 1) {
            try {
                const curve = decodeMaxCurveFormat(data as string);
                JSPAudioNode.applyCurve(this.node.gain, curve, this.audioCtx);
            } catch (e) {
                this.error(e.message);
            }
        }
        return this;
    }
}
