import JSPAudioNode from "./AudioNode";
import { Bang, isBang } from "../Base";
import { decodeLine } from "../../../utils/utils";
import { TMeta, TBPF } from "../../types";

export default class Oscillator extends JSPAudioNode<OscillatorNode, {}, [Bang, TBPF, TBPF, OscillatorType], [null, OscillatorNode], [number, OscillatorType], { detune: number }> {
    static description = "WebAudio OscillatorNode";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "bang",
        description: "Output OscillatorNode instance"
    }, {
        isHot: false,
        type: "signal",
        description: "frequency: bpf or node connection"
    }, {
        isHot: false,
        type: "signal",
        description: "detune: bpf or node connection"
    }, {
        isHot: false,
        type: "enum",
        enums: ["sine", "square", "sawtooth", "triangle", "custom"],
        description: 'type: "sine" | "square" | "sawtooth" | "triangle" | "custom"'
    }];
    static outlets: TMeta["outlets"] = [{
        type: "signal",
        description: "Node connection (1 channel)"
    }, {
        type: "object",
        description: "Instance: OscillatorNode"
    }];
    static args: TMeta["args"] = [{
        type: "number",
        optional: true,
        default: 440,
        description: "Initial frequency"
    }, {
        type: "enum",
        enums: ["sine", "square", "sawtooth", "triangle", "custom"],
        optional: true,
        default: "sine",
        description: 'Initial type: "sine" | "square" | "sawtooth" | "triangle" | "custom"'
    }];
    static props: TMeta["props"] = {
        detune: {
            type: "number",
            default: 0,
            description: "Initial detune"
        }
    };
    static isOscillatorType = (x: any): x is OscillatorType => x === "sine" || x === "square" || x === "sawtooth" || x === "triangle" || x === "custom";
    state = { node: this.audioCtx.createOscillator() };
    inletConnections = [null, { node: this.node.frequency }, { node: this.node.detune }];
    outletConnections = [{ node: this.node, index: 0 }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 4;
            this.outlets = 2;
            this.node.channelInterpretation = "discrete";
            this.node.start();
        });
        this.on("updateProps", (props) => {
            if (typeof props.detune === "number") {
                try {
                    this.node.detune.setValueAtTime(props.detune, this.audioCtx.currentTime);
                } catch (e) {
                    this.error((e as Error).message);
                }
            }
        });
        this.on("updateArgs", (args) => {
            if (typeof args[0] === "number") {
                try {
                    this.node.frequency.setValueAtTime(args[0], this.audioCtx.currentTime);
                } catch (e) {
                    this.error((e as Error).message);
                }
            }
            if (typeof args[1] === "string") {
                try {
                    this.node.type = args[1];
                } catch (e) {
                    this.error((e as Error).message);
                }
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (isBang(data)) this.outlet(1, this.node);
            } else {
                try {
                    if (inlet === 1) {
                        const bpf = decodeLine(data as TBPF);
                        this.applyBPF(this.node.frequency, bpf);
                    } else if (inlet === 2) {
                        const bpf = decodeLine(data as TBPF);
                        this.applyBPF(this.node.detune, bpf);
                    } else if (inlet === 3) {
                        this.node.type = data as OscillatorType;
                    }
                } catch (e) {
                    this.error((e as Error).message);
                }
            }
        });
    }
}
