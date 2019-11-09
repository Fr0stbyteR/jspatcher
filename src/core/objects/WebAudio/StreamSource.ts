import JSPAudioNode from "./AudioNode";
import { Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";
import { TAudioNodeInletConnection, TAudioNodeOutletConnection, TMeta } from "../../types";

type I = [Bang | MediaStream];
export default class StreamSrc extends JSPAudioNode<MediaStreamAudioSourceNode, { stream: MediaStream }, I, [null, MediaStreamAudioSourceNode], [], {}> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "WebAudio MediaStreamAudioSourceNode",
            inlets: [{
                isHot: true,
                type: "object",
                description: "MediaStream to construct node, bang to output MediaStreamAudioSourceNode instance"
            }],
            outlets: [{
                type: "signal",
                description: "Node connection"
            }, {
                type: "object",
                description: "Instance: MediaStreamAudioSourceNode"
            }],
            args: [],
            props: []
        };
    }
    state = { node: undefined as MediaStreamAudioSourceNode, stream: undefined as MediaStream };
    inletConnections: TAudioNodeInletConnection[] = [];
    outletConnections: TAudioNodeOutletConnection[] = [];
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 1;
        this.outlets = 2;
    }
    resetNode() {
        this.disconnectAll();
        this.destroy();
        this.node = this.audioCtx.createMediaStreamSource(this.state.stream);
        this.node.channelInterpretation = "discrete";
        this.node.channelCountMode = "explicit";
        this.outletConnections[0] = { node: this.node, index: 0 };
        this.keepAlive();
        this.connectAll();
    }
    fn<$ extends keyof Pick<I, number>>(data: I[$], inlet: $) {
        if (inlet === 0) {
            if (data instanceof Bang) {
                if (this.node) this.outlet(1, this.node);
            } else if (data instanceof MediaStream) {
                this.state.stream = data;
                this.resetNode();
                this.outlet(1, this.node);
            }
        }
        return this;
    }
}
