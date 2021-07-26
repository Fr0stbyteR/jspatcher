import FileInstance from "../file/FileInstance";
import TextEditor from "./TextEditor";
import TempTextFile from "./TempTextFile";
import TextHistory from "./TextHistory";
import type PersistentProjectFile from "../file/PersistentProjectFile";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";

export interface PatcherTextEventMap {
    "textModified": { text: string; oldText: string };
}

export default class PatcherText extends FileInstance<PatcherTextEventMap, PersistentProjectFile | TempTextFile> {
    static async fromProjectItem(options: { file: PersistentProjectFile; env: IJSPatcherEnv; project?: IProject; instanceId?: string }) {
        return new this(options).init(options.file.data);
    }
    text: string;
    _history = new TextHistory();
    async getEditor() {
        const editor = new TextEditor(this);
        return editor.init();
    }
    async init(data?: ArrayBuffer) {
        if (data) this.text = await new Response(data).text();
        else this.text = "";
        this._isReady = true;
        this.emit("ready");
        return this;
    }
    async serialize() {
        return new Blob([this.text]).arrayBuffer();
    }
    clone() {
        const patcherText = new PatcherText({ env: this.env, project: this.project, file: this.file });
        patcherText.text = this.text;
        return patcherText;
    }
}
