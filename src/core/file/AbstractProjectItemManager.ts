import TypedEventEmitter, { ITypedEventEmitter } from "../../utils/TypedEventEmitter";
import { extToType } from "../../utils/utils";
import type TaskMgr from "../TaskMgr";
import type { IJSPatcherEnv } from "../Env";
import type { ProjectItemType, RawProjectItem } from "../types";
import type { IFileInstance } from "./FileInstance";
import type { IProjectFolder } from "./AbstractProjectFolder";
import type { IProjectFileOrFolder, IProjectItem, ProjectItemEventMap } from "./AbstractProjectItem";
import { IProject } from "../Project";

export interface ItemChangedEvent<K extends keyof ProjectItemEventMap = keyof ProjectItemEventMap> {
    id: string;
    isFolder: boolean;
    path: string;
    type: ProjectItemType;
    data?: any;
    eventName: K;
    eventData?: ProjectItemEventMap[K];
}

export interface ProjectItemManagerEventMap {
    "ready": never;
    "treeChanged": RawProjectItem<"folder">;
    "itemChanged": ItemChangedEvent;
    "changed": never;
}

export interface IProjectItemManager<EventMap extends Record<string, any> & Partial<ProjectItemManagerEventMap> = {}> extends ITypedEventEmitter<EventMap & ProjectItemManagerEventMap> {
    readonly projectFolderName: string;
    readonly id: string;
    readonly taskMgr: TaskMgr;
    readonly allItems: Record<string, IProjectFileOrFolder>;
    readonly allProjectItems: Record<string, IProjectFileOrFolder>;
    root: IProjectFolder;
    /** Enpty the backend file manager */
    empty(): Promise<any>;
    /** Empty the project rool folder */
    emptyProject(): Promise<void>;
    /** Create all project items by analyzing the backend */
    init(clean?: boolean): Promise<this>;
    getTypeFromFileName(name: string): ProjectItemType;
    getProjectItemFromId(id: string): IProjectFileOrFolder;
    getProjectItemFromPath(path: string): IProjectFileOrFolder;
    getPathIdMap(): Record<string, string>;
    instantiateProjectPath(path: string, envIn: IJSPatcherEnv, projectIn?: IProject): Promise<IFileInstance>;
    emitTreeChanged(): Promise<void>;
    emitChanged(): Promise<void>;
    generateItemId(item: IProjectItem): string;
}

export default abstract class AbstractProjectItemManager<EventMap extends Record<string, any> & Partial<ProjectItemManagerEventMap> = {}> extends TypedEventEmitter<EventMap & ProjectItemManagerEventMap> implements IProjectItemManager<EventMap> {
    readonly projectFolderName = "project";
    readonly id: string;
    readonly env: IJSPatcherEnv;
    readonly taskMgr: TaskMgr;
    get allItems() {
        const items: Record<string, IProjectFileOrFolder> = {};
        const rec = (cur: IProjectFileOrFolder) => {
            items[cur.id] = cur;
            if (cur.isFolder) cur.items.forEach(rec);
        };
        rec(this.root);
        return items;
    }
    get allProjectItems() {
        const items: Record<string, IProjectFileOrFolder> = {};
        const rec = (cur: IProjectFileOrFolder) => {
            items[cur.id] = cur;
            if (cur.isFolder) cur.items.forEach(rec);
        };
        rec(this.projectRoot);
        return items;
    }
    root: IProjectFolder;
    constructor(envIn: IJSPatcherEnv) {
        super();
        this.env = envIn;
        this.id = envIn.generateId(this);
        this.taskMgr = envIn.taskMgr;
    }
    abstract empty(): Promise<any>;
    emptyProject() {
        return this.projectRoot.empty();
    }
    abstract init(clean?: boolean): Promise<this>;
    getTypeFromFileName(name: string): ProjectItemType {
        const splitted = name.split(".");
        const ext = splitted[splitted.length - 1];
        return extToType(ext);
    }
    getProjectItemFromId(id: string) {
        return this.allItems[id];
    }
    getProjectItemFromPath(path: string) {
        const pathArray = path.split("/");
        const itemArray: (IProjectFileOrFolder)[] = [this.root, this.projectRoot];
        for (let i = 0; i < pathArray.length; i++) {
            const id = pathArray[i];
            if (id.length === 0) continue;
            if (id === ".") continue;
            if (id === "..") {
                itemArray.pop();
                continue;
            }
            const cur = itemArray[itemArray.length - 1];
            if (!cur.isFolder) throw new Error(`${cur.name} from path ${path} is not a folder`);
            const next = cur.findItem(id);
            if (!next) throw new Error(`Cannot find ${id} from path ${path}`);
            itemArray.push(next);
        }
        return itemArray[itemArray.length - 1];
    }
    getPathIdMap() {
        const map: Record<string, string> = {};
        Object.entries(this.allItems).forEach(([id, { path }]) => map[path] = id);
        return map;
    }
    instantiateProjectPath(path: string, envIn: IJSPatcherEnv, projectIn: IProject) {
        const item = this.getProjectItemFromPath(path);
        if (item.isFolder === false) return item.instantiate({ env: envIn, project: projectIn });
        throw new Error(`Cannot instantiate ${item.name} from path ${path} as it is a folder`);
    }
    async emitTreeChanged() {
        this.emit("treeChanged", this.root.getTree());
    }
    async emitChanged() {
        this.emit("changed");
    }
    get projectRoot() {
        return this.root.findItem(this.projectFolderName) as IProjectFolder;
    }
    generateItemId(item: IProjectItem) {
        return this.env.generateId(item);
    }
}
