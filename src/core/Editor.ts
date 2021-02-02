import { TypedEventEmitter } from "../utils/TypedEventEmitter";
import FileEditor from "./file/FileEditor";

export interface EditorEventMap {
    "open": FileEditor;
    "active": FileEditor;
}
export default class Editor extends TypedEventEmitter<EditorEventMap> {
    private _activeEditor: FileEditor;
    get activeEditor(): FileEditor {
        return this._activeEditor;
    }
    set activeEditor(value: FileEditor) {
        this._activeEditor = value;
        this.emit("active", value);
    }
}
