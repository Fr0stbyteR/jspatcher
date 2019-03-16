import { EventEmitter } from "events";
import { Line, TLine } from "./Line";
import { Box, TBox } from "./Box";

export type TPatcherMode = "max" | "gen" | "js";
export type TPatcher = { lines: { [key: string]: TLine }, boxes: { [key: string]: TBox }, props?: {}, [key: string]: any };
export type TPatcherProps = { mode: TPatcherMode, bgcolor: [number, number, number, number], editing_bgcolor: [number, number, number, number], grid: [number, number], boxIndexCount: number, lineIndexCount: number };
export type TPatcherState = { isLoading: boolean, locked: boolean, presentation: boolean, showGrid: boolean, snapToGrid: boolean, log: TPatcherLog[], history: History, lib: { [key: string]: typeof Base.BaseObject }, libJS: { [key: string]: typeof Base.BaseObject }, libMax: { [key: string]: typeof Base.BaseObject }, libGen: { [key: string]: typeof Base.BaseObject }, selected: string[] };
export type TPatcherLog = { errorLevel: -2 | -1 | 0 | 1, title: string, message: string };
export type TMaxPatcher = { patcher: { lines: TMaxLine[], boxes: TMaxBox[], rect: number[], bgcolor: [number, number, number, number], editing_bgcolor: [number, number, number, number], gridsize: [number, number], [key: string]: any } };
export type TMaxBox = { box: { id: string, maxclass: "newobj" | string, text?: string, numinlets: number, numoutlets: number, patching_rect: [number, number, number, number], presentation_rect: [number, number, number, number], presentation: number }};
export type TMaxLine = { patchline: { destination: [string, number], source: [string, number], order: number, midpoints: number[] }};
export type TPackage = { [key: string]: typeof Base.BaseObject | TPackage };
type TEvents = "loaded" | "lockedChange" | "presentationChange" | "showGridChange" | "createBox" | "createObject" | "changeBoxText" | "deleteBox" | "createLine" | "deleteLine" | "redrawLine" | "changeLineSrc" | "changeLineDest" | "changeLine" | "forceBoxRect" | "newLog" | "updateBoxRect" | "selected" | "deselected" | "tempLine";

import Base from "./objects/Base";
import Max from "./objects/Max";
import Gen from "./objects/Gen";
import UI from "./objects/UI";
import Op from "./objects/Op";
import Window from "./objects/Window";
const Packages = {
    Base, UI, Op, Window
} as TPackage;

export class Patcher extends EventEmitter {
    on: (type: TEvents, listener: (...args: any[]) => void) => this;
    once: (type: TEvents, listener: (...args: any[]) => void) => this;
    off: (type: TEvents, listener: (...args: any[]) => void) => this;
    removeAllListeners: (type: TEvents) => this;
    emit: (type: TEvents, ...args: any[]) => boolean;
    lines: { [key: string]: Line };
    boxes: { [key: string]: Box };
    props: TPatcherProps;
    _state: TPatcherState;
    private _packages: TPackage;
    constructor() {
        super();
        this.setMaxListeners(4096);
        this.observeHistory();
        this._state = { isLoading: false, locked: true, presentation: false, showGrid: true, snapToGrid: true, log: [], history: new History(this), lib: {}, libJS: {}, libMax: {}, libGen: {}, selected: [] };
        this._state.libJS = this.packageRegister(Packages, {});
        this._state.libMax = {}; // this.packageRegister((Packages.Max as TPackage), {});
        this._state.libGen = this.packageRegister((Gen as TPackage), {});
        this._packages = Packages;
        this.clear();
    }
    packageRegister(pkg: TPackage, libOut: { [key: string]: typeof Base.BaseObject }, path?: string) {
        for (const key in pkg) {
            const el = pkg[key];
            if (typeof el === "object") {
                const full = path ? path + "." + key : key;
                this.packageRegister(el, libOut, full);
            } else if (typeof el === "function" && el.prototype instanceof Base.BaseObject) {
                const full = path ? path + "." + key : key;
                if (!libOut.hasOwnProperty(key)) libOut[key] = el;
                if (libOut.hasOwnProperty(full)) this.newLog(1, "Patcher", "Path duplicated, cannot register " + full);
                else libOut[full] = el;
            } else continue;
        }
        return libOut;
    }
    clear() {
        this.lines = {};
        this.boxes = {};
        this.props = { mode: "js", bgcolor: [61, 65, 70, 1], editing_bgcolor: [82, 87, 94, 1], grid: [15, 15], boxIndexCount: 0, lineIndexCount: 0 };
        this._state.selected = [];
    }
    load(modeIn: TPatcherMode, patcherIn: TPatcher | TMaxPatcher | any) {
        this._state.isLoading = true;
        this.clear();
        if (!patcherIn) {
            this._state.isLoading = false;
            return this;
        }
        this.props.mode = modeIn;
        if (modeIn === "max" || modeIn === "gen") {
            const rgbaMax2Css = (maxColor: number[]) => {
                const cssColor = [255, 255, 255, 1] as [number, number, number, number];
                if (!Array.isArray(maxColor)) return cssColor;
                for (let i = 0; i < 3; i++) {
                    if (typeof maxColor[i] === "number") cssColor[i] = Math.floor(maxColor[i] * 255);
                }
                if (typeof maxColor[3] === "number") cssColor[3] = maxColor[3];
                return cssColor;
            };
            this._state.lib = modeIn === "max" ? this._state.libMax : this._state.libGen;
            const patcher = (patcherIn as TMaxPatcher).patcher;
            if (!patcher) {
                this._state.isLoading = false;
                return this;
            }
            this.props.bgcolor = rgbaMax2Css(patcher.bgcolor);
            this.props.editing_bgcolor = rgbaMax2Css(patcher.editing_bgcolor);
            const maxBoxes = patcher.boxes;
            const maxLines = patcher.lines;
            for (let i = 0; i < maxBoxes.length; i++) {
                const maxBox = maxBoxes[i]["box"];
                const numID = parseInt(maxBox.id.match(/\d+/)[0]);
                if (numID > this.props.boxIndexCount) this.props.boxIndexCount = numID;
                const id = "box-" + numID;
                this.createBox({
                    id,
                    inlets: maxBox.numinlets,
                    outlets: maxBox.numoutlets,
                    rect: maxBox.patching_rect,
                    text: (maxBox.maxclass === "newobj" ? "" : maxBox.maxclass + " ") + (maxBox.text ? maxBox.text : "")
                });
            }
            for (let i = 0; i < maxLines.length; i++) {
                const lineArgs = maxLines[i].patchline;
                const id = "line-" + ++this.props.lineIndexCount;
                this.createLine({
                    id,
                    src: [lineArgs.source[0].replace(/obj/, "box"), lineArgs.source[1]],
                    dest: [lineArgs.destination[0].replace(/obj/, "box"), lineArgs.destination[1]]
                });
            }
        } else if (modeIn === "js") {
            this._state.lib = this._state.libJS;
            const patcher = patcherIn;
            if (patcher.props) this.props = { ...this.props, ...patcher.props };
            if (patcher.boxes) { // Boxes & data
                for (const id in patcher.boxes) {
                    this.createBox(patcher.boxes[id]);
                    const numID = parseInt(id.match(/\d+/)[0]);
                    if (numID > this.props.boxIndexCount) this.props.boxIndexCount = numID;
                }
            }
            if (patcher.lines) { // Lines
                for (const id in patcher.lines) {
                    this.createLine(patcher.lines[id]);
                    const numID = parseInt(id.match(/\d+/)[0]);
                    if (numID > this.props.lineIndexCount) this.props.lineIndexCount = numID;
                }
            }
        }
        this._state.isLoading = false;
        this.emit("loaded", this);
        return this;
    }
    createBox(boxIn: TBox) {
        if (!boxIn.hasOwnProperty("id")) boxIn.id = "box-" + ++this.props.boxIndexCount;
        const box = new Box(this, boxIn);
        this.boxes[box.id] = box;
        box.init();
        if (!this._state.isLoading) this.emit("createBox", box);
        return box;
    }
    createObject(parsed: { class: string, args: any[], props: { [key: string]: any } }, boxIn: Box) {
        let obj;
        const className = parsed.class;
        if (typeof className !== "string" || className.length === 0) {
            obj = new Base.EmptyObject(boxIn, this);
        } else {
            if (this._state.lib.hasOwnProperty(className)) {
                obj = new this._state.lib[className](boxIn, this);
            } else {
                this.newLog(1, "Patcher", "Object " + className + " not found.");
                obj = new Base.InvalidObject(boxIn, this);
            }
            if (!(obj instanceof Base.BaseObject)) {
                this.newLog(1, "Patcher", "Object " + className + " is not valid.");
                obj = new Base.InvalidObject(boxIn, this);
            }
        }
        this.emit("createObject", obj);
        return obj;
    }
    changeBoxText(boxID: string, text: string) {
        const oldText = this.boxes[boxID].text;
        this.boxes[boxID].changeText(text);
        this.newTimestamp();
        this.emit("changeBoxText", this.boxes[boxID], oldText, text);
        return this.boxes[boxID];
    }
    deleteBox(boxID: string) {
        const box = this.boxes[boxID];
        box.destroy();
        this.deselect(boxID);
        this.emit("deleteBox", box);
        return box;
    }
    createLine(lineIn: TLine) {
        if (!this.canCreateLine(lineIn)) return null;
        if (!lineIn.hasOwnProperty("id")) lineIn.id = "line-" + ++this.props.lineIndexCount;
        const line = new Line(this, lineIn);
        this.lines[line.id] = line;
        line.enable();
        if (!this._state.isLoading) this.emit("createLine", line);
        return line;
    }
    canCreateLine(lineIn: TLine) {
        if (lineIn.src[1] >= this.boxes[lineIn.src[0]].outlets) return false;
        if (lineIn.dest[1] >= this.boxes[lineIn.dest[0]].inlets) return false;
        if (this.getLinesByBox(lineIn.src[0], lineIn.dest[0], lineIn.src[1], lineIn.dest[1]).length > 0) return false;
        return true;
    }
    deleteLine(lineID: string) {
        const line = this.lines[lineID];
        line.destroy();
        this.deselect(lineID);
        this.emit("deleteLine", line);
        return line;
    }
    changeLineSrc(lineID: string, srcID: string, srcOutlet: number) {
        const line = this.lines[lineID];
        if (this.getLinesByBox(srcID, line.destID, srcOutlet, line.destInlet).length > 0) {
            this.emit("redrawLine", line);
            return line;
        }
        const oldSrc = [line.srcID, line.srcOutlet];
        const src = [srcID, srcOutlet] as [string, number];
        line.setSrc(src);
        this.newTimestamp();
        this.emit("changeLineSrc", line, oldSrc, src);
        this.emit("changeLine", line, true, oldSrc, src);
        return line;
    }
    changeLineDest(lineID: string, destID: string, destOutlet: number) {
        const line = this.lines[lineID];
        if (this.getLinesByBox(line.srcID, destID, line.destInlet, destOutlet).length > 0) {
            this.emit("redrawLine", line);
            return line;
        }
        const oldDest = [line.destID, line.destInlet];
        const dest = [destID, destOutlet] as [string, number];
        line.setDest(dest);
        this.newTimestamp();
        this.emit("changeLineDest", line, oldDest, dest);
        this.emit("changeLine", line, false, oldDest, dest);
        return line;
    }
    getLinesBySrcID(srcID: string) {
        const result = [];
        for (let i = 0; i < this.boxes[srcID].outlets; i++) { // Array.fill fills the array with same instance
            result[i] = [];
        }
        for (const id in this.lines) {
            const line = this.lines[id];
            if (line && line.srcID === srcID) {
                const srcOutlet = line.srcOutlet;
                if (!result[srcOutlet]) result[srcOutlet] = [id];
                else result[srcOutlet].push(id);
            }
        }
        return result;
    }
    getLinesByDestID(destID: string) {
        const result = [];
        for (let i = 0; i < this.boxes[destID].inlets; i++) {
            result[i] = [];
        }
        for (const id in this.lines) {
            const line = this.lines[id];
            if (line && line.destID === destID) {
                const destInlet = line.destInlet;
                if (!result[destInlet]) result[destInlet] = [id];
                else result[destInlet].push(id);
            }
        }
        return result;
    }
    getLinesByBox(srcID: string, destID: string, srcOutlet?: number, destInlet?: number) {
        const result = [] as string[];
        let srcOuts = [] as string[], destIns = [] as string[];
        const srcOutsWraped = this.getLinesBySrcID(srcID);
        if (srcOutlet !== undefined) srcOuts = srcOutsWraped[srcOutlet];
        else srcOutsWraped.forEach(el => srcOuts = srcOuts.concat(el));
        const destInsWraped = this.getLinesByDestID(destID);
        if (destInlet !== undefined) destIns = destInsWraped[destInlet];
        else destInsWraped.forEach(el => destIns = destIns.concat(el));
        if (!srcOuts || !destIns) return result;
        for (const idOut of srcOuts) {
            for (const idIn of destIns) {
                if (idIn === idOut) result.push(idIn);
            }
        }
        return result;
    }
    newLog(errorLevel: -2 | -1 | 0 | 1, title: string, message: string) {
        const log = { errorLevel, title, message };
        this._state.log.push(log);
        this.emit("newLog", log);
    }
    observeHistory() {
        this.on("createBox", (box) => {
            this._state.history.do("createBox", box);
        }).on("deleteBox", (box) => {
            this._state.history.do("deleteBox", box);
        }).on("createLine", (line) => {
            this._state.history.do("createLine", line);
        }).on("deleteLine", (line) => {
            this._state.history.do("deleteLine", line);
        }).on("changeBoxText", (box, oldText, text) => {
            const info = { box, oldText, text };
            this._state.history.do("changeBoxText", info);
        }).on("changeLineSrc", (line, oldSrc, src) => {
            const info = { line, oldSrc, src };
            this._state.history.do("changeLineSrc", info);
        }).on("changeLineDest", (line, oldDest, dest) => {
            const info = { line, oldDest, dest };
            this._state.history.do("changeLineDest", info);
        }).on("updateBoxRect", (box, oldRect, rect) => {
            const info = { box, oldRect, rect };
            this._state.history.do("updateBoxRect", info);
        });
    }
    newTimestamp() {
        this._state.history.newTimestamp();
        return this;
    }
    setLock(bool: boolean): Patcher {
        if (this._state.locked === bool) return this;
        this._state.locked = bool;
        this.emit("lockedChange", bool);
        return this;
    }
    setPresentation(bool: boolean) {
        if (this._state.presentation === bool) return this;
        this._state.presentation = bool;
        this.emit("presentationChange", bool);
        return this;
    }
    setShowGrid(bool: boolean) {
        if (this._state.showGrid === bool) return this;
        this._state.showGrid = bool;
        this.emit("showGridChange", bool);
        return this;
    }
    selectAllBoxes() {
        Object.keys(this.boxes).forEach(id => this.select(id));
    }
    select(id: string) {
        if (this.boxes[id] || this.lines[id]) {
            this._state.selected.push(id);
            this.emit("selected", id);
        }
    }
    deselect(id: string) {
        const i = this._state.selected.indexOf(id);
        if (i >= 0) {
            this._state.selected.splice(i, 1);
            this.emit("deselected", id);
        }
    }
    deselectAll() {
        this._state.selected.forEach(el => this.emit("deselected", el));
        this._state.selected = [];
    }
    selectOnly(id: string) {
        this.deselectAll();
        this.select(id);
    }
    moveBox(boxID: string, deltaX: number, deltaY: number) {
        const box = this.boxes[boxID];
        if (!box) return;
        box.rect[0] += deltaX;
        box.rect[1] += deltaY;
        box.setRect(box.rect);
    }
    moveSelectedBox(boxID: string, dragOffset: { x: number, y: number }) {
        const linesConcerned = {} as { [key: string]: boolean };
        const deltaX = this._state.snapToGrid ? Math.round((this.boxes[boxID].rect[0] + dragOffset.x) / this.props.grid[0]) * this.props.grid[0] - this.boxes[boxID].rect[0] : dragOffset.x;
        const deltaY = this._state.snapToGrid ? Math.round((this.boxes[boxID].rect[1] + dragOffset.y) / this.props.grid[1]) * this.props.grid[1] - this.boxes[boxID].rect[1] : dragOffset.y;
        const delta = { x: deltaX, y: deltaY };
        if (!delta.x && !delta.y) return dragOffset;
        this._state.selected.forEach((id) => {
            if (!id.includes("box")) return;
            const box = this.boxes[id];
            if (!box) return;
            box.rect[0] += delta.x;
            box.rect[1] += delta.y;
            const lineAsDest = this.getLinesByDestID(id);
            const lineAsSrc = this.getLinesBySrcID(id);
            lineAsDest.forEach(el => el.forEach(el => linesConcerned[el] = true));
            lineAsSrc.forEach(el => el.forEach(el => linesConcerned[el] = true));
            box.emit("rectChanged", box);
        });
        Object.keys(linesConcerned).forEach((lineID) => {
            const line = this.lines[lineID];
            if (!line) return;
            line.emit("posChanged", line);
        });
        return { x: dragOffset.x - delta.x, y: dragOffset.y - delta.y };
    }
    findNearestPort(findSrc: boolean, left: number, top: number, from: [string, number], to?: [string, number]) {
        let nearest = [null, null] as [string, number];
        let minDistance = 100;
        if (to) {
            const currentPos = this.boxes[to[0]][findSrc ? "getOutletPosition" : "getInletPosition"](to[1]);
            const currentDistance = ((currentPos.left - left) ** 2 + (currentPos.top - top) ** 2) ** 0.5;
            if (currentDistance < 100) {
                nearest = to;
                minDistance = currentDistance;
            }
        }
        for (const id in this.boxes) {
            const box = this.boxes[id];
            box[findSrc ? "outletsPositions" : "inletsPositions"].forEach((pos, i) => {
                const distance = ((pos.left - left) ** 2 + (pos.top - top) ** 2) ** 0.5;
                if (distance < minDistance) {
                    const canCreate = this.canCreateLine({ src: findSrc ? [id, i] : from, dest: findSrc ? from : [id, i] });
                    if (!canCreate) return;
                    nearest = [id, i];
                    minDistance = distance;
                }
            });
        }
        return nearest;
    }
    highlightNearestPort(findSrc: boolean, dragOffset: { x: number, y: number }, from: [string, number], to?: [string, number]) { // to = the port need to be reconnect
        const origPos = to ? this.boxes[to[0]][findSrc ? "getOutletPosition" : "getInletPosition"](to[1]) : this.boxes[from[0]][findSrc ? "getInletPosition" : "getOutletPosition"](from[1]);
        const left = origPos.left + dragOffset.x;
        const top = origPos.top + dragOffset.y;
        const nearest = this.findNearestPort(findSrc, left, top, from, to);
        for (const id in this.boxes) {
            const box = this.boxes[id];
            for (let i = 0; i < box[findSrc ? "outlets" : "inlets"]; i++) {
                box.highlightPort(findSrc, i, nearest[0] === id && nearest[1] === i);
            }
        }
        return nearest;
    }
    tempLine(findSrc: boolean, from: [string, number]) {
        this.emit("tempLine", findSrc, from);
        return this;
    }
    paste(clipboard: TPatcher) {
        const idMap = {} as { [key: string]: string };
        const pasted = { boxes: [] as TBox[], lines: [] as TLine[] };
        for (const boxID in clipboard.boxes) {
            const box = clipboard.boxes[boxID];
            if (this.boxes.hasOwnProperty(box.id)) {
                idMap[box.id] = "box-" + ++this.props.boxIndexCount;
                box.id = idMap[box.id];
            } else {
                idMap[box.id] = box.id;
            }
            box.rect = [box.rect[0] + 20, box.rect[1] + 20, box.rect[2], box.rect[3]];
            this.createBox(box);
            pasted.boxes.push(box);
        }
        for (const lineID in clipboard.lines) {
            const line = clipboard.lines[lineID];
            if (this.lines.hasOwnProperty(line.id)) {
                line.id = "line-" + ++this.props.lineIndexCount;
            }
            line.src[0] = idMap[line.src[0]];
            line.dest[0] = idMap[line.dest[0]];
            this.createLine(line);
            pasted.lines.push(line);
        }
        return pasted;
    }
    toString() {
        return JSON.stringify(this, (k, v) => k.charAt(0) === "_" ? undefined : v, 4);
    }
}

class History {
    _patcher: Patcher;
    undoList: number[];
    redoList: number[];
    capture: boolean;
    events: { [key: number]: {[key: string]: any[]} };
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
    do(e: string, data: object) {
        if (!this.capture) return this;
        if (!this.events.hasOwnProperty(this.timestamp)) {
            if (this.redoList.length) this.redoList = [];
            this.undoList.push(this.timestamp);
            this.events[this.timestamp] = {};
        }
        if (!this.events[this.timestamp].hasOwnProperty(e)) this.events[this.timestamp][e] = [];
        this.events[this.timestamp][e].push(data);
        return this;
    }
    undo() {
        if (this.undoList.length === 0) return this;
        this.capture = false;
        const eID = this.undoList.pop();
        if (this.events[eID].hasOwnProperty("deleteBox")) {
            for (const box of this.events[eID]["deleteBox"]) {
                this._patcher.createBox(box);
            }
        }
        if (this.events[eID].hasOwnProperty("deleteLine")) {
            for (const line of this.events[eID]["deleteLine"]) {
                this._patcher.createLine(line);
            }
        }
        if (this.events[eID].hasOwnProperty("changeBoxText")) {
            for (const info of this.events[eID]["changeBoxText"]) {
                this._patcher.changeBoxText(info.box.id, info.oldText);
            }
        }
        if (this.events[eID].hasOwnProperty("updateBoxRect")) {
            for (const info of this.events[eID]["updateBoxRect"]) {
                this._patcher.emit("forceBoxRect", info.box.id, info.oldRect);
            }
        }
        if (this.events[eID].hasOwnProperty("changeLineSrc")) {
            for (const info of this.events[eID]["changeLineSrc"]) {
                this._patcher.changeLineSrc(info.line.id, info.oldSrc[0], info.oldSrc[1]);
            }
        }
        if (this.events[eID].hasOwnProperty("changeLineDest")) {
            for (const info of this.events[eID]["changeLineDest"]) {
                this._patcher.changeLineDest(info.line.id, info.oldDest[0], info.oldDest[1]);
            }
        }
        if (this.events[eID].hasOwnProperty("createLine")) {
            for (const line of this.events[eID]["createLine"]) {
                this._patcher.deleteLine(line.id);
            }
        }
        if (this.events[eID].hasOwnProperty("createBox")) {
            for (const box of this.events[eID]["createBox"]) {
                this._patcher.deleteBox(box.id);
            }
        }
        this.redoList.push(eID);
        this.capture = true;
        return this;
    }
    redo() {
        if (this.redoList.length === 0) return this;
        this.capture = false;
        const eID = this.redoList.pop();
        if (this.events[eID].hasOwnProperty("createBox")) {
            for (const box of this.events[eID]["createBox"]) {
                this._patcher.createBox(box);
            }
        }
        if (this.events[eID].hasOwnProperty("createLine")) {
            for (const line of this.events[eID]["createLine"]) {
                this._patcher.createLine(line);
            }
        }
        if (this.events[eID].hasOwnProperty("changeBoxText")) {
            for (const info of this.events[eID]["changeBoxText"]) {
                this._patcher.changeBoxText(info.box.id, info.text);
            }
        }
        if (this.events[eID].hasOwnProperty("updateBoxRect")) {
            for (const info of this.events[eID]["updateBoxRect"]) {
                this._patcher.emit("forceBoxRect", info.box.id, info.rect);
            }
        }
        if (this.events[eID].hasOwnProperty("changeLineSrc")) {
            for (const info of this.events[eID]["changeLineSrc"]) {
                this._patcher.changeLineSrc(info.line.id, info.src[0], info.src[1]);
            }
        }
        if (this.events[eID].hasOwnProperty("changeLineDest")) {
            for (const info of this.events[eID]["changeLineDest"]) {
                this._patcher.changeLineDest(info.line.id, info.dest[0], info.dest[1]);
            }
        }
        if (this.events[eID].hasOwnProperty("deleteLine")) {
            for (const line of this.events[eID]["deleteLine"]) {
                this._patcher.deleteLine(line.id);
            }
        }
        if (this.events[eID].hasOwnProperty("deleteBox")) {
            for (const box of this.events[eID]["deleteBox"]) {
                this._patcher.deleteBox(box.id);
            }
        }
        this.undoList.push(eID);
        this.capture = true;
        return this;
    }
}

class SharedMemory {
    dataSet: { [key: string]: any };
    constructor() {
        this.dataSet = {};
    }
    set(key: string, value: any) {
        if (this.dataSet.hasOwnProperty(key)) this.dataSet[key].value = value;
        else this.dataSet[key] = { value : undefined, inspectors : [] };
        return this.dataSet;
    }
    get(key: string) {
        if (this.dataSet.hasOwnProperty(key)) return this.dataSet[key].value;
        return undefined;
    }
    // bind a variable with object id
    on(key: string, id: string) {
        if (!this.dataSet.hasOwnProperty(key)) this.dataSet[key] = { value : undefined, inspectors : [] };
        this.dataSet[key].inspectors.push(id);
        return this;
    }
    // unbind a variable with object id
    off(key: string, id: string) {
        if (!this.dataSet.hasOwnProperty(key)) return this;
        if (this.dataSet[key].inspectors.includes(id)) this.dataSet[key].inspectors.splice(this.dataSet[key].inspectors.indexOf(id), 1);
        if (this.dataSet[key].inspectors.length === 0) delete this.dataSet[key];
        return this;
    }
}
