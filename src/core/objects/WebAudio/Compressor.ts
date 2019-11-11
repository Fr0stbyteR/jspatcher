import JSPAudioNode from "./AudioNode";
import { Bang } from "../Base";
import { decodeMaxCurveFormat } from "../../../utils";
import { TMeta } from "../../types";

type I = [Bang, string, string, string, string, string];
export default class Compressor extends JSPAudioNode<DynamicsCompressorNode, {}, I, [null, DynamicsCompressorNode], [], DynamicsCompressorOptions> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "WebAudio DynamicsCompressorNode",
            inlets: [{
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
                type: "string",
                description: "release: curve or node connection"
            }],
            outlets: [{
                type: "signal",
                description: "Node connection (1 channel)"
            }, {
                type: "object",
                description: "Instance: DynamicsCompressorNode"
            }],
            args: [],
            props: [...super.meta.props, {
                name: "threshold",
                type: "number",
                description: "Initial threshold"
            }, {
                name: "knee",
                type: "number",
                description: "Initial knee"
            }, {
                name: "ratio",
                type: "number",
                description: "Initial ratio"
            }, {
                name: "attack",
                type: "number",
                description: "Initial attack"
            }, {
                name: "release",
                type: "number",
                description: "Initial release"
            }]
        };
    }
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
            this.keepAlive();
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
                    const curve = decodeMaxCurveFormat(data as string);
                    JSPAudioNode.applyCurve(this.node[paramMap[inlet - 1]], curve, this.audioCtx);
                } catch (e) {
                    this.error(e.message);
                }
            }
        });
    }
}
