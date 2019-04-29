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
        if (this.capture) this.timestamp = new Date().getTime();
        return this;
    }
    did<K extends keyof PatcherEventMap>(type: K, e: PatcherEventMap[K]) {
        if (!this.capture) return this;
        if (!this.events.hasOwnProperty(this.timestamp)) {
            if (this.redoList.length) this.redoList = [];
            this.undoList.push(this.timestamp);
            this.events[this.timestamp] = {};
        }
        if (!this.events[this.timestamp].hasOwnProperty(type)) this.events[this.timestamp][type] = [];
        (this.events[this.timestamp][type] as PatcherEventMap[K][]).push(e);
        return this;
    }
    undo() {
        if (this.undoList.length === 0) return this;
        this.capture = false;
        const eID = this.undoList.pop();
        const patcher = this._patcher;
        if (this.events[eID].hasOwnProperty("deleteBox")) {
            this.events[eID].deleteBox.forEach(box => patcher.createBox(box));
        }
        if (this.events[eID].hasOwnProperty("deleteLine")) {
            this.events[eID].deleteLine.forEach(line => patcher.createLine(line));
        }
        if (this.events[eID].hasOwnProperty("delete")) {
            this.events[eID].delete.forEach(deleted => patcher.create(deleted));
        }
        if (this.events[eID].hasOwnProperty("changeBoxText")) {
            this.events[eID].changeBoxText.forEach(e => patcher.changeBoxText(e.box.id, e.oldText));
        }
        if (this.events[eID].hasOwnProperty("moved")) {
            this.events[eID].moved.forEach((e) => {
                const delta = { x: -1 * e.delta.x, y: -1 * e.delta.y };
                patcher.move(e.selected, delta);
            });
        }
        if (this.events[eID].hasOwnProperty("changeLineSrc")) {
            this.events[eID].changeLineSrc.forEach(e => patcher.changeLineSrc(e.line.id, e.oldSrc[0], e.oldSrc[1]));
        }
        if (this.events[eID].hasOwnProperty("changeLineDest")) {
            this.events[eID].changeLineDest.forEach(e => patcher.changeLineDest(e.line.id, e.oldDest[0], e.oldDest[1]));
        }
        if (this.events[eID].hasOwnProperty("createLine")) {
            this.events[eID].createLine.forEach(line => patcher.deleteLine(line.id));
        }
        if (this.events[eID].hasOwnProperty("createBox")) {
            this.events[eID].createBox.forEach(box => patcher.deleteBox(box.id));
        }
        if (this.events[eID].hasOwnProperty("create")) {
            this.events[eID].create.forEach(created => patcher.delete(created));
        }
        this.redoList.push(eID);
        this.capture = true;
        return this;
    }
    redo() {
        if (this.redoList.length === 0) return this;
        this.capture = false;
        const eID = this.redoList.pop();
        const patcher = this._patcher;
        if (this.events[eID].hasOwnProperty("createBox")) {
            this.events[eID].createBox.forEach(box => patcher.createBox(box));
        }
        if (this.events[eID].hasOwnProperty("createLine")) {
            this.events[eID].createLine.forEach(line => patcher.createLine(line));
        }
        if (this.events[eID].hasOwnProperty("create")) {
            this.events[eID].create.forEach(created => patcher.create(created));
        }
        if (this.events[eID].hasOwnProperty("changeBoxText")) {
            this.events[eID].changeBoxText.forEach(e => patcher.changeBoxText(e.box.id, e.text));
        }
        if (this.events[eID].hasOwnProperty("moved")) {
            this.events[eID].moved.forEach(e => patcher.move(e.selected, e.delta));
        }
        if (this.events[eID].hasOwnProperty("changeLineSrc")) {
            this.events[eID].changeLineSrc.forEach(e => patcher.changeLineSrc(e.line.id, e.src[0], e.src[1]));
        }
        if (this.events[eID].hasOwnProperty("changeLineDest")) {
            this.events[eID].changeLineDest.forEach(e => patcher.changeLineDest(e.line.id, e.dest[0], e.dest[1]));
        }
        if (this.events[eID].hasOwnProperty("deleteLine")) {
            this.events[eID].deleteLine.forEach(line => patcher.deleteLine(line.id));
        }
        if (this.events[eID].hasOwnProperty("deleteBox")) {
            this.events[eID].deleteBox.forEach(box => patcher.deleteBox(box.id));
        }
        if (this.events[eID].hasOwnProperty("delete")) {
            this.events[eID].delete.forEach(deleted => patcher.delete(deleted));
        }
        this.undoList.push(eID);
        this.capture = true;
        return this;
    }
}
