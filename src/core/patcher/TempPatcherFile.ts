import Patcher from "./Patcher";
import PatcherEditor from "./PatcherEditor";
import TempItem from "../file/TempItem";

export default class TempPatcherFile extends TempItem {
    type = "patcher" as const;
    get data(): Patcher {
        return this._data;
    }
    async instantiate(): Promise<Patcher> {
        return this.data;
    }
    async instantiateEditor(): Promise<PatcherEditor> {
        return PatcherEditor.fromProjectItem(this);
    }
}
