import History from "../file/History";
import TextEditor, { TextEditorEventMap } from "./TextEditor";

export default class TextHistory extends History<TextEditorEventMap, TextEditor> {
    get eventListening(): (keyof TextEditorEventMap)[] {
        return ["textModified"];
    }
    async undo() {
        if (!this.editor) return;
        if (!this.isUndoable) return;
        const lastKey = Object.keys(this.undoMap).map(v => +v).sort((a, b) => b - a)[0];
        const { type, event } = this.undoMap[lastKey];
        if (type === "textModified") {
            const e: TextEditorEventMap[typeof type] = event;
            const { oldText } = e;
            if (this.editor.editor) {
                this.editor.editor.focus();
                if (!document.execCommand("undo")) {
                    (this.editor.editor.getModel() as any)?.undo();
                }
                this.editor.text = this.editor.editor.getValue();
                e.oldText = this.editor.text;
            } else {
                this.editor.text = oldText;
            }
        }
        this.redoMap[lastKey] = this.undoMap[lastKey];
        delete this.undoMap[lastKey];
        this.emitChanged();
    }
    async redo() {
        if (!this.editor) return;
        if (!this.isRedoable) return;
        const nextKey = Object.keys(this.redoMap).map(v => +v).sort((a, b) => a - b)[0];
        const { type, event } = this.redoMap[nextKey];
        if (type === "textModified") {
            const e: TextEditorEventMap[typeof type] = event;
            const { text } = e;
            if (this.editor.editor) {
                this.editor.editor.focus();
                if (!document.execCommand("undo")) {
                    (this.editor.editor.getModel() as any)?.redo();
                }
                this.editor.text = this.editor.editor.getValue();
                e.text = this.editor.text;
            } else {
                this.editor.text = text;
            }
        }
        this.undoMap[nextKey] = this.redoMap[nextKey];
        delete this.redoMap[nextKey];
        this.emitChanged();
    }
}
