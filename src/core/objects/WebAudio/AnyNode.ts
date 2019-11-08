import JSPAudioNode from "./AudioNode";
import { TMeta } from "../Base";

export default class AnyNode extends JSPAudioNode<AudioNode, {}, [AudioNode, ...null[]], null[]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "WebAudio AudioNode",
            inlets: [{
                isHot: true,
                type: "signal",
                description: "Node connection, AudioNode instance to set the node."
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
    state = { node: undefined as AudioNode };
    _meta: TMeta = AnyNode.meta;
    get meta() {
        return this._meta;
    }
    keepAlive() {
        if (this.node.numberOfOutputs) this.node.connect(this.dummyAudioNode, 0, 0);
        else if (this.node.numberOfInputs) this.dummyAudioNode.connect(this.node, 0, 0);
    }
    destroy() {
        this.node.disconnect();
        return this;
    }
    fn<I extends [AudioNode], $ extends keyof Pick<I, number>>(data: I[$], inlet: $) {
        if (inlet === 0) {
            try {
                if (data instanceof AudioNode) {
                    this.disconnectAll();
                    this.state.node = data;
                    this.keepAlive();
                    this.inlets = this.node.numberOfInputs || 1;
                    this.outlets = this.node.numberOfOutputs;
                    const factoryMeta = AnyNode.meta;
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
