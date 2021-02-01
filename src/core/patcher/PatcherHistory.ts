import History from "../file/History";
import PatcherEditor, { PatcherEditorEventMap } from "./PatcherEditor";

export default class PatcherHistory extends History<PatcherEditorEventMap, PatcherEditor> {
    get eventListening(): (keyof PatcherEditorEventMap)[] {
        return [
            "create", "delete", "changeBoxText",
            "changeLineSrc", "changeLineDest", "moved", "resized"
        ];
    }
    async undo() {
        if (!this.editor) return;
        if (!this.isUndoable) return;
        this.capture = false;
        const lastKey = Object.keys(this.undoMap).map(v => +v).sort((a, b) => b - a)[0];
        const { type, event } = this.undoMap[lastKey];
        if (type === "delete") {
            const e: PatcherEditorEventMap[typeof type] = event;
            await this.editor.create(e);
        } else if (type === "changeBoxText") {
            const e: PatcherEditorEventMap[typeof type] = event;
            const { box, oldText } = e;
            await this.editor.instance.changeBoxText(box.id, oldText);
        } else if (type === "moved") {
            const e: PatcherEditorEventMap[typeof type] = event;
            const { selected, delta, presentation } = e;
            const d = { x: -1 * delta.x, y: -1 * delta.y };
            this.editor.move(selected, d, presentation);
            this.editor.moveEnd(d);
        } else if (type === "changeLineSrc") {
            const e: PatcherEditorEventMap[typeof type] = event;
            const { line, oldSrc } = e;
            this.editor.changeLineSrc(line.id, oldSrc[0], oldSrc[1]);
        } else if (type === "changeLineDest") {
            const e: PatcherEditorEventMap[typeof type] = event;
            const { line, oldDest } = e;
            this.editor.changeLineDest(line.id, oldDest[0], oldDest[1]);
        } else if (type === "create") {
            const e: PatcherEditorEventMap[typeof type] = event;
            await this.editor.delete(e);
        } else if (type === "resized") {
            const e: PatcherEditorEventMap[typeof type] = event;
            const { selected, delta, type: t, presentation } = e;
            this.editor.resize(selected, { x: -1 * delta.x, y: -1 * delta.y }, t, presentation);
        }
        this.redoMap[lastKey] = this.undoMap[lastKey];
        delete this.undoMap[lastKey];
        this.capture = true;
        this.emitChanged();
    }
    async redo() {
        if (!this.editor) return;
        if (!this.isRedoable) return;
        this.capture = false;
        const nextKey = Object.keys(this.redoMap).map(v => +v).sort((a, b) => a - b)[0];
        const { type, event } = this.redoMap[nextKey];
        if (type === "create") {
            const e: PatcherEditorEventMap[typeof type] = event;
            await this.editor.create(e);
        } else if (type === "changeBoxText") {
            const e: PatcherEditorEventMap[typeof type] = event;
            const { box, text } = e;
            await this.editor.instance.changeBoxText(box.id, text);
        } else if (type === "moved") {
            const e: PatcherEditorEventMap[typeof type] = event;
            const { selected, delta, presentation } = e;
            this.editor.move(selected, delta, presentation);
            this.editor.moveEnd(delta);
        } else if (type === "changeLineSrc") {
            const e: PatcherEditorEventMap[typeof type] = event;
            const { line, src } = e;
            this.editor.changeLineSrc(line.id, src[0], src[1]);
        } else if (type === "changeLineDest") {
            const e: PatcherEditorEventMap[typeof type] = event;
            const { line, dest } = e;
            this.editor.changeLineDest(line.id, dest[0], dest[1]);
        } else if (type === "delete") {
            const e: PatcherEditorEventMap[typeof type] = event;
            await this.editor.delete(e);
        } else if (type === "resized") {
            const e: PatcherEditorEventMap[typeof type] = event;
            const { selected, delta, type: t, presentation } = e;
            this.editor.resize(selected, delta, t, presentation);
        }
        this.undoMap[nextKey] = this.redoMap[nextKey];
        delete this.redoMap[nextKey];
        this.capture = true;
        this.emitChanged();
    }
}
