import AudioWorkletProxyProcessor from "./AudioWorkletProxyProcessor";
import TaskManager from "../TaskMgr";
import TemporaryProjectItemManager from "../file/TemporaryProjectItemManager";
import TypedEventEmitter from "../../utils/TypedEventEmitter";
import WorkletProjectItemManager from "../file/WorkletProjectItemManager";
import type { WorkletEnvParameters, IWorkletEnvNode, IWorkletEnvProcessor, WorkletEnvOptions } from "./WorkletEnv.types";
import type { AudioWorkletGlobalScope, TypedAudioWorkletNodeOptions } from "./TypedAudioWorklet";
import type { Task, TaskError } from "../TaskMgr";
import type { EnvEventMap } from "../Env";
import type { IProjectFile } from "../file/AbstractProjectFile";
import type { IProjectItemManager } from "../file/AbstractProjectItemManager";
import type { IFileEditor } from "../file/FileEditor";
import type { IFileInstance } from "../file/FileInstance";
import type { IPersistentProjectItemManager, ProjectItemManagerDataForDiff } from "../file/PersistentProjectItemManager";
import type { TErrorLevel } from "../types";

export const processorID = "__JSPatcher_WorkletEnv";
declare const globalThis: AudioWorkletGlobalScope;
const { registerProcessor } = globalThis;

export default class WorkletEnvProcessor extends AudioWorkletProxyProcessor<IWorkletEnvProcessor, IWorkletEnvNode, WorkletEnvParameters, WorkletEnvOptions> implements IWorkletEnvProcessor {
    static fnNames: (keyof IWorkletEnvNode)[] = ["taskBegin", "taskUpdate", "taskError", "taskEnd", "fileMgrExists", "fileMgrGetFileDetails", "fileMgrPutFile", "fileMgrReadDir", "fileMgrReadFile", "fileMgrWriteFile", "fileMgrGetPathIdMap", "fileMgrDiff"];
    private readonly ee = new TypedEventEmitter<EnvEventMap>();
    readonly thread = "AudioWorklet";
    readonly os: "Windows" | "MacOS" | "UNIX" | "Linux" | "Unknown";
    readonly browser: "Unknown" | "Chromium" | "Gecko" | "WebKit";
    readonly language: string;
    readonly generatedId: Uint32Array;
    readonly taskMgr = new TaskManager();
    readonly fileMgr: IPersistentProjectItemManager = new WorkletProjectItemManager(this);
    readonly tempMgr: TemporaryProjectItemManager = new TemporaryProjectItemManager(this);
    constructor(options?: TypedAudioWorkletNodeOptions<WorkletEnvOptions>) {
        super(options);
        const { os, browser, language, generatedId } = options.processorOptions;
        this.os = os;
        this.browser = browser;
        this.language = language;
        this.generatedId = generatedId;
        globalThis.jspatcherEnv = this;
        this.bindTaskMgr();
        this.bindFileMgr();
    }
    instances = new Set<IFileInstance>();
    activeInstance: IFileInstance<{}, IProjectFile<any, IProjectItemManager<{}>>>;
    activeEditor: IFileEditor<IFileInstance<{}, IProjectFile<any, IProjectItemManager<{}>>>, {}>;
    generateId(objectIn: object) {
        return this.thread + objectIn.constructor.name + Atomics.add(this.generatedId, 0, 1);
    }
    registerInstance(i: IFileInstance) {
        this.instances.add(i);
        i.on("destroy", () => {
            this.instances.delete(i);
            this.emit("instances", Array.from(this.instances));
        });
        this.emit("instances", Array.from(this.instances));
        return this.generateId(i);
    }
    getInstanceById(id: string) {
        for (const instance of this.instances) {
            if (instance.id === id) return instance;
        }
        return null;
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
    handleFileMgrChange = () => this.fileMgrDiff(this.fileMgr.getDataForDiff());
    bindFileMgr() {
        this.fileMgr.on("changed", this.handleFileMgrChange);
    }
    async workletFileMgrDiff(diff: ProjectItemManagerDataForDiff) {
        this.fileMgr.off("changed", this.handleFileMgrChange);
        await this.fileMgr.processDiff(diff);
        this.fileMgr.on("changed", this.handleFileMgrChange);
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
