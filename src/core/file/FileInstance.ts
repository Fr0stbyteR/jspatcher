import { SemanticICONS } from "semantic-ui-react";
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

export type AnyFileInstance = FileInstance<Record<string, any>>;

export default class FileInstance<EventMap extends Record<string, any> & Partial<FileInstanceEventMap> = {}> extends TypedEventEmitter<EventMap & FileInstanceEventMap> {
    private readonly _env: Env;
    get env(): Env {
        return this._env;
    }
    private readonly _project: Project;
    get project(): Project {
        return this._project;
    }
    private _file?: ProjectItem;
    get file(): ProjectItem {
        return this._file;
    }
    set file(value: ProjectItem) {
        this._file = value;
    }
    get ctx() {
        return this.file || this.project || this.env;
    }
    get isInMemory() {
        return !this.file;
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
    protected _isReady = false;
    get isReady() {
        return this._isReady;
    }
    get isDirty() {
        return this.history.isDirty;
    }
    get history(): History<EventMap> {
        return null;
    }
    get fileExtension() {
        return "data";
    }
    get fileIcon(): SemanticICONS {
        return "code";
    }
    setActive() {
        this.env.activeInstance = this as AnyFileInstance;
    }
    get isActive(): boolean {
        return this.env.activeInstance === this;
    }
    readonly instanceId = performance.now();
    constructor(ctxIn: ProjectItem | Project | Env) {
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
        this.on("dirty", isDirty => this.file?.emit?.("dirty", isDirty));
        this.on("destroy", () => this.file?.emit?.("dirty", false));
        const handleReady = () => {
            this._isReady = true;
            this.off("ready", handleReady);
        };
        this.on("ready", handleReady);
        this.env.registerInstance(this as AnyFileInstance);
        if (this.project) {
            this.project.on("save", this.handleProjectSave);
            this.project.on("unload", this.handleProjectUnload);
        }
    }
    handleProjectSave = async () => this.save();
    handleProjectUnload = async () => this.destroy();
    async serialize(): Promise<ArrayBuffer> {
        throw new Error("Not implemented.");
    }
    undo() {
        return this.history.undo();
    }
    redo() {
        return this.history.redo();
    }
    async copy() {
        throw new Error("Not implemented.");
    }
    async cut() {
        throw new Error("Not implemented.");
    }
    async paste() {
        throw new Error("Not implemented.");
    }
    async deleteSelected(): Promise<any> {
        throw new Error("Not implemented.");
    }
    async selectAll() {
        throw new Error("Not implemented.");
    }
    onUiResized() {
        throw new Error("Not implemented.");
    }
    async save() {
        if (this.isTemporary) throw new Error("Cannot save temporary file");
        if (this.isReadonly) throw new Error("Cannot save readonly file");
        if (this.isInMemory) throw new Error("Cannot save in-memory instance");
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
        } else if (this.isInMemory) {
            this.file = await parent.addProjectItem(name, data);
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
