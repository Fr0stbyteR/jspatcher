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
        super.undo(async (eventName, eventData) => {
            if (eventName === "delete") {
                const e: PatcherEditorEventMap[typeof eventName] = eventData;
                await this.editor.create(e);
            } else if (eventName === "changeBoxText") {
                const e: PatcherEditorEventMap[typeof eventName] = eventData;
                const { boxId, oldText } = e;
                await this.editor.instance.changeBoxText(boxId, oldText);
            } else if (eventName === "moved") {
                const e: PatcherEditorEventMap[typeof eventName] = eventData;
                const { selected, delta, presentation } = e;
                const d = { x: -1 * delta.x, y: -1 * delta.y };
                this.editor.move(selected, d, presentation);
                this.editor.moveEnd(d);
            } else if (eventName === "changeLineSrc") {
                const e: PatcherEditorEventMap[typeof eventName] = eventData;
                const { lineId, oldSrc } = e;
                this.editor.changeLineSrc(lineId, oldSrc[0], oldSrc[1]);
            } else if (eventName === "changeLineDest") {
                const e: PatcherEditorEventMap[typeof eventName] = eventData;
                const { lineId, oldDest } = e;
                this.editor.changeLineDest(lineId, oldDest[0], oldDest[1]);
            } else if (eventName === "create") {
                const e: PatcherEditorEventMap[typeof eventName] = eventData;
                await this.editor.delete(e);
            } else if (eventName === "resized") {
                const e: PatcherEditorEventMap[typeof eventName] = eventData;
                const { selected, delta, type: t, presentation } = e;
                const d = { x: -1 * delta.x, y: -1 * delta.y };
                this.editor.resize(selected, d, t, presentation);
                this.editor.resizeEnd(d, t);
            }
        });
    }
    async redo() {
        super.redo(async (eventName, eventData) => {
            if (eventName === "create") {
                const e: PatcherEditorEventMap[typeof eventName] = eventData;
                await this.editor.create(e);
            } else if (eventName === "changeBoxText") {
                const e: PatcherEditorEventMap[typeof eventName] = eventData;
                const { boxId, text } = e;
                await this.editor.instance.changeBoxText(boxId, text);
            } else if (eventName === "moved") {
                const e: PatcherEditorEventMap[typeof eventName] = eventData;
                const { selected, delta, presentation } = e;
                this.editor.move(selected, delta, presentation);
                this.editor.moveEnd(delta);
            } else if (eventName === "changeLineSrc") {
                const e: PatcherEditorEventMap[typeof eventName] = eventData;
                const { lineId, src } = e;
                this.editor.changeLineSrc(lineId, src[0], src[1]);
            } else if (eventName === "changeLineDest") {
                const e: PatcherEditorEventMap[typeof eventName] = eventData;
                const { lineId, dest } = e;
                this.editor.changeLineDest(lineId, dest[0], dest[1]);
            } else if (eventName === "delete") {
                const e: PatcherEditorEventMap[typeof eventName] = eventData;
                await this.editor.delete(e);
            } else if (eventName === "resized") {
                const e: PatcherEditorEventMap[typeof eventName] = eventData;
                const { selected, delta, type: t, presentation } = e;
                this.editor.resize(selected, delta, t, presentation);
                this.editor.resizeEnd(delta, t);
            }
        });
    }
}
