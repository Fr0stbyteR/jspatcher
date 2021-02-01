import { TypedEventEmitter } from "../../utils/TypedEventEmitter";
import Env from "../Env";
import Project from "../Project";
import ProjectItem from "./ProjectItem";
import TempItem from "./TempItem";

export interface FileInstanceEventMap {
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
    set file(value: Item) {
        this._file = value;
    }
    get ctx() {
        return this.file || this.project || this.env;
    }
    protected _isReady = false;
    get isReady() {
        return this._isReady;
    }
    setActive() {
        this.env.activeInstance = this as AnyFileInstance;
    }
    get isActive(): boolean {
        return this.env.activeInstance === this;
    }
    readonly instanceId = performance.now();
    constructor(ctxIn: Item | Project | Env) {
        super();
        if (ctxIn instanceof ProjectItem) {
            this._file = ctxIn;
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
    }
}
