import { ProjectItemType, RawProjectItem } from "../types";
import AudioFile from "../audio/AudioFile";
import ProjectItem from "./ProjectItem";

export default class Folder extends ProjectItem {
    type = "folder" as const;
    items: Set<ProjectItem> = new Set();
    async init() {
        const items = await this.fileMgr.readDir(this.path);
        for (const item of items) {
            const { name, type } = item;
            this.items.add(await this.getProjectItem(name, type));
        }
        return this;
    }
    getProjectItem(name: string, type: ProjectItemType) {
        if (type === "folder") return new Folder(this.fileMgr, this.project, this, name).init();
        if (type === "audio") return new AudioFile(this.fileMgr, this.project, this, name).init();
        return new ProjectItem(this.fileMgr, this.project, this, name).init();
    }
    findItem(itemIn: string) {
        return Array.from(this.items).find(item => item.name === itemIn);
    }
    existItem(itemIn: ProjectItem | string) {
        return typeof itemIn === "string" ? !!this.findItem(itemIn) : this.items.has(itemIn);
    }
    async addProjectItem(name: string) {
        if (!this.existItem(name)) throw new Error(`${name} already exists.`);
        const tempItem = new ProjectItem(this.fileMgr, this.project, this, name, new ArrayBuffer(0));
        await this.fileMgr.putFile(tempItem);
        const fileDetail = await this.fileMgr.getFileDetails(this.path, name);
        const item = await this.getProjectItem(name, fileDetail.type);
        this.items.add(item);
        this.fileMgr.emitTreeChanged();
        return item;
    }
    async addFolder(name: string) {
        if (!this.existItem(name)) throw new Error(`${name} already exists.`);
        const folder = new Folder(this.fileMgr, this.project, this, name);
        await this.fileMgr.putFile(folder);
        this.items.add(folder);
        this.fileMgr.emitTreeChanged();
        return folder;
    }
    getTree(): RawProjectItem<"folder"> {
        return {
            type: "folder",
            name: this.name,
            items: Array.from(this.items).map(item => (item.type === "folder" ? (item as Folder).getTree() : { type: item.type, name: item.name, data: item.data, items: undefined })),
            data: undefined as never
        };
    }
}
