import JSPAudioNode from "./AudioNode";
import { Bang, isBang } from "../base/index.jspatpkg";
import { IJSPatcherObjectMeta } from "../../types";

type I = [Bang, AudioBuffer, boolean];
type O = [null, ConvolverNode];
export default class Convolver extends JSPAudioNode<ConvolverNode, {}, I, O, [], { normalize: boolean }> {
    static description = "WebAudio ConvolverNode";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Node connection, bang to output ConvolverNode instance"
    }, {
        isHot: true,
        type: "object",
        description: "buffer (2-4 channels): AudioBuffer"
    }, {
        isHot: true,
        type: "boolean",
        description: "normalize: boolean"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "signal",
        description: "Node connection (2-4 channels)"
    }, {
        type: "object",
        description: "Instance: ConvolverNode"
    }];
    static props: IJSPatcherObjectMeta["props"] = {
        normalize: {
            type: "boolean",
            default: true,
            description: "Controls whether the impulse response from the buffer will be scaled by an equal-power normalization"
        }
    };
    state = { node: this.audioCtx.createConvolver() };
    inletAudioConnections = [{ node: this.node, index: 0 }];
    outletAudioConnections = [{ node: this.node, index: 0 }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 3;
            this.outlets = 2;
            this.node.channelInterpretation = "discrete";
        });
        this.on("updateProps", (props) => {
            try {
                if (typeof props.normalize === "boolean") this.node.normalize = props.normalize;
            } catch (e) {
                this.error((e as Error).message);
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (isBang(data)) this.outlet(1, this.node);
            } else if (inlet === 1) {
                if (data instanceof AudioBuffer) {
                    try {
                        this.node.buffer = data as I[1];
                    } catch (e) {
                        this.error((e as Error).message);
                    }
                } else {
                    this.error("Invalid ArrayBuffer");
                }
            } else if (inlet === 2) {
                if (typeof data === "boolean") {
                    try {
                        this.node.normalize = data;
                    } catch (e) {
                        this.error((e as Error).message);
                    }
                }
            }
        });
    }
}
