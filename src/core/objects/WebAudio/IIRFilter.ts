import JSPAudioNode from "./AudioNode";
import { Bang, isBang } from "../Base";
import { isNumberArray } from "../../../utils/utils";
import { TMeta } from "../../types";

type I = [Bang, number[], number[]];
export default class IIRFilter extends JSPAudioNode<IIRFilterNode, { feedforward: number[]; feedback: number[] }, I, [null, IIRFilterNode], [number[], number[]], {}> {
    static description = "WebAudio IIRFilterNode";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Node connection (1 channel), bang to output IIRFilterNode instance"
    }, {
        isHot: false,
        type: "object",
        description: "feedforward, A sequence of coefficients, change will reconstruct the node: number[]"
    }, {
        isHot: false,
        type: "object",
        description: "feedback, A sequence of coefficients, change will reconstruct the node: number[]"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "signal",
        description: "Node connection (1 channel)"
    }, {
        type: "object",
        description: "Instance: IIRFilterNode"
    }];
    static args: TMeta["args"] = [{
        type: "object",
        optional: false,
        default: [],
        description: "feedforward, A sequence of coefficients: number[]"
    }, {
        type: "object",
        optional: false,
        default: [],
        description: "feedback, A sequence of coefficients: number[]"
    }];
    state = { node: undefined as IIRFilterNode, feedforward: [] as number[], feedback: [] as number[] };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 3;
            this.outlets = 2;
        });
        this.on("update", ({ args }) => {
            if (isNumberArray(args[0])) this.state.feedforward = args[0];
            if (isNumberArray(args[1])) this.state.feedback = args[1];
            this.resetNode();
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (isBang(data)) this.outlet(1, this.node);
            } else if (inlet === 1) {
                if (isNumberArray(data)) this.state.feedforward = data;
                this.resetNode();
            } else if (inlet === 2) {
                if (isNumberArray(data)) this.state.feedback = data;
                this.resetNode();
            }
        });
    }
    resetNode() {
        this.disconnectAudio();
        this.node = this.audioCtx.createIIRFilter(this.state.feedforward, this.state.feedback);
        this.node.channelInterpretation = "discrete";
        this.inletAudioConnections[0] = { node: this.node, index: 0 };
        this.outletAudioConnections[0] = { node: this.node, index: 0 };
        this.connectAudio();
    }
}
