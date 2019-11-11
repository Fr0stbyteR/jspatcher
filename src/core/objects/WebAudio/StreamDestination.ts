import JSPAudioNode from "./AudioNode";
import { Bang } from "../Base";
import { TMeta } from "../../types";

export default class StreamDest extends JSPAudioNode<MediaStreamAudioDestinationNode, {}, [Bang], [MediaStreamAudioDestinationNode, MediaStream]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "WebAudio MediaStreamAudioDestinationNode",
            inlets: [{
                isHot: true,
                type: "signal",
                description: "Node connection, bang to output MediaStreamAudioDestinationNode instance with its stream"
            }],
            outlets: [{
                type: "object",
                description: "Instance: MediaStreamAudioDestinationNode"
            }, {
                type: "object",
                description: "Stream"
            }],
            args: [],
            props: []
        };
    }
    state = { node: this.audioCtx.createMediaStreamDestination() };
    inletConnections = [{ node: this.node, index: 0 }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 2;
            this.node.channelInterpretation = "discrete";
            this.node.channelCountMode = "explicit";
            this.keepAlive();
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (data instanceof Bang) this.outletAll([this.node, this.node.stream]);
            }
        });
    }
}
