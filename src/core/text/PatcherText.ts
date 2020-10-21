import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import FileInstance from "../file/FileInstance";

export interface PatcherTextEventMap {
    "textModified": { text: string; oldText: string };
}

export default class PatcherText extends FileInstance<PatcherTextEventMap> {
    text: string;
    editor: editor.IStandaloneCodeEditor;
    async init(data: ArrayBuffer) {
        this.text = await new Response(data).text();
        this.emit("ready");
    }
    async serialize() {
        return new Blob([this.text]).arrayBuffer();
    }
    clone() {
        const patcherText = new PatcherText();
        patcherText.text = this.text;
        return patcherText;
    }
    bindEditor(editor: editor.IStandaloneCodeEditor) {
        this.editor = editor;
        const didChanged = editor.onDidChangeModelContent((e) => {
            const oldText = this.text;
            const text = editor.getValue();
            this.text = text;
            this.emit("textModified", { text, oldText });
            this.emit("changed");
        });
        const didDispose = editor.onDidDispose(() => {
            didChanged.dispose();
            didDispose.dispose();
            this.editor = undefined;
            this.emit("destroy");
        });
    }
}
