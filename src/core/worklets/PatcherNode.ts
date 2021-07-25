import processorURL from "./Patcher.worklet.ts"; // eslint-disable-line import/extensions
import AudioWorkletProxyNode from "./AudioWorkletProxyNode";
import AudioWorkletRegister from "./AudioWorkletRegister";
import type Patcher from "../patcher/Patcher";
import type { PatcherEventMap } from "../patcher/Patcher";
import type { IPatcherNode, IPatcherProcessor, PatcherOptions, PatcherParameters } from "./PatcherWorklet.types";
import type { IJSPatcherEnv } from "../Env";

const processorID = "__JSPatcher_Patcher";

export default class PatcherNode extends AudioWorkletProxyNode<IPatcherNode, IPatcherProcessor, PatcherParameters, PatcherOptions> implements IPatcherNode {
    static processorID = processorID;
    static register = (audioWorklet: AudioWorklet) => AudioWorkletRegister.register(audioWorklet, processorID, processorURL);
    static fnNames: (keyof IPatcherProcessor)[] = ["fn", "edit"];
    readonly patcher: Patcher;
    constructor(context: BaseAudioContext, options: { env: IJSPatcherEnv; instanceId: string }) {
        super(context, processorID, {
            numberOfInputs: 1,
            numberOfOutputs: 1,
            processorOptions: { instanceId: options.instanceId }
        });
        this.patcher = options.env.getInstanceById(options.instanceId) as Patcher;
        this.patcher.on("remoteEdit", this.handleRemoteEdit);
        this.patcher.on("inlet", this.handleInlet);
    }
    handleRemoteEdit = (e: PatcherEventMap["remoteEdit"]) => this.edit(e);
    handleInlet = (e: PatcherEventMap["inlet"]) => this.fn(e.data, e.inlet);
    outlet(port: number, data: any) {
        this.patcher.outlet(port, data);
    }
}
