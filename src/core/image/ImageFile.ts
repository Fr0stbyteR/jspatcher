import ProjectItem from "../file/ProjectItem";
import ImageEditor from "./ImageEditor";
import PatcherImage from "./PatcherImage";

export default class ImageFile extends ProjectItem {
    type = "image" as const;
    async instantiate(): Promise<PatcherImage> {
        return PatcherImage.fromProjectItem(this);
    }
    async instantiateEditor(): Promise<ImageEditor> {
        return ImageEditor.fromProjectItem(this);
    }
}
