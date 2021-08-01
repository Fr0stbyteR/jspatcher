import processorURL from "./Patcher.worklet.ts"; // eslint-disable-line import/extensions
import AudioWorkletProxyNode from "./AudioWorkletProxyNode";
import AudioWorkletRegister from "./AudioWorkletRegister";
import type Patcher from "../patcher/Patcher";
import type { PatcherEventMap } from "../patcher/Patcher";
import type { IPatcherNode, IPatcherProcessor, PatcherOptions, PatcherParameters } from "./PatcherWorklet.types";
import type { IJSPatcherEnv } from "../Env";
import type { RawPatcher } from "../types";

const processorId = "__JSPatcher_Patcher";

export default class PatcherNode extends AudioWorkletProxyNode<IPatcherNode, IPatcherProcessor, PatcherParameters, PatcherOptions> implements IPatcherNode {
    static processorId = processorId;
    static register = (audioWorklet: AudioWorklet) => AudioWorkletRegister.register(audioWorklet, processorId, processorURL);
    static fnNames: (keyof IPatcherProcessor)[] = ["init", "fn", "sync", "objectEmit"];
    readonly patcher: Patcher;
    constructor(context: BaseAudioContext, options: { env: IJSPatcherEnv; instanceId: string; fileId?: string; data?: RawPatcher }) {
        super(context, processorId, {
            numberOfInputs: 1,
            numberOfOutputs: 1,
            processorOptions: { instanceId: options.instanceId, fileId: options.fileId, data: options.data }
        });
        this.patcher = options.env.getInstanceById(options.instanceId) as Patcher;
        this.patcher.on("changed", this.handleChanged);
        this.patcher.on("inlet", this.handleInlet);
        this.patcher.on("destroy", this.handleDestroy);
    }
    handleChanged = () => {
        const syncData = this.patcher.history.getSyncData();
        this.sync(syncData);
    };
    handleInlet = (e: PatcherEventMap["inlet"]) => this.fn(e.data, e.inlet);
    handleDestroy = () => this.destroy();
    outlet(port: number, data: any) {
        this.patcher.outlet(port, data);
    }
    objectEmitFromWorklet(boxId: string, eventName: string, eventData: any) {
        return this.patcher.boxes[boxId]?.object.emit(eventName as any, eventData);
    }
    boxEmitFromWorklet(boxId: string, eventName: string, eventData: any) {
        return this.patcher.boxes[boxId]?.emit(eventName as any, eventData);
    }
    lineEmitFromWorklet(lineId: string, eventName: string, eventData: any) {
        return this.patcher.lines[lineId]?.emit(eventName as any, eventData);
    }
}
