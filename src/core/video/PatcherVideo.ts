import FileInstance from "../file/FileInstance";
import VideoEditor from "./VideoEditor";
import type PersistentProjectFile from "../file/PersistentProjectFile";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";

export interface PatcherVideoEventMap {}

export default class PatcherVideo extends FileInstance<PatcherVideoEventMap, PersistentProjectFile> {
    static async fromProjectItem(options: { file: PersistentProjectFile; env: IJSPatcherEnv; project?: IProject; instanceId?: string }) {
        return new this(options).init(options.file.data);
    }
    objectURL: string;
    async getEditor() {
        const editor = new VideoEditor(this);
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
        const patcherVideo = new PatcherVideo({ env: this.env, project: this.project, file: this.file });
        patcherVideo.objectURL = this.objectURL;
        return patcherVideo;
    }
}
