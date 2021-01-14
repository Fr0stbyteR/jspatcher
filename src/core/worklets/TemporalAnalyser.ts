import processorURL from "./TemporalAnalyser.worklet.ts"; // eslint-disable-line import/extensions
import AudioWorkletProxyNode from "./AudioWorkletProxyNode";
import { ITemporalAnalyserNode, ITemporalAnalyserProcessor, TemporalAnalyserParameters } from "./TemporalAnalyserWorklet.types";
import AudioWorkletRegister from "./AudioWorkletRegister";

export const processorID = "__JSPatcher_TemporalAnalyser";
export default class TemporalAnalyserNode extends AudioWorkletProxyNode<ITemporalAnalyserNode, ITemporalAnalyserProcessor, TemporalAnalyserParameters> implements ITemporalAnalyserNode {
    static processorID = processorID;
    static register = (audioWorklet: AudioWorklet) => AudioWorkletRegister.register(audioWorklet, processorID, processorURL);
    static fnNames: (keyof ITemporalAnalyserProcessor)[] = ["getRMS", "getAbsMax", "getZCR", "getEstimatedFreq", "getBuffer", "destroy"];
    constructor(context: BaseAudioContext) {
        super(context, processorID, { numberOfInputs: 1, numberOfOutputs: 0 });
        const _destroy = this.destroy;
        this.destroy = async () => {
            await _destroy.call(this);
            this.port.close();
        };
    }
}
