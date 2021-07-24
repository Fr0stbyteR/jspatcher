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
    async instantiateEditor({ env, project, instanceId }: { env: IJSPatcherEnv; project?: IProject; instanceId?: string }) {
        return TextEditor.fromProjectItem({ file: this, env, project, instanceId });
    }
}
