import JSPAudioNode from "./AudioNode";
import { Bang } from "../Base";
import { TMeta } from "../../types";

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
                description: "Node connection"
            }, {
                type: "object",
                description: "Instance: MediaElementAudioSourceNode"
            }],
            args: [],
            props: []
        };
    }
    state = { node: undefined as MediaElementAudioSourceNode, element: undefined as HTMLMediaElement };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 2;
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (data instanceof Bang) {
                    if (this.node) this.outlet(1, this.node);
                } else if (data instanceof HTMLMediaElement) {
                    this.state.element = data;
                    this.resetNode();
                    this.outlet(1, this.node);
                }
            }
        });
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
}
