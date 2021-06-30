import TypedEventEmitter from "../../utils/TypedEventEmitter";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";
import type { IObservee } from "../types";
import type { AnyFileEditor } from "./FileEditor";
import type { IProjectFile } from "./AbstractProjectFile";
import TemporaryProjectFile from "./TemporaryProjectFile";

export interface FileInstanceEventMap {
    "observers": Set<any>;
    "ready": never;
    "changed": never;
    "destroy": never;
}

export interface IFileInstance<EventMap extends Record<string, any> & Partial<FileInstanceEventMap> = {}, File extends IProjectFile = IProjectFile> extends TypedEventEmitter<EventMap & FileInstanceEventMap>, IObservee {
    file?: File;
    readonly env: IJSPatcherEnv;
    readonly project: IProject;
    readonly ctx: File | IProject | IJSPatcherEnv;
    /** Means it doesn't have a file to save */
    readonly isInMemory: boolean;
    /** Means it doesn't have a file to save in the backend */
    readonly isTemporary: boolean;
    isReadonly: boolean;
    isReady: boolean;
    readonly isActive: boolean;
    readonly _instanceId: string;
    init(): Promise<this>;
    setActive(): void;
    getEditor(): Promise<AnyFileEditor>;
    serialize(): Promise<ArrayBuffer>;
    destroy(): Promise<void>;
}

export type AnyFileInstance = IFileInstance<Record<string, any>>;

export default abstract class FileInstance<EventMap extends Record<string, any> & Partial<FileInstanceEventMap> = {}, File extends IProjectFile = IProjectFile> extends TypedEventEmitter<EventMap & FileInstanceEventMap> implements IFileInstance<EventMap, File> {
    private readonly _env: IJSPatcherEnv;
    get env() {
        return this._env;
    }
    private readonly _project: IProject;
    get project(): IProject {
        return this._project;
    }
    private _file?: File;
    get file(): File {
        return this._file;
    }
    set file(value) {
        if (value === this._file) return;
        this._file?.removeObserver(this._instanceId);
        this._file = value;
        this._file?.addObserver(this._instanceId);
    }
    get ctx(): File | IProject | IJSPatcherEnv {
        return this.file || this.project || this.env;
    }
    get isInMemory() {
        return !this.file;
    }
    get isTemporary() {
        return this.file instanceof TemporaryProjectFile;
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
    readonly _instanceId = performance.now().toString();
    constructor(envIn: IJSPatcherEnv, projectIn?: IProject, fileIn?: File) {
        super();
        this._env = envIn;
        this._project = projectIn;
        this._file = fileIn;
        this._file.addObserver(this._instanceId);
        this._instanceId = this.env.registerInstance(this);
    }
    async init() {
        return this;
    }
    async serialize(): Promise<ArrayBuffer> {
        throw new Error("Not implemented.");
    }
    async destroy() {
        await this.emit("destroy");
        await this.file?.removeObserver(this._instanceId);
    }
}
