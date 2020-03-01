import { SemanticICONS } from "semantic-ui-react";
import { Bang, DefaultAudioObject } from "../Base";

export default abstract class JSPAudioNode<T extends AudioNode = AudioNode, S = {}, I extends [Bang?, ...any[]] = [], O extends (null | any | T)[] = [], A extends any[] = any[], P = {}> extends DefaultAudioObject<{}, { node: T } & S, I, O, A, P> {
    static package = "WebAudio";
    static icon: SemanticICONS = "volume up";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "WebAudio Nodes implementation";
    set node(nodeIn: T) {
        this.state.node = nodeIn;
    }
    get node() {
        return this.state.node;
    }
}
