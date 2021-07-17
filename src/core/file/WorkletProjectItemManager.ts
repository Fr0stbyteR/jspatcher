import AbstractProjectItemManager, { IProjectItemManager } from "./AbstractProjectItemManager";
import PersistentProjectFolder from "./PersistentProjectFolder";
import type { TypedMessagePort } from "../workers/Worker";
import type WorkletEnvProcessor from "../worklets/WorkletEnv.worklet";
import type { IProjectFolder } from "./AbstractProjectFolder";
import type { IPersistentProjectItemManager } from "./PersistentProjectItemManager";

export default class WorkletProjectItemManager extends AbstractProjectItemManager implements IPersistentProjectItemManager {
    readonly port: TypedMessagePort;
    readonly env: WorkletEnvProcessor;
    constructor(envIn: WorkletEnvProcessor) {
        super(envIn);
        this.env = envIn;
    }
    empty(): Promise<any> {
        throw new Error("Empty is not allowed from other threads.");
    }
    async init() {
        this.root = new PersistentProjectFolder(this, null, null);
        await this.root.init();
        if (!this.projectRoot) await this.root.addFolder(AbstractProjectItemManager.projectFolderName);
        this.emit("ready");
        return this;
    }
    readFile(path: string) {
        return this.env.fileMgrReadFile(path);
    }
    readDir(path?: string): Promise<{ isFolder: boolean; name: string }[]> {
        return this.env.fileMgrReadDir(path);
    }
    getFileDetails(path: string, name: string) {
        return this.env.fileMgrGetFileDetails(path, name);
    }
    exists(path: string) {
        return this.env.fileMgrExists(path);
    }
    putFile(item: { isFolder: boolean; path: string; data?: ArrayBuffer | SharedArrayBuffer }) {
        return this.env.fileMgrPutFile(item);
    }
    writeFile(path: string, data: ArrayBuffer | SharedArrayBuffer) {
        return this.env.fileMgrWriteFile(path, data);
    }
    remove(path: string, isFolder?: boolean): Promise<true> {
        throw new Error("Remove is not allowed from other threads.");
    }
    rename(oldPath: string, newPath: string): Promise<true> {
        throw new Error("Rename is not allowed from other threads.");
    }
    importFileZip(data: ArrayBuffer, subfolder?: string, to?: IProjectFolder<IProjectItemManager<{}>>, taskHost?: any): Promise<void> {
        throw new Error("Import is not allowed from other threads.");
    }
    exportProjectZip(): Promise<ArrayBuffer> {
        throw new Error("Import is not allowed from other threads.");
    }
}
