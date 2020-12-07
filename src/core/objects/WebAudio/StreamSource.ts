import JSPAudioNode from "./AudioNode";
import { Bang, isBang } from "../Base";
import { TMeta } from "../../types";

type I = [Bang | MediaStream];
export default class StreamSrc extends JSPAudioNode<MediaStreamAudioSourceNode, { stream: MediaStream }, I, [null, MediaStreamAudioSourceNode], [], {}> {
    static description = "WebAudio MediaStreamAudioSourceNode";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "object",
        description: "MediaStream to construct node, bang to output MediaStreamAudioSourceNode instance"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "signal",
        description: "Node connection"
    }, {
        type: "object",
        description: "Instance: MediaStreamAudioSourceNode"
    }];
    state = { node: undefined as MediaStreamAudioSourceNode, stream: undefined as MediaStream };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 2;
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) {
                    this.state.stream = data;
                    this.resetNode();
                }
                if (this.node) this.outlet(1, this.node);
            }
        });
    }
    resetNode() {
        this.disconnectAudio();
        this.node = this.audioCtx.createMediaStreamSource(this.state.stream);
        this.node.channelInterpretation = "discrete";
        this.outletConnections[0] = { node: this.node, index: 0 };
        this.connectAudio();
    }
}
