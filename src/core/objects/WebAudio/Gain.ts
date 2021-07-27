import JSPAudioNode from "./AudioNode";
import { Bang, isBang } from "../base/index.jspatpkg";
import { decodeLine } from "../../../utils/utils";
import { IJSPatcherObjectMeta, TBPF } from "../../types";

export default class Gain extends JSPAudioNode<GainNode, {}, [Bang, TBPF], [null, GainNode], [number]> {
    static description = "WebAudio GainNode";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Node connection, bang to output GainNode instance"
    }, {
        isHot: false,
        type: "signal",
        description: "gain: bpf or node connection"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "signal",
        description: "Node connection"
    }, {
        type: "object",
        description: "Instance: GainNode"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "number",
        optional: true,
        description: "Initial gain"
    }];
    state = { node: this.audioCtx.createGain() };
    inletAudioConnections = [{ node: this.node, index: 0 }, { node: this.node.gain }];
    outletAudioConnections = [{ node: this.node, index: 0 }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 2;
            this.node.channelInterpretation = "discrete";
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
                if (isBang(data)) this.outlet(1, this.node);
            } else if (inlet === 1) {
                try {
                    const bpf = decodeLine(data as TBPF);
                    this.applyBPF(this.node.gain, bpf);
                } catch (e) {
                    this.error(e.message);
                }
            }
        });
    }
}
