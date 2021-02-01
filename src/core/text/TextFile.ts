import PatcherText from "./PatcherText";
import ProjectItem from "../file/ProjectItem";
import TextEditor from "./TextEditor";

export default class TextFile extends ProjectItem {
    type = "text" as const;
    async instantiate(): Promise<PatcherText> {
        return PatcherText.fromProjectItem(this);
    }
    async instantiateEditor(): Promise<TextEditor> {
        return TextEditor.fromProjectItem(this);
    }
}
