import type { SemanticICONS } from "semantic-ui-react";
import TypedEventEmitter, { ITypedEventEmitter } from "../../utils/TypedEventEmitter";
import History from "./History";
import TemporaryProjectFile from "./TemporaryProjectFile";
import type { IFileInstance } from "./FileInstance";
import type { IProjectFile } from "./AbstractProjectFile";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";
import type { IProjectFolder } from "./AbstractProjectFolder";

export interface FileEditorEventMap {
    "ready": never;
    "changed": never;
    "dirty": boolean;
    "saved": never;
    "locked": boolean;
    "destroy": never;
}

export interface IFileEditor<Instance extends IFileInstance = IFileInstance, EventMap extends Record<string, any> & Partial<FileEditorEventMap> = {}> extends ITypedEventEmitter<EventMap & FileEditorEventMap> {
    readonly instance: Instance;
    readonly env: IJSPatcherEnv;
    readonly project: IProject;
    readonly ctx: IFileInstance["ctx"];
    readonly isInMemory: boolean;
    readonly isTemporary: boolean;
    isReadonly: boolean;
    readonly isReady: boolean;
    readonly isDestroyed: boolean;
    readonly isDirty: boolean;
    readonly isLocked: boolean;
    readonly isActive: boolean;
    readonly editorId: string;
    readonly fileExtension: string;
    readonly fileIcon: SemanticICONS;
    file: IProjectFile;
    setActive(): void;
    undo(): Promise<void>;
    redo(): Promise<void>;
    copy(): Promise<void>;
    cut(): Promise<void>;
    paste(): Promise<void>;
    deleteSelected(): Promise<any>;
    selectAll(): Promise<void>;
    onUiResized(): void;
    save(): Promise<void>;
    saveAs(parent: any, name: string): Promise<void>;
    destroy(): Promise<void>;
}

export type AnyFileEditor = FileEditor<any, Record<string, any>>;

export default class FileEditor<Instance extends IFileInstance = IFileInstance, EventMap extends Record<string, any> & Partial<FileEditorEventMap> = {}> extends TypedEventEmitter<EventMap & FileEditorEventMap> implements IFileEditor<Instance, EventMap> {
    static async fromProjectItem({ file, env, project, instanceId }: { file: IProjectFile; env: IJSPatcherEnv; project?: IProject; instanceId?: string }): Promise<IFileEditor> {
        return new this(await file.instantiate({ env, project, instanceId }));
    }
    readonly instance: Instance;
    get env() {
        return this.instance.env;
    }
    get project() {
        return this.instance.project;
    }
    get file() {
        return this.instance.file;
    }
    set file(value) {
        this.instance.file = value;
    }
    get ctx() {
        return this.instance.ctx;
    }
    get isInMemory() {
        return this.instance.isInMemory;
    }
    get isTemporary() {
        return this.instance.isTemporary;
    }
    get isReadonly() {
        return this.instance.isReadonly;
    }
    set isReadonly(value) {
        this.instance.isReadonly = value;
    }
    protected _isReady = false;
    get isReady() {
        return this._isReady;
    }
    protected _isDestroyed = false;
    get isDestroyed() {
        return this._isDestroyed;
    }
    get isDirty() {
        return this.history?.isDirty;
    }
    get isLocked() {
        return false;
    }
    get history(): History<Partial<EventMap>, this> {
        return this.instance.history;
    }
    get fileExtension() {
        return "data";
    }
    get fileIcon(): SemanticICONS {
        return "code";
    }
    setActive() {
        this.env.activeEditor = this;
    }
    get isActive(): boolean {
        return this.env.thread === "main" && this.env.activeEditor === this;
    }
    readonly editorId: string;
    handleProjectSave = async () => this.save();
    handleProjectUnload = async () => this.destroy();
    handleDestroy = () => this.destroy();
    constructor(instance: Instance) {
        super();
        this.instance = instance;
        this.instance?.addObserver(this);
        this.instance.on("destroy", this.handleDestroy);
        this.history?.addEditor(this);
        this.on("dirty", async (isDirty) => {
            if (this.env.autoSave && !this.isReadonly && !this.isInMemory) await this.save();
            else this.file?.emit("dirty", isDirty);
        });
        this.env.on("options", ({ options: { autoSave } }) => {
            if (autoSave && !this.isReadonly && !this.isInMemory) this.save();
        });
        this.on("destroy", () => this.file?.emit("dirty", false));
        const handleReady = () => {
            this._isReady = true;
            this.off("ready", handleReady);
        };
        this.on("ready", handleReady);
        this.editorId = this.env.generateId(this);
        if (this.env.thread === "main") this.env.registerInstance(this.instance);
        if (this.project) {
            this.project.on("save", this.handleProjectSave);
            this.project.on("unload", this.handleProjectUnload);
        }
    }
    async toFileData() {
        return this.instance.serialize();
    }
    async toTempData(): Promise<any> {
        return this.instance;
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
        if (this.isReadonly) throw new Error("Cannot save readonly file");
        if (this.isInMemory) throw new Error("Cannot save in-memory instance");
        const data = await (this.file instanceof TemporaryProjectFile ? this.toTempData() : this.toFileData());
        await this.file.save(data, this);
        await this.emit("saved");
    }
    async saveAs(parent: IProjectFolder, name: string) {
        const data = await this.toFileData();
        if (this.isTemporary) {
            await this.file.saveAsCopy(parent, name, data);
        } else if (this.isReadonly) {
            await this.file.saveAs(parent, name, data, this);
        } else if (this.isInMemory) {
            this.file = await parent.addFile(name, data) as any;
        } else {
            await this.file.saveAs(parent, name, data, this);
        }
        this.isReadonly = false;
        await this.emit("saved");
    }
    async destroy() {
        if (this.isDestroyed) return;
        if (this.project) {
            this.project.off("save", this.handleProjectSave);
            this.project.off("unload", this.handleProjectUnload);
        }
        this.instance.off("destroy", this.handleDestroy);
        this.instance.removeObserver(this);
        this.history?.removeEditor(this);
        this._isDestroyed = true;
        await this.emit("destroy");
    }
}
