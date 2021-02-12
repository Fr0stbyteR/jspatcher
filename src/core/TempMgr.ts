import TempFolder from "./file/TempFolder";
import ProjectItem from "./file/ProjectItem";
import FileManager from "./FileMgr";
import Project from "./Project";
import { RawProjectItem, RawProjectItems } from "./types";
import TempItem from "./file/TempItem";

export default class TempManager extends FileManager {
    root: TempFolder;
    async empty() {
        return true;
    }
    async init(project: Project, clean?: boolean) {
        this.root = new TempFolder(this, project, null, null);
        await this.root.init();
        this.emit("ready");
        return this;
    }
    async readFile(path: string): Promise<any> {
        throw new Error("Not Implemented");
        /* const exist = path in this.data;
        if (exist) return this.data[path];
        throw new Error(`Cannot read file ${path}`); */
    }
    async readDir(path = "/"): Promise<RawProjectItems> {
        throw new Error("Not Implemented");
        // return [];
    }
    async getFileDetails(path: string, name: string): Promise<Omit<RawProjectItem, "data" | "items">> {
        throw new Error("Not Implemented");
        /* const itemPath = `${path}/${name}`;
        const isFile = this.data[itemPath] !== $tempFolder;
        if (!isFile) return { name, type: "folder" };
        const type: ProjectItemType = isFile ? this.getTypeFromFileName(name) : "folder";
        return { name, type }; */
    }
    async exists(path: string): Promise<boolean> {
        throw new Error("Not Implemented");
        // return path in this.data;
    }
    emitTreeChanged() {
        this.emit("treeChanged", this.root.getTree());
    }
    async putFile(item: ProjectItem) {
        throw new Error("Not Implemented");
        /* const { data, path, type } = item;
        if (type === "folder") {
            if (await this.exists(path)) return;
            this.data[path] = $tempFolder;
            return;
        }
        await this.writeFile(path, data); */
    }
    async writeFile(path: string, data: any) {
        throw new Error("Not Implemented");
        /* if (await this.exists(path)) await this.remove(path);
        this.data[path] = data; */
    }
    async remove(path: string, isFolder = false): Promise<true> {
        throw new Error("Not Implemented");
        /* const exist = await this.worker.exists(path);
        if (exist) {
            if (isFolder) {
                for (const $path in this.data) {
                    if ($path.startsWith(`${$path}/`)) delete this.data[$path];
                }
            }
            delete this.data[path];
            return true as const;
        }
        throw new Error(`Cannot unlink path ${path}`); */
    }
    async rename(oldPath: string, newPath: string): Promise<true> {
        throw new Error("Not Implemented");
        /* const exist = oldPath in this.data;
        if (exist) {
            this.data[newPath] = this.data[oldPath];
            delete this.data[oldPath];
            return true as const;
        }
        throw new Error(`Cannot rename path ${oldPath}`); */
    }
    getProjectItemFromPath(path: string) {
        const pathArray = path.split("/");
        const itemArray: (TempItem | TempFolder)[] = [this.root];
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
            const next = (cur as TempFolder).findItem(id);
            if (!next) throw new Error(`Cannot find ${id} from path ${path}`);
            itemArray.push(next);
        }
        return itemArray[itemArray.length - 1];
    }
    async importFileZip() {
        throw new Error("Cannot import zip to temp");
    }
    async exportProjectZip(): Promise<ArrayBuffer> {
        throw new Error("Cannot export zip from temp");
    }
}
