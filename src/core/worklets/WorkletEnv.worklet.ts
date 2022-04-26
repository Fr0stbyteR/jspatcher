import AudioWorkletProxyProcessor from "./AudioWorkletProxyProcessor";
import TaskManager from "../TaskMgr";
import TemporaryProjectItemManager from "../file/TemporaryProjectItemManager";
import TypedEventEmitter from "../../utils/TypedEventEmitter";
import WorkletProjectItemManager from "../file/WorkletProjectItemManager";
import WorkletGlobalPackageManager from "../WorkletGlobalPackageManager";
import Project from "../Project";
import JSPatcherWorkletSDK from "../WorkletSDK";
import type { WorkletEnvParameters, IWorkletEnvNode, IWorkletEnvProcessor, WorkletEnvOptions } from "./WorkletEnv.types";
import type { AudioWorkletGlobalScope, TypedAudioWorkletNodeOptions } from "./TypedAudioWorklet";
import type { Task, TaskError } from "../TaskMgr";
import type { EnvEventMap, IJSPatcherEnv } from "../Env";
import type { IFileEditor } from "../file/FileEditor";
import type { IFileInstance } from "../file/FileInstance";
import type { ProjectItemManagerDataForDiff } from "../file/PersistentProjectItemManager";
import type { TErrorLevel } from "../types";
import type { IExternalPackage } from "../GlobalPackageManager";
import type GlobalTransportProcessor from "./GlobalTransportProcessor.worklet";

export const processorId = "__JSPatcher_WorkletEnv";
declare const globalThis: AudioWorkletGlobalScope;
const { registerProcessor } = globalThis;

export default class WorkletEnvProcessor extends AudioWorkletProxyProcessor<IWorkletEnvProcessor, IWorkletEnvNode, WorkletEnvParameters, WorkletEnvOptions> implements IWorkletEnvProcessor, IJSPatcherEnv {
    static fnNames: (keyof IWorkletEnvNode)[] = ["envNewLog", "taskBegin", "taskUpdate", "taskError", "taskEnd", "fileMgrExists", "fileMgrGetFileDetails", "fileMgrPutFile", "fileMgrReadDir", "fileMgrReadFile", "fileMgrWriteFile", "fileMgrGetPathIdMap", "fileMgrDiff", "addObjects", "addWorkletModule"];
    private readonly ee = new TypedEventEmitter<EnvEventMap>();
    readonly thread = "AudioWorklet";
    readonly os: "Windows" | "MacOS" | "UNIX" | "Linux" | "Unknown";
    readonly browser: "Unknown" | "Chromium" | "Gecko" | "WebKit";
    readonly generatedId: Uint32Array;
    readonly taskMgr = new TaskManager();
    readonly fileMgr: WorkletProjectItemManager;
    readonly tempMgr: TemporaryProjectItemManager;
    readonly pkgMgr: WorkletGlobalPackageManager;
    readonly sdk = new JSPatcherWorkletSDK();
    readonly username = "";
    currentProject: Project;
    globalTransport: GlobalTransportProcessor;
    constructor(options?: TypedAudioWorkletNodeOptions<WorkletEnvOptions>) {
        super(options);
        globalThis.jspatcherEnv = this;
        const { os, browser, generatedId } = options.processorOptions;
        this.os = os;
        this.browser = browser;
        this.generatedId = generatedId;
        this.fileMgr = new WorkletProjectItemManager(this);
        this.tempMgr = new TemporaryProjectItemManager(this);
        this.pkgMgr = new WorkletGlobalPackageManager(this);
    }
    async init() {
        await this.pkgMgr.init();
        this.currentProject = new Project(this);
        await this.fileMgr.init();
        await this.tempMgr.init();
        this.bindTaskMgr();
        this.bindFileMgr();
    }
    instances = new Set<IFileInstance>();
    activeInstance: IFileInstance;
    activeEditor: IFileEditor;
    newLog(errorLevel: TErrorLevel, title: string, message: string, emitterIn?: any) {
        const emitter = typeof emitterIn === "string" ? emitterIn : typeof emitterIn === "object" ? emitterIn.constructor.name : typeof emitterIn === "function" ? emitterIn.name : "";
        this.envNewLog(errorLevel, title, message, emitter);
    }
    generateId(objectIn: object) {
        return this.thread + objectIn.constructor.name + (((globalThis as any).Atomics as typeof Atomics)?.add(this.generatedId, 0, 1) ?? ++this.generatedId[0]);
    }
    registerInstance(i: IFileInstance, id?: string) {
        this.instances.add(i);
        i.on("destroy", () => {
            this.instances.delete(i);
            this.ee.emit("instances", Array.from(this.instances));
        });
        this.ee.emit("instances", Array.from(this.instances));
        if (!id) return this.generateId(i);
        return id;
    }
    getInstanceById(id: string) {
        for (const instance of this.instances) {
            if (instance.id === id) return instance;
        }
        return null;
    }
    // get _listeners() { return this.ee._listeners; }
    // get getListeners() { return this.ee.getListeners; }
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
    handleFileMgrChange = () => {
        /* SharedArrayBuffer
        if (this.fileMgr.disabled) return;
        this.fileMgrDiff(this.fileMgr.getDataForDiff());
        */
    };
    bindFileMgr() {
        this.fileMgr.on("changed", this.handleFileMgrChange);
    }
    async workletFileMgrDiff(diff: ProjectItemManagerDataForDiff) {
        this.fileMgr.off("changed", this.handleFileMgrChange);
        await this.fileMgr.processDiff(diff);
        this.fileMgr.on("changed", this.handleFileMgrChange);
    }
    async importPackage(url: string, pkgInfo: IExternalPackage) {
        await this.pkgMgr.importPackage(url, pkgInfo);
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][]) {
        if (this._disposed) return false;
        return true;
    }
}

try {
    registerProcessor(processorId, WorkletEnvProcessor);
} catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
}
