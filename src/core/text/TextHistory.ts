import History from "../file/History";
import TextEditor, { TextHistoryEventMap } from "./TextEditor";

export default class TextHistory extends History<TextHistoryEventMap, TextEditor> {
    get eventListening(): (keyof TextHistoryEventMap)[] {
        return ["textModified"];
    }
    async undoOf(editor: TextEditor, eventName: keyof TextHistoryEventMap, eventData: any) {
        if (eventName === "textModified") {
            const e: TextHistoryEventMap[typeof eventName] = eventData;
            const { oldText } = e;
            if (editor.editor) {
                editor.editor.focus();
                if (!document.execCommand("undo")) {
                    (editor.editor.getModel() as any)?.undo();
                }
                editor.text = editor.editor.getValue();
                e.oldText = editor.text;
            } else {
                editor.text = oldText;
            }
        }
    }
    async redoOf(editor: TextEditor, eventName: keyof TextHistoryEventMap, eventData: any) {
        if (eventName === "textModified") {
            const e: TextHistoryEventMap[typeof eventName] = eventData;
            const { text } = e;
            if (editor.editor) {
                editor.editor.focus();
                if (!document.execCommand("undo")) {
                    (editor.editor.getModel() as any)?.redo();
                }
                editor.text = editor.editor.getValue();
                e.text = editor.text;
            } else {
                editor.text = text;
            }
        }
    }
}
