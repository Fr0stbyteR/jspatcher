import JSPAudioNode from "./AudioNode";
import { Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";
import { TMeta } from "../../types";

export default class Merger extends JSPAudioNode<ChannelMergerNode, {}, [Bang | number, ...null[]], [null, ChannelMergerNode], [number]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "WebAudio ChannelMergerNode",
            inlets: [{
                isHot: true,
                type: "signal",
                description: "Node connection, bang to output DestinationNode instance, number to change inputs"
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
    outletConnections = [{ node: this.node, index: 0 }];
    _meta: TMeta;
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.outlets = 2;
        this.update((box as Box<this>).args);
    }
    get meta() {
        return this._meta;
    }
    update(args?: [number]) {
        this.updateBox(args);
        const channelCount = (args && typeof args[0] === "number" && ~~args[0]) > 0 ? ~~args[0] : 6;
        this.resetNode(channelCount);
        return this;
    }
    resetNode(channelCount: number) {
        this.disconnectAll();
        this.destroy();
        this.node = this.audioCtx.createChannelMerger(channelCount);
        this.node.channelInterpretation = "discrete";
        this.node.channelCountMode = "explicit";
        const factoryMeta = Merger.meta;
        const bangInlet = factoryMeta.inlets[0];
        const siganlInlet = factoryMeta.inlets[1];
        this.inletConnections = [{ node: this.node, index: 0 }];
        factoryMeta.inlets = [bangInlet];
        for (let i = 1; i < channelCount; i++) {
            factoryMeta.inlets[i] = siganlInlet;
            this.inletConnections[i] = { node: this.node, index: i };
        }
        this._meta = factoryMeta;
        this.inlets = channelCount;
        this.keepAlive();
        this.connectAll();
    }
    fn<I extends [Bang], $ extends keyof Pick<I, number>>(data: I[$], inlet: $) {
        if (inlet === 0) {
            if (typeof data === "number") {
                const channelCount = ~~data > 0 ? ~~data : 6;
                if (this.node && channelCount !== this.node.numberOfInputs) this.resetNode(channelCount);
                this.outlet(1, this.node);
            } else if (data instanceof Bang) this.outlet(1, this.node);
        }
        return this;
    }
}
