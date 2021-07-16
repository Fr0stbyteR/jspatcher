import JSPAudioNode from "./AudioNode";
import { Bang, isBang } from "../Base";
import { IJSPatcherObjectMeta } from "../../types";

export default class Destination extends JSPAudioNode<AudioDestinationNode, {}, [Bang], [AudioDestinationNode]> {
    static description = "WebAudio DestinationNode";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Node connection, bang to output DestinationNode instance"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "object",
        description: "Instance: DestinationNode"
    }];
    state = { node: this.audioCtx.destination };
    inletAudioConnections = [{ node: this.node, index: 0 }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
            this.node.channelInterpretation = "discrete";
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (isBang(data)) this.outlet(0, this.node);
            }
        });
    }
}
