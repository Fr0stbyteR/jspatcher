import JSPAudioNode from "./AudioNode";
import { TMeta, Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";
import { isNumberArray } from "../../../utils";
import { TAudioNodeInletConnection, TAudioNodeOutletConnection } from "../../types";

type I = [Bang, number[], number[]];
export default class IIRFilter extends JSPAudioNode<IIRFilterNode, { feedforward: number[]; feedback: number[] }, I, [null, IIRFilterNode], [number[], number[]], {}> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "WebAudio IIRFilterNode",
            inlets: [{
                isHot: true,
                type: "signal",
                description: "Node connection (1 channel), bang to output IIRFilterNode instance"
            }, {
                isHot: false,
                type: "object",
                description: "feedforward, A sequence of coefficients, change will reconstruct the node: number[]"
            }, {
                isHot: false,
                type: "object",
                description: "feedback, A sequence of coefficients, change will reconstruct the node: number[]"
            }],
            outlets: [{
                type: "signal",
                description: "Node connection (1 channel)"
            }, {
                type: "object",
                description: "Instance: IIRFilterNode"
            }],
            args: [{
                type: "object",
                optional: false,
                default: [],
                description: "feedforward, A sequence of coefficients: number[]"
            }, {
                type: "object",
                optional: false,
                default: [],
                description: "feedback, A sequence of coefficients: number[]"
            }],
            props: []
        };
    }
    state = { node: undefined as IIRFilterNode, feedforward: [] as number[], feedback: [] as number[] };
    inletConnections: TAudioNodeInletConnection[] = [];
    outletConnections: TAudioNodeOutletConnection[] = [];
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 3;
        this.outlets = 2;
        this.update((box as Box<this>).args);
    }
    resetNode() {
        this.destroy();
        this.node = this.audioCtx.createIIRFilter(this.state.feedforward, this.state.feedback);
        this.node.channelInterpretation = "discrete";
        this.node.channelCountMode = "explicit";
        this.inletConnections[0] = { node: this.node, index: 0 };
        this.outletConnections[0] = { node: this.node, index: 0 };
        this.keepAlive();
        this.connectAll();
    }
    keepAlive() {
        this.node.connect(this.dummyAudioNode, 0, 0);
    }
    destroy() {
        if (this.node) this.node.disconnect();
        return this;
    }
    update(args?: [number[], number[]]) {
        this.updateBox(args);
        if (args) {
            if (isNumberArray(args[0])) this.state.feedforward = args[0];
            if (isNumberArray(args[1])) this.state.feedback = args[1];
        }
        this.resetNode();
        return this;
    }
    fn<$ extends keyof Pick<I, number>>(data: I[$], inlet: $) {
        if (inlet === 0) {
            if (data instanceof Bang) this.outlet(1, this.node);
        } else if (inlet === 1) {
            if (isNumberArray(data)) this.state.feedforward = data;
            this.resetNode();
        } else if (inlet === 2) {
            if (isNumberArray(data)) this.state.feedback = data;
            this.resetNode();
        }
        return this;
    }
}
