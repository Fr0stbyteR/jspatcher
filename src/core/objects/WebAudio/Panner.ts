import JSPAudioNode from "./AudioNode";
import { Bang } from "../Base";
import { decodeMaxCurveFormat } from "../../../utils";
import { TMeta } from "../../types";

type I = [Bang, string, string, string, string, string, string, PannerOptions];
export default class Panner extends JSPAudioNode<PannerNode, {}, I, [null, PannerNode], [], PannerOptions> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "WebAudio PannerNode",
            inlets: [{
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
                type: "string",
                description: "positionY: curve or node connection"
            }, {
                isHot: false,
                type: "string",
                description: "positionZ: curve or node connection"
            }, {
                isHot: false,
                type: "object",
                description: "options: coneInnerAngle, coneOuterAngle, coneOuterGain, distanceModel, maxDistance, orientationX, orientationY, orientationZ, panningModel, positionX, positionY, positionZ, refDistance, rolloffFactor"
            }],
            outlets: [{
                type: "signal",
                description: "Node connection (2 channel)"
            }, {
                type: "object",
                description: "Instance: PannerNode"
            }],
            args: [],
            props: [...super.meta.props, {
                name: "coneInnerAngle",
                type: "number",
                description: "Initial coneInnerAngle"
            }, {
                name: "coneOuterAngle",
                type: "number",
                description: "Initial coneOuterAngle"
            }, {
                name: "coneOuterGain",
                type: "number",
                description: "Initial coneOuterGain"
            }, {
                name: "distanceModel",
                type: "string",
                description: 'Initial distanceModel: "linear" | "inverse" | "exponential"'
            }, {
                name: "maxDistance",
                type: "number",
                description: "Initial maxDistance"
            }, {
                name: "orientationX",
                type: "number",
                description: "Initial orientationX"
            }, {
                name: "orientationY",
                type: "number",
                description: "Initial orientationY"
            }, {
                name: "orientationZ",
                type: "number",
                description: "Initial orientationZ"
            }, {
                name: "panningModel",
                type: "string",
                description: 'Initial panningModel: "equalpower" | "HRTF"'
            }, {
                name: "positionX",
                type: "number",
                description: "Initial positionX"
            }, {
                name: "positionY",
                type: "number",
                description: "Initial positionY"
            }, {
                name: "positionZ",
                type: "number",
                description: "Initial positionZ"
            }, {
                name: "refDistance",
                type: "number",
                description: "Initial refDistance"
            }, {
                name: "rolloffFactor",
                type: "number",
                description: "Initial rolloffFactor"
            }]
        };
    }
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
            this.keepAlive();
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
                    const curve = decodeMaxCurveFormat(data as string);
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
