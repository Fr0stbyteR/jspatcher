import Patcher from "./Patcher";
import { THistoryElement, PatcherEventMap } from "./types";

export default class History {
    readonly _patcher: Patcher;
    undoList: number[];
    redoList: number[];
    capture: boolean;
    events: { [timestamp: number]: THistoryElement };
    timestamp: number;
    constructor(patcher: Patcher) {
        this._patcher = patcher;
        this.undoList = [];
        this.redoList = [];
        this.capture = true;
        this.events = {};
        this.newTimestamp();
    }
    newTimestamp() {
        if (this.capture) this.timestamp = performance.now();
        return this;
    }
    did<K extends keyof PatcherEventMap>(type: K, e: PatcherEventMap[K]) {
        if (!this.capture) return this;
        if (!this.events.hasOwnProperty(this.timestamp)) {
            if (this.redoList.length) this.redoList = [];
            this.undoList.push(this.timestamp);
            this.events[this.timestamp] = {};
        }
        if (!this.events[this.timestamp].hasOwnProperty(type)) this.events[this.timestamp][type] = [] as any;
        (this.events[this.timestamp][type] as PatcherEventMap[K][]).push(e);
        return this;
    }
    async undo() {
        if (this.undoList.length === 0) return this;
        this.capture = false;
        const eID = this.undoList.pop();
        const patcher = this._patcher;
        if (this.events[eID].hasOwnProperty("deleteBox")) {
            await Promise.all(this.events[eID].deleteBox.map(box => patcher.createBox(box)));
        }
        if (this.events[eID].hasOwnProperty("deleteLine")) {
            this.events[eID].deleteLine.forEach(line => patcher.createLine(line));
        }
        if (this.events[eID].hasOwnProperty("delete")) {
            await Promise.all(this.events[eID].delete.map(deleted => patcher.create(deleted)));
        }
        if (this.events[eID].hasOwnProperty("changeBoxText")) {
            await Promise.all(this.events[eID].changeBoxText.map(({ box, oldText }) => patcher.changeBoxText(box.id, oldText)));
        }
        if (this.events[eID].hasOwnProperty("moved")) {
            this.events[eID].moved.forEach(({ selected, delta, presentation }) => patcher.move(selected, { x: -1 * delta.x, y: -1 * delta.y }, presentation));
        }
        if (this.events[eID].hasOwnProperty("changeLineSrc")) {
            this.events[eID].changeLineSrc.forEach(({ line, oldSrc }) => patcher.changeLineSrc(line.id, oldSrc[0], oldSrc[1]));
        }
        if (this.events[eID].hasOwnProperty("changeLineDest")) {
            this.events[eID].changeLineDest.forEach(({ line, oldDest }) => patcher.changeLineDest(line.id, oldDest[0], oldDest[1]));
        }
        if (this.events[eID].hasOwnProperty("createLine")) {
            this.events[eID].createLine.forEach(line => patcher.deleteLine(line.id));
        }
        if (this.events[eID].hasOwnProperty("createBox")) {
            await Promise.all(this.events[eID].createBox.map(box => patcher.deleteBox(box.id)));
        }
        if (this.events[eID].hasOwnProperty("create")) {
            await Promise.all(this.events[eID].create.map(created => patcher.delete(created)));
        }
        if (this.events[eID].hasOwnProperty("resized")) {
            this.events[eID].resized.forEach(({ selected, delta, type, presentation }) => patcher.resize(selected, { x: -1 * delta.x, y: -1 * delta.y }, type, presentation));
        }
        this.redoList.push(eID);
        this.capture = true;
        return this;
    }
    async redo() {
        if (this.redoList.length === 0) return this;
        this.capture = false;
        const eID = this.redoList.pop();
        const patcher = this._patcher;
        if (this.events[eID].hasOwnProperty("createBox")) {
            await Promise.all(this.events[eID].createBox.map(box => patcher.createBox(box)));
        }
        if (this.events[eID].hasOwnProperty("createLine")) {
            this.events[eID].createLine.forEach(line => patcher.createLine(line));
        }
        if (this.events[eID].hasOwnProperty("create")) {
            await Promise.all(this.events[eID].create.map(created => patcher.create(created)));
        }
        if (this.events[eID].hasOwnProperty("changeBoxText")) {
            await Promise.all(this.events[eID].changeBoxText.map(({ box, text }) => patcher.changeBoxText(box.id, text)));
        }
        if (this.events[eID].hasOwnProperty("moved")) {
            this.events[eID].moved.forEach(({ selected, delta, presentation }) => patcher.move(selected, delta, presentation));
        }
        if (this.events[eID].hasOwnProperty("changeLineSrc")) {
            this.events[eID].changeLineSrc.forEach(({ line, src }) => patcher.changeLineSrc(line.id, src[0], src[1]));
        }
        if (this.events[eID].hasOwnProperty("changeLineDest")) {
            this.events[eID].changeLineDest.forEach(({ line, dest }) => patcher.changeLineDest(line.id, dest[0], dest[1]));
        }
        if (this.events[eID].hasOwnProperty("deleteLine")) {
            this.events[eID].deleteLine.forEach(line => patcher.deleteLine(line.id));
        }
        if (this.events[eID].hasOwnProperty("deleteBox")) {
            await Promise.all(this.events[eID].deleteBox.map(box => patcher.deleteBox(box.id)));
        }
        if (this.events[eID].hasOwnProperty("delete")) {
            await Promise.all(this.events[eID].delete.map(deleted => patcher.delete(deleted)));
        }
        if (this.events[eID].hasOwnProperty("resized")) {
            this.events[eID].resized.forEach(({ selected, delta, type, presentation }) => patcher.resize(selected, delta, type, presentation));
        }
        this.undoList.push(eID);
        this.capture = true;
        return this;
    }
}
