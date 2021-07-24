import Patcher from "./Patcher";
import PatcherEditor from "./PatcherEditor";
import TemporaryProjectFile from "../file/TemporaryProjectFile";
import type { RawPatcher } from "../types";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";

export default class TempPatcherFile extends TemporaryProjectFile<RawPatcher> {
    get type() {
        return "patcher" as const;
    }
    async instantiate({ env, project, instanceId }: { env: IJSPatcherEnv; project?: IProject; instanceId?: string }) {
        const patcher = new Patcher({ file: this, env, project, instanceId });
        await patcher.load(this.data);
        return patcher;
    }
    async instantiateEditor({ env, project, instanceId }: { env: IJSPatcherEnv; project?: IProject; instanceId?: string }) {
        return PatcherEditor.fromProjectItem({ file: this, env, project, instanceId });
    }
}
