import JSPAudioNode from "./AudioNode";
import { Bang, isBang } from "../base/index.jspatpkg";
import { decodeLine } from "../../../utils/utils";
import { IJSPatcherObjectMeta, TBPF, IPropsMeta } from "../../types";

type I = [Bang, TBPF, TBPF, TBPF, TBPF, TBPF, TBPF, PannerOptions];
export default class Panner extends JSPAudioNode<PannerNode, {}, I, [null, PannerNode], [], PannerOptions> {
    static description = "WebAudio PannerNode";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Node connection, bang to output PannerNode instance"
    }, {
        isHot: false,
        type: "signal",
        description: "orientationX: bpf or node connection"
    }, {
        isHot: false,
        type: "signal",
        description: "orientationY: bpf or node connection"
    }, {
        isHot: false,
        type: "signal",
        description: "orientationZ: bpf or node connection"
    }, {
        isHot: false,
        type: "signal",
        description: "positionX: bpf or node connection"
    }, {
        isHot: false,
        type: "signal",
        description: "positionY: bpf or node connection"
    }, {
        isHot: false,
        type: "signal",
        description: "positionZ: bpf or node connection"
    }, {
        isHot: false,
        type: "object",
        description: "options: coneInnerAngle, coneOuterAngle, coneOuterGain, distanceModel, maxDistance, orientationX, orientationY, orientationZ, panningModel, positionX, positionY, positionZ, refDistance, rolloffFactor"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "signal",
        description: "Node connection (2 channel)"
    }, {
        type: "object",
        description: "Instance: PannerNode"
    }];
    static props: IPropsMeta<PannerOptions> = {
        coneInnerAngle: {
            type: "number",
            default: 360,
            description: "Initial coneInnerAngle"
        },
        coneOuterAngle: {
            type: "number",
            default: 0,
            description: "Initial coneOuterAngle"
        },
        coneOuterGain: {
            type: "number",
            default: 0,
            description: "Initial coneOuterGain"
        },
        distanceModel: {
            type: "enum",
            enums: ["linear", "inverse", "exponential"],
            default: "inverse",
            description: 'Initial distanceModel: "linear" | "inverse" | "exponential"'
        },
        maxDistance: {
            type: "number",
            default: 10000,
            description: "Initial maxDistance"
        },
        orientationX: {
            type: "number",
            default: 1,
            description: "Initial orientationX"
        },
        orientationY: {
            type: "number",
            default: 0,
            description: "Initial orientationY"
        },
        orientationZ: {
            type: "number",
            default: 0,
            description: "Initial orientationZ"
        },
        panningModel: {
            type: "enum",
            enums: ["equalpower", "HRTF"],
            default: "equalpower",
            description: 'Initial panningModel: "equalpower" | "HRTF"'
        },
        positionX: {
            type: "number",
            default: 0,
            description: "Initial positionX"
        },
        positionY: {
            type: "number",
            default: 0,
            description: "Initial positionY"
        },
        positionZ: {
            type: "number",
            default: 0,
            description: "Initial positionZ"
        },
        refDistance: {
            type: "number",
            default: 1,
            description: "Initial refDistance"
        },
        rolloffFactor: {
            type: "number",
            default: 1,
            description: "Initial rolloffFactor"
        }
    };
    state = { node: this.audioCtx.createPanner() };
    inletAudioConnections = [{ node: this.node, index: 0 }, { node: this.node.orientationX }, { node: this.node.orientationY }, { node: this.node.orientationZ }, null, { node: this.node.positionX }, { node: this.node.positionY }, { node: this.node.positionZ }];
    outletAudioConnections = [{ node: this.node, index: 0 }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 8;
            this.outlets = 2;
            this.node.channelInterpretation = "discrete";
        });
        this.on("updateProps", (props) => {
            const paramMap = ["orientationX", "orientationY", "orientationZ", "positionX", "positionY", "positionZ"] as const;
            const numberParamMap = ["coneInnerAngle", "coneOuterAngle", "coneOuterGain", "maxDistance", "refDistance", "rolloffFactor"] as const;
            try {
                paramMap.forEach((key) => {
                    if (typeof props[key] === "number") this.node[key].setValueAtTime(props[key], this.audioCtx.currentTime);
                });
                numberParamMap.forEach((key) => {
                    if (typeof props[key] === "number") this.node[key] = props[key];
                });
                if (typeof props.distanceModel === "string") this.node.distanceModel = props.distanceModel;
                if (typeof props.panningModel === "string") this.node.panningModel = props.panningModel;
            } catch (e) {
                this.error(e.message);
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            const paramMap = ["orientationX", "orientationY", "orientationZ", "positionX", "positionY", "positionZ"] as const;
            const numberParamMap = ["coneInnerAngle", "coneOuterAngle", "coneOuterGain", "maxDistance", "refDistance", "rolloffFactor"] as const;
            if (inlet === 0) {
                if (isBang(data)) this.outlet(1, this.node);
            } else if (inlet > 0 && inlet < 7) {
                try {
                    const bpf = decodeLine(data as TBPF);
                    this.applyBPF(this.node[paramMap[inlet - 1]], bpf);
                } catch (e) {
                    this.error(e.message);
                }
            } else if (inlet === 7) {
                if (typeof data === "object") {
                    const props = data as PannerOptions;
                    try {
                        paramMap.forEach((key) => {
                            if (typeof props[key] === "number") this.node[key].setValueAtTime(props[key], this.audioCtx.currentTime);
                        });
                        numberParamMap.forEach((key) => {
                            if (typeof props[key] === "number") this.node[key] = props[key];
                        });
                        if (typeof props.distanceModel === "string") this.node.distanceModel = props.distanceModel;
                        if (typeof props.panningModel === "string") this.node.panningModel = props.panningModel;
                    } catch (e) {
                        this.error(e.message);
                    }
                }
            }
        });
    }
}
