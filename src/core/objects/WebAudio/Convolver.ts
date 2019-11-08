import JSPAudioNode from "./AudioNode";
import { TMeta, Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";

type I = [Bang, AudioBuffer, boolean];
type O = [null, ConvolverNode];
export default class Convolver extends JSPAudioNode<ConvolverNode, {}, I, O, [], { normalize: boolean }> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "WebAudio ConvolverNode",
            inlets: [{
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
            }],
            outlets: [{
                type: "signal",
                description: "Node connection (2-4 channels)"
            }, {
                type: "object",
                description: "Instance: ConvolverNode"
            }],
            args: [],
            props: [{
                name: "normalize",
                type: "boolean",
                description: "Controls whether the impulse response from the buffer will be scaled by an equal-power normalization"
            }]
        };
    }
    state = { node: this.audioCtx.createConvolver() };
    inletConnections = [{ node: this.node, index: 0 }];
    outletConnections = [{ node: this.node, index: 0 }];
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 3;
        this.outlets = 2;
        this.node.channelInterpretation = "discrete";
        this.node.channelCountMode = "explicit";
        this.keepAlive();
        this.update((box as Box<this>).args, (box as Box<this>).props);
    }
    keepAlive() {
        this.node.connect(this.dummyAudioNode, 0, 0);
    }
    destroy() {
        this.node.disconnect();
        return this;
    }
    update(args?: [], props?: { normalize?: boolean }) {
        this.updateBox(args, props);
        if (props) {
            try {
                if (typeof props.normalize === "boolean") this.node.normalize = props.normalize;
            } catch (e) {
                this.error((e as Error).message);
            }
        }
        return this;
    }
    fn<$ extends keyof Pick<I, number>>(data: I[$], inlet: $) {
        if (inlet === 0) {
            if (data instanceof Bang) this.outlet(1, this.node);
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
        return this;
    }
}
