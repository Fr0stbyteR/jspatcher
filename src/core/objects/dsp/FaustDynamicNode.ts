/*
import { DefaultAudioObject } from "../Base";
import { FaustAudioWorkletNode, FaustScriptProcessorNode } from "faust2webaudio";

export default class FaustDynamicNode extends DefaultAudioObject<{}, { merger: ChannelMergerNode, splitter: ChannelSplitterNode, node: FaustAudioWorkletNode | FaustScriptProcessorNode }> {
    get expr(): string {
        return ""
    }
    async getFaustNode() {
        const { expr } = this;
        const { faustPromise, audioCtx, supportAudioWorklet } = this.patcher.env;
        const faust = await faustPromise;
        return faust.getNode(expr, { audioCtx, useWorklet: supportAudioWorklet, plotHandler: () => { } });
    }
}
*/
