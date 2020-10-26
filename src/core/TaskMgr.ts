import { TypedEventEmitter } from "../utils/TypedEventEmitter";

export interface Task {
    emitter: string;
    message: string;
    callback: () => void | Promise<void>;
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
    async newTask(emitter: string, message: string, callback: () => void | Promise<void>) {
        const timestamp = performance.now();
        this.tasks = { ...this.tasks, [timestamp]: { emitter, message, callback } };
        this.emit("tasks", this.tasks);
        try {
            await callback();
        } catch (error) {
            this.errors = { ...this.errors, [timestamp]: { emitter, message, error } };
            this.emit("error", this.errors);
            throw error;
        } finally {
            delete this.tasks[timestamp];
            this.tasks = { ...this.tasks };
            this.emit("tasks", this.tasks);
        }
    }
}
