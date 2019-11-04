import JSPAudioNode from "./AudioNode";
import { TMeta, Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";

export default class Splitter extends JSPAudioNode<ChannelSplitterNode, {}, [Bang], (null | ChannelSplitterNode)[], [number]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "WebAudio ChannelSplitterNode",
            inlets: [{
                isHot: true,
                type: "signal",
                description: "Node connection, bang to output ChannelSplitterNode instance"
            }],
            outlets: [{
                type: "signal",
                description: "Node connection (1 channel)"
            }, {
                type: "object",
                description: "Instance: ChannelSplitterNode"
            }],
            args: [{
                type: "number",
                optional: true,
                description: "Number of Outputs"
            }],
            props: []
        };
    }
    state = { node: null as ChannelSplitterNode };
    _meta: TMeta;
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        const channelCount = box.args && box.args[0] && ~~box.args[0] > 0 ? ~~box.args[0] : 6;
        this.state.node = this.patcher._state.audioCtx.createChannelSplitter(channelCount);
        this.node.channelInterpretation = "discrete";
        this.node.channelCountMode = "explicit";
        this.inlets = 1;
        this.outlets = channelCount + 1;
        const factoryMeta = Splitter.meta;
        const signalOutlet = factoryMeta.outlets[0];
        const nodeOutlet = factoryMeta.outlets[1];
        for (let i = 0; i < channelCount; i++) {
            factoryMeta.outlets[i] = signalOutlet;
        }
        factoryMeta.outlets[channelCount] = nodeOutlet;
        this._meta = factoryMeta;
        this.keepAlive();
    }
    get meta() {
        return this._meta;
    }
    keepAlive() {
        this.patcher._state.dummyAudioNode.connect(this.node, 0, 0);
    }
    destroy() {
        this.node.disconnect();
        return this;
    }
    fn<I extends [Bang], $ extends keyof Pick<I, number>>(data: I[$], inlet: $) {
        if (inlet === 0) {
            if (data instanceof Bang) this.outlet(this.outlets - 1, this.node);
        }
        return this;
    }
}
