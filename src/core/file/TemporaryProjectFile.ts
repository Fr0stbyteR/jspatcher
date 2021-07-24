import AbstractProjectFile from "./AbstractProjectFile";
import PersistentProjectFile from "./PersistentProjectFile";
import type TemporaryProjectItemManager from "./TemporaryProjectItemManager";
import type PersistentProjectItemManager from "./PersistentProjectItemManager";
import type { IProjectFolder } from "./AbstractProjectFolder";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";
import type { IFileEditor } from "./FileEditor";
import type { IFileInstance } from "./FileInstance";

/**
 * An item under TempMgr, this contains in-memory data/instance.
 */
export default class TemporaryProjectFile<Data = any> extends AbstractProjectFile<Data, TemporaryProjectItemManager> {
    async removeObserver(observer: string) {
        await super.removeObserver(observer);
        await this.fileMgr.emitChanged();
        if (this._observers.size === 0) await this.destroy();
    }
    /**
     * Creating alias (do not copy the data, new item has the same ref)
     */
    clone(parentIn = this.parent, nameIn = this._name, dataIn = this.data) {
        const Ctor = this.constructor as typeof TemporaryProjectFile;
        return new Ctor(this._fileMgr, parentIn, nameIn, dataIn);
    }
    async rename(newNameIn: string) {
        const newName = newNameIn.trim();
        const oldName = this._name;
        if (newName === oldName) return;
        if (this.parent.existItem(newNameIn)) throw new Error(`${newName} already exists.`);
        this._name = newName;
        await this.emitTreeChanged();
        await this.emit("nameChanged", { oldName, newName });
        await this.fileMgr.emitChanged();
    }
    async move(to: IProjectFolder, newName = this.name) {
        if (to === this as any) return;
        if (to === this.parent) return;
        if (to.existItem(newName)) throw new Error(`${newName} already exists in ${to.name}`);
        const from = this.parent;
        from.items.delete(this);
        this.parent = to;
        const oldName = this._name;
        this._name = newName;
        this.parent.items.add(this);
        await from.emitTreeChanged();
        await this.emitTreeChanged();
        await this.emit("pathChanged", { from: from.path, to: to.path });
        if (oldName !== newName) await this.emit("nameChanged", { oldName, newName });
        await this.fileMgr.emitChanged();
    }
    async destroy() {
        this.parent.items.delete(this);
        await this.emitTreeChanged();
        await this.emit("destroyed");
        await this.fileMgr.emitChanged();
    }
    async save(newData: Data, by: any) {
        this._data = newData;
        this.emit("saved", by);
        await this.fileMgr.emitChanged();
    }
    async saveAsCopy(parent: IProjectFolder, name: string, newData: ArrayBuffer, persistentMgr?: PersistentProjectItemManager) {
        const item = new PersistentProjectFile(persistentMgr, parent, name, newData);
        await persistentMgr.putFile(item);
        parent.items.add(item);
        await this.emitTreeChanged();
        await this.fileMgr.emitChanged();
        return item;
    }
    async saveAs(to: IProjectFolder, name: string, newData: ArrayBuffer, by: any, persistentMgr: PersistentProjectItemManager) {
        const item = new PersistentProjectFile(persistentMgr, to, name, newData);
        await persistentMgr.putFile(item);
        const from = this.parent;
        this.parent = to;
        this._name = name;
        const _this: PersistentProjectFile = Object.setPrototypeOf(this, PersistentProjectFile.prototype);
        this.parent.items.add(_this);
        await this.emitTreeChanged();
        await this.emit("pathChanged", { from: from.path, to: to.path });
        await this.emit("saved", by);
        await this.fileMgr.emitChanged();
        return this;
    }
    async instantiate(options: { env: IJSPatcherEnv; project?: IProject; instanceId?: string }): Promise<IFileInstance> {
        throw new Error("Not implemented.");
        // new instance Patcher / AudioBuffer etc
    }
    async instantiateEditor(options: { env: IJSPatcherEnv; project?: IProject; instanceId?: string }): Promise<IFileEditor> {
        throw new Error("Not implemented.");
    }
}
