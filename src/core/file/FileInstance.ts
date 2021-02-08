import { TypedEventEmitter } from "../../utils/TypedEventEmitter";
import Env from "../Env";
import Project from "../Project";
import { AnyFileEditor } from "./FileEditor";
import ProjectItem from "./ProjectItem";
import TempItem from "./TempItem";

export interface FileInstanceEventMap {
    "observers": Set<any>;
    "ready": never;
    "changed": never;
    "destroy": never;
}

export type AnyFileInstance = FileInstance<Record<string, any>>;

export default class FileInstance<EventMap extends Record<string, any> & Partial<FileInstanceEventMap> = {}, Item extends ProjectItem | TempItem = ProjectItem | TempItem> extends TypedEventEmitter<EventMap & FileInstanceEventMap> {
    static async fromProjectItem(item: ProjectItem | TempItem): Promise<FileInstance<any>> {
        return new this(item);
    }
    private readonly _env: Env;
    get env(): Env {
        return this._env;
    }
    private readonly _project: Project;
    get project(): Project {
        return this._project;
    }
    private _file?: Item;
    get file(): Item {
        return this._file;
    }
    set file(value) {
        if (value === this._file) return;
        this._file?.removeObserver(this);
        this._file = value;
        this._file?.addObserver(this);
    }
    get ctx(): Item | Project | Env {
        return this.file || this.project || this.env;
    }
    get isInMemory() {
        return !this.file;
    }
    get isTemporary() {
        return this.file instanceof TempItem;
    }
    private _isReadonly = false;
    get isReadonly() {
        return this._isReadonly;
    }
    set isReadonly(value) {
        this._isReadonly = value;
    }
    protected _isReady = false;
    get isReady() {
        return this._isReady;
    }
    setActive() {
        this.env.activeInstance = this;
    }
    get isActive(): boolean {
        return this.env.activeInstance === this;
    }
    async getEditor(): Promise<AnyFileEditor> {
        throw new Error("Not implemented.");
    }
    protected readonly _observers = new Set<any>();
    async addObserver(observer: any) {
        this._observers.add(observer);
        await this.emit("observers", this._observers);
    }
    async removeObserver(observer: any) {
        this._observers.delete(observer);
        await this.emit("observers", this._observers);
        if (this._observers.size === 0) await this.destroy();
    }
    readonly _instanceId = performance.now();
    constructor(ctxIn: Item | Project | Env) {
        super();
        if (ctxIn instanceof ProjectItem) {
            this._file = ctxIn;
            this._file.addObserver(this);
            this._env = ctxIn.env;
            this._project = ctxIn.project;
        } else if (ctxIn instanceof Project) {
            this._project = ctxIn;
            this._env = ctxIn.env;
        } else {
            this._env = ctxIn;
        }
    }
    async serialize(): Promise<ArrayBuffer> {
        throw new Error("Not implemented.");
    }
    async destroy() {
        await this.emit("destroy");
        await this.file?.removeObserver(this);
    }
}
