import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";
import type { ProjectItemType } from "../types";
import type { IProjectItemManager } from "./AbstractProjectItemManager";
import type { IFileEditor } from "./FileEditor";
import type { IFileInstance } from "./FileInstance";
import type { IProjectFolder } from "./AbstractProjectFolder";
import AbstractProjectItem, { IProjectItem, ProjectItemEventMap } from "./AbstractProjectItem";

export interface ProjectFileEventMap extends ProjectItemEventMap {
    "saved": any; // here emit with the object who performed the saving
}

export interface IProjectFile<Data = any, Manager extends IProjectItemManager = IProjectItemManager> extends IProjectItem<ProjectFileEventMap, Manager> {
    readonly type: Exclude<ProjectItemType, "folder">;
    readonly isFolder: false;
    readonly data: Data;
    readonly fileExtension: string;
    clone(parentIn?: IProjectFolder, nameIn?: string, dataIn?: Data): IProjectFile<Data>;
    /**
     * This method calls default instantiation (from the file manager).
     * Please use `FileInstance.fromProjectItem(item)` for a better instantiation.
     */
    instantiate(options: { env: IJSPatcherEnv; project?: IProject; instanceId?: string }): Promise<IFileInstance>;
    instantiateEditor(options: { env: IJSPatcherEnv; project?: IProject; instanceId?: string }): Promise<IFileEditor>;
    /**
     * Save the data to the file manager
     *
     * @param newDataIn new data to save
     * @param by the editor who performs the save
     */
    save(newDataIn: Data, by: any): Promise<void>;
    /** Save the data to a new file, not modifying the current file, nor point current editing file to the new one. */
    saveAsCopy(parentIn: IProjectFolder, nameIn: string, newDataIn: any, manager?: IProjectItemManager): Promise<IProjectFile>;
    /**
     * Not modifying the current file, save to a new file and point current editing file to the new one.
     *
     * @param to the folder that will contain the new file to save
     * @param newNameIn new file name to save
     * @param newDataIn new data to save
     * @param by the editor who performs the save
     */
    saveAs(to: IProjectFolder, newNameIn: string, newDataIn: any, by: any, manager?: IProjectItemManager): Promise<IProjectFile>;
}

export default abstract class AbstractProjectFile<Data = ArrayBuffer, Manager extends IProjectItemManager<any> = IProjectItemManager> extends AbstractProjectItem<ProjectFileEventMap, Manager> implements IProjectFile<Data, Manager> {
    get type() {
        return this.fileMgr.getTypeFromFileName(this.name) as Exclude<ProjectItemType, "folder">;
    }
    readonly isFolder = false;
    protected _data: Data;
    get data() {
        return this._data;
    }
    set data(dataIn: Data) {
        this._data = dataIn;
    }
    get fileExtension() {
        const splitted = this.name.split(".");
        return splitted[splitted.length - 1];
    }
    constructor(fileMgrIn: Manager, parentIn: IProjectFolder, nameIn: string, dataIn?: Data) {
        super(fileMgrIn, parentIn, nameIn);
        if (dataIn) this._data = dataIn;
        this.onAny(({ eventName, eventData }) => {
            const { id, isFolder, type, path, data } = this;
            this.fileMgr.emit("itemChanged", { id, isFolder, type, path, data, eventName, eventData });
        });
    }
    abstract clone(parentIn?: IProjectFolder, nameIn?: string, dataIn?: Data): IProjectFile<Data>;
    abstract instantiate(options: { env: IJSPatcherEnv; project?: IProject; instanceId?: string }): Promise<IFileInstance>;
    abstract instantiateEditor(options: { env: IJSPatcherEnv; project?: IProject; instanceId?: string }): Promise<IFileEditor>;
    async save(newData: Data, by: any) {
        this._data = newData;
        await this.emit("saved", by);
        await this.fileMgr.emitChanged();
    }
    async saveAsCopy(parent: IProjectFolder, name: string, newData: any, manager?: IProjectItemManager): Promise<IProjectFile> {
        const item = this.clone(parent, name, newData);
        parent.items.add(item);
        await this.emitTreeChanged();
        await this.fileMgr.emitChanged();
        return item;
    }
    async saveAs(to: IProjectFolder, newName: string, newData: any, by: any, manager?: IProjectItemManager): Promise<IProjectFile> {
        const { parent, name, data } = this;
        const from = parent;
        this._data = newData;
        await this.move(to, newName);
        const item = this.clone(parent, name, data);
        parent.items.add(item);
        await parent.emitTreeChanged();
        await this.emitTreeChanged();
        await this.emit("pathChanged", { from: from.path, to: to.path });
        await this.emit("saved", by);
        await this.fileMgr.emitChanged();
        return item;
    }
}
