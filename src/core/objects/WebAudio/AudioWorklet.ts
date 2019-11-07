import { TMeta, Bang, BaseObject } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";
import JSPAudioNode from "./AudioNode";

export class audioWorklet extends BaseObject<{}, {}, [Bang, string], [AudioWorklet, Bang]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Get currrent patcher's audio worklet from context",
            inlets: [{
                isHot: true,
                type: "bang",
                description: "Output current audio worklet"
            }, {
                isHot: true,
                type: "string",
                description: "Code to add as module"
            }],
            outlets: [{
                type: "object",
                description: "Current audio worklet"
            }, {
                type: "bang",
                description: "Output a bang while module is added"
            }],
            args: [],
            props: []
        };
    }
    state = {};
    audioWorklet: AudioWorklet;
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 2;
        this.outlets = 2;
        if (!this.patcher.env.audioCtx.audioWorklet) this.error("AudioWorklet not found.");
        else this.audioWorklet = this.patcher.env.audioCtx.audioWorklet;
    }
    fn<I extends [Bang, string], $ extends keyof Pick<I, number>>(data: I[$], inlet: $) {
        if (inlet === 0) {
            if (data instanceof Bang) this.outlet(0, this.audioWorklet);
        } else if (inlet === 1) {
            if (typeof data === "string") {
                try {
                    const url = window.URL.createObjectURL(new Blob([data], { type: "text/javascript" }));
                    this.audioWorklet.addModule(url)
                        .then(() => this.outlet(1, new Bang()))
                        .catch((e: Error) => this.error(e.message));
                } catch (e) {
                    this.error((e as Error).message);
                }
            }
        }
        return this;
    }
}
export class JSPAudioWorklet extends JSPAudioNode<AudioWorkletNode, {}, [AudioWorkletNode, ...null[]], null[]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "WebAudio AudioWorkletNode",
            inlets: [{
                isHot: true,
                type: "signal",
                description: "Node connection, AudioWorkletNode instance to set the node."
            }, {
                isHot: false,
                type: "signal",
                description: "Node connection"
            }],
            outlets: [{
                type: "signal",
                description: "Node connection"
            }],
            args: [],
            props: []
        };
    }
    state = { node: undefined as AudioWorkletNode };
    _meta: TMeta = JSPAudioWorklet.meta;
    get meta() {
        return this._meta;
    }
    keepAlive() {
        if (this.node.numberOfOutputs) this.node.connect(this.patcher.env.dummyAudioNode, 0, 0);
        else if (this.node.numberOfInputs) this.patcher.env.dummyAudioNode.connect(this.node, 0, 0);
    }
    destroy() {
        this.node.disconnect();
        return this;
    }
    fn<I extends [AudioWorkletNode], $ extends keyof Pick<I, number>>(data: I[$], inlet: $) {
        if (inlet === 0) {
            try {
                if (data instanceof window.AudioWorkletNode) {
                    this.disconnectAll();
                    this.state.node = data;
                    this.keepAlive();
                    this.inlets = this.node.numberOfInputs || 1;
                    this.outlets = this.node.numberOfOutputs;
                    const factoryMeta = JSPAudioWorklet.meta;
                    const inlet0 = factoryMeta.inlets[0];
                    const inlet1 = factoryMeta.inlets[1];
                    const outlet0 = factoryMeta.inlets[0];
                    this.inletConnections = [{ node: this.node, index: 0 }];
                    factoryMeta.inlets = [inlet0];
                    for (let i = 1; i < this.inlets; i++) {
                        factoryMeta.inlets[i] = inlet1;
                    }
                    for (let i = 0; i < this.outlets; i++) {
                        factoryMeta.outlets[i] = outlet0;
                    }
                    for (let i = 0; i < this.node.numberOfInputs; i++) {
                        this.inletConnections[i] = { node: this.node, index: i };
                    }
                    for (let i = 0; i < this.node.numberOfOutputs; i++) {
                        this.outletConnections[i] = { node: this.node, index: i };
                    }
                    this._meta = factoryMeta;
                    this.connectAll();
                }
            } catch (e) {
                this.error((e as Error).message);
                return this;
            }
        }
        return this;
    }
}
