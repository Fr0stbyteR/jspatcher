import * as JsZip from "jszip";
import FileMgrWorker from "./workers/FileMgrWorker";
import Env from "./Env";
import { TypedEventEmitter } from "../utils/TypedEventEmitter";
import { AudioFileExtension, PatcherFileExtension, ProjectItemType, RawProjectItem, TextFileExtension } from "./types";
import ProjectItem from "./file/ProjectItem";
import Folder from "./file/Folder";
import Project from "./Project";

export interface FileManagerEventMap {
    "ready": never;
    "treeChanged": RawProjectItem<"folder">;
}
export default class FileManager extends TypedEventEmitter<FileManagerEventMap> {
    static maxFileSize = 133169152;
    static multipartSuffix = "jspatpart";
    static projectFolderName = "project";
    static patcherFileExtensions: PatcherFileExtension[] = ["jspat", "maxpat", "gendsp", "dsppat"];
    static audioFileExtensions: AudioFileExtension[] = ["wav", "mp3", "aif", "aiff", "aac", "flac", "ogg"];
    static textFileExtensions: TextFileExtension[] = ["txt", "json"];
    env: Env;
    worker: FileMgrWorker;
    root: Folder;
    get projectRoot() {
        return this.root.findItem(FileManager.projectFolderName) as Folder;
    }
    constructor(env: Env) {
        super();
        this.env = env;
        this.worker = env.fileMgrWorker;
    }
    empty() {
        return this.worker.empty();
    }
    async init(project: Project, clean?: boolean) {
        await this.worker.init();
        if (clean) await this.worker.empty();
        this.root = new Folder(this, project, null, null);
        await this.root.init();
        if (!this.projectRoot) this.projectRoot.addFolder(FileManager.projectFolderName);
        this.emit("ready");
        return this;
    }
    async readFile(path: string) {
        const exist = await this.worker.exists(path);
        if (exist) return this.worker.readFile(path);
        const multipartFilePath = `${path}.${FileManager.multipartSuffix}`;
        const existMultipart = await this.worker.exists(multipartFilePath);
        if (existMultipart) {
            const multipartFile = await this.worker.readFile(multipartFilePath);
            const numberOfParts = new Uint8Array(multipartFile)[0];
            const parts: ArrayBuffer[] = [];
            for (let i = 0; i < numberOfParts; i++) {
                const partPath = `${path}.${FileManager.multipartSuffix}${i + 1}`;
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
            const fileNames = rawFileNames.filter(name => !name.match(`\\.${FileManager.multipartSuffix}\\d+$`)).map(name => name.replace(new RegExp(`\\.${FileManager.multipartSuffix}$`), ""));
            return Promise.all(fileNames.map(name => this.getFileDetails(path, name)));
        }
        throw new Error(`Cannot read path ${path}`);
    }
    async getFileDetails(path: string, name: string): Promise<Omit<RawProjectItem, "data" | "items">> {
        const itemPath = `${path}/${name}`;
        const isFile = await this.worker.isFile(itemPath);
        if (!isFile) return { name, type: "folder" };
        const type: ProjectItemType = isFile ? this.getTypeFromFileName(name) : "folder";
        return { name, type };
    }
    private getTypeFromFileName(name: string): ProjectItemType {
        if (FileManager.patcherFileExtensions.find(ext => name.endsWith(`.${ext}`))) return "patcher";
        if (FileManager.audioFileExtensions.find(ext => name.endsWith(`.${ext}`))) return "audio";
        if (FileManager.textFileExtensions.find(ext => name.endsWith(`.${ext}`))) return "text";
        return "unknown";
    }

    async exists(path: string) {
        const multipartFilePath = `${path}.${FileManager.multipartSuffix}`;
        const exist = await this.worker.exists(path);
        const existMultipart = await this.worker.exists(multipartFilePath);
        return exist || existMultipart;
    }

    emitTreeChanged() {
        this.emit("treeChanged", this.projectRoot.getTree());
    }
    async putFile(item: ProjectItem) {
        const { data, path, type } = item;
        if (type === "folder") {
            if (this.exists(path)) return;
            this.worker.mkdir(path);
            return;
        }
        await this.writeFile(path, data);
    }
    async writeFile(path: string, data: ArrayBuffer) {
        const { maxFileSize, multipartSuffix } = FileManager;
        if (this.exists(path)) await this.remove(path);
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
    async remove(path: string) {
        const exist = await this.worker.exists(path);
        if (exist) return this.worker.unlink(path);
        const multipartFilePath = `${path}.${FileManager.multipartSuffix}`;
        const existMultipart = await this.worker.exists(multipartFilePath);
        if (existMultipart) {
            const multipartFile = await this.worker.readFile(multipartFilePath);
            const numberOfParts = new Uint8Array(multipartFile)[0];
            for (let i = 0; i < numberOfParts; i++) {
                const partPath = `${path}.${FileManager.multipartSuffix}${i + 1}`;
                await this.worker.unlink(partPath);
            }
            return this.worker.unlink(multipartFilePath);
        }
        throw new Error(`Cannot unlink path ${path}`);
    }
    async rename(oldPath: string, newPath: string) {
        const exist = await this.worker.exists(oldPath);
        if (exist) return this.worker.rename(oldPath, newPath);
        const oldMultipartFilePath = `${oldPath}.${FileManager.multipartSuffix}`;
        const newMultipartFilePath = `${newPath}.${FileManager.multipartSuffix}`;
        const existMultipart = await this.worker.exists(oldMultipartFilePath);
        if (existMultipart) {
            const multipartFile = await this.worker.readFile(oldMultipartFilePath);
            const numberOfParts = new Uint8Array(multipartFile)[0];
            for (let i = 0; i < numberOfParts; i++) {
                const oldPartPath = `${oldPath}.${FileManager.multipartSuffix}${i + 1}`;
                const newPartPath = `${newPath}.${FileManager.multipartSuffix}${i + 1}`;
                await this.worker.rename(oldPartPath, newPartPath);
            }
            return this.worker.rename(oldMultipartFilePath, newMultipartFilePath);
        }
        throw new Error(`Cannot rename path ${oldPath}`);
    }
    getProjectItemFromPath(path: string) {
        const pathArray = path.split("/");
        const itemArray: ProjectItem[] = [this.root, this.projectRoot];
        for (let i = 0; i < pathArray.length; i++) {
            const id = pathArray[i];
            if (id.length === 0) continue;
            if (id === ".") continue;
            if (id === "..") {
                itemArray.pop();
                continue;
            }
            const cur = itemArray[itemArray.length - 1];
            if (cur.type !== "folder") throw new Error(`${cur.name} from path ${path} is not a folder`);
            const next = (cur as Folder).findItem(id);
            if (!next) throw new Error(`Cannot find ${id} from path ${path}`);
            itemArray.push(next);
        }
        return itemArray[itemArray.length - 1];
    }
    instantiateProjectPath(path: string) {
        const item = this.getProjectItemFromPath(path);
        return item.instantiate();
    }
    async importFile(file: File, to: Folder = this.projectRoot) {
        const name = to.uniqueName(file.name);
        const data = await file.arrayBuffer();
        return to.addProjectItem(name, data);
    }
    async importFileZip(data: ArrayBuffer, subfolder?: string, to: Folder = this.projectRoot) {
        return this.env.taskMgr.newTask(this.constructor.name, "Unzipping file...", async (onUpdate) => {
            let folder = to;
            if (subfolder) {
                const name = to.uniqueName(subfolder);
                folder = await to.addFolder(name);
            }
            const jsZip = new JsZip();
            const zip = await jsZip.loadAsync(data);
            const unzip = async (zip: JsZip, to: Folder) => {
                for (const $name in zip.files) {
                    const $file = zip.files[$name];
                    if ($file.dir) {
                        const $zip = zip.folder($name);
                        const $folder = await to.addFolder($name);
                        await unzip($zip, $folder);
                    } else {
                        const $data = await zip.file($name).async("arraybuffer", state => onUpdate(`${state.percent}% - ${state.currentFile}`));
                        await to.addProjectItem($name, $data);
                    }
                }
            };
            await unzip(zip, folder);
        });
    }
    async exportProjectZip() {
        return this.env.taskMgr.newTask(this.constructor.name, "Zipping project...", async (onUpdate) => {
            const jsZip = new JsZip();
            const toZip = (zip: JsZip, item: ProjectItem) => {
                const { name } = item;
                if (item.type === "folder") {
                    const $zip = zip.folder(name);
                    for (const $item of (item as Folder).items) {
                        toZip($zip, $item);
                    }
                } else {
                    zip.file(name, item.data);
                }
            };
            toZip(jsZip, this.projectRoot);
            return jsZip.generateAsync({ type: "arraybuffer" }, state => onUpdate(`${state.percent}% - ${state.currentFile}`));
        });
    }
}
