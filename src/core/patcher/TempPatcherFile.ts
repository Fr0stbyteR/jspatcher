import Patcher from "./Patcher";
import PatcherEditor from "./PatcherEditor";
import TempItem from "../file/TempItem";
import { RawPatcher } from "../types";

export default class TempPatcherFile extends TempItem {
    type = "patcher" as const;
    get data(): RawPatcher {
        return this._data;
    }
    async instantiate(): Promise<Patcher> {
        const patcher = new Patcher(this);
        await patcher.load(this.data);
        return patcher;
    }
    async instantiateEditor(): Promise<PatcherEditor> {
        return PatcherEditor.fromProjectItem(this);
    }
}
