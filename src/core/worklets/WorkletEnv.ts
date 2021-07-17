import processorURL from "./WorkletEnv.worklet.ts"; // eslint-disable-line import/extensions
import AudioWorkletProxyNode from "./AudioWorkletProxyNode";
import AudioWorkletRegister from "./AudioWorkletRegister";
import type { WorkletEnvParameters, IWorkletEnvNode, IWorkletEnvProcessor, WorkletEnvEventMap, WorkletEnvOptions } from "./WorkletEnv.types";
import type Env from "../Env";
import type { Task, TaskError } from "../TaskMgr";
import type PersistentProjectFile from "../file/PersistentProjectFile";
import type PersistentProjectFolder from "../file/PersistentProjectFolder";
import { sab2ab } from "../../utils/utils";

export const processorID = "__JSPatcher_WorkletEnv";

export default class WorkletEnvNode extends AudioWorkletProxyNode<IWorkletEnvNode, IWorkletEnvProcessor, WorkletEnvParameters, WorkletEnvOptions, WorkletEnvEventMap> implements IWorkletEnvNode {
    static processorID = processorID;
    static register = (audioWorklet: AudioWorklet) => AudioWorkletRegister.register(audioWorklet, processorID, processorURL);
    static fnNames: (keyof IWorkletEnvProcessor)[] = [] as never[];
    readonly env: Env;
    constructor(context: BaseAudioContext, mainEnv: Env) {
        const { os, browser, language } = mainEnv;
        super(context, processorID, { numberOfInputs: 0, numberOfOutputs: 0, processorOptions: { os, browser, language } });
        this.env = mainEnv;
    }
    taskBegin({ id, message, emitter }: Pick<Task, "id" | "message" | "emitter">) {
        this.env.taskMgr.newTask(emitter, message, onUpdate => new Promise<void>((resolve, reject) => {
            const handleTaskUpdate = (e: CustomEvent<Pick<Task, "id" | "message">>) => {
                if (id === e.detail.id) onUpdate(e.detail.message);
            };
            const handleTaskError = (e: CustomEvent<Pick<TaskError, "id" | "error">>) => {
                this.removeEventListener("taskUpdate", handleTaskUpdate);
                this.removeEventListener("taskError", handleTaskError);
                this.removeEventListener("taskEnd", handleTaskEnd);
                if (id === e.detail.id) reject(e.detail.error);
            };
            const handleTaskEnd = (e: CustomEvent<Pick<Task, "id">>) => {
                this.removeEventListener("taskUpdate", handleTaskUpdate);
                this.removeEventListener("taskError", handleTaskError);
                this.removeEventListener("taskEnd", handleTaskEnd);
                if (id === e.detail.id) resolve();
            };
            this.addEventListener("taskUpdate", handleTaskUpdate);
            this.addEventListener("taskError", handleTaskError);
            this.addEventListener("taskEnd", handleTaskEnd);
        }));
    }
    taskUpdate(task: Pick<Task, "id" | "message">) {
        this.dispatchEvent(new CustomEvent("taskUpdate", { detail: task }));
    }
    taskError(error: Pick<TaskError, "id" | "error">) {
        this.dispatchEvent(new CustomEvent("taskError", { detail: error }));
    }
    taskEnd(task: Pick<Task, "id">) {
        this.dispatchEvent(new CustomEvent("taskEnd", { detail: task }));
    }
    async fileMgrReadFile(path: string) {
        const item = this.env.fileMgr.getProjectItemFromPath(path) as PersistentProjectFile | PersistentProjectFolder;
        if (item.isFolder === false) return item.sab;
        return null;
    }
    fileMgrReadDir(path?: string) {
        return this.env.fileMgr.readDir(path);
    }
    fileMgrGetFileDetails(path: string, name: string) {
        return this.env.fileMgr.getFileDetails(path, name);
    }
    fileMgrExists(path: string) {
        return this.env.fileMgr.exists(path);
    }
    fileMgrPutFile(item: { isFolder: boolean; path: string; data?: ArrayBuffer | SharedArrayBuffer }) {
        if (item.data) item.data = sab2ab(item.data);
        return this.env.fileMgr.putFile(item);
    }
    fileMgrWriteFile(path: string, dataIn: ArrayBuffer | SharedArrayBuffer) {
        const data = sab2ab(dataIn);
        return this.env.fileMgr.writeFile(path, data);
    }
}
