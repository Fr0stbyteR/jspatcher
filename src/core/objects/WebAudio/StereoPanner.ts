import JSPAudioNode from "./AudioNode";
import { Bang } from "../Base";
import { decodeCurve } from "../../../utils";
import { TMeta, TCurve } from "../../types";

export default class StereoPanner extends JSPAudioNode<StereoPannerNode, {}, [Bang, TCurve], [null, StereoPannerNode], [number]> {
    static description = "WebAudio StereoPannerNode";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Node connection, bang to output StereoPannerNode instance"
    }, {
        isHot: false,
        type: "signal",
        description: "pan: curve or node connection"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "signal",
        description: "Node connection"
    }, {
        type: "object",
        description: "Instance: StereoPannerNode"
    }];
    static args: TMeta["args"] = [{
        type: "number",
        optional: true,
        description: "Initial pan"
    }];
    state = { node: this.audioCtx.createStereoPanner() };
    inletConnections = [{ node: this.node, index: 0 }, { node: this.node.pan }];
    outletConnections = [{ node: this.node, index: 0 }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 2;
            this.node.channelInterpretation = "discrete";
            this.node.channelCountMode = "explicit";
            this.keepAlive();
        });
        this.on("updateArgs", (args) => {
            if (typeof args[0] === "number") {
                try {
                    this.node.pan.setValueAtTime(args[0], this.audioCtx.currentTime);
                } catch (e) {
                    this.error((e as Error).message);
                }
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (data instanceof Bang) this.outlet(1, this.node);
            } else if (inlet === 1) {
                try {
                    const curve = decodeCurve(data as TCurve);
                    JSPAudioNode.applyCurve(this.node.pan, curve, this.audioCtx);
                } catch (e) {
                    this.error(e.message);
                }
            }
        });
    }
}
