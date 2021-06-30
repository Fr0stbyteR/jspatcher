import type { Task, TaskError } from "../TaskMgr";
import type TaskManager from "../TaskMgr";

export interface IWorkletEnvProcessor {
    thread: "AudioWorklet";
    taskMgr: TaskManager;
}
export interface IWorkletEnvNode {
    taskBegin(task: Pick<Task, "id" | "message" | "emitter">): void;
    taskUpdate(task: Pick<Task, "id" | "message">): void;
    taskError(error: Pick<TaskError, "id" | "error">): void;
    taskEnd(task: Pick<Task, "id">): void;
}
export type WorkletEnvParameters = never;

export interface WorkletEnvEventMap {
    "taskUpdate": Pick<Task, "id" | "message">;
    "taskError": Pick<TaskError, "id" | "error">;
    "taskEnd": Pick<Task, "id">;
}
