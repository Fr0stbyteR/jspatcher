import PatcherText from "./PatcherText";
import TempItem from "../file/TempItem";

export default class TempTextFile extends TempItem {
    type = "text" as const;
    async instantiate(): Promise<PatcherText> {
        return this._data;
    }
}
