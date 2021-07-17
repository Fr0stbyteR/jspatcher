import type { IJSPatcherEnv } from "../Env";
import type { IPersistentProjectItemManager } from "../file/PersistentProjectItemManager";
import type { Task, TaskError } from "../TaskMgr";
import { PrefixKeys } from "../types";

export interface IWorkletEnvProcessor extends IJSPatcherEnv {
    thread: "AudioWorklet";
}
export interface IWorkletEnvNode extends PrefixKeys<Pick<IPersistentProjectItemManager, "readFile" | "readDir" | "getFileDetails" | "exists" | "putFile" | "writeFile">, "fileMgr"> {
    taskBegin(task: Pick<Task, "id" | "message" | "emitter">): void;
    taskUpdate(task: Pick<Task, "id" | "message">): void;
    taskError(error: Pick<TaskError, "id" | "error">): void;
    taskEnd(task: Pick<Task, "id">): void;
}
export interface WorkletEnvOptions {
    os: "Windows" | "MacOS" | "UNIX" | "Linux" | "Unknown";
    browser: "Unknown" | "Chromium" | "Gecko" | "WebKit";
    language: string;
}
export type WorkletEnvParameters = never;

export interface WorkletEnvEventMap {
    "taskUpdate": Pick<Task, "id" | "message">;
    "taskError": Pick<TaskError, "id" | "error">;
    "taskEnd": Pick<Task, "id">;
}
