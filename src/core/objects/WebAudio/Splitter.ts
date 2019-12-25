import JSPAudioNode from "./AudioNode";
import { Bang } from "../Base";
import { TMeta } from "../../types";

export default class Splitter extends JSPAudioNode<ChannelSplitterNode, {}, [Bang], (null | ChannelSplitterNode)[], [number]> {
    static description = "WebAudio ChannelSplitterNode";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Node connection, bang to output ChannelSplitterNode instance, number to change outputs"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "signal",
        description: "Node connection (1 channel)"
    }, {
        type: "object",
        description: "Instance: ChannelSplitterNode"
    }];
    static args: TMeta["args"] = [{
        type: "number",
        optional: true,
        description: "Number of Outputs"
    }];
    state = { node: null as ChannelSplitterNode };
    inletConnections = [{ node: this.node, index: 0 }];
    _meta: TMeta;
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
        });
        this.on("update", ({ args }) => {
            const channelCount = (args && typeof args[0] === "number" && ~~args[0]) > 0 ? ~~args[0] : 6;
            this.resetNode(channelCount);
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (typeof data === "number") {
                    const channelCount = ~~data > 0 ? ~~data : 6;
                    if (this.node && channelCount !== this.node.numberOfOutputs) this.resetNode(channelCount);
                    this.outlet(this.outlets - 1, this.node);
                } else if (data instanceof Bang) this.outlet(this.outlets - 1, this.node);
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
        this.node = this.audioCtx.createChannelSplitter(channelCount);
        this.node.channelInterpretation = "discrete";
        const factoryMeta = Splitter.meta;
        const signalOutlet = factoryMeta.outlets[0];
        const nodeOutlet = factoryMeta.outlets[1];
        this.inletConnections = [{ node: this.node, index: 0 }];
        this.outletConnections = [];
        for (let i = 0; i < channelCount; i++) {
            factoryMeta.outlets[i] = signalOutlet;
            this.outletConnections[i] = { node: this.node, index: i };
        }
        factoryMeta.outlets[channelCount] = nodeOutlet;
        this.meta = factoryMeta;
        this.outlets = channelCount + 1;
        this.connectAudio();
    }
}
