import { TypedEventEmitter } from "../../utils/TypedEventEmitter";
import Env from "../Env";
import FileManager from "../FileMgr";
import Project from "../Project";
import { ProjectItemType } from "../types";
import { AnyFileEditor } from "./FileEditor";
import { AnyFileInstance } from "./FileInstance";
import Folder from "./Folder";

export interface ProjectItemEventMap {
    "ready": never;
    "nameChanged": { oldName: string, newName: string };
    "pathChanged": { from: Folder, to: Folder };
    "treeChanged": never;
    "destroyed": never;
    "dirty": boolean;
    "saved": never;
}

export default class ProjectItem extends TypedEventEmitter<ProjectItemEventMap> {
    type: ProjectItemType = "unknown";
    private readonly _env: Env;
    get env(): Env {
        return this._env;
    }
    protected readonly _fileMgr: FileManager;
    get fileMgr() {
        return this._fileMgr;
    }
    private readonly _project: Project;
    get project() {
        return this._project;
    }
    protected _name: string;
    get name() {
        return this._name;
    }
    parent: Folder;
    protected _data: ArrayBuffer;
    get data() {
        return this._data;
    }
    private _isDirty: boolean;
    get isDirty() {
        return this._isDirty;
    }
    constructor(fileMgrIn: FileManager, projectIn: Project, parentIn: Folder, nameIn: string, dataIn?: ArrayBuffer) {
        super();
        this._fileMgr = fileMgrIn;
        this._env = fileMgrIn.env;
        this._project = projectIn;
        this.parent = parentIn;
        this._name = nameIn;
        this.on("dirty", dirty => this._isDirty = dirty);
        if (dataIn) this._data = dataIn;
    }
    clone(parentIn = this.parent, nameIn = this._name, dataIn = this._data.slice(0)) {
        const Ctor = this.constructor as typeof ProjectItem;
        return new Ctor(this._fileMgr, this.project, parentIn, nameIn, dataIn);
    }
    async init() {
        this._data = await this.fileMgr.readFile(this.path);
        await this.emit("ready");
        return this;
    }
    /**
     * This method calls default instantiation (from the file manager).
     * Please use `FileInstance.fromProjectItem(item)` for a better instantiation.
     */
    async instantiate(): Promise<AnyFileInstance> {
        throw new Error("Not implemented.");
        // new instance Patcher / AudioBuffer etc
    }
    async instantiateEditor(): Promise<AnyFileEditor> {
        throw new Error("Not implemented.");
    }
    get path(): string {
        return this.parent ? `${this.parentPath}/${this._name}` : "";
    }
    get parentPath() {
        return this.parent?.path;
    }
    get projectPath() {
        return this.path.replace(/^\/project/, "");
    }
    get fileExtension() {
        const splitted = this.name.split(".");
        return splitted[splitted.length - 1];
    }
    async emitTreeChanged() {
        await this.emit("treeChanged");
        await (this.parent || this.fileMgr).emitTreeChanged();
    }
    async rename(newNameIn: string) {
        const newName = newNameIn.trim();
        const oldName = this._name;
        if (newName === oldName) return;
        if (this.parent.existItem(newNameIn)) throw new Error(`${newName} already exists.`);
        await this.fileMgr.rename(this.path, `${this.parentPath}/${newNameIn}`);
        this._name = newName;
        await this.emitTreeChanged();
        await this.emit("nameChanged", { oldName, newName });
    }
    async move(to: Folder, newName = this.name) {
        if (to as ProjectItem === this) return;
        if (to === this.parent) return;
        if (to.existItem(newName)) throw new Error(`${newName} already exists in ${to.name}`);
        await this._fileMgr.rename(this.path, `${to.path}/${newName}`);
        const from = this.parent;
        from.items.delete(this);
        this.parent = to;
        const oldName = this._name;
        this._name = newName;
        this.parent.items.add(this);
        await from.emitTreeChanged();
        await this.emitTreeChanged();
        await this.emit("pathChanged", { from, to });
        if (oldName !== newName) await this.emit("nameChanged", { oldName, newName });
    }
    async destroy() {
        await this._fileMgr.remove(this.path, this.type === "folder");
        this.parent.items.delete(this);
        await this.emitTreeChanged();
        await this.emit("destroyed");
    }
    async save(newData: ArrayBuffer) {
        this._data = newData;
        await this._fileMgr.putFile(this);
        await this.emit("saved");
    }
    async saveAsCopy(parent: Folder, name: string, newData: ArrayBuffer) {
        const item = this.clone(parent, name, newData);
        await this._fileMgr.putFile(item);
        parent.items.add(item);
        await this.emitTreeChanged();
        return item;
    }
    async saveAs(to: Folder, name: string, newData: ArrayBuffer) {
        const item = this.clone(to, name, newData);
        await this._fileMgr.putFile(item);
        const from = this.parent;
        this.parent = to;
        this._name = name;
        this.parent.items.add(this);
        await this.emitTreeChanged();
        await this.emit("pathChanged", { from, to });
        await this.emit("saved");
        return item;
    }
}
