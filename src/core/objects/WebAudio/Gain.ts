import JSPAudioNode from "./AudioNode";
import { Bang } from "../Base";
import { decodeMaxCurveFormat } from "../../../utils";
import { TMeta } from "../../types";

export default class Gain extends JSPAudioNode<GainNode, {}, [Bang, string], [null, GainNode], [number]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "WebAudio GainNode",
            inlets: [{
                isHot: true,
                type: "signal",
                description: "Node connection, bang to output GainNode instance"
            }, {
                isHot: false,
                type: "signal",
                description: "gain: curve or node connection"
            }],
            outlets: [{
                type: "signal",
                description: "Node connection"
            }, {
                type: "object",
                description: "Instance: GainNode"
            }],
            args: [{
                type: "number",
                optional: true,
                description: "Initial gain"
            }],
            props: []
        };
    }
    state = { node: this.audioCtx.createGain() };
    inletConnections = [{ node: this.node, index: 0 }, { node: this.node.gain }];
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
                    this.node.gain.setValueAtTime(args[0], this.audioCtx.currentTime);
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
                    const curve = decodeMaxCurveFormat(data as string);
                    JSPAudioNode.applyCurve(this.node.gain, curve, this.audioCtx);
                } catch (e) {
                    this.error(e.message);
                }
            }
        });
    }
}
