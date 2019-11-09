import { Bang, BaseAudioObject } from "../Base";
import { TMeta } from "../../types";

export default abstract class JSPAudioNode<T extends AudioNode = AudioNode, S = {}, I extends [Bang?, ...any[]] = [], O extends (null | any | T)[] = [], A extends any[] = [], P = {}> extends BaseAudioObject<{}, { node: T } & S, I, O, A, P> {
    static get _meta(): TMeta {
        return {
            ...super.meta,
            package: "WebAudio",
            icon: "volume up",
            author: "Fr0stbyteR",
            version: "1.0.0",
            description: "WebAudio Nodes implementation"
        };
    }
    set node(nodeIn: T) {
        this.state.node = nodeIn;
    }
    get node() {
        return this.state.node;
    }
    keepAlive() {
        if (!this.node) return this;
        if (this.node.numberOfOutputs) this.node.connect(this.dummyAudioNode, 0, 0);
        else if (this.node.numberOfInputs) this.dummyAudioNode.connect(this.node, 0, 0);
        return this;
    }
    destroy() {
        if (this.node) this.node.disconnect();
        return this;
    }
}
