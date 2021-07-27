import TemporaryProjectFile from "../file/TemporaryProjectFile";
import type PatcherText from "./PatcherText";
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
        const TextEditor = (await import("./TextEditor")).default;
        return TextEditor.fromProjectItem({ file: this, env, project, instanceId });
    }
}
