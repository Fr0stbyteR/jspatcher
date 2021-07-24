import processorURL from "./Patcher.worklet.ts"; // eslint-disable-line import/extensions
import AudioWorkletProxyNode from "./AudioWorkletProxyNode";
import AudioWorkletRegister from "./AudioWorkletRegister";
import { IPatcherNode, IPatcherProcessor, PatcherOptions, PatcherParameters } from "./PatcherWorklet.types";

const processorID = "__JSPatcher_Patcher";

export default class PatcherNode extends AudioWorkletProxyNode<IPatcherNode, IPatcherProcessor, PatcherParameters, PatcherOptions> implements IPatcherNode {
    static processorID = processorID;
    static register = (audioWorklet: AudioWorklet) => AudioWorkletRegister.register(audioWorklet, processorID, processorURL);
    static fnNames: (keyof IPatcherProcessor)[] = [] as never[];
    constructor(context: BaseAudioContext, options: { instanceId: string }) {
        super(context, processorID, {
            numberOfInputs: 1,
            numberOfOutputs: 1,
            processorOptions: { instanceId: options.instanceId }
        });
    }
}
