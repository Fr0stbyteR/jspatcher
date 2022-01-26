import FileInstance from "../file/FileInstance";
import ImageEditor from "./ImageEditor";
import type PersistentProjectFile from "../file/PersistentProjectFile";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";

export interface PatcherImageEventMap {}

export default class PatcherImage extends FileInstance<PatcherImageEventMap, PersistentProjectFile> {
    static async fromProjectItem(options: { file: PersistentProjectFile; env: IJSPatcherEnv; project?: IProject; instanceId?: string }) {
        return new this(options).init(options.file.data);
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
        const patcherImage = new PatcherImage({ env: this.env, project: this.project, file: this.file });
        patcherImage.objectURL = this.objectURL;
        return patcherImage;
    }
}
