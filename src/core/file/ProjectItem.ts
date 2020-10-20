import { TypedEventEmitter } from "../../utils/TypedEventEmitter";
import FileManager from "../FileMgr";
import { ProjectItemType } from "../types";
import Folder from "./Folder";

export interface ProjectItemEventMap {
    "ready": never;
    "renamed": { oldName: string, newName: string };
    "moved": { from: Folder, to: Folder };
    "destroyed": never;
    "updated": never;
    "dirty": boolean;
}

export default class ProjectItem extends TypedEventEmitter<ProjectItemEventMap> {
    type: ProjectItemType = "unknown";
    private _fileMgr: FileManager;
    get fileMgr() {
        return this._fileMgr;
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
    async setData(dataIn: ArrayBuffer) {
        this._data = dataIn;
        await this.fileMgr.putFile(this);
        this.emit("updated");
    }
    constructor(fileMgrIn: FileManager, parentIn: Folder, nameIn: string, dataIn?: ArrayBuffer) {
        super();
        this._fileMgr = fileMgrIn;
        this.parent = parentIn;
        this._name = nameIn;
        if (dataIn) this._data = dataIn;
    }
    clone(parentIn = this.parent, nameIn = this._name, dataIn?: ArrayBuffer) {
        const Ctor = this.constructor as typeof ProjectItem;
        return new Ctor(this._fileMgr, parentIn, nameIn, dataIn);
    }
    async init() {
        this._data = await this.fileMgr.readFile(this.path);
        this.emit("ready");
        return this;
    }
    async instantiate(): Promise<any> {
        // new instance Patcher / AudioBuffer etc
    }
    get path(): string {
        return this.parentPath ? `${this.parentPath}/${this._name}` : "";
    }
    get parentPath() {
        return this.parent?.path;
    }
    async rename(newNameIn: string) {
        const newName = newNameIn.trim();
        const oldName = this._name;
        if (newName === oldName) return;
        if (!this.parent.existItem(newNameIn)) throw new Error(`${newName} already exists.`);
        await this.fileMgr.rename(this.path, `${this.parentPath}/${newNameIn}`);
        this.fileMgr.emitTreeChanged();
        this.emit("renamed", { oldName, newName });
    }
    async move(to: Folder) {
        if (to === this.parent) return;
        if (!to.existItem(this.name)) throw new Error(`${this.name} already exists in ${to.name}`);
        await this._fileMgr.rename(this.path, `${to.path}/${this._name}`);
        const from = this.parent;
        from.items.delete(this);
        this.parent = to;
        this.parent.items.add(this);
        this.fileMgr.emitTreeChanged();
        this.emit("moved", { from, to });
    }
    async destroy() {
        await this._fileMgr.remove(this.path);
        this.parent.items.delete(this);
        this.emit("destroyed");
    }
    async save(newData: ArrayBuffer) {
        this._data = newData;
        await this._fileMgr.putFile(this);
    }
    async saveAs(parent: Folder, name: string, newData: ArrayBuffer) {
        const item = this.clone(parent, name, newData);
        this._fileMgr.putFile(item);
        parent.items.add(item);
        return item;
    }
    emitDirty(isDirty: boolean) {
        this.emit("dirty", isDirty);
    }
}
