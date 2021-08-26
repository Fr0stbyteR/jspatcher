import TypedEventEmitter, { ITypedEventEmitter } from "../../utils/TypedEventEmitter";
import type { IObservee, ProjectItemType } from "../types";
import type { IProjectItemManager } from "./AbstractProjectItemManager";
import type { IProjectFile } from "./AbstractProjectFile";
import type { IProjectFolder } from "./AbstractProjectFolder";

export type IProjectFileOrFolder = IProjectFolder | IProjectFile;

export interface ProjectItemEventMap {
    "ready": never;
    "nameChanged": { oldName: string; newName: string };
    "pathChanged": { from: string; to: string };
    "treeChanged": never;
    "destroyed": never;
    "observers": Set<string>;
    "dirty": boolean;
}

export interface IProjectItem<EventMap extends Record<string, any> = {}, Manager extends IProjectItemManager = IProjectItemManager> extends ITypedEventEmitter<ProjectItemEventMap & EventMap>, IObservee<string> {
    readonly id: string;
    readonly fileMgr: Manager;
    readonly isFolder: boolean;
    readonly type: ProjectItemType;
    readonly name: string;
    /** path used by the file manager */
    readonly path: string;
    /** parent path used by the file manager */
    readonly parentPath: string;
    /** path relative to the project root */
    readonly projectPath: string;
    /** Is the file is editing by some editor and modified (without saving the data), isDirty is true. */
    readonly isDirty: boolean;
    parent: IProjectFolder;
    /** Load data */
    init(): Promise<void>;
    /** Clone with optional modifications */
    clone(parentIn?: IProjectFolder, nameIn?: string): IProjectItem;
    rename(newNameIn: string): Promise<void>;
    move(to: IProjectFolder, newNameIn?: string): Promise<void>;
    /** Delete current file from file manager and the parent folder. */
    destroy(): Promise<void>;
}

export default abstract class AbstractProjectItem<EventMap extends Partial<ProjectItemEventMap> & Record<string, any> = {}, Manager extends IProjectItemManager = IProjectItemManager> extends TypedEventEmitter<ProjectItemEventMap & EventMap> implements IProjectItem<EventMap, Manager> {
    id: string;
    get type(): ProjectItemType {
        return "unknown";
    }
    readonly isFolder: boolean;
    protected readonly _fileMgr;
    get fileMgr() {
        return this._fileMgr;
    }
    protected _name: string;
    get name() {
        return this._name;
    }
    parent: IProjectFolder;
    private _isDirty = false;
    get isDirty() {
        return this._isDirty;
    }
    get path(): string {
        return this.parent ? `${this.parentPath}/${this._name}` : "";
    }
    get parentPath() {
        return this.parent?.path;
    }
    get projectPath() {
        return this.path.replace(new RegExp(`^/${this._fileMgr.projectFolderName}`), "");
    }
    protected readonly _observers = new Set<string>();
    async addObserver(observer: string) {
        this._observers.add(observer);
        await this.emit("observers", this._observers);
        await this.fileMgr.emitChanged();
    }
    async removeObserver(observer: string) {
        this._observers.delete(observer);
        await this.emit("observers", this._observers);
        if (this._observers.size === 0) this.emit("dirty", false);
        await this.fileMgr.emitChanged();
    }
    constructor(fileMgrIn: Manager, parentIn: IProjectFolder, nameIn: string) {
        super();
        this._fileMgr = fileMgrIn;
        this.parent = parentIn;
        this._name = nameIn;
        this.on("dirty", dirty => this._isDirty = dirty);
    }
    abstract rename(newNameIn: string): Promise<void>;
    abstract move(to: IProjectFolder, newNameIn?: string): Promise<void>;
    abstract destroy(): Promise<void>;
    abstract clone(parentIn?: IProjectFolder, nameIn?: string): IProjectItem;
    async init() {
        this.id = this.fileMgr.generateItemId(this);
        await this.emit("ready");
        await this.fileMgr.emitChanged();
    }
    async emitTreeChanged() {
        await this.emit("treeChanged");
        await (this.parent || this.fileMgr).emitTreeChanged();
    }
}
