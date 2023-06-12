import TemporaryProjectFile from "../file/TemporaryProjectFile";
import type { RawHardwarePatcher } from "./types";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";

export default class TempHardwareFile extends TemporaryProjectFile<RawHardwarePatcher> {
    get type() {
        return "hardware" as const;
    }
    async instantiate({ env, project, instanceId }: { env: IJSPatcherEnv; project?: IProject; instanceId?: string }) {
        const Patcher = (await import("./Patcher")).default;
        const patcher = new Patcher({ file: this, env, project, instanceId });
        await patcher.load(this.data);
        return patcher;
    }
    async instantiateEditor({ env, project, instanceId }: { env: IJSPatcherEnv; project?: IProject; instanceId?: string }) {
        const PatcherEditor = (await import("./HardwareEditor")).default;
        return PatcherEditor.fromProjectItem({ file: this, env, project, instanceId });
    }
}
