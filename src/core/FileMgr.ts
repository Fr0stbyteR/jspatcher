import FileMgrWorker from "./workers/FileMgrWorker";
import Env from "./Env";
import { TypedEventEmitter } from "../utils/TypedEventEmitter";
import { AudioFileExtension, PatcherFileExtension, ProjectItemType, RawProjectItem, TextFileExtension } from "./types";
import ProjectItem from "./file/ProjectItem";
import Folder from "./file/Folder";

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
    projectRoot: Folder;
    constructor(env: Env) {
        super();
        this.env = env;
        this.worker = env.fileMgrWorker;
    }
    empty() {
        return this.worker.empty();
    }
    async init(clean?: boolean) {
        await this.worker.init();
        if (clean) await this.worker.empty();
        this.root = new Folder(this, null, null);
        await this.root.init();
        this.projectRoot = this.root.findItem(FileManager.projectFolderName) as Folder;
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
        let type: ProjectItemType = isFile ? "unknown" : "folder";
        if (FileManager.patcherFileExtensions.find(ext => name.endsWith(`.${ext}`))) type = "patcher";
        else if (FileManager.audioFileExtensions.find(ext => name.endsWith(`.${ext}`))) type = "audio";
        else if (FileManager.textFileExtensions.find(ext => name.endsWith(`.${ext}`))) type = "text";
        else type = "unknown";
        return { name, type };
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
        const { maxFileSize, multipartSuffix } = FileManager;
        const { data, path, type } = item;
        if (type === "folder") {
            if (this.exists(path)) return;
            this.worker.mkdir(path);
            return;
        }
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
}
