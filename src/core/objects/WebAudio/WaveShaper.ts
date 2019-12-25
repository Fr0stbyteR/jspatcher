import JSPAudioNode from "./AudioNode";
import { Bang } from "../Base";
import { TMeta } from "../../types";

type I = [Bang, Float32Array, OverSampleType];
export default class WaveShaper extends JSPAudioNode<WaveShaperNode, {}, I, [null, WaveShaperNode], [], { oversample?: OverSampleType }> {
    static description = "WebAudio WaveShaperNode";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Node connection, bang to output WaveShaperNode instance"
    }, {
        isHot: false,
        type: "object",
        description: "curve: Float32Array"
    }, {
        isHot: false,
        type: "enum",
        enums: ["none", "2x", "4x"],
        description: 'oversample: "none" | "2x" | "4x"'
    }];
    static outlets: TMeta["outlets"] = [{
        type: "signal",
        description: "Node connection"
    }, {
        type: "object",
        description: "Instance: WaveShaperNode"
    }];
    static props: TMeta["props"] = {
        oversample: {
            type: "enum",
            enums: ["none", "2x", "4x"],
            default: "none",
            description: "Initial oversample"
        }
    };
    state = { node: this.audioCtx.createWaveShaper() };
    inletConnections = [{ node: this.node, index: 0 }];
    outletConnections = [{ node: this.node, index: 0 }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 3;
            this.outlets = 2;
            this.node.channelInterpretation = "discrete";
        });
        this.on("updateProps", (props) => {
            try {
                if (typeof props.oversample === "string") this.node.oversample = props.oversample;
            } catch (e) {
                this.error(e.message);
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (data instanceof Bang) this.outlet(1, this.node);
            } else if (inlet === 1) {
                try {
                    if (data instanceof Float32Array) this.node.curve = data;
                    else this.error("The curve is not a Float32Array.");
                } catch (e) {
                    this.error(e.message);
                }
            } else if (inlet === 2) {
                try {
                    if (typeof data === "string") this.node.oversample = data as OverSampleType;
                    else this.error("Incorrect oversample type.");
                } catch (e) {
                    this.error(e.message);
                }
            }
        });
    }
}
