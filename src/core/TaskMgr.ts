import { TypedEventEmitter } from "../utils/TypedEventEmitter";

export interface Task {
    emitter: string;
    message: string;
    callback: () => void | Promise<void>;
}

export interface Tasks { [timestamp: number]: Task }

export interface TaskManagerEventMap {
    "tasks": Tasks;
}

export default class TaskManager extends TypedEventEmitter<TaskManagerEventMap> {
    tasks: Tasks = {};
    async newTask(emitter: string, message: string, callback: () => void | Promise<void>) {
        const timestamp = performance.now();
        this.tasks = { ...this.tasks, [timestamp]: { emitter, message, callback } };
        this.emit("tasks", this.tasks);
        await callback();
        delete this.tasks[timestamp];
        this.tasks = { ...this.tasks };
        this.emit("tasks", this.tasks);
    }
}
