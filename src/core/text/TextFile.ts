import PatcherText from "./PatcherText";
import ProjectItem from "../file/ProjectItem";

export default class TextFile extends ProjectItem {
    type = "text" as const;
    async instantiate(): Promise<PatcherText> {
        return PatcherText.fromProjectItem(this);
    }
}
