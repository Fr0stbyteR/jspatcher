import FileInstance from "../file/FileInstance";
import ImageFile from "./ImageFile";
import ImageEditor from "./ImageEditor";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";

export interface PatcherImageEventMap {}

export default class PatcherImage extends FileInstance<PatcherImageEventMap, ImageFile> {
    static async fromProjectItem(fileIn: ImageFile, envIn: IJSPatcherEnv, projectIn: IProject) {
        return new this(envIn, projectIn, fileIn).init(fileIn.data);
    }
    objectURL: string;
    async getEditor() {
        const editor = new ImageEditor(this);
        return editor.init();
    }
    async init(data?: ArrayBuffer) {
        if (data) this.objectURL = URL.createObjectURL(await new Response(data).blob());
        else this.objectURL = "";
        this._isReady = true;
        this.emit("ready");
        return this;
    }
    async serialize() {
        return (await fetch(this.objectURL)).arrayBuffer();
    }
    clone() {
        const patcherText = new PatcherImage(this.env, this.project, this.file);
        patcherText.objectURL = this.objectURL;
        return patcherText;
    }
}
