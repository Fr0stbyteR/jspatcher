import type { RawProjectItem } from "../types";
import type { IProjectItemManager } from "./AbstractProjectItemManager";
import AbstractProjectItem, { IProjectFileOrFolder, IProjectItem } from "./AbstractProjectItem";

export interface IProjectFolder<Manager extends IProjectItemManager = IProjectItemManager> extends IProjectItem<{}, Manager> {
    readonly type: "folder";
    readonly isFolder: true;
    readonly items: Set<IProjectFileOrFolder>;
    clone(parentIn?: IProjectFolder, nameIn?: string): IProjectFolder;
    createProjectItem(nameIn: string, isFolder: boolean, dataIn?: any): IProjectFileOrFolder;
    findItem(itemIn: string): IProjectFileOrFolder;
    existItem(itemIn: IProjectFileOrFolder | string): boolean;
    uniqueName(nameIn: string): string;
    addFile(nameIn: string, dataIn?: any): Promise<IProjectFileOrFolder>;
    addFolder(nameIn: string): Promise<IProjectFolder>;
    empty(): Promise<void>;
    getTree(): RawProjectItem<"folder">;
    getDescendantFiles(): IProjectFileOrFolder[];
    isParentOf(itemIn: IProjectItem): boolean;
    getOrderedItems(): IProjectFileOrFolder[];
    emitTreeChanged(): Promise<void>;
}

export default abstract class AbstractProjectFolder<Manager extends IProjectItemManager = IProjectItemManager> extends AbstractProjectItem<{}, Manager> implements IProjectFolder<Manager> {
    get type(): "folder" {
        return "folder";
    }
    readonly isFolder = true;
    items: Set<IProjectFileOrFolder> = new Set();
    get isDirty() {
        return !this.getDescendantFiles().every(f => !f.isDirty);
    }
    constructor(fileMgrIn: Manager, parentIn: IProjectFolder, nameIn: string) {
        super(fileMgrIn, parentIn, nameIn);
        this.onAny((eventName, eventData) => {
            const { id, isFolder, type, path } = this;
            this.fileMgr.emit("itemChanged", { id, isFolder, type, path, eventName, eventData });
        });
    }
    abstract clone(parentIn?: IProjectFolder, nameIn?: string): IProjectFolder;
    abstract createProjectItem(nameIn: string, isFolder: boolean, dataIn?: any): IProjectFileOrFolder;
    findItem(itemIn: string) {
        return Array.from(this.items).find(item => item.name === itemIn);
    }
    existItem(itemIn: IProjectFileOrFolder | string) {
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
    abstract addFile(nameIn: string, dataIn?: any): Promise<IProjectFileOrFolder>;
    abstract addFolder(nameIn: string): Promise<IProjectFolder>;
    async empty() {
        for (const item of this.items) {
            await item.destroy();
        }
    }
    getTree(): RawProjectItem<"folder"> {
        return {
            type: "folder",
            id: this.id,
            isFolder: true,
            name: this.name,
            items: Array.from(this.items).map((item) => {
                if (item.isFolder === false) {
                    const { id, isFolder, type, name, data } = item;
                    return { id, isFolder, type, name, data };
                }
                return item.getTree();
            })
        };
    }
    getDescendantFiles() {
        return Array.from(this.items).reduce((acc, cur) => {
            if (cur.isFolder === false) acc.push(cur);
            else acc.push(...cur.getDescendantFiles());
            return acc;
        }, [] as IProjectFileOrFolder[]);
    }
    isParentOf(itemIn: IProjectFileOrFolder) {
        let { parent } = itemIn;
        while (parent !== this) {
            if (!parent) return false;
            parent = parent.parent;
        }
        return true;
    }
    getOrderedItems() {
        const items = Array.from(this.items);
        const folders = items.filter(i => i.isFolder).sort((a, b) => a.name.localeCompare(b.name));
        const files = items.filter(i => !i.isFolder).sort((a, b) => a.name.localeCompare(b.name));
        return [...folders, ...files];
    }
}
