import JSPAudioNode from "./AudioNode";
import { Bang } from "../Base";
import { decodeCurve } from "../../../utils";
import { TMeta, TCurve } from "../../types";

export default class Constant extends JSPAudioNode<ConstantSourceNode, {}, [Bang, TCurve], [null, ConstantSourceNode], [number]> {
    static description = "WebAudio ConstantSourceNode";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "bang",
        description: "Output ConstantSourceNode instance"
    }, {
        isHot: false,
        type: "signal",
        description: "offset: curve or node connection"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "signal",
        description: "Node connection (1 channel)"
    }, {
        type: "object",
        description: "Instance: ConstantSourceNode"
    }];
    static args: TMeta["args"] = [{
        type: "number",
        optional: true,
        description: "Initial offset"
    }];
    state = { node: this.audioCtx.createConstantSource() };
    inletConnections = [null, { node: this.node.offset }];
    outletConnections = [{ node: this.node, index: 0 }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 4;
            this.outlets = 2;
            this.node.channelInterpretation = "discrete";
            this.node.channelCountMode = "explicit";
            this.keepAlive();
            this.node.start();
        });
        this.on("updateArgs", (args) => {
            if (typeof args[0] === "number") {
                try {
                    this.node.offset.setValueAtTime(args[0], this.audioCtx.currentTime);
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
                    JSPAudioNode.applyCurve(this.node.offset, curve, this.audioCtx);
                } catch (e) {
                    this.error(e.message);
                }
            }
        });
    }
}
