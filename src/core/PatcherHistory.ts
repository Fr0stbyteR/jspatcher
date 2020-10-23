import History from "./file/History";
import Patcher from "./Patcher";
import { PatcherEventMap } from "./types";

export default class PatcherHistory extends History<PatcherEventMap> {
    instance: Patcher;
    eventListening: (keyof PatcherEventMap)[] = [
        "createBox", "deleteBox", "createLine", "deleteLine", "create", "delete",
        "changeBoxText", "changeLineSrc", "changeLineDest", "moved", "resized"
    ];
    async undo() {
        if (!this.instance) return;
        if (!this.isUndoable) return;
        this.capture = false;
        const lastKey = Object.keys(this.undoMap).map(v => +v).sort((a, b) => b - a)[0];
        const { type, event } = this.undoMap[lastKey];
        if (type === "deleteBox") {
            const e: PatcherEventMap[typeof type] = event;
            await this.instance.createBox(e);
        } else if (type === "deleteLine") {
            const e: PatcherEventMap[typeof type] = event;
            this.instance.createLine(e);
        } else if (type === "delete") {
            const e: PatcherEventMap[typeof type] = event;
            await this.instance.create(e);
        } else if (type === "changeBoxText") {
            const e: PatcherEventMap[typeof type] = event;
            const { box, oldText } = e;
            await this.instance.changeBoxText(box.id, oldText);
        } else if (type === "moved") {
            const e: PatcherEventMap[typeof type] = event;
            const { selected, delta, presentation } = e;
            this.instance.move(selected, { x: -1 * delta.x, y: -1 * delta.y }, presentation);
        } else if (type === "changeLineSrc") {
            const e: PatcherEventMap[typeof type] = event;
            const { line, oldSrc } = e;
            this.instance.changeLineSrc(line.id, oldSrc[0], oldSrc[1]);
        } else if (type === "changeLineDest") {
            const e: PatcherEventMap[typeof type] = event;
            const { line, oldDest } = e;
            this.instance.changeLineDest(line.id, oldDest[0], oldDest[1]);
        } else if (type === "createLine") {
            const e: PatcherEventMap[typeof type] = event;
            this.instance.deleteLine(e.id);
        } else if (type === "createBox") {
            const e: PatcherEventMap[typeof type] = event;
            await this.instance.deleteBox(e.id);
        } else if (type === "create") {
            const e: PatcherEventMap[typeof type] = event;
            await this.instance.delete(e);
        } else if (type === "resized") {
            const e: PatcherEventMap[typeof type] = event;
            const { selected, delta, type: t, presentation } = e;
            this.instance.resize(selected, { x: -1 * delta.x, y: -1 * delta.y }, t, presentation);
        }
        this.redoMap[lastKey] = this.undoMap[lastKey];
        delete this.undoMap[lastKey];
        this.capture = true;
        this.emitChanged();
    }
    async redo() {
        if (!this.instance) return;
        if (!this.isRedoable) return;
        this.capture = false;
        const nextKey = Object.keys(this.redoMap).map(v => +v).sort((a, b) => a - b)[0];
        const { type, event } = this.redoMap[nextKey];
        if (type === "createBox") {
            const e: PatcherEventMap[typeof type] = event;
            await this.instance.createBox(e);
        } else if (type === "createLine") {
            const e: PatcherEventMap[typeof type] = event;
            this.instance.createLine(e);
        } else if (type === "create") {
            const e: PatcherEventMap[typeof type] = event;
            await this.instance.create(e);
        } else if (type === "changeBoxText") {
            const e: PatcherEventMap[typeof type] = event;
            const { box, text } = e;
            await this.instance.changeBoxText(box.id, text);
        } else if (type === "moved") {
            const e: PatcherEventMap[typeof type] = event;
            const { selected, delta, presentation } = e;
            this.instance.move(selected, delta, presentation);
        } else if (type === "changeLineSrc") {
            const e: PatcherEventMap[typeof type] = event;
            const { line, src } = e;
            this.instance.changeLineSrc(line.id, src[0], src[1]);
        } else if (type === "changeLineDest") {
            const e: PatcherEventMap[typeof type] = event;
            const { line, dest } = e;
            this.instance.changeLineDest(line.id, dest[0], dest[1]);
        } else if (type === "deleteLine") {
            const e: PatcherEventMap[typeof type] = event;
            this.instance.deleteLine(e.id);
        } else if (type === "deleteBox") {
            const e: PatcherEventMap[typeof type] = event;
            await this.instance.deleteBox(e.id);
        } else if (type === "delete") {
            const e: PatcherEventMap[typeof type] = event;
            await this.instance.delete(e);
        } else if (type === "resized") {
            const e: PatcherEventMap[typeof type] = event;
            const { selected, delta, type: t, presentation } = e;
            this.instance.resize(selected, delta, t, presentation);
        }
        this.undoMap[nextKey] = this.redoMap[nextKey];
        delete this.redoMap[nextKey];
        this.capture = true;
        this.emitChanged();
    }
}
