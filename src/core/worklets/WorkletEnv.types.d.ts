import type { IPersistentProjectItemManager, ProjectItemManagerDataForDiff } from "../file/PersistentProjectItemManager";
import type { Task, TaskError } from "../TaskMgr";
import type { PrefixKeys, TErrorLevel, TAbstractPackage } from "../types";

export interface IWorkletEnvProcessor {
    thread: "AudioWorklet";
    init(): Promise<void>;
    workletFileMgrDiff(diff: ProjectItemManagerDataForDiff): void;
    importPackage(url: string, id: string): Promise<void>;
}
export interface IWorkletEnvNode extends PrefixKeys<Pick<IPersistentProjectItemManager, "readFile" | "readDir" | "getFileDetails" | "exists" | "putFile" | "writeFile" | "getPathIdMap">, "fileMgr"> {
    envNewLog(errorLevel: TErrorLevel, title: string, message: string, emitter?: any): void;
    taskBegin(task: Pick<Task, "id" | "message" | "emitter">): void;
    taskUpdate(task: Pick<Task, "id" | "message">): void;
    taskError(error: Pick<TaskError, "id" | "error">): void;
    taskEnd(task: Pick<Task, "id">): void;
    fileMgrDiff(diff: ProjectItemManagerDataForDiff): void;
    addObjects(descriptors: TAbstractPackage, pkgName: string): void;
    addWorkletModule(url: string): Promise<void>;
}
export interface WorkletEnvOptions {
    os: "Windows" | "MacOS" | "UNIX" | "Linux" | "Unknown";
    browser: "Unknown" | "Chromium" | "Gecko" | "WebKit";
    language: string;
    generatedId: Uint32Array;
}
export type WorkletEnvParameters = never;

export interface WorkletEnvEventMap {
    "taskUpdate": Pick<Task, "id" | "message">;
    "taskError": Pick<TaskError, "id" | "error">;
    "taskEnd": Pick<Task, "id">;
}
