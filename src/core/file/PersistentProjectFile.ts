import AbstractProjectFile from "./AbstractProjectFile";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";
import type { IFileEditor } from "./FileEditor";
import type { IFileInstance } from "./FileInstance";
import type { IProjectFolder } from "./AbstractProjectFolder";
import type { IPersistentProjectItemManager } from "./PersistentProjectItemManager";

export default class PersistentProjectFile extends AbstractProjectFile<ArrayBuffer, IPersistentProjectItemManager> {
    private _sab: SharedArrayBuffer;
    get sab() {
        return this._sab;
    }
    get data() {
        return this._data;
    }
    set data(dataIn: ArrayBuffer) {
        this._data = dataIn;
        if (dataIn instanceof SharedArrayBuffer) {
            this._sab = dataIn;
            return;
        }
        this._sab = new SharedArrayBuffer(dataIn.byteLength);
        const ui8ab = new Uint8Array(dataIn);
        const ui8sab = new Uint8Array(this._sab);
        for (let i = 0; i < ui8ab.length; i++) {
            ui8sab[i] = ui8ab[i];
        }
    }
    lastModifiedId: string;
    constructor(fileMgrIn: IPersistentProjectItemManager, parentIn: IProjectFolder, nameIn: string, dataIn?: ArrayBuffer) {
        super(fileMgrIn, parentIn, nameIn);
        this.lastModifiedId = this.id;
        if (dataIn) this.data = dataIn;
    }
    async init() {
        this.id = this.fileMgr.generateItemId(this);
        if (!this.data) this.data = await this.fileMgr.readFile(this.path);
        await this.emit("ready");
        await this.fileMgr.emitChanged();
    }
    clone(parentIn = this.parent, nameIn = this._name, dataIn = this.data) {
        const Ctor = this.constructor as typeof PersistentProjectFile;
        return new Ctor(this._fileMgr, parentIn, nameIn, dataIn);
    }
    async save(newData: ArrayBuffer, by: any) {
        this.data = newData;
        this.lastModifiedId = this.fileMgr.generateItemId(this);
        await this._fileMgr.putFile(this);
        await this.emit("saved", by);
        await this.fileMgr.emitChanged();
    }
    async saveAsCopy(parent: IProjectFolder, name: string, newData: ArrayBuffer) {
        const item = this.clone(parent, name, newData);
        await this._fileMgr.putFile(item);
        parent.items.add(item);
        await this.emitTreeChanged();
        await this.fileMgr.emitChanged();
        return item;
    }
    async saveAs(to: IProjectFolder, newName: string, newData: ArrayBuffer, by: any) {
        const { parent, name, data } = this;
        const from = parent;
        this.data = newData;
        this.lastModifiedId = this.fileMgr.generateItemId(this);
        await this.move(to, newName);
        await this._fileMgr.putFile(this);
        const item = this.clone(parent, name, data);
        await this._fileMgr.putFile(item);
        parent.items.add(item);
        await parent.emitTreeChanged();
        await this.emitTreeChanged();
        await this.emit("pathChanged", { from: from.path, to: to.path });
        await this.emit("saved", by);
        await this.fileMgr.emitChanged();
        return item;
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
        await this.fileMgr.emitChanged();
    }
    async move(to: IProjectFolder, newName = this.name) {
        if (to === this as any) return;
        if (to === this.parent && newName === this.name) return;
        if (to.existItem(newName)) throw new Error(`${newName} already exists in ${to.name}`);
        await this._fileMgr.rename(this.path, `${to.path}/${newName}`);
        const from = this.parent;
        from.items.delete(this as any);
        this.parent = to;
        const oldName = this._name;
        this._name = newName;
        this.parent.items.add(this as any);
        await from.emitTreeChanged();
        await this.emitTreeChanged();
        await this.emit("pathChanged", { from: from.path, to: to.path });
        if (oldName !== newName) await this.emit("nameChanged", { oldName, newName });
        await this.fileMgr.emitChanged();
    }
    async destroy() {
        await this._fileMgr.remove(this.path, this.isFolder);
        this.parent.items.delete(this as any);
        await this.emitTreeChanged();
        await this.emit("destroyed");
        await this.fileMgr.emitChanged();
    }
    async instantiate({ env, project, instanceId }: { env: IJSPatcherEnv; project?: IProject; instanceId?: string }): Promise<IFileInstance> {
        const { type } = this;
        const Constructor = {
            patcher: (await import("../patcher/Patcher")).default,
            audio: (await import("../audio/PatcherAudio")).default,
            image: (await import("../image/PatcherImage")).default,
            text: (await import("../text/PatcherText")).default,
            video: undefined,
            unknown: (await import("../text/PatcherText")).default
        }[type];
        if (Constructor) return Constructor.fromProjectItem({ file: this as any, env, project, instanceId }) as Promise<IFileInstance>;
        throw new Error("Not implemented.");
    }
    async instantiateEditor({ env, project, instanceId }: { env: IJSPatcherEnv; project?: IProject; instanceId?: string }): Promise<IFileEditor> {
        const { type } = this;
        const Constructor = {
            patcher: (await import("../patcher/PatcherEditor")).default,
            audio: (await import("../audio/AudioEditor")).default,
            image: (await import("../image/ImageEditor")).default,
            text: (await import("../text/TextEditor")).default,
            video: undefined,
            unknown: (await import("../text/TextEditor")).default
        }[type];
        if (Constructor) return Constructor.fromProjectItem({ file: this as any, env, project, instanceId }) as Promise<IFileEditor>;
        throw new Error("Not implemented.");
    }
}
