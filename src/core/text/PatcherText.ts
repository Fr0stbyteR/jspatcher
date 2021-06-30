import FileInstance from "../file/FileInstance";
import TextEditor from "./TextEditor";
import TempTextFile from "./TempTextFile";
import type PersistentProjectFile from "../file/PersistentProjectFile";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";

export interface PatcherTextEventMap {
    "textModified": { text: string; oldText: string };
}

export default class PatcherText extends FileInstance<PatcherTextEventMap, PersistentProjectFile | TempTextFile> {
    static async fromProjectItem(fileIn: PersistentProjectFile, envIn: IJSPatcherEnv, projectIn?: IProject) {
        return new this(envIn, projectIn, fileIn).init(fileIn.data);
    }
    text: string;
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
        const patcherText = new PatcherText(this.env, this.project, this.file);
        patcherText.text = this.text;
        return patcherText;
    }
}
