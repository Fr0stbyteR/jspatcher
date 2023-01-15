import type { FaustAudioWorkletNode, FaustScriptProcessorNode } from "@shren/faustwasm/dist/esm";
import DefaultObject from "../base/DefaultObject";
import type { DefaultUIState } from "../base/DefaultUI";

export interface DefaultFaustDynamicNodeState {
    merger: ChannelMergerNode;
    splitter: ChannelSplitterNode;
    node: (FaustAudioWorkletNode | FaustScriptProcessorNode) & { dspCode?: string };
}

export default abstract class FaustDynamicNode<
    D extends {} = {},
    S extends Partial<DefaultFaustDynamicNodeState> & Record<string, any> = {},
    I extends any[] = any[],
    O extends any[] = any[],
    A extends any[] = any[],
    P extends Partial<DefaultUIState> & Record<string, any> = {},
    U extends Partial<DefaultUIState> & Record<string, any> = {},
    E extends {} = {}
> extends DefaultObject<D, S & DefaultFaustDynamicNodeState, I, O, A, P, U & DefaultUIState, E> {
    async getFaustNode(code: string, voices: number) {
        const { audioCtx } = this.patcher;
        const { FaustMonoDspGenerator, FaustPolyDspGenerator } = this.env.Faust;
        const faustCompiler = await this.env.getFaustCompiler();
        if (voices) {
            const generator = new FaustPolyDspGenerator();
            await generator.compile(faustCompiler, "FaustDSP", code, "");
            return generator.createNode(audioCtx, voices);
        }
        const generator = new FaustMonoDspGenerator();
        await generator.compile(faustCompiler, "FaustDSP", code, "");
        return generator.createNode(audioCtx);
    }
    async compile(code: string, voices: number) {
        let splitter: ChannelSplitterNode;
        let merger: ChannelMergerNode;
        const node: DefaultFaustDynamicNodeState["node"] = await this.getFaustNode(code, voices);
        if (!node) throw new Error("Cannot compile Faust code");
        node.channelInterpretation = "discrete";
        node.dspCode = code;
        const { audioCtx } = this.patcher;
        const inlets = node.getNumInputs();
        const outlets = node.getNumOutputs();
        if (inlets) {
            merger = audioCtx.createChannelMerger(inlets);
            merger.channelInterpretation = "discrete";
            merger.connect(node, 0, 0);
        }
        if (outlets) {
            splitter = audioCtx.createChannelSplitter(outlets);
            node.connect(splitter, 0, 0);
        }
        return { inlets, outlets, node, splitter, merger };
    }
}
