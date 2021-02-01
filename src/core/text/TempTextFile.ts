import PatcherText from "./PatcherText";
import TempItem from "../file/TempItem";
import TextEditor from "./TextEditor";

export default class TempTextFile extends TempItem {
    type = "text" as const;
    async instantiate(): Promise<PatcherText> {
        return this._data;
    }
    async instantiateEditor(): Promise<TextEditor> {
        return TextEditor.fromProjectItem(this);
    }
}
