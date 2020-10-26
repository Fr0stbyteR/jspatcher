import { TypedEventEmitter } from "../utils/TypedEventEmitter";
import FileInstance from "./file/FileInstance";

export interface EditorEventMap {
    "open": FileInstance;
    "active": FileInstance;
}
export default class Editor extends TypedEventEmitter<EditorEventMap> {
    private _activeInstance: FileInstance;
    get activeInstance(): FileInstance {
        return this._activeInstance;
    }
    set activeInstance(value: FileInstance) {
        this._activeInstance = value;
        this.emit("active", value);
    }
}
