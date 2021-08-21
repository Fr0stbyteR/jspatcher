import processorURL from "./Patcher.worklet.ts"; // eslint-disable-line import/extensions
import AudioWorkletProxyNode from "./AudioWorkletProxyNode";
import AudioWorkletRegister from "./AudioWorkletRegister";
import type Patcher from "../patcher/Patcher";
import type { PatcherEventMap } from "../patcher/Patcher";
import type { IPatcherNode, IPatcherProcessor, PatcherOptions, PatcherParameters } from "./PatcherWorklet.types";
import type { IJSPatcherEnv } from "../Env";

const processorId = "__JSPatcher_Patcher";

export default class PatcherNode extends AudioWorkletProxyNode<IPatcherNode, IPatcherProcessor, PatcherParameters, PatcherOptions> implements IPatcherNode {
    static processorId = processorId;
    static register = (audioWorklet: AudioWorklet) => AudioWorkletRegister.register(audioWorklet, processorId, processorURL);
    static fnNames: (keyof IPatcherProcessor)[] = ["init", "fn", "sync", "objectEmit", "destroy"];
    readonly patcher: Patcher;
    constructor(context: BaseAudioContext, options: { env: IJSPatcherEnv; inputs: number; outputs: number } & PatcherOptions) {
        super(context, processorId, {
            numberOfInputs: options.inputs,
            numberOfOutputs: options.outputs,
            channelCountMode: "explicit",
            channelInterpretation: "discrete",
            processorOptions: { instanceId: options.instanceId, fileId: options.fileId, data: options.data }
        });
        this.patcher = options.env.getInstanceById(options.instanceId) as Patcher;
        this.patcher.on("changed", this.handleChanged);
        this.patcher.on("dataInput", this.handleInput);
        this.patcher.on("destroy", this.handleDestroy);
        const _destroy = this.destroy;
        this.destroy = async () => {
            await _destroy.call(this);
            this._disposed = true;
        };
    }
    handleChanged = () => {
        const syncData = this.patcher.history.getSyncData();
        this.sync(syncData);
    };
    handleInput = (e: PatcherEventMap["dataInput"]) => this.fn(e.data, e.inlet);
    handleDestroy = () => this.destroy();
    outlet(port: number, data: any) {
        this.patcher.outlet(port, data);
    }
    objectEmitFromWorklet(boxId: string, eventName: string, eventData: any) {
        return this.patcher.boxes[boxId]?.object.emit(eventName as any, eventData);
    }
}
