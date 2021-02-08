import { SemanticICONS } from "semantic-ui-react";
import FileInstance from "../file/FileInstance";
import TextFile from "./TextFile";
import TextEditor from "./TextEditor";
import TempTextFile from "./TempTextFile";

export interface PatcherTextEventMap {
    "textModified": { text: string; oldText: string };
}

export default class PatcherText extends FileInstance<PatcherTextEventMap, TextFile | TempTextFile> {
    static async fromProjectItem(item: TextFile) {
        return new this(item).init(item.data);
    }
    text: string;
    get fileExtension() {
        return "txt";
    }
    get fileIcon(): SemanticICONS {
        return "code";
    }
    async getEditor() {
        const editor = new TextEditor(this);
        return editor.init();
    }
    async init(data?: ArrayBuffer) {
        if (data) this.text = await new Response(data).text();
        else this.text = "";
        this.emit("ready");
        return this;
    }
    async serialize() {
        return new Blob([this.text]).arrayBuffer();
    }
    clone() {
        const patcherText = new PatcherText(this.ctx);
        patcherText.text = this.text;
        return patcherText;
    }
}
