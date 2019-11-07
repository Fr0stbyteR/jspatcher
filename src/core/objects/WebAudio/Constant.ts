import JSPAudioNode from "./AudioNode";
import { TMeta, Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";
import { decodeMaxCurveFormat } from "../../../utils";

export default class Constant extends JSPAudioNode<ConstantSourceNode, {}, [Bang, string], [null, ConstantSourceNode], [number]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "WebAudio ConstantSourceNode",
            inlets: [{
                isHot: true,
                type: "bang",
                description: "Output ConstantSourceNode instance"
            }, {
                isHot: false,
                type: "signal",
                description: "offset: curve or node connection"
            }],
            outlets: [{
                type: "signal",
                description: "Node connection (1 channel)"
            }, {
                type: "object",
                description: "Instance: ConstantSourceNode"
            }],
            args: [{
                type: "number",
                optional: true,
                description: "Initial offset"
            }],
            props: []
        };
    }
    state = { node: this.patcher.state.audioCtx.createConstantSource() };
    inletConnections = [null, { node: this.node.offset }];
    outletConnections = [{ node: this.node, index: 0 }];
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 4;
        this.outlets = 2;
        this.node.channelInterpretation = "discrete";
        this.node.channelCountMode = "explicit";
        this.keepAlive();
        this.node.start();
        this.update((box as Box<this>).args);
    }
    keepAlive() {
        this.node.connect(this.patcher.state.dummyAudioNode, 0, 0);
    }
    destroy() {
        this.node.disconnect();
        return this;
    }
    update(args?: [number?]) {
        this.updateBox(args);
        if (args && args.length) {
            if (args[0] && typeof args[0] === "number" && isFinite(args[0])) this.node.offset.setValueAtTime(args[0], this.audioCtx.currentTime);
        }
        return this;
    }
    fn<I extends [Bang, string], $ extends keyof Pick<I, number>>(data: I[$], inlet: $) {
        if (inlet === 0) {
            if (data instanceof Bang) this.outlet(1, this.node);
        } else if (inlet === 1) {
            try {
                const curve = decodeMaxCurveFormat(data as string);
                JSPAudioNode.applyCurve(this.node.offset, curve, this.audioCtx);
            } catch (e) {
                this.error(e.message);
            }
        }
        return this;
    }
}
