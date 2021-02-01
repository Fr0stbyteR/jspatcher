import { SemanticICONS } from "semantic-ui-react";
import { TypedEventEmitter } from "../../utils/TypedEventEmitter";
import FileInstance, { AnyFileInstance } from "./FileInstance";
import Folder from "./Folder";
import History from "./History";
import ProjectItem from "./ProjectItem";
import TempItem from "./TempItem";

export interface FileEditorEventMap {
    "ready": never;
    "changed": never;
    "dirty": boolean;
    "saved": never;
    "locked": boolean;
    "destroy": never;
}

export type AnyFileEditor = FileEditor<any, Record<string, any>>;

export default class FileEditor<Instance extends FileInstance = FileInstance, EventMap extends Record<string, any> & Partial<FileEditorEventMap> = {}> extends TypedEventEmitter<EventMap & FileEditorEventMap> {
    static async fromProjectItem(item: ProjectItem | TempItem): Promise<FileEditor> {
        return new this(await item.instantiate());
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
    set file(value: Instance["file"]) {
        this.instance.file = value;
    }
    get ctx() {
        return this.instance.ctx;
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
    get isDirty() {
        return this.history.isDirty;
    }
    get isLocked() {
        return false;
    }
    get history(): History<any, any> {
        return null;
    }
    get fileExtension() {
        return "data";
    }
    get fileIcon(): SemanticICONS {
        return "code";
    }
    setActive() {
        this.env.activeEditor = this as AnyFileEditor;
    }
    get isActive(): boolean {
        return this.env.activeEditor === this;
    }
    handleProjectSave = async () => this.save();
    handleProjectUnload = async () => this.destroy();
    constructor(instance: Instance) {
        super();
        this.instance = instance;
        this.on("dirty", isDirty => this.file?.emit?.("dirty", isDirty));
        this.on("destroy", () => this.file?.emit?.("dirty", false));
        const handleReady = () => {
            this._isReady = true;
            this.off("ready", handleReady);
        };
        this.on("ready", handleReady);
        this.env.registerInstance(this.instance as AnyFileInstance);
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
        const data = await (this.file instanceof TempItem ? this.toTempData() : this.toFileData());
        await this.file.save(data);
        this.emit("saved");
    }
    async saveAs(parent: Folder, name: string) {
        const data = await this.toFileData();
        if (this.isTemporary) {
            await this.file.saveAsCopy(parent, name, data);
        } else if (this.isReadonly) {
            await this.file.saveAs(parent, name, data);
        } else if (this.isInMemory) {
            this.file = await parent.addProjectItem(name, data) as any;
        } else {
            await this.file.saveAs(parent, name, data);
        }
        this.isReadonly = false;
        this.emit("saved");
    }
    async destroy() {
        await this.emit("destroy");
    }
}
