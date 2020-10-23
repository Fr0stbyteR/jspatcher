import { TypedEventEmitter } from "../../utils/TypedEventEmitter";
import Folder from "./Folder";
import History from "./History";

export interface FileInstanceEventMap {
    "ready": never;
    "changed": never;
    "save": ArrayBuffer;
    "saveAs": { parent: Folder, name: string, data: ArrayBuffer };
    "destroy": never;
}

export default class FileInstance<EventMap extends Record<string, any> & Partial<FileInstanceEventMap> = {}> extends TypedEventEmitter<EventMap & FileInstanceEventMap> {
    isTemporary = false;
    get isDirty() {
        return this.history.isDirty;
    }
    get history(): History<EventMap> {
        return null;
    }
    async serialize(): Promise<ArrayBuffer> {
        throw new Error("Not implemented.");
    }
    async save() {
        if (this.isTemporary) throw new Error("Cannot save temporary file");
        const data = await this.serialize();
        await this.emit("save", data);
        this.history.handleSave();
    }
    async saveAs(parent: Folder, name: string) {
        const data = await this.serialize();
        await this.emit("saveAs", { parent, name, data });
        this.history.handleSave();
        this.isTemporary = false;
    }
    async destroy() {
        await this.emit("destroy");
    }
}
