import JSPAudioNode from "./AudioNode";
import { TMeta } from "../../types";

export default class AnyNode extends JSPAudioNode<AudioNode, {}, [AudioNode, ...null[]], null[]> {
    static description = "WebAudio AudioNode";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Node connection, AudioNode instance to set the node."
    }, {
        isHot: false,
        type: "signal",
        description: "Node connection"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "signal",
        description: "Node connection"
    }];
    state = { node: undefined as AudioNode };
    _meta: TMeta = AnyNode.meta;
    get meta() {
        return this._meta;
    }
    handleInlet: (e: { data: any; inlet: number }) => void = ({ data, inlet }) => {
        if (inlet === 0) {
            try {
                if (data instanceof AudioNode) {
                    this.disconnectAll();
                    this.handleDestroy();
                    this.state.node = data;
                    const inlets = this.node.numberOfInputs || 1;
                    const outlets = this.node.numberOfOutputs;
                    const factoryMeta = AnyNode.meta;
                    const inlet0 = factoryMeta.inlets[0];
                    const inlet1 = factoryMeta.inlets[1];
                    const outlet0 = factoryMeta.inlets[0];
                    this.inletConnections = [{ node: this.node, index: 0 }];
                    factoryMeta.inlets = [inlet0];
                    for (let i = 1; i < inlets; i++) {
                        factoryMeta.inlets[i] = inlet1;
                    }
                    for (let i = 0; i < outlets; i++) {
                        factoryMeta.outlets[i] = outlet0;
                    }
                    for (let i = 0; i < this.node.numberOfInputs; i++) {
                        this.inletConnections[i] = { node: this.node, index: i };
                    }
                    for (let i = 0; i < this.node.numberOfOutputs; i++) {
                        this.outletConnections[i] = { node: this.node, index: i };
                    }
                    this._meta = factoryMeta;
                    this.inlets = inlets;
                    this.outlets = outlets;
                    this.keepAlive();
                    this.connectAll();
                }
            } catch (e) {
                this.error((e as Error).message);
                return this;
            }
        }
        return this;
    }
    subscribe() {
        super.subscribe();
        this.on("inlet", this.handleInlet);
    }
}
