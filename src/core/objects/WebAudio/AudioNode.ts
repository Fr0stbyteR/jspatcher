import { TMeta, Bang, BaseAudioObject } from "../Base";

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
}
