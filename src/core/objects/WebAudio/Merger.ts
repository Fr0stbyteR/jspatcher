import JSPAudioNode from "./AudioNode";
import { Bang } from "../Base";
import { TMeta } from "../../types";

export default class Merger extends JSPAudioNode<ChannelMergerNode, {}, [Bang | number, ...null[]], [null, ChannelMergerNode], [number]> {
    static description = "WebAudio ChannelMergerNode";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Node connection, bang to output DestinationNode instance, number to change inputs"
    }, {
        isHot: false,
        type: "signal",
        description: "Node connection"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "signal",
        description: "Node connection (n channels)"
    }, {
        type: "object",
        description: "Instance: ChannelMergerNode"
    }];
    static args: TMeta["args"] = [{
        type: "number",
        optional: true,
        description: "Number of Inputs"
    }];
    state = { node: null as ChannelMergerNode };
    outletConnections = [{ node: this.node, index: 0 }];
    _meta: TMeta;
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.outlets = 2;
        });
        this.on("update", ({ args }) => {
            const channelCount = (typeof args[0] === "number" && ~~args[0]) > 0 ? ~~args[0] : 6;
            this.resetNode(channelCount);
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (typeof data === "number") {
                    const channelCount = ~~data > 0 ? ~~data : 6;
                    if (this.node && channelCount !== this.node.numberOfInputs) this.resetNode(channelCount);
                    this.outlet(1, this.node);
                } else if (data instanceof Bang) this.outlet(1, this.node);
            }
        });
    }
    get meta() {
        return this._meta;
    }
    set meta(metaIn: TMeta) {
        this._meta = metaIn;
        this.emit("metaChanged", this._meta);
    }
    resetNode(channelCount: number) {
        this.disconnectAudio();
        this.node = this.audioCtx.createChannelMerger(channelCount);
        this.node.channelInterpretation = "discrete";
        this.node.channelCountMode = "explicit";
        const factoryMeta = Merger.meta;
        const bangInlet = factoryMeta.inlets[0];
        const siganlInlet = factoryMeta.inlets[1];
        this.inletConnections = [{ node: this.node, index: 0 }];
        this.outletConnections = [{ node: this.node, index: 0 }];
        factoryMeta.inlets = [bangInlet];
        for (let i = 1; i < channelCount; i++) {
            factoryMeta.inlets[i] = siganlInlet;
            this.inletConnections[i] = { node: this.node, index: i };
        }
        this.meta = factoryMeta;
        this.inlets = channelCount;
        this.connectAudio();
    }
}
