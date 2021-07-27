import type * as JsZip from "jszip";
import AbstractProjectItemManager, { IProjectItemManager } from "./AbstractProjectItemManager";
import PersistentProjectFolder from "./PersistentProjectFolder";
import { sab2ab } from "../../utils/utils";
import type FileMgrWorker from "../workers/FileMgrWorker";
import type { IProjectFolder } from "./AbstractProjectFolder";
import type { IJSPatcherEnv } from "../Env";
import type PersistentProjectFile from "./PersistentProjectFile";
import type { IProjectItem } from "./AbstractProjectItem";

export type ProjectItemManagerDataForDiff = Record<string, { isFolder: true; parent: string; name: string; path: string } | { isFolder: false; data: SharedArrayBuffer; lastModifiedId: string; parent: string; name: string; path: string }>;

export interface IPersistentProjectItemManager extends IProjectItemManager {
    /** Read file data from backend */
    readFile(path: string): Promise<ArrayBuffer>;
    /** Read folder data from backend */
    readDir(path?: string): Promise<{ isFolder: boolean; name: string }[]>;
    getFileDetails(path: string, name: string): Promise<{ isFolder: boolean; name: string }>;
    /** Returns if the path exists in the backend */
    exists(path: string): Promise<boolean>;
    /** Put a projectItem into the backend */
    putFile(item: { isFolder: boolean; path: string; data?: ArrayBuffer }): Promise<void>;
    writeFile(path: string, data: ArrayBuffer): Promise<void>;
    remove(path: string, isFolder?: boolean): Promise<boolean>;
    rename(oldPath: string, newPath: string): Promise<boolean>;
    getDataForDiff(): ProjectItemManagerDataForDiff;
    processDiff(diff: ProjectItemManagerDataForDiff): Promise<void>;
    importFileZip(data: ArrayBuffer, subfolder?: string, to?: IProjectFolder, taskHost?: any): Promise<void>;
    exportProjectZip(): Promise<ArrayBuffer>;
}

export default class PersistentProjectItemManager extends AbstractProjectItemManager implements IPersistentProjectItemManager {
    static maxFileSize = 133169152;
    static multipartSuffix = "jspatpart";
    readonly worker: FileMgrWorker;
    JsZip: typeof JsZip;
    workerInited = false;
    cachedPathIdMap: Record<string, string> = {};
    get projectRoot() {
        return this.root.findItem(AbstractProjectItemManager.projectFolderName) as IProjectFolder;
    }
    constructor(envIn: IJSPatcherEnv, worker?: FileMgrWorker) {
        super(envIn);
        this.worker = worker;
    }
    empty() {
        return this.worker.empty();
    }
    async init(clean?: boolean) {
        if (!this.JsZip) this.JsZip = (await import("jszip") as any).default;
        if (!this.workerInited) {
            await this.worker.init();
            this.workerInited = true;
        }
        if (clean) await this.worker.empty();
        this.root = new PersistentProjectFolder(this, null, null);
        await this.root.init();
        if (!this.projectRoot) await this.root.addFolder(AbstractProjectItemManager.projectFolderName);
        this.emit("ready");
        return this;
    }
    async readFile(path: string) {
        const exist = await this.worker.exists(path);
        if (exist) return this.worker.readFile(path);
        const multipartFilePath = `${path}.${PersistentProjectItemManager.multipartSuffix}`;
        const existMultipart = await this.worker.exists(multipartFilePath);
        if (existMultipart) {
            const multipartFile = await this.worker.readFile(multipartFilePath);
            const numberOfParts = new Uint8Array(multipartFile)[0];
            const parts: ArrayBuffer[] = [];
            for (let i = 0; i < numberOfParts; i++) {
                const partPath = `${path}.${PersistentProjectItemManager.multipartSuffix}${i + 1}`;
                parts[i] = await this.worker.readFile(partPath);
            }
            const concatBlob = new Blob(parts);
            const response = new Response(concatBlob);
            return response.arrayBuffer();
        }
        throw new Error(`Cannot read file ${path}`);
    }
    async readDir(path = "/") {
        const exist = (await this.worker.exists(path)) && !(await this.worker.isFile(path));
        if (exist) {
            const rawFileNames = await this.worker.readdir(path);
            const fileNames = rawFileNames.filter(name => !name.match(`\\.${PersistentProjectItemManager.multipartSuffix}\\d+$`)).map(name => name.replace(new RegExp(`\\.${PersistentProjectItemManager.multipartSuffix}$`), ""));
            return Promise.all(fileNames.map(name => this.getFileDetails(path, name)));
        }
        throw new Error(`Cannot read path ${path}`);
    }
    async getFileDetails(path: string, name: string): Promise<{ isFolder: boolean; name: string }> {
        const itemPath = `${path}/${name}`;
        const isFile = await this.worker.isFile(itemPath);
        return { name, isFolder: !isFile };
    }

    async exists(path: string) {
        const multipartFilePath = `${path}.${PersistentProjectItemManager.multipartSuffix}`;
        const exist = await this.worker.exists(path);
        const existMultipart = await this.worker.exists(multipartFilePath);
        return exist || existMultipart;
    }
    async putFile({ data, path, isFolder }: { isFolder: boolean; path: string; data?: ArrayBuffer }) {
        if (isFolder) {
            if (await this.exists(path)) return;
            await this.worker.mkdir(path);
            return;
        }
        await this.writeFile(path, data);
    }
    async writeFile(path: string, data: ArrayBuffer) {
        const { maxFileSize, multipartSuffix } = PersistentProjectItemManager;
        if (await this.exists(path)) await this.remove(path);
        if (data.byteLength <= maxFileSize) {
            await this.worker.createFile(path, new Uint8Array(data));
        } else {
            const parts = Math.ceil(data.byteLength / maxFileSize);
            const multiPartFilePath = `${path}.${multipartSuffix}`;
            const multiPartFileData = new Uint8Array([parts]);
            const ui8Data = new Uint8Array(data);
            await this.worker.createFile(multiPartFilePath, multiPartFileData);
            for (let i = 0; i < parts; i++) {
                const curPath = `${path}.${multipartSuffix}${i + 1}`;
                const curData = ui8Data.subarray(i * maxFileSize, Math.min((i + 1) * maxFileSize, data.byteLength));
                await this.worker.createFile(curPath, curData);
            }
        }
    }
    async remove(path: string, isFolder = false) {
        const exist = await this.worker.exists(path);
        if (exist) {
            if (isFolder) {
                const recRmdir = async (path: string) => {
                    const children = await this.worker.readdir(path);
                    for (const child of children) {
                        const $path = `${path}/${child}`;
                        if (await this.worker.isFile($path)) await this.worker.unlink($path);
                        else await recRmdir($path);
                    }
                    return this.worker.rmdir(path);
                };
                return recRmdir(path);
            }
            return this.worker.unlink(path);
        }
        const multipartFilePath = `${path}.${PersistentProjectItemManager.multipartSuffix}`;
        const existMultipart = await this.worker.exists(multipartFilePath);
        if (existMultipart) {
            const multipartFile = await this.worker.readFile(multipartFilePath);
            const numberOfParts = new Uint8Array(multipartFile)[0];
            for (let i = 0; i < numberOfParts; i++) {
                const partPath = `${path}.${PersistentProjectItemManager.multipartSuffix}${i + 1}`;
                await this.worker.unlink(partPath);
            }
            return this.worker.unlink(multipartFilePath);
        }
        throw new Error(`Cannot unlink path ${path}`);
    }
    async rename(oldPath: string, newPath: string) {
        const exist = await this.worker.exists(oldPath);
        if (exist) return this.worker.rename(oldPath, newPath);
        const oldMultipartFilePath = `${oldPath}.${PersistentProjectItemManager.multipartSuffix}`;
        const newMultipartFilePath = `${newPath}.${PersistentProjectItemManager.multipartSuffix}`;
        const existMultipart = await this.worker.exists(oldMultipartFilePath);
        if (existMultipart) {
            const multipartFile = await this.worker.readFile(oldMultipartFilePath);
            const numberOfParts = new Uint8Array(multipartFile)[0];
            for (let i = 0; i < numberOfParts; i++) {
                const oldPartPath = `${oldPath}.${PersistentProjectItemManager.multipartSuffix}${i + 1}`;
                const newPartPath = `${newPath}.${PersistentProjectItemManager.multipartSuffix}${i + 1}`;
                await this.worker.rename(oldPartPath, newPartPath);
            }
            return this.worker.rename(oldMultipartFilePath, newMultipartFilePath);
        }
        throw new Error(`Cannot rename path ${oldPath}`);
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
                            const newFile = await parent.addFile($item.name, sab2ab($item.data)) as PersistentProjectFile;
                            newFile.lastModifiedId = $item.lastModifiedId;
                        }
                    }
                } else {
                    if (current.isFolder === false && $item.isFolder === false) {
                        if (current.lastModifiedId !== $item.lastModifiedId) await current.save(sab2ab($item.data), this);
                        if (current.name !== $item.name) await current.rename($item.name);
                        if (current.parent?.id !== $item.parent) await current.move(parent);
                    }
                }
            };
            await process(id);
        }
    }
    generateItemId(item: IProjectItem) {
        if (item.path in this.cachedPathIdMap) {
            const id = this.cachedPathIdMap[item.path];
            delete this.cachedPathIdMap[item.path];
            return id;
        }
        return super.generateItemId(item);
    }
    async importFile(file: File, to: IProjectFolder = this.projectRoot) {
        const name = to.uniqueName(file.name);
        const data = await file.arrayBuffer();
        return to.addFile(name, data);
    }
    async importFileZip(data: ArrayBuffer, subfolder?: string, to: IProjectFolder = this.projectRoot, taskHost: any = this) {
        return this.env.taskMgr.newTask(taskHost, "Unzipping file...", async (onUpdate) => {
            let folder = to;
            if (subfolder) {
                const name = to.uniqueName(subfolder);
                folder = await to.addFolder(name);
            }
            const jsZip = new this.JsZip();
            const zip = await jsZip.loadAsync(data);
            const unzip = async (zip: JsZip, to: IProjectFolder) => {
                for (const $nameIn in zip.files) {
                    const splitted = $nameIn.split("/").filter(v => !!v);
                    const $file = zip.files[$nameIn];
                    let $to = to;
                    if ($file.dir) {
                        for (let i = 0; i < splitted.length; i++) {
                            const $name = splitted[i];
                            if ($to.existItem($name)) $to = $to.findItem($name) as IProjectFolder;
                            else $to = await $to.addFolder($name);
                        }
                    } else {
                        for (let i = 0; i < splitted.length - 1; i++) {
                            const $name = splitted[i];
                            if ($to.existItem($name)) $to = $to.findItem($name) as IProjectFolder;
                            else $to = await $to.addFolder($name);
                        }
                        const $name = splitted[splitted.length - 1];
                        const $data = await $file.async("arraybuffer", state => onUpdate(`${$nameIn} - ${state.percent.toFixed(2)}%`));
                        if ($to.existItem($name)) continue;
                        await $to.addFile($name, $data);
                    }
                }
            };
            await unzip(zip, folder);
        });
    }
    async exportProjectZip() {
        return this.env.taskMgr.newTask(this, "Zipping project...", async (onUpdate) => {
            const jsZip = new this.JsZip();
            const toZip = (zip: JsZip, folder: IProjectFolder) => {
                for (const item of folder.items) {
                    const { name } = item;
                    if (item.isFolder === true) {
                        const $zip = zip.folder(name);
                        toZip($zip, item);
                    } else {
                        zip.file(name, item.data);
                    }
                }
            };
            toZip(jsZip, this.projectRoot);
            return jsZip.generateAsync({ type: "arraybuffer" }, state => onUpdate(`${state.percent}% - ${state.currentFile}`));
        });
    }
}
