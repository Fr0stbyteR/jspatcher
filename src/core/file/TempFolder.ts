import TempAudioFile from "../audio/TempAudioFile";
import TempPatcherFile from "../patcher/TempPatcherFile";
import TempManager from "../TempMgr";
import TempTextFile from "../text/TempTextFile";
import { ProjectItemType } from "../types";
import Folder from "./Folder";
import TempData from "./TempData";
import TempItem from "./TempItem";

export default class TempFolder extends Folder {
    protected readonly _fileMgr: TempManager;
    get fileMgr() {
        return this._fileMgr;
    }
    async init() {
        await this.emit("ready");
        return this;
    }
    getProjectItem(name: string, type: ProjectItemType, data?: any): TempItem | TempFolder {
        if (type === "folder") return new TempFolder(this.fileMgr, this.project, this, name, data);
        if (type === "patcher") return new TempPatcherFile(this.fileMgr, this.project, this, name, data);
        if (type === "audio") return new TempAudioFile(this.fileMgr, this.project, this, name, data);
        if (type === "text") return new TempTextFile(this.fileMgr, this.project, this, name, data);
        return new TempData(this.fileMgr, this.project, this, name, data);
    }
    async addProjectItem(name: string, data = new ArrayBuffer(0)) {
        if (this.existItem(name)) throw new Error(`${name} already exists.`);
        const fileDetail = await this.fileMgr.getFileDetails(this.path, name);
        const item = this.getProjectItem(name, fileDetail.type, data);
        this.items.add(item);
        await this.emitTreeChanged();
        return item;
    }
    async addFolder(name: string) {
        if (this.existItem(name)) throw new Error(`${name} already exists.`);
        const folder: TempFolder = new TempFolder(this.fileMgr, this.project, this, name);
        this.items.add(folder);
        await folder.init();
        await this.emitTreeChanged();
        return folder;
    }
}
