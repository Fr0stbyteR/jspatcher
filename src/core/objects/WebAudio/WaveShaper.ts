import JSPAudioNode from "./AudioNode";
import { TMeta, Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";

type I = [Bang, Float32Array, OverSampleType];
export default class WaveShaper extends JSPAudioNode<WaveShaperNode, {}, I, [null, WaveShaperNode], [], { oversample?: OverSampleType }> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "WebAudio WaveShaperNode",
            inlets: [{
                isHot: true,
                type: "signal",
                description: "Node connection, bang to output WaveShaperNode instance"
            }, {
                isHot: false,
                type: "object",
                description: "curve: Float32Array"
            }, {
                isHot: false,
                type: "string",
                description: 'oversample: "none" | "2x" | "4x"'
            }],
            outlets: [{
                type: "signal",
                description: "Node connection"
            }, {
                type: "object",
                description: "Instance: WaveShaperNode"
            }],
            args: [],
            props: [{
                name: "oversample",
                type: "string",
                description: "Initial oversample"
            }]
        };
    }
    state = { node: this.audioCtx.createWaveShaper() };
    inletConnections = [{ node: this.node, index: 0 }];
    outletConnections = [{ node: this.node, index: 0 }];
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 3;
        this.outlets = 2;
        this.node.channelInterpretation = "discrete";
        this.node.channelCountMode = "explicit";
        this.keepAlive();
        this.update((box as Box<this>).args, (box as Box<this>).props);
    }
    update(args?: [], props?: { oversample?: OverSampleType }) {
        this.updateBox(args, props);
        if (props) {
            try {
                if (typeof props.oversample === "string") this.node.oversample = props.oversample;
            } catch (e) {
                this.error(e.message);
            }
        }
        return this;
    }
    fn<$ extends keyof Pick<I, number>>(data: I[$], inlet: $) {
        if (inlet === 0) {
            if (data instanceof Bang) this.outlet(1, this.node);
        } else if (inlet === 1) {
            try {
                if (data instanceof Float32Array) this.node.curve = data;
                else this.error("The curve is not a Float32Array.");
            } catch (e) {
                this.error(e.message);
            }
        } else if (inlet === 2) {
            try {
                if (typeof data === "string") this.node.oversample = data as OverSampleType;
                else this.error("Incorrect oversample type.");
            } catch (e) {
                this.error(e.message);
            }
        }
        return this;
    }
}