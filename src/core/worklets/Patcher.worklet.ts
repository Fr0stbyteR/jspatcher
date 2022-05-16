import AudioWorkletProxyProcessor from "./AudioWorkletProxyProcessor";
import type PatcherEditor from "../patcher/PatcherEditor";
import type Patcher from "../patcher/Patcher";
import type PersistentProjectFile from "../file/PersistentProjectFile";
import type { IPatcherNode, PatcherParameters, IPatcherProcessor, PatcherOptions } from "./PatcherWorklet.types";
import type { AudioWorkletGlobalScope, TypedAudioParamDescriptor, TypedAudioWorkletNodeOptions } from "./TypedAudioWorklet";
import type { IHistoryData } from "../file/History";
import type { PatcherEditorEventMap } from "../patcher/PatcherEditor";
import type { PatcherEventMap } from "../patcher/Patcher";
import type { RawPatcher } from "../types";

const processorId = "__JSPatcher_Patcher";
declare const globalThis: AudioWorkletGlobalScope;
const { registerProcessor, jspatcherEnv } = globalThis;

export default class PatcherProcessor extends AudioWorkletProxyProcessor<IPatcherProcessor, IPatcherNode, PatcherParameters, PatcherOptions> implements IPatcherProcessor {
    static fnNames: (keyof IPatcherNode)[] = ["outlet", "objectEmitFromWorklet"];
    static get parameterDescriptors(): TypedAudioParamDescriptor<PatcherParameters>[] {
        return new Array(128).fill(null).map((v, i) => ({
            defaultValue: 0,
            // maxValue: Number.MAX_VALUE,
            // minValue: -Number.MAX_VALUE,
            name: `00${i}`.slice(-3)
        }));
    }
    readonly env = jspatcherEnv;
    readonly instanceId: string;
    readonly file: PersistentProjectFile;
    readonly initData: RawPatcher;
    patcher: Patcher;
    editor: PatcherEditor;
    constructor(options?: TypedAudioWorkletNodeOptions<PatcherOptions>) {
        super(options);
        const { instanceId, fileId, data } = options.processorOptions;
        this.instanceId = instanceId;
        this.file = this.env.fileMgr.getProjectItemFromId(fileId) as PersistentProjectFile;
        this.initData = data;
    }
    async init() {
        const Patcher = this.env.sdk.Patcher;
        this.patcher = new Patcher({ env: this.env, file: this.file, project: this.env.currentProject, instanceId: this.instanceId });
        this.patcher.state.patcherProcessor = this;
        await this.patcher.init(this.initData);
        this.patcher.on("dataOutput", this.handleOutlet);
        this.editor = await this.patcher.getEditor();
    }
    handleOutlet = (e: PatcherEventMap["dataOutput"]) => this.outlet(e.outlet, e.data);
    fn(data: any, port: number) {
        this.patcher.fn(data, port);
    }
    sync(data: /* IHistoryData<PatcherEditorEventMap> */any) {
        // this.patcher.history.syncData(data);
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<PatcherParameters, Float32Array>) {
        if (this._disposed) return false;
        if (!inputs?.[0]?.[0]?.length) return true;
        const { parametersBoxes } = this.patcher.inspectAudioIO();
        const handleOutput = ({ output, buffer }: PatcherEventMap["audioOutput"]) => {
            if (outputs[output]?.[0]) outputs[output][0].set(buffer);
        };
        this.patcher.on("audioOutput", handleOutput);
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i]?.[0]) this.patcher.inputAudio(i, inputs[i][0]);
        }
        for (const key in parameters) {
            const boxInfo = parametersBoxes[+key];
            if (!boxInfo) continue;
            const param = boxInfo[0];
            this.patcher.inputParam(param, parameters[param]);
        }
        this.patcher.off("audioOutput", handleOutput);
        return true;
    }
    destroy() {
        this.patcher.destroy();
        this._disposed = true;
    }
    objectEmit(boxId: string, eventName: string, eventData: any) {
        return this.patcher.boxes[boxId]?.object.emit(eventName as any, eventData);
    }
}

try {
    registerProcessor(processorId, PatcherProcessor);
} catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
}
