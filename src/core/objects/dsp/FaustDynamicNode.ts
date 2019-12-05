import { FaustAudioWorkletNode, FaustScriptProcessorNode } from "faust2webaudio";
import { DefaultAudioObject } from "../Base";
import { DefaultUIState } from "../../types";

export type DefaultFaustDynamicNodeState = { merger: ChannelMergerNode; splitter: ChannelSplitterNode; node: FaustAudioWorkletNode | FaustScriptProcessorNode };
export default abstract class FaustDynamicNode<D extends {} = {}, S extends Partial<DefaultFaustDynamicNodeState> & { [key: string]: any } = {}, I extends any[] = [], O extends any[] = [], A extends any[] = [], P extends Partial<DefaultUIState> & { [key: string]: any } = {}, U extends Partial<DefaultUIState> & { [key: string]: any } = {}, E extends {} = {}> extends DefaultAudioObject<D, S & DefaultFaustDynamicNodeState, I, O, A, P, U & DefaultUIState, E> {
    get expr(): string {
        return "";
    }
    async getFaustNode() {
        const { expr } = this;
        const { faust, audioCtx, supportAudioWorklet } = this.patcher.env;
        return faust.getNode(expr, { audioCtx, useWorklet: supportAudioWorklet, plotHandler: () => undefined });
    }
    async compile() {
        this.disconnectAll();
        this.destroy();
        try {
            this.state.node = await this.getFaustNode();
            if (!this.state.node) throw new Error("Cannot compile Faust code");
        } catch (e) {
            this.error((e as Error).message);
        }
        const { audioCtx } = this.patcher.env;
        const inlets = this.state.node.getNumInputs();
        const outlets = this.state.node.getNumOutputs();
        if (inlets && !this.state.merger || this.state.merger.numberOfInputs !== inlets) {
            this.state.merger = audioCtx.createChannelMerger(inlets);
            this.state.merger.connect(this.state.node, 0, 0);
        }
        if (outlets && !this.state.splitter || this.state.splitter.numberOfOutputs !== outlets) {
            this.state.splitter = audioCtx.createChannelSplitter(outlets);
            this.state.node.connect(this.state.splitter);
        }
        this.connectAll();
    }
    handleDestroy = () => {
        if (this.state.merger) this.state.merger.disconnect();
        if (this.state.node) this.state.node.disconnect();
    };
    subscribe() {
        super.subscribe();
        this.on("destroy", this.handleDestroy);
    }
}
