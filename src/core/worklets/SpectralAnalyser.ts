import processorURL from "./SpectralAnalyser.worklet.ts"; // eslint-disable-line import/extensions
import AudioWorkletProxyNode from "./AudioWorkletProxyNode";
import { ISpectralAnalyserNode, ISpectralAnalyserProcessor, SpectralAnalyserParameters } from "./SpectralAnalyserWorklet.types";
import AudioWorkletRegister from "./AudioWorkletRegister";

export const processorID = "__JSPatcher_SpectralAnalyser";
export default class SpectralAnalyserNode extends AudioWorkletProxyNode<ISpectralAnalyserNode, ISpectralAnalyserProcessor, SpectralAnalyserParameters> implements ISpectralAnalyserNode {
    static processorID = processorID;
    static register = (audioWorklet: AudioWorklet) => AudioWorkletRegister.register(audioWorklet, processorID, processorURL);
    static fnNames: (keyof ISpectralAnalyserProcessor)[] = ["getBuffer", "getLastAmplitudes", "getAllAmplitudes", "getAllAmplitudes", "getEstimatedFreq", "getCentroid", "getFlatness", "getFlux", "getKurtosis", "getSkewness", "getRolloff", "getSlope", "getSpread", "gets", "destroy"];
    constructor(context: BaseAudioContext) {
        super(context, processorID, { numberOfInputs: 1, numberOfOutputs: 0 });
        const _destroy = this.destroy;
        this.destroy = async () => {
            await _destroy.call(this);
            this.port.close();
        };
    }
}
