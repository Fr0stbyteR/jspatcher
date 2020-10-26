import { TypedEventEmitter } from "../utils/TypedEventEmitter";

export interface Task {
    emitter: string;
    message: string;
    callback: (onUpdate?: (newMsg: string) => any) => any | Promise<any>;
}

export interface TaskError {
    emitter: string;
    message: string;
    error: Error;
}

export interface Tasks { [timestamp: number]: Task }

export interface Errors { [timestamp: number]: TaskError }

export interface TaskManagerEventMap {
    "tasks": Tasks;
    "error": Errors;
}

export default class TaskManager extends TypedEventEmitter<TaskManagerEventMap> {
    tasks: Tasks = {};
    errors: Errors = {};
    async newTask<T extends Task["callback"] = Task["callback"]>(emitter: string, message: string, callback: T) {
        const timestamp = performance.now();
        this.tasks = { ...this.tasks, [timestamp]: { emitter, message, callback } };
        this.emit("tasks", this.tasks);
        let returnValue: ReturnType<T> extends Promise<infer R> ? R : ReturnType<T>;
        const handleUpdate = (msg: string) => {
            this.tasks = { ...this.tasks, [timestamp]: { emitter, message: `${message}: ${msg}`, callback } };
        };
        try {
            returnValue = await callback(handleUpdate);
        } catch (error) {
            this.errors = { ...this.errors, [timestamp]: { emitter, message, error } };
            this.emit("error", this.errors);
            throw error;
        } finally {
            delete this.tasks[timestamp];
            this.tasks = { ...this.tasks };
            this.emit("tasks", this.tasks);
        }
        return returnValue;
    }
}
