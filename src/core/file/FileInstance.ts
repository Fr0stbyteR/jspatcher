import { TypedEventEmitter } from "../../utils/TypedEventEmitter";
import Env from "../Env";
import Project from "../Project";
import { AnyFileEditor } from "./FileEditor";
import ProjectItem from "./ProjectItem";
import TempItem from "./TempItem";

export interface FileInstanceEventMap {
    "observer": never;
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
    observers = new Set<any>();
    addObserver(observer: any) {
        this.observers.add(observer);
    }
    removeObserver(observer: any) {
        this.observers.delete(observer);
        if (this.observers.size === 0) this.destroy();
    }
    readonly instanceId = performance.now();
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
        this.file?.removeObserver(this);
    }
}
