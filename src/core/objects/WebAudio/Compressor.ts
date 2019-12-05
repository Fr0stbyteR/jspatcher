import JSPAudioNode from "./AudioNode";
import { Bang } from "../Base";
import { decodeCurve } from "../../../utils";
import { TMeta, TCurve } from "../../types";

type I = [Bang, TCurve, TCurve, TCurve, TCurve, TCurve];
export default class Compressor extends JSPAudioNode<DynamicsCompressorNode, {}, I, [null, DynamicsCompressorNode], [], DynamicsCompressorOptions> {
    static description = "WebAudio DynamicsCompressorNode";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Node connection (1 channel), bang to output DynamicsCompressorNode instance"
    }, {
        isHot: false,
        type: "signal",
        description: "threshold: curve or node connection"
    }, {
        isHot: false,
        type: "signal",
        description: "knee: curve or node connection"
    }, {
        isHot: false,
        type: "signal",
        description: "ratio: curve or node connection"
    }, {
        isHot: false,
        type: "signal",
        description: "attack: curve or node connection"
    }, {
        isHot: false,
        type: "signal",
        description: "release: curve or node connection"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "signal",
        description: "Node connection (1 channel)"
    }, {
        type: "object",
        description: "Instance: DynamicsCompressorNode"
    }];
    static props: TMeta["props"] = {
        threshold: {
            type: "number",
            default: -24,
            description: "Initial threshold"
        },
        knee: {
            type: "number",
            default: 30,
            description: "Initial knee"
        },
        ratio: {
            type: "number",
            default: 12,
            description: "Initial ratio"
        },
        attack: {
            type: "number",
            default: 0.003,
            description: "Initial attack"
        },
        release: {
            type: "number",
            default: 0.25,
            description: "Initial release"
        }
    };
    state = { node: this.audioCtx.createDynamicsCompressor() };
    inletConnections = [{ node: this.node, index: 0 }, { node: this.node.threshold }, { node: this.node.knee }, { node: this.node.ratio }, null, { node: this.node.attack }, { node: this.node.release }];
    outletConnections = [{ node: this.node, index: 0 }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 6;
            this.outlets = 2;
            this.node.channelInterpretation = "discrete";
            this.node.channelCountMode = "explicit";
        });
        this.on("updateProps", (props) => {
            const paramMap = ["threshold", "knee", "ratio", "attack", "release"] as const;
            paramMap.forEach((key) => {
                try {
                    if (typeof props[key] === "number") this.node[key].setValueAtTime(props[key], this.audioCtx.currentTime);
                } catch (e) {
                    this.error(e.message);
                }
            });
        });
        this.on("inlet", ({ data, inlet }) => {
            const paramMap = ["threshold", "knee", "ratio", "attack", "release"] as const;
            if (inlet === 0) {
                if (data instanceof Bang) this.outlet(1, this.node);
            } else if (inlet > 0 && inlet < 6) {
                try {
                    const curve = decodeCurve(data as TCurve);
                    JSPAudioNode.applyCurve(this.node[paramMap[inlet - 1]], curve, this.audioCtx);
                } catch (e) {
                    this.error(e.message);
                }
            }
        });
    }
}
