import { ProjectItemType, RawProjectItem } from "../types";
import AudioFile from "../audio/AudioFile";
import ProjectItem from "./ProjectItem";
import TextFile from "../text/TextFile";
import PatcherFile from "../patcher/PatcherFile";

export default class Folder extends ProjectItem {
    type = "folder" as const;
    items: Set<ProjectItem> = new Set();
    get isDirty() {
        return !this.getDescendantFiles().every(f => !f.isDirty);
    }
    async init() {
        const items = await this.fileMgr.readDir(this.path || "/");
        for (const rawItem of items) {
            const { name, type } = rawItem;
            const item = this.getProjectItem(name, type);
            this.items.add(item);
            await this.emitTreeChanged();
            await item.init();
        }
        await this.emit("ready");
        return this;
    }
    getProjectItem(name: string, type: ProjectItemType, data?: ArrayBuffer) {
        if (type === "folder") return new Folder(this.fileMgr, this.project, this, name, data);
        if (type === "patcher") return new PatcherFile(this.fileMgr, this.project, this, name, data);
        if (type === "audio") return new AudioFile(this.fileMgr, this.project, this, name, data);
        if (type === "text") return new TextFile(this.fileMgr, this.project, this, name, data);
        return new TextFile(this.fileMgr, this.project, this, name, data);
    }
    findItem(itemIn: string) {
        return Array.from(this.items).find(item => item.name === itemIn);
    }
    existItem(itemIn: ProjectItem | string) {
        return typeof itemIn === "string" ? !!this.findItem(itemIn) : this.items.has(itemIn);
    }
    uniqueName(nameIn: string) {
        if (!this.existItem(nameIn)) return nameIn;
        let i = 0;
        let name;
        do {
            i++;
            name = `nameIn_${i}`;
        } while (this.existItem(nameIn));
        return name;
    }
    async addProjectItem(name: string, data = new ArrayBuffer(0)) {
        if (this.existItem(name)) throw new Error(`${name} already exists.`);
        const tempItem = new ProjectItem(this.fileMgr, this.project, this, name, data);
        await this.fileMgr.putFile(tempItem);
        const fileDetail = await this.fileMgr.getFileDetails(this.path, name);
        const item = this.getProjectItem(name, fileDetail.type, data);
        this.items.add(item);
        await this.emitTreeChanged();
        return item;
    }
    async addFolder(name: string) {
        if (this.existItem(name)) throw new Error(`${name} already exists.`);
        const folder = new Folder(this.fileMgr, this.project, this, name);
        await this.fileMgr.putFile(folder);
        this.items.add(folder);
        await folder.init();
        await this.emitTreeChanged();
        return folder;
    }
    async empty() {
        for (const item of this.items) {
            await item.destroy();
        }
    }
    getTree(): RawProjectItem<"folder"> {
        return {
            type: "folder",
            name: this.name,
            items: Array.from(this.items).map(item => (item.type === "folder" ? (item as Folder).getTree() : { type: item.type, name: item.name, data: item.data, items: undefined })),
            data: undefined as never
        };
    }
    getDescendantFiles() {
        return Array.from(this.items).reduce((acc, cur) => {
            if (cur.type === "folder") acc.push(...(cur as Folder).getDescendantFiles());
            else acc.push(cur);
            return acc;
        }, [] as ProjectItem[]);
    }
    isParentOf(item: ProjectItem) {
        let { parent } = item;
        while (parent !== this) {
            if (!parent) return false;
            parent = parent.parent;
        }
        return true;
    }
    getOrderedItems() {
        const items = Array.from(this.items);
        const folders = items.filter(i => i.type === "folder").sort((a, b) => a.name.localeCompare(b.name));
        const files = items.filter(i => i.type !== "folder").sort((a, b) => a.name.localeCompare(b.name));
        return [...folders, ...files];
    }
}
