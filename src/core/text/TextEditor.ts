import type { SemanticICONS } from "semantic-ui-react";
import type MonacoEditor from "react-monaco-editor";
import type { editor } from "monaco-editor/esm/vs/editor/editor.api";
import FileEditor from "../file/FileEditor";
import TempTextFile from "./TempTextFile";
import TextHistory from "./TextHistory";
import type PatcherText from "./PatcherText";
import type PersistentProjectFile from "../file/PersistentProjectFile";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";

export interface TextEditorEventMap {
    "textModified": { text: string; oldText: string };
}

export default class TextEditor extends FileEditor<PatcherText, TextEditorEventMap> {
    static async fromProjectItem({ file, env, project, instanceId }: { file: PersistentProjectFile | TempTextFile; env: IJSPatcherEnv; project?: IProject; instanceId?: string }) {
        const text = file instanceof TempTextFile ? file.data : await file.instantiate({ env, project, instanceId }) as PatcherText;
        const editor = new this(text);
        return editor.init();
    }
    editor: editor.IStandaloneCodeEditor;
    editorJSX: typeof MonacoEditor;
    readonly _history: TextHistory = new TextHistory(this);
    get fileExtension() {
        return "txt";
    }
    get fileIcon(): SemanticICONS {
        return "code";
    }
    get history() {
        return this._history;
    }
    get text() {
        return this.instance.text;
    }
    set text(value: string) {
        this.instance.text = value;
    }
    async init() {
        if (!this.instance.isReady) {
            await new Promise<void>((resolve, reject) => {
                const handleReady = () => {
                    resolve();
                    this.instance.off("ready", handleReady);
                };
                this.instance.on("ready", handleReady);
            });
        }
        this._isReady = true;
        this.emit("ready");
        return this;
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
