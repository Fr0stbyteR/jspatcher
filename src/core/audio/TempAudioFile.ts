import AudioEditor from "./AudioEditor";
import PatcherAudio from "./PatcherAudio";
import TemporaryProjectFile from "../file/TemporaryProjectFile";
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
        return AudioEditor.fromProjectItem({ file: this, env, project, instanceId });
    }
}
