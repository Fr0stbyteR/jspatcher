import History from "../file/History";
import TextEditor, { TextEditorEventMap } from "./TextEditor";

export default class TextHistory extends History<TextEditorEventMap, TextEditor> {
    get eventListening(): (keyof TextEditorEventMap)[] {
        return ["textModified"];
    }
    async undo() {
        super.undo((eventName, eventData) => {
            if (eventName === "textModified") {
                const e: TextEditorEventMap[typeof eventName] = eventData;
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
        });
    }
    async redo() {
        super.redo((eventName, eventData) => {
            if (eventName === "textModified") {
                const e: TextEditorEventMap[typeof eventName] = eventData;
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
        });
    }
}
