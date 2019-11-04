import JSPAudioNode from "./AudioNode";
import { TMeta, Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";

export default class Merger extends JSPAudioNode<ChannelMergerNode, {}, [Bang, ...null[]], [null, ChannelMergerNode], [number]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "WebAudio ChannelMergerNode",
            inlets: [{
                isHot: true,
                type: "signal",
                description: "Node connection, bang to output DestinationNode instance"
            }, {
                isHot: false,
                type: "signal",
                description: "Node connection"
            }],
            outlets: [{
                type: "signal",
                description: "Node connection (n channels)"
            }, {
                type: "object",
                description: "Instance: ChannelMergerNode"
            }],
            args: [{
                type: "number",
                optional: true,
                description: "Number of Inputs"
            }],
            props: []
        };
    }
    state = { node: null as ChannelMergerNode };
    _meta: TMeta;
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        const channelCount = box.args && box.args[0] && ~~box.args[0] > 0 ? ~~box.args[0] : 6;
        this.state.node = this.patcher._state.audioCtx.createChannelMerger(channelCount);
        this.node.channelInterpretation = "discrete";
        this.node.channelCountMode = "explicit";
        this.inlets = channelCount;
        this.outlets = 2;
        const factoryMeta = Merger.meta;
        const bangInlet = factoryMeta.inlets[0];
        const siganlInlet = factoryMeta.inlets[1];
        this.inletConnections = [{ node: this.state.node, index: 0 }];
        factoryMeta.inlets = [bangInlet];
        for (let i = 1; i < channelCount; i++) {
            factoryMeta.inlets[i] = siganlInlet;
            this.inletConnections[i] = { node: this.state.node, index: i };
        }
        this._meta = factoryMeta;
        this.outletConnections = [{ node: this.state.node, index: 0 }];
        this.keepAlive();
    }
    get meta() {
        return this._meta;
    }
    keepAlive() {
        this.node.connect(this.patcher._state.dummyAudioNode, 0, 0);
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
