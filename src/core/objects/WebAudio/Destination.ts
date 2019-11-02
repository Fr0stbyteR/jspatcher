import JSPAudioNode from "./AudioNode";
import { TMeta, Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";

export default class Destination extends JSPAudioNode<AudioDestinationNode, {}, [Bang], [AudioDestinationNode]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "WebAudio DestinationNode",
            inlets: [{
                isHot: true,
                type: "signal",
                description: "Node connection, bang to Output DestinationNode instance"
            }],
            outlets: [{
                type: "object",
                description: "Instance: DestinationNode"
            }],
            args: [],
            props: []
        };
    }
    state = { node: this.patcher._state.audioCtx.destination };
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 1;
        this.outlets = 1;
        this.node.channelInterpretation = "discrete";
        this.node.channelCountMode = "explicit";
    }
    fn<I extends [Bang], $ extends keyof Pick<I, number>>(data: I[$], inlet: $) {
        if (inlet === 0) {
            if (data instanceof Bang) this.outlet(0, this.node);
        }
        return this;
    }
}
