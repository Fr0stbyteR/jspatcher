import PatcherText from "./PatcherText";
import TemporaryProjectFile from "../file/TemporaryProjectFile";
import TextEditor from "./TextEditor";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";

export default class TempTextFile extends TemporaryProjectFile<PatcherText> {
    get type() {
        return "text" as const;
    }
    async instantiate() {
        return this.data;
    }
    async instantiateEditor(envIn: IJSPatcherEnv, projectIn?: IProject) {
        return TextEditor.fromProjectItem(this, envIn, projectIn);
    }
}
