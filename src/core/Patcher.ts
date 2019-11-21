import { MappedEventEmitter } from "../utils";
import Line from "./Line";
import Box from "./Box";
import History from "./History";
import Importer from "./objects/importer/Importer";
import { TLine, TBox, PatcherEventMap, TPackage, TPatcherProps, TPatcherState, TPatcherMode, TPatcher, TMaxPatcher, TMaxClipboard, TResizeHandlerType, TErrorLevel } from "./types";

import Base from "./objects/Base";
import Std from "./objects/Std";
import New from "./objects/importer/New";
import GenOps from "./objects/Gen";
import Max from "./objects/Max";
import FaustOps, { toFaustDspCode } from "./objects/Faust";
import UI from "./objects/UI";
import Op from "./objects/Op";
import Window from "./objects/Window";
import JSPWebAudio from "./objects/WebAudio/Imports";
import live from "./objects/live/exports";

const Packages: TPackage = { Base, Std, Max, UI, Op, Window, WebAudio: JSPWebAudio, new: New, live };

export default class Patcher extends MappedEventEmitter<PatcherEventMap> {
    lines: { [key: string]: Line };
    boxes: { [key: string]: Box };
    props: TPatcherProps;
    _state: TPatcherState;
    private _packages: TPackage;
    constructor() {
        super();
        this.setMaxListeners(4096);
        this.observeHistory();
        this._state = {
            isLoading: false,
            locked: true,
            presentation: false,
            showGrid: true,
            snapToGrid: true,
            log: [],
            history: new History(this),
            lib: {},
            libJS: {},
            libMax: {},
            libGen: {},
            libFaust: {},
            selected: []
        };
        this._state.libJS = this.packageRegister(Packages, {});
        this._state.libMax = {}; // this.packageRegister((Packages.Max as TPackage), {});
        this._state.libGen = this.packageRegister(GenOps, {});
        this._state.libFaust = this.packageRegister(FaustOps, {});
        this._state.lib = this._state.libJS;
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
                if (!path) continue;
                if (libOut.hasOwnProperty(full)) this.newLog("warn", "Patcher", "Path duplicated, cannot register " + full, this);
                else libOut[full] = el;
            } else continue;
        }
        return libOut;
    }
    async dynamicImportPackage(address: string, pkgName?: string) {
        const pkg = await Importer.importFrom(address, pkgName);
        Packages[pkgName || name] = pkg;
        this.packageRegister(pkg, this._state.libJS, pkgName || name);
    }
    clear() {
        for (const id in this.boxes) {
            this.boxes[id].object.destroy();
        }
        this.lines = {};
        this.boxes = {};
        // eslint-disable-next-line @typescript-eslint/camelcase
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
            // eslint-disable-next-line @typescript-eslint/camelcase
            this.props.editing_bgcolor = rgbaMax2Css(patcher.editing_bgcolor);
            const maxBoxes = patcher.boxes;
            const maxLines = patcher.lines;
            for (let i = 0; i < maxBoxes.length; i++) {
                const maxBox = maxBoxes[i].box;
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
        } else if (modeIn === "js" || modeIn === "faust") {
            this._state.lib = modeIn === "js" ? this._state.libJS : this._state.libFaust;
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
    createObject(parsed: { class: string; args: any[]; props: { [key: string]: any } }, boxIn: Box) {
        let obj;
        const className = parsed.class;
        if (typeof className !== "string" || className.length === 0) {
            obj = new Base.EmptyObject(boxIn, this);
        } else {
            if (this._state.lib[className]) {
                obj = new this._state.lib[className](boxIn, this);
            } else {
                this.newLog("error", "Patcher", "Object " + className + " not found.", this);
                obj = new Base.InvalidObject(boxIn, this);
            }
            if (!(obj instanceof Base.BaseObject)) {
                this.newLog("error", "Patcher", "Object " + className + " is not valid.", this);
                obj = new Base.InvalidObject(boxIn, this);
            }
        }
        obj.init();
        this.emit("createObject", obj);
        return obj;
    }
    getObjectMeta(parsed: { class: string; args: any[]; props: { [key: string]: any } }) {
        const className = parsed.class;
        if (typeof className !== "string" || className.length === 0) {
            return Base.EmptyObject.meta;
        }
        if (this._state.lib[className].meta) {
            return this._state.lib[className].meta;
        }
        return Base.InvalidObject.meta;
    }
    changeBoxText(boxID: string, text: string) {
        const oldText = this.boxes[boxID].text;
        if (oldText === text) return this.boxes[boxID];
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
        const oldSrc: [string, number] = [line.srcID, line.srcOutlet];
        const src: [string, number] = [srcID, srcOutlet];
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
        const oldDest: [string, number] = [line.destID, line.destInlet];
        const dest: [string, number] = [destID, destOutlet];
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
        const result: string[] = [];
        let srcOuts: string[] = [];
        let destIns: string[] = [];
        const srcOutsWraped = this.getLinesBySrcID(srcID);
        if (srcOutlet !== undefined) srcOuts = srcOutsWraped[srcOutlet];
        else srcOutsWraped.forEach(el => srcOuts = srcOuts.concat(el));
        const destInsWraped = this.getLinesByDestID(destID);
        if (destInlet !== undefined) destIns = destInsWraped[destInlet];
        else destInsWraped.forEach(el => destIns = destIns.concat(el));
        if (!srcOuts || !destIns) return result;
        srcOuts.forEach(idOut => destIns.forEach(idIn => (idIn === idOut ? result.push(idIn) : undefined)));
        return result;
    }
    log(message: string) {
        this.newLog("none", "Patcher", message, this);
    }
    error(message: string) {
        this.newLog("error", "Patcher", message, this);
    }
    newLog(errorLevel: TErrorLevel, title: string, message: string, emitter?: any) {
        const log = { errorLevel, title, message, emitter };
        this._state.log.push(log);
        this.emit("newLog", log);
    }
    observeHistory() {
        const eventNames = [
            "createBox", "deleteBox", "createLine", "deleteLine", "create", "delete",
            "changeBoxText", "changeLineSrc", "changeLineDest", "moved", "resized"
        ] as const;
        eventNames.forEach(type => this.on(type, e => this._state.history.did(type, e)));
    }
    newTimestamp() {
        this._state.history.newTimestamp();
        return this;
    }
    setLock(bool: boolean): Patcher {
        if (this._state.locked === bool) return this;
        this.deselectAll();
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
        const { selected } = this._state;
        this._state.selected = [];
        selected.forEach(el => this.emit("deselected", el));
    }
    selectOnly(id: string) {
        this.deselectAll();
        this.select(id);
    }
    selectRegion(selectionRect: number[], selectedBefore: string[]) {
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
    selectedToString() {
        const linesConcerned: { [id: string]: true } = {};
        const patcher: TPatcher = { lines: {}, boxes: {} };
        this._state.selected
            .filter(id => id.includes("box") && this.boxes[id])
            .map(id => this.boxes[id])
            .forEach((box) => {
                box.allLines.forEach(id => linesConcerned[id] = true);
                patcher.boxes[box.id] = box;
            });
        Object.keys(linesConcerned).forEach((lineID) => {
            const line = this.lines[lineID];
            if (!line) return;
            if (patcher.boxes[line.srcID] && patcher.boxes[line.destID]) patcher.lines[lineID] = line;
        });
        return JSON.stringify(patcher, (k, v) => (k.charAt(0) === "_" ? undefined : v), 4);
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
    moveSelectedBox(boxID: string, dragOffset: { x: number; y: number }) {
        const rect = this.boxes[boxID].rect;
        const delta = { x: 0, y: 0 };
        delta.x = this._state.snapToGrid ? Math.round((rect[0] + dragOffset.x) / this.props.grid[0]) * this.props.grid[0] - rect[0] : dragOffset.x;
        delta.y = this._state.snapToGrid ? Math.round((rect[1] + dragOffset.y) / this.props.grid[1]) * this.props.grid[1] - rect[1] : dragOffset.y;
        if (!delta.x && !delta.y) return dragOffset;
        this.move(this._state.selected, delta);
        return { x: dragOffset.x - delta.x, y: dragOffset.y - delta.y };
    }
    moveEnd(delta: { x: number; y: number }) {
        this.newTimestamp();
        this.emit("moved", { delta, selected: this._state.selected });
    }
    move(selected: string[], delta: { x: number; y: number }) {
        selected.forEach(id => this.select(id));
        const linesConcerned: { [id: string]: true } = {};
        const boxes = this._state.selected.filter(id => id.includes("box") && this.boxes[id]).map(id => this.boxes[id]);
        if (boxes.length === 0) return;
        const leftMost = boxes.sort((a, b) => a.rect[0] - b.rect[0])[0];
        const topMost = boxes.sort((a, b) => a.rect[1] - b.rect[1])[0];
        if (leftMost.rect[0] + delta.x < 0) delta.x = 0;
        else boxes.forEach(box => box.rect[0] += delta.x);
        if (topMost.rect[1] + delta.y < 0) delta.y = 0;
        else boxes.forEach(box => box.rect[1] += delta.y);
        if (!delta.x && !delta.y) return;
        boxes.forEach((box) => {
            box.allLines.forEach(id => linesConcerned[id] = true);
            box.emit("rectChanged", box);
        });
        Object.keys(linesConcerned).forEach((lineID) => {
            const line = this.lines[lineID];
            if (!line) return;
            line.emit("posChanged", line);
        });
    }
    resizeSelectedBox(boxID: string, dragOffset: { x: number; y: number }, type: TResizeHandlerType) {
        const rect = this.boxes[boxID].rect;
        const delta = { x: 0, y: 0 };
        if (type === "e" || type === "se") {
            delta.x = this._state.snapToGrid ? Math.round((rect[0] + rect[2] + dragOffset.x) / this.props.grid[0]) * this.props.grid[0] - rect[0] - rect[2] : dragOffset.x;
        }
        if (type === "s" || type === "se") {
            delta.y = this._state.snapToGrid ? Math.round((rect[1] + rect[3] + dragOffset.y) / this.props.grid[1]) * this.props.grid[1] - rect[1] - rect[3] : dragOffset.y;
        }
        if (type === "w" || type === "nw") {
            delta.x = this._state.snapToGrid ? Math.round((rect[0] + dragOffset.x) / this.props.grid[0]) * this.props.grid[0] - rect[0] : dragOffset.x;
        }
        if (type === "n" || type === "nw") {
            delta.y = this._state.snapToGrid ? Math.round((rect[1] + dragOffset.y) / this.props.grid[1]) * this.props.grid[1] - rect[1] : dragOffset.y;
        }
        if (!delta.x && !delta.y) return dragOffset;
        this.resize(this._state.selected, delta, type);
        return { x: dragOffset.x - delta.x, y: dragOffset.y - delta.y };
    }
    resizeEnd(delta: { x: number; y: number }, type: TResizeHandlerType) {
        this.newTimestamp();
        this.emit("resized", { delta, type, selected: this._state.selected });
    }
    resize(selected: string[], delta: { x: number; y: number }, type: TResizeHandlerType) {
        selected.forEach(id => this.select(id));
        const linesConcerned: { [id: string]: true } = {};
        const boxes = this._state.selected.filter(id => id.includes("box") && this.boxes[id]).map(id => this.boxes[id]);
        if (boxes.length === 0) return;
        const leftMost = boxes.sort((a, b) => a.rect[0] - b.rect[0])[0];
        const topMost = boxes.sort((a, b) => a.rect[1] - b.rect[1])[0];
        const widthLeast = boxes.sort((a, b) => a.rect[2] - b.rect[2])[0];
        const heightLeast = boxes.sort((a, b) => a.rect[3] - b.rect[3])[0];
        if (type === "ne" || type === "e" || type === "se") {
            if (widthLeast.rect[2] + delta.x < 15) delta.x = 0;
            else {
                boxes.forEach((box) => {
                    box.rect[2] += delta.x;
                });
            }
        }
        if (type === "se" || type === "s" || type === "sw") {
            if (heightLeast.rect[3] + delta.y < 15) delta.y = 0;
            else {
                boxes.forEach((box) => {
                    box.rect[3] += delta.y;
                });
            }
        }
        if (type === "sw" || type === "w" || type === "nw") {
            if (leftMost.rect[0] + delta.x < 0 || widthLeast.rect[2] - delta.x < 15) delta.x = 0;
            else {
                boxes.forEach((box) => {
                    box.rect[2] -= delta.x;
                    box.rect[0] += delta.x;
                });
            }
        }
        if (type === "nw" || type === "n" || type === "ne") {
            if (topMost.rect[1] + delta.y < 0 || heightLeast.rect[3] - delta.y < 15) delta.y = 0;
            else {
                boxes.forEach((box) => {
                    box.rect[3] -= delta.y;
                    box.rect[1] += delta.y;
                });
            }
        }
        if (!delta.x && !delta.y) return;
        boxes.forEach((box) => {
            box.allLines.forEach(id => linesConcerned[id] = true);
            box.emit("rectChanged", box);
            box.emit("resized", box);
        });
        Object.keys(linesConcerned).forEach((lineID) => {
            const line = this.lines[lineID];
            if (!line) return;
            line.emit("posChanged", line);
        });
    }
    findNearestPort(findSrc: boolean, left: number, top: number, from: [string, number], to?: [string, number]) {
        let nearest: [string, number] = [null, null];
        let minDistance = 100;
        if (to) {
            const currentPos = this.boxes[to[0]][findSrc ? "getOutletPos" : "getInletPos"](to[1]);
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
    highlightNearestPort(findSrc: boolean, dragOffset: { x: number; y: number }, from: [string, number], to?: [string, number]) { // to = the port need to be reconnect
        const origPos = to ? this.boxes[to[0]][findSrc ? "getOutletPos" : "getInletPos"](to[1]) : this.boxes[from[0]][findSrc ? "getInletPos" : "getOutletPos"](from[1]);
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
        const idMap: { [key: string]: string } = {};
        const pasted = { boxes: [] as TBox[], lines: [] as TLine[] };
        if (!clipboard || !clipboard.boxes) return pasted;
        this.deselectAll();
        this.newTimestamp();
        if (Array.isArray(clipboard.boxes)) { // Max Patcher
            const maxBoxes = clipboard.boxes;
            for (let i = 0; i < maxBoxes.length; i++) {
                const maxBox = maxBoxes[i].box;
                const numID = parseInt(maxBox.id.match(/\d+/)[0]);
                let id = "box-" + numID;
                if (this.boxes[id]) {
                    idMap[id] = "box-" + ++this.props.boxIndexCount;
                    id = idMap[id];
                } else {
                    idMap[id] = id;
                    if (numID > this.props.boxIndexCount) this.props.boxIndexCount = numID;
                }
                const box: TBox = {
                    id,
                    inlets: maxBox.numinlets,
                    outlets: maxBox.numoutlets,
                    rect: maxBox.patching_rect,
                    text: (maxBox.maxclass === "newobj" ? "" : maxBox.maxclass + " ") + (maxBox.text ? maxBox.text : "")
                };
                this.createBox(box);
                pasted.boxes.push(box);
                this.select(box.id);
            }
            if (Array.isArray(clipboard.lines)) {
                const maxLines = clipboard.lines;
                for (let i = 0; i < maxLines.length; i++) {
                    const lineArgs = maxLines[i].patchline;
                    let id = "line-" + ++this.props.lineIndexCount;
                    if (this.lines[id]) id = "line-" + ++this.props.lineIndexCount;
                    const line: TLine = {
                        id,
                        src: [idMap[lineArgs.source[0].replace(/obj/, "box")], lineArgs.source[1]],
                        dest: [idMap[lineArgs.destination[0].replace(/obj/, "box")], lineArgs.destination[1]]
                    };
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
            this.select(box.id);
        }
        for (const lineID in clipboard.lines) {
            const line = clipboard.lines[lineID];
            line.id = "line-" + ++this.props.lineIndexCount;
            line.src[0] = idMap[line.src[0]];
            line.dest[0] = idMap[line.dest[0]];
            this.createLine(line);
            pasted.lines.push(line);
        }
        return pasted;
    }
    create(objects: TPatcher) {
        this.newTimestamp();
        const created: TPatcher = { boxes: {}, lines: {} };
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
        const map: { boxes: { [id: string]: true }; lines: { [id: string]: true } } = { boxes: {}, lines: {} };
        this._state.selected.filter(id => id.includes("line")).forEach(id => map.lines[id] = true);
        this._state.selected.filter(id => id.includes("box")).forEach((id) => {
            map.boxes[id] = true;
            this.boxes[id].allLines.forEach(id => map.lines[id] = true);
        });

        const deleted: TPatcher = { boxes: {}, lines: {} };
        Object.keys(map.lines).forEach(id => deleted.lines[id] = this.lines[id].destroy());
        Object.keys(map.boxes).forEach(id => deleted.boxes[id] = this.boxes[id].destroy());
        this._state.selected = [];
        this.emit("delete", deleted);
        return deleted;
    }
    delete(objects: TPatcher) {
        this.newTimestamp();
        const deleted: TPatcher = { boxes: {}, lines: {} };
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
    toFaustDspCode() {
        const code = toFaustDspCode(this);
        this.emit("generateCode", code);
        return code;
    }
    toString() {
        return JSON.stringify(this, (k, v) => (k.charAt(0) === "_" ? undefined : v), 4);
    }
    get state() {
        return this._state;
    }
    get env() {
        return window.jspatcherEnv;
    }
}
