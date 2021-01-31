import TempManager from "../TempMgr";
import Folder from "./Folder";
import ProjectItem from "./ProjectItem";

/**
 * An item under TempMgr, this contains in-memory data/instance.
 */
export default class TempItem extends ProjectItem {
    protected readonly _fileMgr: TempManager;
    get fileMgr() {
        return this._fileMgr;
    }
    /**
     * Override, could be any type
     */
    protected _data: any;
    get data() {
        return this._data;
    }
    async init() {
        await this.emit("ready");
        return this;
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
    async save(newData: any) {
        this._data = newData;
    }
    async saveAsCopy(parent: Folder, name: string, newData: ArrayBuffer) {
        return super.saveAsCopy(parent, name, newData);
    }
    async saveAs(to: Folder, name: string, newData: ArrayBuffer) {
        return super.saveAs(to, name, newData);
    }
}
