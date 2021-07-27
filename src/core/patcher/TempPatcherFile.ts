import TemporaryProjectFile from "../file/TemporaryProjectFile";
import type { RawPatcher } from "../types";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";

export default class TempPatcherFile extends TemporaryProjectFile<RawPatcher> {
    get type() {
        return "patcher" as const;
    }
    async instantiate({ env, project, instanceId }: { env: IJSPatcherEnv; project?: IProject; instanceId?: string }) {
        const Patcher = (await import("./Patcher")).default;
        const patcher = new Patcher({ file: this, env, project, instanceId });
        await patcher.load(this.data);
        return patcher;
    }
    async instantiateEditor({ env, project, instanceId }: { env: IJSPatcherEnv; project?: IProject; instanceId?: string }) {
        const PatcherEditor = (await import("./PatcherEditor")).default;
        return PatcherEditor.fromProjectItem({ file: this, env, project, instanceId });
    }
}
