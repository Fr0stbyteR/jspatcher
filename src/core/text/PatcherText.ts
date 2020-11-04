import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { SemanticICONS } from "semantic-ui-react";
import FileInstance from "../file/FileInstance";
import TextHistory from "./TextHistory";

export interface PatcherTextEventMap {
    "textModified": { text: string; oldText: string };
}

export default class PatcherText extends FileInstance<PatcherTextEventMap> {
    text: string;
    editor: editor.IStandaloneCodeEditor;
    _history: TextHistory = new TextHistory(this);
    get history() {
        return this._history;
    }
    get fileExtention() {
        return "txt";
    }
    get fileIcon(): SemanticICONS {
        return "code";
    }
    async init(data?: ArrayBuffer) {
        if (data) this.text = await new Response(data).text();
        else this.text = "";
        this.emit("ready");
    }
    async serialize() {
        return new Blob([this.text]).arrayBuffer();
    }
    clone() {
        const patcherText = new PatcherText(this.file);
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
    async copy() {
        if (!this.editor) return;
        this.editor.focus();
        document.execCommand("copy");
    }
    async cut() {
        if (!this.editor) return;
        this.editor.focus();
        document.execCommand("cut");
    }
    async paste() {
        if (!this.editor) return;
        this.editor.focus();
        document.execCommand("paste");
    }
    async deleteSelected() {
        if (!this.editor) return;
        this.editor.executeEdits("", [{ range: this.editor.getSelection(), text: null }]);
    }
    async selectAll() {
        if (!this.editor) return;
        const range = this.editor.getModel().getFullModelRange();
        this.editor.setSelection(range);
    }
}
