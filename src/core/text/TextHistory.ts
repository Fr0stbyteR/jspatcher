import History from "../file/History";
import PatcherText, { PatcherTextEventMap } from "./PatcherText";

export default class AudioHistory extends History<PatcherTextEventMap> {
    instance: PatcherText;
    eventListening: (keyof PatcherTextEventMap)[] = ["textModified"];
    async undo() {
        if (!this.instance) return;
        if (!this.isUndoable) return;
        const lastKey = Object.keys(this.undoMap).map(v => +v).sort((a, b) => b - a)[0];
        const { type, event } = this.undoMap[lastKey];
        if (type === "textModified") {
            const e: PatcherTextEventMap[typeof type] = event;
            const { oldText } = e;
            if (this.instance.editor) {
                this.instance.editor.trigger("", "undo", null);
                this.instance.text = this.instance.editor.getValue();
                e.oldText = this.instance.text;
            } else {
                this.instance.text = oldText;
            }
        }
        this.redoMap[lastKey] = this.undoMap[lastKey];
        delete this.undoMap[lastKey];
        this.emitDirty();
    }
    async redo() {
        if (!this.instance) return;
        if (!this.isRedoable) return;
        const nextKey = Object.keys(this.redoMap).map(v => +v).sort((a, b) => a - b)[0];
        const { type, event } = this.redoMap[nextKey];
        if (type === "textModified") {
            const e: PatcherTextEventMap[typeof type] = event;
            const { text } = e;
            if (this.instance.editor) {
                this.instance.editor.trigger("", "redo", null);
                this.instance.text = this.instance.editor.getValue();
                e.text = this.instance.text;
            } else {
                this.instance.text = text;
            }
        }
        this.undoMap[nextKey] = this.redoMap[nextKey];
        delete this.redoMap[nextKey];
        this.emitDirty();
    }
}
