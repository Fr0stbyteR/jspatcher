import { TypedEventEmitter } from "../../utils/TypedEventEmitter";
import Folder from "./Folder";
import History from "./History";
import ProjectItem from "./ProjectItem";

export interface FileInstanceEventMap {
    "loading": string[];
    "ready": never;
}

export default class FileInstance<EventMap extends Record<string, any> & Partial<FileInstanceEventMap> = {}> extends TypedEventEmitter<EventMap & FileInstanceEventMap> {
    file: ProjectItem;
    history: History;
    get isDirty() {
        return this.history.isDirty;
    }
    isReady = false;
    async serialize(): Promise<ArrayBuffer> {
        throw new Error("Not implemented.");
    }
    emitDirty(isDirty: boolean) {
        this.file.emitDirty(isDirty);
    }
    async save() {
        if (this.isDirty) await this.file.save(await this.serialize());
    }
    async saveAs(parent: Folder, name: string) {
        await this.file.saveAs(parent, name, await this.serialize());
    }
}
