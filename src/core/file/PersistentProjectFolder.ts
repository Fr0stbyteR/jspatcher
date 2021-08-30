import PersistentProjectFile from "./PersistentProjectFile";
import AbstractProjectFolder, { IProjectFolder } from "./AbstractProjectFolder";
import type { IPersistentProjectItemManager } from "./PersistentProjectItemManager";

export default class PersistentProjectFolder extends AbstractProjectFolder<IPersistentProjectItemManager> {
    async init() {
        this.id = this.fileMgr.generateItemId(this);
        const items = await this.fileMgr.readDir(this.path || "/");
        for (const rawItem of items) {
            const { name, isFolder } = rawItem;
            const item = this.createProjectItem(name, isFolder);
            this.items.add(item);
            await this.emitTreeChanged();
            await item.init();
        }
        await this.emit("ready");
        await this.fileMgr.emitChanged();
    }
    clone(parentIn = this.parent, nameIn = this._name) {
        const Ctor = this.constructor as typeof PersistentProjectFolder;
        return new Ctor(this._fileMgr, parentIn, nameIn);
    }
    createProjectItem(nameIn: string, isFolder: boolean, dataIn?: ArrayBuffer): PersistentProjectFolder | PersistentProjectFile {
        if (isFolder) return new PersistentProjectFolder(this.fileMgr, this, nameIn);
        return new PersistentProjectFile(this.fileMgr, this, nameIn, dataIn);
    }
    async addFile(nameIn: string, dataIn?: ArrayBuffer) {
        if (this.existItem(nameIn)) throw new Error(`${nameIn} already exists.`);
        const tempItem = new PersistentProjectFile(this.fileMgr, this, nameIn, dataIn);
        await this.fileMgr.putFile(tempItem);
        const item = this.createProjectItem(nameIn, false, dataIn);
        this.items.add(item);
        await item.init();
        await this.emitTreeChanged();
        return item;
    }
    async addFolder(name: string) {
        if (this.existItem(name)) throw new Error(`${name} already exists.`);
        const folder = new PersistentProjectFolder(this.fileMgr, this, name);
        await this.fileMgr.putFile(folder);
        this.items.add(folder);
        await folder.init();
        await this.emitTreeChanged();
        return folder;
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
    async move(to: IProjectFolder, newName = this.name) {
        if (to === this) return;
        if (to === this.parent && newName === this.name) return;
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
        await this.emit("pathChanged", { from: from.path, to: to.path });
        if (oldName !== newName) await this.emit("nameChanged", { oldName, newName });
    }
    async destroy() {
        await this._fileMgr.remove(this.path, this.isFolder);
        this.parent.items.delete(this as any);
        await this.emitTreeChanged();
        await this.emit("destroyed");
    }
}
