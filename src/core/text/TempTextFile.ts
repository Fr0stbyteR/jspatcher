import PatcherText from "./PatcherText";
import TempItem from "../file/TempItem";
import TextEditor from "./TextEditor";

export default class TempTextFile extends TempItem {
    type = "text" as const;
    get data(): PatcherText {
        return this._data;
    }
    async instantiate(): Promise<PatcherText> {
        return this.data;
    }
    async instantiateEditor(): Promise<TextEditor> {
        return TextEditor.fromProjectItem(this);
    }
}
