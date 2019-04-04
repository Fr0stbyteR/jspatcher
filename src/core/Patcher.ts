import { EventEmitter } from "events";
import { Line } from "./Line";
import { Box } from "./Box";
import { AutoImporter } from "./AutoImporter";
import { TLine, TBox, PatcherEventMap, THistoryElement, TPackage, TPatcherProps, TPatcherState, TPatcherMode, TPatcher, TMaxPatcher, TMaxClipboard } from "./types";

import Base from "./objects/Base";
import Max from "./objects/Max";
import Gen from "./objects/Gen";
import UI from "./objects/UI";
import Op from "./objects/Op";
import Window from "./objects/Window";

const Packages = { Base, UI, Op, Window } as TPackage;

export class Patcher extends EventEmitter {
    on<K extends keyof PatcherEventMap>(type: K, listener: (e: PatcherEventMap[K]) => void) {
        return super.on(type, listener);
    }
    once<K extends keyof PatcherEventMap>(type: K, listener: (e: PatcherEventMap[K]) => void) {
        return super.once(type, listener);
    }
    off<K extends keyof PatcherEventMap>(type: K, listener: (e: PatcherEventMap[K]) => void) {
        return super.off(type, listener);
    }
    removeAllListeners<K extends keyof PatcherEventMap>(type: K) {
        return super.removeAllListeners(type);
    }
    emit<K extends keyof PatcherEventMap>(type: K, e: PatcherEventMap[K]) {
        return super.emit(type, e);
    }
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
    async dynamicImportPackage(address: string, pkgName?: string) {
        const pkg = await AutoImporter.importFrom(address, pkgName);
        Packages[pkgName || name] = pkg;
        this.packageRegister(pkg, this._state.libJS, pkgName || name);
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
                this.emit("loaded", this);
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
        this.emit("changeBoxText", { oldText, text, box: this.boxes[boxID] });
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
        const oldSrc = [line.srcID, line.srcOutlet] as [string, number];
        const src = [srcID, srcOutlet] as [string, number];
        line.setSrc(src);
        this.newTimestamp();
        this.emit("changeLineSrc", { line, oldSrc, src });
        this.emit("changeLine", { line, isSrc: true, oldPort: oldSrc, port: src });
        return line;
    }
    changeLineDest(lineID: string, destID: string, destOutlet: number) {
        const line = this.lines[lineID];
        if (this.getLinesByBox(line.srcID, destID, line.destInlet, destOutlet).length > 0) {
            this.emit("redrawLine", line);
            return line;
        }
        const oldDest = [line.destID, line.destInlet] as [string, number];
        const dest = [destID, destOutlet] as [string, number];
        line.setDest(dest);
        this.newTimestamp();
        this.emit("changeLineDest", { line, oldDest, dest });
        this.emit("changeLine", { line, isSrc: false, oldPort: oldDest, port: dest });
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
    log(message: string) {
        this.newLog(0, "Patcher", message);
    }
    error(message: string) {
        this.newLog(1, "Patcher", message);
    }
    newLog(errorLevel: -2 | -1 | 0 | 1, title: string, message: string) {
        const log = { errorLevel, title, message };
        this._state.log.push(log);
        this.emit("newLog", log);
    }
    observeHistory<K extends keyof PatcherEventMap>() {
        [
            "createBox", "deleteBox", "createLine", "deleteLine", "create", "delete",
            "changeBoxText", "changeLineSrc", "changeLineDest", "updateBoxRect"
        ].forEach((type: K) => this.on(type, e => this._state.history.did(type, e)));
    }
    newTimestamp() {
        this._state.history.newTimestamp();
        return this;
    }
    setLock(bool: boolean): Patcher {
        if (this._state.locked === bool) return this;
        this._state.locked = bool;
        this.emit("locked", bool);
        return this;
    }
    setPresentation(bool: boolean) {
        if (this._state.presentation === bool) return this;
        this._state.presentation = bool;
        this.emit("presentation", bool);
        return this;
    }
    setShowGrid(bool: boolean) {
        if (this._state.showGrid === bool) return this;
        this._state.showGrid = bool;
        this.emit("showGrid", bool);
        return this;
    }
    selectAllBoxes() {
        Object.keys(this.boxes).forEach(id => this.select(id));
    }
    select(id: string) {
        if (this._state.selected.indexOf(id) >= 0) return;
        if (this.boxes[id] || this.lines[id]) {
            this._state.selected.push(id);
            this.emit("selected", id);
        }
    }
    deselect(id: string) {
        const i = this._state.selected.indexOf(id);
        if (i === -1) return;
        this._state.selected.splice(i, 1);
        this.emit("deselected", id);
    }
    deselectAll() {
        this._state.selected.forEach(el => this.emit("deselected", el));
        this._state.selected = [];
    }
    selectOnly(id: string) {
        this.deselectAll();
        this.select(id);
    }
    selectRegion(selectionRect: number[], selectedBefore: string[]): any {
        let [left, top, right, bottom] = selectionRect;
        if (left > right) [left, right] = [right, left];
        if (top > bottom) [top, bottom] = [bottom, top];
        const select = selectedBefore.slice();
        for (const boxID in this.boxes) {
            const box = this.boxes[boxID];
            const [boxLeft, boxTop] = box.rect;
            const [boxRight, boxBottom] = [boxLeft + box.rect[2], boxTop + box.rect[3]];
            if (boxLeft < right && boxTop < bottom && boxRight > left && boxBottom > top) {
                const i = select.indexOf(boxID);
                if (i === -1) select.push(boxID);
                else select.splice(i, 1);
            }
        }
        const deselect = this._state.selected.filter(id => select.indexOf(id) === -1);
        select.forEach(boxID => this.select(boxID));
        deselect.forEach(id => this.deselect(id));
    }
    moveBox(boxID: string, deltaX: number, deltaY: number) {
        const box = this.boxes[boxID];
        if (!box) return this;
        box.rect[0] += deltaX;
        box.rect[1] += deltaY;
        if (box.rect[0] < 0) box.rect[0] = 0;
        if (box.rect[1] < 0) box.rect[1] = 0;
        box.setRect(box.rect);
        return this;
    }
    moveSelectedBox(boxID: string, dragOffset: { x: number, y: number }) {
        const linesConcerned = {} as { [id: string]: true };
        const deltaX = this._state.snapToGrid ? Math.round((this.boxes[boxID].rect[0] + dragOffset.x) / this.props.grid[0]) * this.props.grid[0] - this.boxes[boxID].rect[0] : dragOffset.x;
        const deltaY = this._state.snapToGrid ? Math.round((this.boxes[boxID].rect[1] + dragOffset.y) / this.props.grid[1]) * this.props.grid[1] - this.boxes[boxID].rect[1] : dragOffset.y;
        const delta = { x: deltaX, y: deltaY };
        if (!delta.x && !delta.y) return dragOffset;
        const boxes = this._state.selected.filter(id => id.includes("box") && this.boxes[id]).map(id => this.boxes[id]);
        boxes.sort((a, b) => a.rect[0] - b.rect[0]).forEach((box) => {
            box.rect[0] += delta.x;
            if (box.rect[0] < 0) {
                delta.x -= box.rect[0];
                box.rect[0] = 0;
            }
        });
        boxes.sort((a, b) => a.rect[1] - b.rect[1]).forEach((box) => {
            box.rect[1] += delta.y;
            if (box.rect[1] < 0) {
                delta.y -= box.rect[1];
                box.rect[1] = 0;
            }
            box.allLines.forEach(id => linesConcerned[id] = true);
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
        this.emit("tempLine", { findSrc, from });
        return this;
    }
    paste(clipboard: TPatcher | TMaxClipboard) {
        const idMap = {} as { [key: string]: string };
        const pasted = { boxes: [] as TBox[], lines: [] as TLine[] };
        if (Array.isArray(clipboard.boxes)) { // Max Patcher
            const maxBoxes = clipboard.boxes;
            for (let i = 0; i < maxBoxes.length; i++) {
                const maxBox = maxBoxes[i]["box"];
                const numID = parseInt(maxBox.id.match(/\d+/)[0]);
                let id = "box-" + numID;
                if (this.boxes[id]) {
                    idMap[id] = "box-" + ++this.props.boxIndexCount;
                    id = idMap[id];
                } else {
                    idMap[id] = id;
                    if (numID > this.props.boxIndexCount) this.props.boxIndexCount = numID;
                }
                const box = {
                    id,
                    inlets: maxBox.numinlets,
                    outlets: maxBox.numoutlets,
                    rect: maxBox.patching_rect,
                    text: (maxBox.maxclass === "newobj" ? "" : maxBox.maxclass + " ") + (maxBox.text ? maxBox.text : "")
                } as TBox;
                this.createBox(box);
                pasted.boxes.push(box);
            }
            if (Array.isArray(clipboard.lines)) {
                const maxLines = clipboard.lines;
                for (let i = 0; i < maxLines.length; i++) {
                    const lineArgs = maxLines[i].patchline;
                    let id = "line-" + ++this.props.lineIndexCount;
                    if (this.lines[id]) id = "line-" + ++this.props.lineIndexCount;
                    const line = {
                        id,
                        src: [idMap[lineArgs.source[0].replace(/obj/, "box")], lineArgs.source[1]],
                        dest: [idMap[lineArgs.destination[0].replace(/obj/, "box")], lineArgs.destination[1]]
                    } as TLine;
                    this.createLine(line);
                    pasted.lines.push(line);
                }
            }
            return pasted;
        }
        if (Array.isArray(clipboard.boxes) || Array.isArray(clipboard.lines)) return pasted;
        for (const boxID in clipboard.boxes) {
            const box = clipboard.boxes[boxID];
            if (this.boxes[box.id]) {
                idMap[box.id] = "box-" + ++this.props.boxIndexCount;
                box.id = idMap[box.id];
            } else {
                idMap[box.id] = box.id;
                const numID = parseInt(box.id.match(/\d+/)[0]);
                if (numID > this.props.boxIndexCount) this.props.boxIndexCount = numID;
            }
            box.rect = [box.rect[0] + 20, box.rect[1] + 20, box.rect[2], box.rect[3]];
            this.createBox(box);
            pasted.boxes.push(box);
        }
        for (const lineID in clipboard.lines) {
            const line = clipboard.lines[lineID];
            if (this.lines[line.id]) line.id = "line-" + ++this.props.lineIndexCount;
            line.src[0] = idMap[line.src[0]];
            line.dest[0] = idMap[line.dest[0]];
            this.createLine(line);
            pasted.lines.push(line);
        }
        return pasted;
    }
    create(objects: TPatcher) {
        this.newTimestamp();
        const created = { boxes: {}, lines: {} } as TPatcher;
        for (const boxID in objects.boxes) {
            const boxIn = objects.boxes[boxID];
            const box = new Box(this, boxIn);
            this.boxes[box.id] = box;
            created.boxes[box.id] = box;
            box.init();
            this.select(box.id);
        }
        for (const lineID in objects.lines) {
            const lineIn = objects.lines[lineID];
            const line = new Line(this, lineIn);
            this.lines[line.id] = line;
            created.lines[line.id] = line;
            line.enable();
        }
        this.emit("create", created);
    }
    deleteSelected() {
        this.newTimestamp();
        const map = { boxes: {}, lines: {} } as { boxes: { [id: string]: true }, lines: { [id: string]: true } };
        this._state.selected.filter(id => id.includes("line")).forEach(id => map.lines[id] = true);
        this._state.selected.filter(id => id.includes("box")).forEach((id) => {
            map.boxes[id] = true;
            this.boxes[id].allLines.forEach(id => map.lines[id] = true);
        });

        const deleted = { boxes: {}, lines: {} } as TPatcher;
        Object.keys(map.lines).forEach(id => deleted.lines[id] = this.lines[id].destroy());
        Object.keys(map.boxes).forEach(id => deleted.boxes[id] = this.boxes[id].destroy());
        this._state.selected = [];
        this.emit("delete", deleted);
        return deleted;
    }
    delete(objects: TPatcher) {
        this.newTimestamp();
        const deleted = { boxes: {}, lines: {} } as TPatcher;
        for (const id in objects.lines) {
            deleted.lines[id] = this.lines[id].destroy();
        }
        for (const id in objects.boxes) {
            deleted.boxes[id] = this.boxes[id].destroy();
        }
        this.emit("delete", deleted);
    }
    undo() {
        this._state.history.undo();
    }
    redo() {
        this._state.history.redo();
    }
    toString() {
        return JSON.stringify(this, (k, v) => k.charAt(0) === "_" ? undefined : v, 4);
    }
}

export class History {
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
            this.events[this.timestamp] = {} as THistoryElement;
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
            for (const box of this.events[eID]["deleteBox"]) {
                patcher.createBox(box);
            }
        }
        if (this.events[eID].hasOwnProperty("deleteLine")) {
            for (const line of this.events[eID]["deleteLine"]) {
                patcher.createLine(line);
            }
        }
        if (this.events[eID].hasOwnProperty("delete")) {
            for (const deleted of this.events[eID]["delete"]) {
                patcher.create(deleted);
            }
        }
        if (this.events[eID].hasOwnProperty("changeBoxText")) {
            for (const e of this.events[eID]["changeBoxText"]) {
                patcher.changeBoxText(e.box.id, e.oldText);
            }
        }
        if (this.events[eID].hasOwnProperty("updateBoxRect")) {
            for (const e of this.events[eID]["updateBoxRect"]) {
                patcher.emit("forceBoxRect", { box: e.box, oldRect: e.rect, rect: e.oldRect });
            }
        }
        if (this.events[eID].hasOwnProperty("changeLineSrc")) {
            for (const e of this.events[eID]["changeLineSrc"]) {
                patcher.changeLineSrc(e.line.id, e.oldSrc[0], e.oldSrc[1]);
            }
        }
        if (this.events[eID].hasOwnProperty("changeLineDest")) {
            for (const e of this.events[eID]["changeLineDest"]) {
                patcher.changeLineDest(e.line.id, e.oldDest[0], e.oldDest[1]);
            }
        }
        if (this.events[eID].hasOwnProperty("createLine")) {
            for (const line of this.events[eID]["createLine"]) {
                patcher.deleteLine(line.id);
            }
        }
        if (this.events[eID].hasOwnProperty("createBox")) {
            for (const box of this.events[eID]["createBox"]) {
                patcher.deleteBox(box.id);
            }
        }
        if (this.events[eID].hasOwnProperty("create")) {
            for (const created of this.events[eID]["create"]) {
                patcher.delete(created);
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
        const patcher = this._patcher;
        if (this.events[eID].hasOwnProperty("createBox")) {
            for (const box of this.events[eID]["createBox"]) {
                patcher.createBox(box);
            }
        }
        if (this.events[eID].hasOwnProperty("createLine")) {
            for (const line of this.events[eID]["createLine"]) {
                patcher.createLine(line);
            }
        }
        if (this.events[eID].hasOwnProperty("create")) {
            for (const created of this.events[eID]["create"]) {
                patcher.create(created);
            }
        }
        if (this.events[eID].hasOwnProperty("changeBoxText")) {
            for (const e of this.events[eID]["changeBoxText"]) {
                patcher.changeBoxText(e.box.id, e.text);
            }
        }
        if (this.events[eID].hasOwnProperty("updateBoxRect")) {
            for (const e of this.events[eID]["updateBoxRect"]) {
                patcher.emit("forceBoxRect", e);
            }
        }
        if (this.events[eID].hasOwnProperty("changeLineSrc")) {
            for (const e of this.events[eID]["changeLineSrc"]) {
                patcher.changeLineSrc(e.line.id, e.src[0], e.src[1]);
            }
        }
        if (this.events[eID].hasOwnProperty("changeLineDest")) {
            for (const e of this.events[eID]["changeLineDest"]) {
                patcher.changeLineDest(e.line.id, e.dest[0], e.dest[1]);
            }
        }
        if (this.events[eID].hasOwnProperty("deleteLine")) {
            for (const line of this.events[eID]["deleteLine"]) {
                patcher.deleteLine(line.id);
            }
        }
        if (this.events[eID].hasOwnProperty("deleteBox")) {
            for (const box of this.events[eID]["deleteBox"]) {
                patcher.deleteBox(box.id);
            }
        }
        if (this.events[eID].hasOwnProperty("delete")) {
            for (const deleted of this.events[eID]["delete"]) {
                patcher.delete(deleted);
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
