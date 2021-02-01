import Patcher from "./Patcher";
import PatcherEditor from "./PatcherEditor";
import ProjectItem from "../file/ProjectItem";

export default class PatcherFile extends ProjectItem {
    type = "patcher" as const;
    async instantiate(): Promise<Patcher> {
        return Patcher.fromProjectItem(this);
    }
    async instantiateEditor(): Promise<PatcherEditor> {
        return PatcherEditor.fromProjectItem(this);
    }
}
