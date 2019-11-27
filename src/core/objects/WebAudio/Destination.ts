import JSPAudioNode from "./AudioNode";
import { Bang } from "../Base";
import { TMeta } from "../../types";

export default class Destination extends JSPAudioNode<AudioDestinationNode, {}, [Bang], [AudioDestinationNode]> {
    static description = "WebAudio DestinationNode";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Node connection, bang to output DestinationNode instance"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "object",
        description: "Instance: DestinationNode"
    }];
    state = { node: this.audioCtx.destination };
    inletConnections = [{ node: this.node, index: 0 }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
            this.node.channelInterpretation = "discrete";
            this.node.channelCountMode = "explicit";
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (data instanceof Bang) this.outlet(0, this.node);
            }
        });
    }
}
