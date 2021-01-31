import Patcher from "./Patcher";
import TempItem from "../file/TempItem";

export default class TempPatcherFile extends TempItem {
    type = "patcher" as const;
    async instantiate(): Promise<Patcher> {
        return Patcher.fromProjectItem(this);
    }
}
