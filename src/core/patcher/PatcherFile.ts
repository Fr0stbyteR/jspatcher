import Patcher from "./Patcher";
import ProjectItem from "../file/ProjectItem";

export default class PatcherFile extends ProjectItem {
    type = "patcher" as const;
    async instantiate(): Promise<Patcher> {
        return Patcher.fromProjectItem(this);
    }
}
