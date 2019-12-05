import JSPAudioNode from "./AudioNode";
import { Bang } from "../Base";
import { decodeCurve } from "../../../utils";
import { TMeta, TCurve } from "../../types";

export default class Delay extends JSPAudioNode<DelayNode, {}, [Bang, TCurve], [null, DelayNode], [number]> {
    static description = "WebAudio DelayNode";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Node connection, bang to output DelayNode instance"
    }, {
        isHot: false,
        type: "signal",
        description: "delayTime: curve or node connection"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "signal",
        description: "Node connection"
    }, {
        type: "object",
        description: "Instance: DelayNode"
    }];
    static args: TMeta["args"] = [{
        type: "number",
        optional: true,
        description: "Initial delayTime"
    }];
    state = { node: this.audioCtx.createDelay() };
    inletConnections = [{ node: this.node, index: 0 }, { node: this.node.delayTime }];
    outletConnections = [{ node: this.node, index: 0 }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 2;
            this.node.channelInterpretation = "discrete";
            this.node.channelCountMode = "explicit";
        });
        this.on("updateArgs", (args) => {
            if (typeof args[0] === "number") {
                try {
                    this.node.delayTime.setValueAtTime(args[0], this.audioCtx.currentTime);
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
                    JSPAudioNode.applyCurve(this.node.delayTime, curve, this.audioCtx);
                } catch (e) {
                    this.error(e.message);
                }
            }
        });
    }
}
