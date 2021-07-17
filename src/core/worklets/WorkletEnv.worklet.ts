import AudioWorkletProxyProcessor from "./AudioWorkletProxyProcessor";
import TaskManager from "../TaskMgr";
import type { WorkletEnvParameters, IWorkletEnvNode, IWorkletEnvProcessor, WorkletEnvOptions } from "./WorkletEnv.types";
import type { AudioWorkletGlobalScope, TypedAudioWorkletNodeOptions } from "./TypedAudioWorklet";
import type { Task, TaskError } from "../TaskMgr";
import { EnvEventMap } from "../Env";
import { IProjectFile } from "../file/AbstractProjectFile";
import { IProjectItemManager } from "../file/AbstractProjectItemManager";
import { IFileEditor } from "../file/FileEditor";
import { IFileInstance } from "../file/FileInstance";
import { IPersistentProjectItemManager } from "../file/PersistentProjectItemManager";
import TemporaryProjectItemManager from "../file/TemporaryProjectItemManager";
import { TErrorLevel } from "../types";
import TypedEventEmitter from "../../utils/TypedEventEmitter";
import WorkletProjectItemManager from "../file/WorkletProjectItemManager";

export const processorID = "__JSPatcher_WorkletEnv";
declare const globalThis: AudioWorkletGlobalScope;
const { registerProcessor } = globalThis;

export default class WorkletEnvProcessor extends AudioWorkletProxyProcessor<IWorkletEnvProcessor, IWorkletEnvNode, WorkletEnvParameters, WorkletEnvOptions> implements IWorkletEnvProcessor {
    static fnNames: (keyof IWorkletEnvNode)[] = ["taskBegin", "taskUpdate", "taskError", "taskEnd", "fileMgrExists", "fileMgrGetFileDetails", "fileMgrPutFile", "fileMgrReadDir", "fileMgrReadFile", "fileMgrWriteFile"];
    private readonly ee = new TypedEventEmitter<EnvEventMap>();
    readonly thread = "AudioWorklet";
    readonly os: "Windows" | "MacOS" | "UNIX" | "Linux" | "Unknown";
    readonly browser: "Unknown" | "Chromium" | "Gecko" | "WebKit";
    readonly language: string;
    readonly taskMgr = new TaskManager();
    readonly fileMgr: IPersistentProjectItemManager = new WorkletProjectItemManager(this);
    readonly tempMgr: TemporaryProjectItemManager = new TemporaryProjectItemManager(this);
    constructor(options?: TypedAudioWorkletNodeOptions<WorkletEnvOptions>) {
        super(options);
        const { os, browser, language } = options.processorOptions;
        this.os = os;
        this.browser = browser;
        this.language = language;
        globalThis.jspatcherEnv = this;
        this.bindTaskMgr();
    }
    activeInstance: IFileInstance<{}, IProjectFile<any, IProjectItemManager<{}>>>;
    activeEditor: IFileEditor<IFileInstance<{}, IProjectFile<any, IProjectItemManager<{}>>>, {}>;
    _generatedId = 1;
    generateId(objectIn: object): string {
        return this.thread + objectIn.constructor.name + this._generatedId++;
    }
    registerInstance(instanceIn: IFileInstance<{}, IProjectFile<any, IProjectItemManager<{}>>>): string {
        throw new Error("Method not implemented.");
    }
    newLog(errorLevel: TErrorLevel, title: string, message: string, emitter?: any): void {
        throw new Error("Method not implemented.");
    }
    get listeners() { return this.ee.listeners; }
    get on() { return this.ee.on; }
    get once() { return this.ee.once; }
    get onAny() { return this.ee.onAny; }
    get off() { return this.ee.off; }
    get offAny() { return this.ee.offAny; }
    get offAll() { return this.ee.offAll; }
    get emit() { return this.ee.emit; }
    get emitSerial() { return this.ee.emitSerial; }
    get emitSync() { return this.ee.emitSync; }
    get listenerCount() { return this.ee.listenerCount; }
    bindTaskMgr() {
        const handleTaskBegin = ({ id, message, emitter }: Task) => this.taskBegin({ id, message, emitter: typeof emitter === "string" ? emitter : emitter.constructor?.name });
        const handleTaskUpdate = ({ id, message }: Task) => this.taskUpdate({ id, message });
        const handleTaskError = ({ id, error }: TaskError) => this.taskError({ id, error });
        const handleTaskEnd = ({ id }: Task) => this.taskEnd({ id });
        this.taskMgr.on("taskBegin", handleTaskBegin);
        this.taskMgr.on("taskUpdate", handleTaskUpdate);
        this.taskMgr.on("taskError", handleTaskError);
        this.taskMgr.on("taskEnd", handleTaskEnd);
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][]) {
        if (this._disposed) return false;
        return true;
    }
}

try {
    registerProcessor(processorID, WorkletEnvProcessor);
} catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
}
