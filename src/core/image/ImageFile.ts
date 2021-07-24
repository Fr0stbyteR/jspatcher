import PersistentProjectFile from "../file/PersistentProjectFile";
import ImageEditor from "./ImageEditor";
import PatcherImage from "./PatcherImage";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";

export default class ImageFile extends PersistentProjectFile {
    get type() {
        return "image" as const;
    }
    async instantiate({ env, project, instanceId }: { env: IJSPatcherEnv; project?: IProject; instanceId?: string }): Promise<PatcherImage> {
        return PatcherImage.fromProjectItem({ file: this, env, project, instanceId });
    }
    async instantiateEditor({ env, project, instanceId }: { env: IJSPatcherEnv; project?: IProject; instanceId?: string }): Promise<ImageEditor> {
        return ImageEditor.fromProjectItem({ file: this, env, project, instanceId });
    }
}
