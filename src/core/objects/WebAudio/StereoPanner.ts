import JSPAudioNode from "./AudioNode";
import { Bang, isBang } from "../Base";
import { decodeLine } from "../../../utils/utils";
import { IJSPatcherObjectMeta, TBPF } from "../../types";

export default class StereoPanner extends JSPAudioNode<StereoPannerNode, {}, [Bang, TBPF], [null, StereoPannerNode], [number]> {
    static description = "WebAudio StereoPannerNode";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Node connection, bang to output StereoPannerNode instance"
    }, {
        isHot: false,
        type: "signal",
        description: "pan: bpf or node connection"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "signal",
        description: "Node connection"
    }, {
        type: "object",
        description: "Instance: StereoPannerNode"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "number",
        optional: true,
        description: "Initial pan"
    }];
    state = { node: this.audioCtx.createStereoPanner() };
    inletAudioConnections = [{ node: this.node, index: 0 }, { node: this.node.pan }];
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
                    this.node.pan.setValueAtTime(args[0], this.audioCtx.currentTime);
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
                    this.applyBPF(this.node.pan, bpf);
                } catch (e) {
                    this.error(e.message);
                }
            }
        });
    }
}
