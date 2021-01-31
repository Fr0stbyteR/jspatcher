import MonacoEditor from "react-monaco-editor";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { SemanticICONS } from "semantic-ui-react";
import FileInstance from "../file/FileInstance";
import TextFile from "./TextFile";
import TextHistory from "./TextHistory";
import TempTextFile from "./TempTextFile";

export interface PatcherTextEventMap {
    "textModified": { text: string; oldText: string };
}

export default class PatcherText extends FileInstance<PatcherTextEventMap, TextFile | TempTextFile> {
    static async fromProjectItem(item: TextFile | TempTextFile) {
        return new this(item).init();
    }
    text: string;
    editor: editor.IStandaloneCodeEditor;
    editorJSX: typeof MonacoEditor;
    _history: TextHistory = new TextHistory(this);
    get history() {
        return this._history;
    }
    get fileExtension() {
        return "txt";
    }
    get fileIcon(): SemanticICONS {
        return "code";
    }
    async init(data = this.file?.data) {
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
    get editorLanguage() {
        if (!this.file) return "none";
        if (this.file.name.endsWith(".js")) return "js";
        if (this.file.name.endsWith(".json")) return "json";
        if (this.file.name.endsWith(".html")) return "html";
        if (this.file.name.endsWith(".dsp")) return "faust";
        return "none";
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
        editor.addAction({
            id: "editor.action.save",
            label: "Save",
            keybindings: [/* KeyMod.CtrlCmd */2048 | /* KeyCode.KEY_S */49],
            run: () => this.save()
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
        const text = await navigator.clipboard.readText();
        this.editor.executeEdits("", [{ range: this.editor.getSelection(), text, forceMoveMarkers: true }]);
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
    onUiResized() {}
}
