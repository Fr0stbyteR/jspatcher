// @deprecated

import type { FaustDspFactory } from "@grame/faustwasm";
import processorURL from "./FaustFFTProcessor.worklet.ts"; // eslint-disable-line import/extensions
import AudioWorkletProxyNode from "./AudioWorkletProxyNode";
import type { FaustFFTParameters, IFaustFFTNode, IFaustFFTProcessor } from "./FaustFFT.types";
import AudioWorkletRegister from "./AudioWorkletRegister";

export const processorId = "__JSPatcher_FaustFFTProcessor";
export default class FaustFFTNode extends AudioWorkletProxyNode<IFaustFFTNode, IFaustFFTProcessor, FaustFFTParameters> implements IFaustFFTNode {
    static processorId = processorId;
    static register = (audioWorklet: AudioWorklet) => AudioWorkletRegister.register(audioWorklet, processorId, processorURL);
    static fnNames: (keyof IFaustFFTProcessor)[] = ["setProcessorParamValue", "destroy"];
    dspCode: string;
    inputChannels: number;
    outputChannels: number;
    constructor(context: BaseAudioContext, options: { channelCount: number; outputChannelCount: number[]; processorOptions: { factory: FaustDspFactory } }) {
        super(context, processorId, { numberOfInputs: 1, numberOfOutputs: 1, channelCountMode: "explicit", channelInterpretation: "discrete", ...options });
        this.inputChannels = options.channelCount;
        this.outputChannels = options.outputChannelCount[0];
        const _destroy = this.destroy;
        this.destroy = async () => {
            await _destroy.call(this);
            this._disposed = true;
        };
    }
}
