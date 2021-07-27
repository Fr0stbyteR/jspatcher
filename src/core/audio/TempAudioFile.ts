import TemporaryProjectFile from "../file/TemporaryProjectFile";
import type PatcherAudio from "./PatcherAudio";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";

export default class TempAudioFile extends TemporaryProjectFile<PatcherAudio> {
    get type() {
        return "audio" as const;
    }
    async instantiate() {
        return this.data;
    }
    async instantiateEditor({ env, project, instanceId }: { env: IJSPatcherEnv; project?: IProject; instanceId?: string }) {
        const AudioEditor = (await import("./AudioEditor")).default;
        return AudioEditor.fromProjectItem({ file: this, env, project, instanceId });
    }
}
