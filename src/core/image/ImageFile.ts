import PersistentProjectFile from "../file/PersistentProjectFile";
import ImageEditor from "./ImageEditor";
import PatcherImage from "./PatcherImage";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";

export default class ImageFile extends PersistentProjectFile {
    get type() {
        return "image" as const;
    }
    async instantiate(envIn: IJSPatcherEnv, projectIn?: IProject) {
        return PatcherImage.fromProjectItem(this, envIn, projectIn);
    }
    async instantiateEditor(envIn: IJSPatcherEnv, projectIn?: IProject) {
        return ImageEditor.fromProjectItem(this, envIn, projectIn);
    }
}
