import TempAudioFile from "../audio/TempAudioFile";
import TempPatcherFile from "../patcher/TempPatcherFile";
import TempTextFile from "../text/TempTextFile";
import TempData from "./TempData";
import AbstractProjectFolder, { IProjectFolder } from "./AbstractProjectFolder";
import type TemporaryProjectFile from "./TemporaryProjectFile";
import type { TempItemType } from "../types";
import type TemporaryProjectItemManager from "./TemporaryProjectItemManager";

export default class TemporaryProjectFolder extends AbstractProjectFolder<TemporaryProjectItemManager> {
    async init() {
        await this.emit("ready");
    }
    clone(parentIn = this.parent, nameIn = this._name) {
        const Ctor = this.constructor as typeof TemporaryProjectFolder;
        return new Ctor(this._fileMgr, parentIn, nameIn);
    }
    createProjectItem(name: string, isFolder: boolean, data?: any, typeIn?: TempItemType): TemporaryProjectFile {
        const type = typeIn || this.fileMgr.getTypeFromFileName(name);
        if (type === "patcher") return new TempPatcherFile(this.fileMgr, this, name, data);
        if (type === "audio") return new TempAudioFile(this.fileMgr, this, name, data);
        if (type === "text") return new TempTextFile(this.fileMgr, this, name, data);
        return new TempData(this.fileMgr, this, name, data);
    }
    async addProjectItem(name: string, data?: any, typeIn?: TempItemType) {
        if (this.existItem(name)) throw new Error(`${name} already exists.`);
        const item = this.createProjectItem(name, false, data, typeIn);
        this.items.add(item);
        await this.emitTreeChanged();
        return item;
    }
    async addFolder(name: string) {
        if (this.existItem(name)) throw new Error(`${name} already exists.`);
        const folder = new TemporaryProjectFolder(this.fileMgr, this, name);
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
        this._name = newName;
        await this.emitTreeChanged();
        await this.emit("nameChanged", { oldName, newName });
    }
    async move(to: IProjectFolder, newName = this.name) {
        if (to === this) return;
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
        await this.emit("pathChanged", { from, to });
        if (oldName !== newName) await this.emit("nameChanged", { oldName, newName });
    }
    async destroy() {
        this.parent.items.delete(this);
        await this.emitTreeChanged();
        await this.emit("destroyed");
    }
}
