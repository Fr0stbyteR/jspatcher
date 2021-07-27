import AbstractProjectItemManager, { IProjectItemManager } from "./AbstractProjectItemManager";
import PersistentProjectFolder from "./PersistentProjectFolder";
import type { TypedMessagePort } from "../workers/Worker";
import type WorkletEnvProcessor from "../worklets/WorkletEnv.worklet";
import type { IProjectFolder } from "./AbstractProjectFolder";
import type { IPersistentProjectItemManager, ProjectItemManagerDataForDiff } from "./PersistentProjectItemManager";
import type { IProjectItem } from "./AbstractProjectItem";
import type PersistentProjectFile from "./PersistentProjectFile";

export default class WorkletProjectItemManager extends AbstractProjectItemManager implements IPersistentProjectItemManager {
    readonly port: TypedMessagePort;
    readonly env: WorkletEnvProcessor;
    cachedPathIdMap: Record<string, string> = {};
    disabled = false;
    constructor(envIn: WorkletEnvProcessor) {
        super(envIn);
        this.env = envIn;
    }
    empty(): Promise<any> {
        throw new Error("Empty is not allowed from other threads.");
    }
    async init() {
        this.cachedPathIdMap = await this.env.fileMgrGetPathIdMap();
        this.root = new PersistentProjectFolder(this, null, null);
        await this.root.init();
        if (!this.projectRoot) await this.root.addFolder(AbstractProjectItemManager.projectFolderName);
        this.emit("ready");
        return this;
    }
    getDataForDiff() {
        const map: ProjectItemManagerDataForDiff = {};
        const { allItems } = this;
        for (const id in allItems) {
            const item = allItems[id] as PersistentProjectFile | PersistentProjectFolder;
            if (item.isFolder === true) map[id] = { isFolder: item.isFolder, parent: item.parent?.id, name: item.name, path: item.path };
            else map[id] = { isFolder: item.isFolder, data: item.sab, lastModifiedId: item.lastModifiedId, parent: item.parent?.id, name: item.name, path: item.path };
        }
        return map;
    }
    async processDiff(diff: ProjectItemManagerDataForDiff) {
        this.disabled = true;
        for (const id in diff) {
            const process = async (id: string): Promise<void> => {
                const $item = diff[id];
                const $parentId = $item.parent;
                let parent = this.getProjectItemFromId($parentId);
                if (!parent) await process($parentId);
                parent = this.getProjectItemFromId($parentId) as PersistentProjectFolder;
                const current = this.getProjectItemFromId(id) as PersistentProjectFile | PersistentProjectFolder;
                if (!current) {
                    if (parent.isFolder === true) {
                        this.cachedPathIdMap[$item.path] = id;
                        if ($item.isFolder === true) {
                            await parent.addFolder($item.name);
                        } else {
                            const newFile = await parent.addFile($item.name, $item.data) as PersistentProjectFile;
                            newFile.lastModifiedId = $item.lastModifiedId;
                        }
                    }
                } else {
                    if (current.isFolder === false && $item.isFolder === false) {
                        if (current.lastModifiedId !== $item.lastModifiedId) await current.save($item.data, this);
                        if (current.name !== $item.name) await current.rename($item.name);
                        if (current.parent?.id !== $item.parent) await current.move(parent);
                    }
                }
            };
            await process(id);
        }
        this.disabled = false;
    }
    generateItemId(item: IProjectItem) {
        const id = this.cachedPathIdMap[item.path];
        delete this.cachedPathIdMap[item.path];
        return id;
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
        if (this.disabled) return null;
        return this.env.fileMgrPutFile(item);
    }
    async writeFile(path: string, data: ArrayBuffer | SharedArrayBuffer) {
        if (this.disabled) return null;
        return this.env.fileMgrWriteFile(path, data);
    }
    async remove(path: string, isFolder?: boolean) {
        return true;
    }
    async rename(oldPath: string, newPath: string) {
        return true;
    }
    importFileZip(data: ArrayBuffer, subfolder?: string, to?: IProjectFolder<IProjectItemManager<{}>>, taskHost?: any): Promise<void> {
        throw new Error("Import is not allowed from other threads.");
    }
    exportProjectZip(): Promise<ArrayBuffer> {
        throw new Error("Import is not allowed from other threads.");
    }
}
