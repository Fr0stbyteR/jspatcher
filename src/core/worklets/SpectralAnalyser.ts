import processorURL from "./SpectralAnalyser.worklet.ts"; // eslint-disable-line import/extensions
import AudioWorkletProxyNode from "./AudioWorkletProxyNode";
import { ISpectralAnalyserNode, ISpectralAnalyserProcessor, SpectralAnalyserParameters } from "./SpectralAnalyserWorklet.types";
import AudioWorkletRegister from "./AudioWorkletRegister";

export const processorId = "__JSPatcher_SpectralAnalyser";
export default class SpectralAnalyserNode extends AudioWorkletProxyNode<ISpectralAnalyserNode, ISpectralAnalyserProcessor, SpectralAnalyserParameters> implements ISpectralAnalyserNode {
    static processorId = processorId;
    static register = (audioWorklet: AudioWorklet) => AudioWorkletRegister.register(audioWorklet, processorId, processorURL);
    static fnNames: (keyof ISpectralAnalyserProcessor)[] = ["getBuffer", "getLastAmplitudes", "getAllAmplitudes", "getAllAmplitudes", "getEstimatedFreq", "getCentroid", "getFlatness", "getFlux", "getKurtosis", "getSkewness", "getRolloff", "getSlope", "getSpread", "gets", "destroy"];
    constructor(context: BaseAudioContext) {
        super(context, processorId, { numberOfInputs: 1, numberOfOutputs: 0 });
        const _destroy = this.destroy;
        this.destroy = async () => {
            await _destroy.call(this);
            this._disposed = true;
        };
    }
}
