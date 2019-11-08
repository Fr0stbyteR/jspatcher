import JSPAudioNode from "./AudioNode";
import { TMeta, Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";
import { TAudioNodeInletConnection, TAudioNodeOutletConnection } from "../../types";

type I = [Bang | HTMLMediaElement];
export default class Media extends JSPAudioNode<MediaElementAudioSourceNode, { element: HTMLMediaElement }, I, [null, MediaElementAudioSourceNode], [], {}> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "WebAudio MediaElementAudioSourceNode",
            inlets: [{
                isHot: true,
                type: "object",
                description: "HTMLMediaElement to construct node, bang to output MediaElementAudioSourceNode instance"
            }],
            outlets: [{
                type: "signal",
                description: "Node connection (1 channel)"
            }, {
                type: "object",
                description: "Instance: MediaElementAudioSourceNode"
            }],
            args: [],
            props: []
        };
    }
    state = { node: undefined as MediaElementAudioSourceNode, element: undefined as HTMLMediaElement };
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
        this.node = this.audioCtx.createMediaElementSource(this.state.element);
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
            } else if (data instanceof HTMLMediaElement) {
                this.state.element = data;
                this.resetNode();
                this.outlet(1, this.node);
            }
        }
        return this;
    }
}
