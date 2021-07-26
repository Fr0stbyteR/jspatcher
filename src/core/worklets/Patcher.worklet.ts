import AudioWorkletProxyProcessor from "./AudioWorkletProxyProcessor";
import type Patcher from "../patcher/Patcher";
import type { TOutletEvent } from "../objects/base/AbstractObject";
import type { IPatcherNode, PatcherParameters, IPatcherProcessor, PatcherOptions } from "./PatcherWorklet.types";
import type { AudioWorkletGlobalScope, TypedAudioParamDescriptor, TypedAudioWorkletNodeOptions } from "./TypedAudioWorklet";
import type { IHistoryData } from "../file/History";
import type { PatcherEditorEventMap } from "../patcher/PatcherEditor";
import PatcherEditor from "../patcher/PatcherEditor";

const processorID = "__JSPatcher_Patcher";
declare const globalThis: AudioWorkletGlobalScope;
const { registerProcessor, jspatcherEnv } = globalThis;

class PatcherProcessor extends AudioWorkletProxyProcessor<IPatcherProcessor, IPatcherNode, PatcherParameters, PatcherOptions> implements IPatcherProcessor {
    static fnNames: (keyof IPatcherNode)[] = ["outlet"];
    static get parameterDescriptors(): TypedAudioParamDescriptor<PatcherParameters>[] {
        return new Array(128).map(i => ({
            defaultValue: 1024,
            maxValue: -Number.MAX_VALUE,
            minValue: Number.MAX_VALUE,
            name: `00${i}`.slice(-3)
        }));
    }
    readonly patcher: Patcher;
    editor: PatcherEditor;
    constructor(options?: TypedAudioWorkletNodeOptions<PatcherOptions>) {
        super(options);
        this.patcher = jspatcherEnv.getInstanceById(options.processorOptions.instanceId) as Patcher;
    }
    async init() {
        this.patcher.init();
        this.patcher.on("outlet", this.handleOutlet);
        this.editor = await this.patcher.getEditor();
    }
    handleOutlet = (e: TOutletEvent<any[], number>) => this.outlet(e.outlet, e.data);
    fn(data: any, port: number) {
        this.patcher.fn(data, port);
    }
    sync(data: IHistoryData<PatcherEditorEventMap>) {
        this.patcher.history.syncData(data);
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][]) {
        if (this._disposed) return false;
        return true;
    }
    destroy() {
        this.patcher.destroy();
        this._disposed = true;
    }
}

try {
    registerProcessor(processorID, PatcherProcessor);
} catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
}
