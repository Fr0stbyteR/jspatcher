import JSPAudioNode from "./AudioNode";
import { TMeta, Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";
import { TAudioNodeInletConnection, TAudioNodeOutletConnection } from "../../types";

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
                description: "Node connection (1 channel)"
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
    keepAlive() {
        this.node.connect(this.dummyAudioNode, 0, 0);
    }
    destroy() {
        if (this.node) this.node.disconnect();
        return this;
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
