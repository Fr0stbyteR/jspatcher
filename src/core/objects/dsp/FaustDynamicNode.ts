import { FaustAudioWorkletNode, FaustScriptProcessorNode } from "faust2webaudio";
import { DefaultAudioObject } from "../Base";
import { DefaultUIState } from "../../types";

export type DefaultFaustDynamicNodeState = { merger: ChannelMergerNode; splitter: ChannelSplitterNode; node: FaustAudioWorkletNode | FaustScriptProcessorNode };
export default abstract class FaustDynamicNode<D extends {} = {}, S extends Partial<DefaultFaustDynamicNodeState> & { [key: string]: any } = {}, I extends any[] = [], O extends any[] = [], A extends any[] = [], P extends Partial<DefaultUIState> & { [key: string]: any } = {}, U extends Partial<DefaultUIState> & { [key: string]: any } = {}, E extends {} = {}> extends DefaultAudioObject<D, S & DefaultFaustDynamicNodeState, I, O, A, P, U & DefaultUIState, E> {
    async getFaustNode(code: string, voices: number) {
        const { faust, audioCtx, supportAudioWorklet } = this.patcher.env;
        return faust.getNode(code, { audioCtx, useWorklet: supportAudioWorklet, voices, args: { "-I": ["libraries/", "project/"] } });
    }
    async compile(code: string, voices: number) {
        let splitter: ChannelSplitterNode;
        let merger: ChannelMergerNode;
        const node = await this.getFaustNode(code, voices);
        if (!node) throw new Error("Cannot compile Faust code");
        node.channelInterpretation = "discrete";
        node.channelCountMode = "explicit";
        const { audioCtx } = this.patcher.env;
        const inlets = node.getNumInputs();
        const outlets = node.getNumOutputs();
        if (inlets) {
            merger = audioCtx.createChannelMerger(inlets);
            merger.channelInterpretation = "discrete";
            merger.channelCountMode = "explicit";
            merger.connect(node, 0, 0);
        }
        if (outlets) {
            splitter = audioCtx.createChannelSplitter(outlets);
            node.connect(splitter, 0, 0);
        }
        return { inlets, outlets, node, splitter, merger };
    }
}
