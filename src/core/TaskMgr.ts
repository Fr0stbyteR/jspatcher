import TypedEventEmitter from "../utils/TypedEventEmitter";

export interface Task {
    /** thread + numberId */
    id: string;
    timestamp: number;
    thread: string;
    emitter: Object | string;
    message: string;
    callback: (onUpdate?: (newMsg: string) => any) => any | Promise<any>;
}

export interface TaskError {
    id: string;
    timestamp: number;
    thread: string;
    emitter: Object | string;
    message: string;
    error: Error;
}

export interface TaskManagerEventMap {
    "taskBegin": Task;
    "taskUpdate": Task;
    "taskEnd": Task;
    "taskError": TaskError;
    "tasks": Task[];
    "errors": TaskError[];
}

export default class TaskManager extends TypedEventEmitter<TaskManagerEventMap> {
    _id = 0;
    _tasks: { [thread: string]: Task[] } = {};
    _errors: { [thread: string]: TaskError[] } = {};
    get tasks() {
        const tasks: Task[] = [];
        for (const key in this._tasks) {
            tasks.push(...this._tasks[key].filter(e => !!e));
        }
        return tasks;
    }
    get errors() {
        const errors: TaskError[] = [];
        for (const key in this._errors) {
            errors.push(...this._errors[key].filter(e => !!e));
        }
        return errors;
    }
    async newTask<T extends Task["callback"] = Task["callback"]>(emitter: string | Object, message: string, callback: T) {
        const thread = globalThis.constructor.name;
        const timestamp = performance.now();
        const id = thread + this._id++;
        const task: Task = { id, thread, timestamp, emitter, message, callback };
        if (!(thread in this._tasks)) this._tasks[thread] = [];
        const $ = this._tasks[thread].push(task) - 1;
        this.emit("tasks", this.tasks);
        this.emit("taskBegin", task);
        let returnValue: ReturnType<T> extends Promise<infer R> ? R : ReturnType<T>;
        const handleUpdate = (msg: string) => {
            const task: Task = { id, thread, timestamp, emitter, message: `${message}: ${msg}`, callback };
            this._tasks[thread][$] = task;
            this.emit("tasks", this.tasks);
            this.emit("taskUpdate", task);
        };
        try {
            returnValue = await callback(handleUpdate);
        } catch (error) {
            const taskError: TaskError = { id, thread, timestamp, emitter, message, error };
            if (!(thread in this._errors)) this._errors[thread] = [];
            this._errors[thread].push(taskError);
            this.emit("errors", this.errors);
            this.emit("taskError", taskError);
            throw error;
        } finally {
            this._tasks[thread][$] = null;
            this.emit("tasks", this.tasks);
            this.emit("taskEnd", task);
        }
        return returnValue;
    }
    get lastError(): TaskError {
        return this.errors.sort(((a, b) => b.timestamp - a.timestamp))[0];
    }
    get lastTask(): Task {
        return this.tasks.sort(((a, b) => b.timestamp - a.timestamp))[0];
    }
    getTasksFromEmitter(emitter: string | Object) {
        return this.tasks.filter(task => task.emitter === emitter);
    }
    getErrorsFromEmitter(emitter: string | Object) {
        return this.errors.filter(error => error.emitter === emitter);
    }
    dismissLastError() {
        const { lastError } = this;
        if (!lastError) return;
        const $ = this._errors[lastError.thread].indexOf(lastError);
        this._errors[lastError.thread][$] = null;
        this.emit("errors", this.errors);
    }
    dismissAllErrors() {
        this._errors = {};
        this.emit("errors", this.errors);
    }
}
