import TempManager from "../TempMgr";
import Folder from "./Folder";
import ProjectItem from "./ProjectItem";

/**
 * An item under TempMgr, this contains in-memory data/instance.
 */
export default class TempItem extends ProjectItem {
    get fileMgr(): TempManager {
        return this._fileMgr as TempManager;
    }
    /**
     * Override, could be any type
     */
    get data() {
        return this._data as any;
    }
    async init() {
        await this.emit("ready");
        return this;
    }
    async removeObserver(observer: any) {
        await super.removeObserver(observer);
        if (this._observers.size === 0) await this.destroy();
    }
    /**
     * Creating alias (do not copy the data, new item has the same ref)
     */
    clone(parentIn = this.parent, nameIn = this._name, dataIn = this.data) {
        const Ctor = this.constructor as typeof ProjectItem;
        return new Ctor(this._fileMgr, this.project, parentIn, nameIn, dataIn);
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
    async move(to: Folder, newName = this.name) {
        if (to as ProjectItem === this) return;
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
    async save(newData: any, by: any) {
        this._data = newData;
        this.emit("saved", by);
    }
    async saveAsCopy(parent: Folder, name: string, newData: ArrayBuffer) {
        const item = new ProjectItem(this.env.fileMgr, this.project, parent, name, newData);
        await this._fileMgr.putFile(item);
        parent.items.add(item);
        await this.emitTreeChanged();
        return item;
    }
    async saveAs(to: Folder, name: string, newData: ArrayBuffer, by: any) {
        const item = new ProjectItem(this.env.fileMgr, this.project, to, name, newData);
        await this.env.fileMgr.putFile(item);
        const from = this.parent;
        this.parent = to;
        this._name = name;
        const _this: ProjectItem = Object.setPrototypeOf(this, ProjectItem.prototype);
        this.parent.items.add(_this);
        await this.emitTreeChanged();
        await this.emit("pathChanged", { from, to });
        await this.emit("saved", by);
        return this;
    }
}
