import { TypedEventEmitter } from "../../utils/TypedEventEmitter";
import Env from "../Env";
import Project from "../Project";
import Folder from "./Folder";
import History from "./History";
import ProjectItem from "./ProjectItem";

export interface FileInstanceEventMap {
    "ready": FileInstance;
    "changed": never;
    "dirty": boolean;
    "saved": never;
    "destroy": never;
}

export default class FileInstance<EventMap extends Record<string, any> & Partial<FileInstanceEventMap> = {}> extends TypedEventEmitter<EventMap & FileInstanceEventMap> {
    private readonly _env: Env;
    get env(): Env {
        return this._env;
    }
    private readonly _project: Project;
    get project(): Project {
        return this._project;
    }
    private readonly _file?: ProjectItem;
    get file(): ProjectItem {
        return this._file;
    }
    private _isTemporary = false;
    get isTemporary() {
        return this._isTemporary;
    }
    set isTemporary(value) {
        this._isTemporary = value;
    }
    private _isReadonly = false;
    get isReadonly() {
        return this._isReadonly;
    }
    set isReadonly(value) {
        this._isReadonly = value;
    }
    get isDirty() {
        return this.history.isDirty;
    }
    get history(): History<EventMap> {
        return null;
    }
    constructor(fileIn?: ProjectItem) {
        super();
        this._file = fileIn;
        this._env = fileIn.env;
        this._project = fileIn.project;
        this.on("dirty", isDirty => this.file.emit("dirty", isDirty));
    }
    async serialize(): Promise<ArrayBuffer> {
        throw new Error("Not implemented.");
    }
    async save() {
        if (this.isTemporary) throw new Error("Cannot save temporary file");
        if (this.isReadonly) throw new Error("Cannot save readonly file");
        const data = await this.serialize();
        await this.file.save(data);
        this.emit("saved");
    }
    async saveAs(parent: Folder, name: string) {
        const data = await this.serialize();
        if (this.isTemporary) {
            await this.file.move(parent, name);
            await this.file.save(data);
        } else if (this.isReadonly) {
            await this.file.saveAsSelf(parent, name, data);
        } else {
            await this.file.saveAs(parent, name, data);
        }
        this.isTemporary = false;
        this.isReadonly = false;
        this.emit("saved");
    }
    async destroy() {
        await this.emit("destroy");
    }
}
