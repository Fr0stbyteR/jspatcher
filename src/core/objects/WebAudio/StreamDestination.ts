import JSPAudioNode from "./AudioNode";
import { Bang, isBang } from "../base/index.jspatpkg";
import { IJSPatcherObjectMeta } from "../../types";

export default class StreamDest extends JSPAudioNode<MediaStreamAudioDestinationNode, {}, [Bang], [MediaStreamAudioDestinationNode, MediaStream]> {
    static description = "WebAudio MediaStreamAudioDestinationNode";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Node connection, bang to output MediaStreamAudioDestinationNode instance with its stream"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "object",
        description: "Instance: MediaStreamAudioDestinationNode"
    }, {
        type: "object",
        description: "Stream"
    }];
    state = { node: this.audioCtx.createMediaStreamDestination() };
    inletAudioConnections = [{ node: this.node, index: 0 }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 2;
            this.node.channelInterpretation = "discrete";
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (isBang(data)) this.outletAll([this.node, this.node.stream]);
            }
        });
    }
}
