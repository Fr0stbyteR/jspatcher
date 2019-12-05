import JSPAudioNode from "./AudioNode";
import { Bang } from "../Base";
import { decodeCurve } from "../../../utils";
import { TMeta, TCurve } from "../../types";

type I = [Bang, TCurve, TCurve, TCurve, TCurve, TCurve, TCurve, PannerOptions];
export default class Panner extends JSPAudioNode<PannerNode, {}, I, [null, PannerNode], [], PannerOptions> {
    static description = "WebAudio PannerNode";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Node connection, bang to output PannerNode instance"
    }, {
        isHot: false,
        type: "signal",
        description: "orientationX: curve or node connection"
    }, {
        isHot: false,
        type: "signal",
        description: "orientationY: curve or node connection"
    }, {
        isHot: false,
        type: "signal",
        description: "orientationZ: curve or node connection"
    }, {
        isHot: false,
        type: "signal",
        description: "positionX: curve or node connection"
    }, {
        isHot: false,
        type: "signal",
        description: "positionY: curve or node connection"
    }, {
        isHot: false,
        type: "signal",
        description: "positionZ: curve or node connection"
    }, {
        isHot: false,
        type: "object",
        description: "options: coneInnerAngle, coneOuterAngle, coneOuterGain, distanceModel, maxDistance, orientationX, orientationY, orientationZ, panningModel, positionX, positionY, positionZ, refDistance, rolloffFactor"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "signal",
        description: "Node connection (2 channel)"
    }, {
        type: "object",
        description: "Instance: PannerNode"
    }];
    static props: TMeta["props"] = {
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
    inletConnections = [{ node: this.node, index: 0 }, { node: this.node.orientationX }, { node: this.node.orientationY }, { node: this.node.orientationZ }, null, { node: this.node.positionX }, { node: this.node.positionY }, { node: this.node.positionZ }];
    outletConnections = [{ node: this.node, index: 0 }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 8;
            this.outlets = 2;
            this.node.channelInterpretation = "discrete";
            this.node.channelCountMode = "explicit";
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
                if (data instanceof Bang) this.outlet(1, this.node);
            } else if (inlet > 0 && inlet < 7) {
                try {
                    const curve = decodeCurve(data as TCurve);
                    JSPAudioNode.applyCurve(this.node[paramMap[inlet - 1]], curve, this.audioCtx);
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
