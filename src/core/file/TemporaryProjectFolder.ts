import TempAudioFile from "../audio/TempAudioFile";
import TempPatcherFile from "../patcher/TempPatcherFile";
import TempTextFile from "../text/TempTextFile";
import TempData from "./TempData";
import AbstractProjectFolder, { IProjectFolder } from "./AbstractProjectFolder";
import type TemporaryProjectFile from "./TemporaryProjectFile";
import type { TempItemType } from "../types";
import type TemporaryProjectItemManager from "./TemporaryProjectItemManager";
import TempHardwareFile from "../hardware/TempHardwareFile";

export default class TemporaryProjectFolder extends AbstractProjectFolder<TemporaryProjectItemManager> {
    async init() {
        this.id = this.fileMgr.generateItemId(this);
        await this.emit("ready");
    }
    clone(parentIn = this.parent, nameIn = this._name) {
        const Ctor = this.constructor as typeof TemporaryProjectFolder;
        return new Ctor(this._fileMgr, parentIn, nameIn);
    }
    createProjectItem(name: string, isFolder: boolean, data?: any, typeIn?: TempItemType): TemporaryProjectFile {
        const type = typeIn || this.fileMgr.getTypeFromFileName(name);
        if (type === "patcher")
            return new TempPatcherFile(this.fileMgr, this, name, data);
        if (type === "audio")
            return new TempAudioFile(this.fileMgr, this, name, data);
        if (type === "text")
            return new TempTextFile(this.fileMgr, this, name, data);
        if (type === "hardware")
            return new TempHardwareFile(this.fileMgr, this, name, data);
        return new TempData(this.fileMgr, this, name, data);
    }
    async addFile(name: string, data?: any, typeIn?: TempItemType) {
        if (this.existItem(name)) throw new Error(`${name} already exists.`);
        const item = this.createProjectItem(name, false, data, typeIn);
        this.items.add(item);
        await this.emitTreeChanged();
        await item.init();
        return item;
    }
    async addFolder(name: string) {
        if (this.existItem(name)) throw new Error(`${name} already exists.`);
        const folder = new TemporaryProjectFolder(this.fileMgr, this, name);
        this.items.add(folder);
        await folder.init();
        await this.emitTreeChanged();
        await this.fileMgr.emitChanged();
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
        await this.fileMgr.emitChanged();
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
}
