import PersistentProjectFile from "../file/PersistentProjectFile";
import VideoEditor from "./VideoEditor";
import PatcherVideo from "./PatcherVideo";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";

export default class VideoFile extends PersistentProjectFile {
    get type() {
        return "video" as const;
    }
    async instantiate({ env, project, instanceId }: { env: IJSPatcherEnv; project?: IProject; instanceId?: string }): Promise<PatcherVideo> {
        return PatcherVideo.fromProjectItem({ file: this, env, project, instanceId });
    }
    async instantiateEditor({ env, project, instanceId }: { env: IJSPatcherEnv; project?: IProject; instanceId?: string }): Promise<VideoEditor> {
        return VideoEditor.fromProjectItem({ file: this, env, project, instanceId });
    }
}
