import { MappedEventEmitter } from "../utils";
import Line from "./Line";
import Box from "./Box";
import History from "./History";
import Importer from "./objects/importer/Importer";
import { TLine, TBox, PatcherEventMap, TPackage, TPatcherProps, TPatcherState, TPatcherMode, TPatcher, TMaxPatcher, TMaxClipboard, TResizeHandlerType, TErrorLevel, TRect } from "./types";

import Base, { AnyObject } from "./objects/Base";
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
import faust from "./objects/faust/exports";

const Packages: TPackage = { Base, Std, Max, UI, Op, Window, WebAudio: JSPWebAudio, new: New, live, faust };

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
    packageRegister(pkg: TPackage, libOut: { [key: string]: typeof AnyObject }, path?: string) {
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
            this.boxes[id].destroy();
        }
        this.lines = {};
        this.boxes = {};
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.props = { mode: "js", bgColor: [61, 65, 70, 1], editingBgColor: [82, 87, 94, 1], grid: [15, 15], boxIndexCount: 0, lineIndexCount: 0 };
        this._state.selected = [];
    }
    load(patcherIn: TPatcher | TMaxPatcher | any, modeIn?: TPatcherMode) {
        this._state.isLoading = true;
        this.clear();
        if (!patcherIn) {
            this._state.isLoading = false;
            return this;
        }
        this.props.mode = (patcherIn.props && patcherIn.props.mode ? patcherIn.props.mode : modeIn) || "js";
        const { mode } = this.props;
        if (mode === "max" || mode === "gen") {
            const rgbaMax2Css = (maxColor: number[]) => {
                const cssColor = [255, 255, 255, 1] as TRect;
                if (!Array.isArray(maxColor)) return cssColor;
                for (let i = 0; i < 3; i++) {
                    if (typeof maxColor[i] === "number") cssColor[i] = Math.floor(maxColor[i] * 255);
                }
                if (typeof maxColor[3] === "number") cssColor[3] = maxColor[3];
                return cssColor;
            };
            this._state.lib = mode === "max" ? this._state.libMax : this._state.libGen;
            const patcher = (patcherIn as TMaxPatcher).patcher;
            if (!patcher) {
                this._state.isLoading = false;
                this.emit("loaded", this);
                return this;
            }
            this.props.bgColor = rgbaMax2Css(patcher.bgcolor);
            // eslint-disable-next-line @typescript-eslint/camelcase
            this.props.editingBgColor = rgbaMax2Css(patcher.editing_bgcolor);
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
        } else if (mode === "js" || mode === "faust") {
            this._state.lib = mode === "js" ? this._state.libJS : this._state.libFaust;
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
        if (this._state.lib[className]) {
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
    set lock(bool: boolean) {
        if (this._state.locked === bool) return;
        this.deselectAll();
        this._state.locked = bool;
        this.emit("locked", bool);
    }
    set presentation(bool: boolean) {
        if (this._state.presentation === bool) return;
        this.deselectAll();
        this._state.presentation = bool;
        this.emit("presentation", bool);
    }
    set showGrid(bool: boolean) {
        if (this._state.showGrid === bool) return;
        this._state.showGrid = bool;
        this.emit("showGrid", bool);
    }
    selectAllBoxes() {
        const ids = Object.keys(this.boxes);
        this._state.selected = ids;
        this.emit("selected", ids);
    }
    select(id: string) {
        if (this._state.selected.indexOf(id) >= 0) return;
        if (this.boxes[id] || this.lines[id]) {
            this._state.selected.push(id);
            this.emit("selected", [id]);
        }
    }
    selects(ids: string[]) {
        ids.forEach((id) => {
            if (this._state.selected.indexOf(id) >= 0) return;
            if (this.boxes[id] || this.lines[id]) this._state.selected.push(id);
        });
        this.emit("selected", ids);
    }
    deselect(id: string) {
        const i = this._state.selected.indexOf(id);
        if (i === -1) return;
        this._state.selected.splice(i, 1);
        this.emit("deselected", [id]);
    }
    deselects(ids: string[]) {
        ids.forEach((id) => {
            const i = this._state.selected.indexOf(id);
            if (i === -1) return;
            this._state.selected.splice(i, 1);
        });
        this.emit("deselected", ids);
    }
    deselectAll() {
        const { selected } = this._state;
        this._state.selected = [];
        this.emit("deselected", selected);
    }
    selectOnly(id: string) {
        this.deselectAll();
        this.select(id);
    }
    selectRegion(selectionRect: number[], selectedBefore: string[]) {
        let [left, top, right, bottom] = selectionRect;
        if (left > right) [left, right] = [right, left];
        if (top > bottom) [top, bottom] = [bottom, top];
        const { presentation } = this._state;
        const rectKey = presentation ? "presentationRect" : "rect";
        const select = selectedBefore.slice();
        for (const boxID in this.boxes) {
            const box = this.boxes[boxID];
            if (presentation && !box.presentation) continue;
            const [boxLeft, boxTop] = box[rectKey];
            const [boxRight, boxBottom] = [boxLeft + box[rectKey][2], boxTop + box[rectKey][3]];
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
    moveBox(boxID: string, deltaXIn: number, deltaYIn: number) {
        if (!deltaXIn && !deltaYIn) return this;
        const { presentation } = this._state;
        const rectKey = presentation ? "presentationRect" : "rect";
        const box = this.boxes[boxID];
        if (!box) return this;
        const rect = box[rectKey].slice() as TRect;
        // Not allowing resize out of bound
        const deltaX = Math.max(deltaXIn, -rect[0]);
        const deltaY = Math.max(deltaYIn, -rect[1]);
        if (!deltaX && !deltaY) return this;
        rect[0] += deltaX;
        rect[1] += deltaY;
        if (presentation) box.setPresentationRect(rect);
        else box.setRect(rect);
        return this;
    }
    moveSelectedBox(dragOffset: { x: number; y: number }, refBoxID?: string) {
        const { presentation, snapToGrid, selected } = this._state;
        const rectKey = presentation ? "presentationRect" : "rect";
        const delta = { ...dragOffset };
        if (refBoxID) {
            const rect = this.boxes[refBoxID][rectKey];
            delta.x = snapToGrid ? Math.round((rect[0] + dragOffset.x) / this.props.grid[0]) * this.props.grid[0] - rect[0] : dragOffset.x;
            delta.y = snapToGrid ? Math.round((rect[1] + dragOffset.y) / this.props.grid[1]) * this.props.grid[1] - rect[1] : dragOffset.y;
        }
        if (!delta.x && !delta.y) return dragOffset;
        this.move(selected, delta, presentation);
        return { x: dragOffset.x - delta.x, y: dragOffset.y - delta.y };
    }
    moveEnd(delta: { x: number; y: number }) {
        this.newTimestamp();
        this.emit("moved", { delta, selected: this._state.selected, presentation: this._state.presentation });
    }
    move(selected: string[], delta: { x: number; y: number }, presentation: boolean) {
        selected.forEach(id => this.select(id));
        const rectKey = presentation ? "presentationRect" : "rect";
        const boxes = this._state.selected.filter(id => id.includes("box") && this.boxes[id]).map(id => this.boxes[id]);
        if (boxes.length === 0) return;
        const leftMost = boxes.sort((a, b) => a[rectKey][0] - b[rectKey][0])[0];
        const topMost = boxes.sort((a, b) => a[rectKey][1] - b[rectKey][1])[0];
        // Not allowing resize out of bound
        delta.x = Math.max(delta.x, -leftMost[rectKey][0]);
        delta.y = Math.max(delta.y, -topMost[rectKey][1]);
        if (delta.x) boxes.forEach(box => box[rectKey][0] += delta.x);
        if (delta.y) boxes.forEach(box => box[rectKey][1] += delta.y);
        // Emit events
        if (!delta.x && !delta.y) return;
        if (presentation !== this._state.presentation) return;
        const linesAffected: { [id: string]: true } = {};
        boxes.forEach((box) => {
            box.emit(this._state.presentation ? "presentationRectChanged" : "rectChanged", box);
            if (!presentation) box.allLines.forEach(id => linesAffected[id] = true);
        });
        if (presentation) return;
        for (const lineID in linesAffected) {
            const line = this.lines[lineID];
            if (!line) continue;
            line.emit("posChanged", line);
        }
    }
    resizeSelectedBox(boxID: string, dragOffset: { x: number; y: number }, type: TResizeHandlerType) {
        const { presentation, snapToGrid, selected } = this._state;
        const rectKey = presentation ? "presentationRect" : "rect";
        const rect = this.boxes[boxID][rectKey];
        const delta = { x: 0, y: 0 };
        // Round delta to grid
        if (type === "e" || type === "se" || type === "ne") {
            delta.x = snapToGrid ? Math.round((rect[0] + rect[2] + dragOffset.x) / this.props.grid[0]) * this.props.grid[0] - rect[0] - rect[2] : dragOffset.x;
        }
        if (type === "s" || type === "se" || type === "sw") {
            delta.y = snapToGrid ? Math.round((rect[1] + rect[3] + dragOffset.y) / this.props.grid[1]) * this.props.grid[1] - rect[1] - rect[3] : dragOffset.y;
        }
        if (type === "w" || type === "nw" || type === "sw") {
            delta.x = snapToGrid ? Math.round((rect[0] + dragOffset.x) / this.props.grid[0]) * this.props.grid[0] - rect[0] : dragOffset.x;
        }
        if (type === "n" || type === "nw" || type === "ne") {
            delta.y = snapToGrid ? Math.round((rect[1] + dragOffset.y) / this.props.grid[1]) * this.props.grid[1] - rect[1] : dragOffset.y;
        }
        if (!delta.x && !delta.y) return dragOffset;
        this.resize(selected, delta, type, presentation);
        return { x: dragOffset.x - delta.x, y: dragOffset.y - delta.y };
    }
    resizeEnd(delta: { x: number; y: number }, type: TResizeHandlerType) {
        this.newTimestamp();
        const { selected, presentation } = this._state;
        this.emit("resized", { delta, type, selected, presentation });
    }
    resize(selected: string[], delta: { x: number; y: number }, type: TResizeHandlerType, presentation: boolean) {
        selected.forEach(id => this.select(id));
        const rectKey = presentation ? "presentationRect" : "rect";
        const boxes = this._state.selected.filter(id => id.includes("box") && this.boxes[id]).map(id => this.boxes[id]);
        if (boxes.length === 0) return;
        const leftMost = boxes.sort((a, b) => a[rectKey][0] - b[rectKey][0])[0];
        const topMost = boxes.sort((a, b) => a[rectKey][1] - b[rectKey][1])[0];
        const widthLeast = boxes.sort((a, b) => a[rectKey][2] - b[rectKey][2])[0];
        const heightLeast = boxes.sort((a, b) => a[rectKey][3] - b[rectKey][3])[0];
        // Not allowing resize out of bound
        delta.x = Math.max(delta.x, -leftMost[rectKey][0]);
        delta.y = Math.max(delta.y, -topMost[rectKey][1]);
        // Not allowing resize below 15px width or height
        delta.x = Math.max(delta.x, 15 - widthLeast[rectKey][2]);
        delta.y = Math.max(delta.y, 15 - heightLeast[rectKey][3]);
        boxes.forEach((box) => {
            if (delta.x) {
                if (type === "ne" || type === "e" || type === "se") box[rectKey][2] += delta.x;
                if (type === "sw" || type === "w" || type === "nw") {
                    box[rectKey][2] -= delta.x;
                    box[rectKey][0] += delta.x;
                }
            }
            if (delta.y) {
                if (type === "se" || type === "s" || type === "sw") box[rectKey][3] += delta.y;
                if (type === "nw" || type === "n" || type === "ne") {
                    box[rectKey][3] -= delta.y;
                    box[rectKey][1] += delta.y;
                }
            }
        });
        // Emit events
        if (!delta.x && !delta.y) return;
        if (presentation !== this._state.presentation) return;
        const linesAffected: { [id: string]: true } = {};
        boxes.forEach((box) => {
            box.emit(this._state.presentation ? "presentationRectChanged" : "rectChanged", box);
            if (!presentation) box.allLines.forEach(id => linesAffected[id] = true);
        });
        if (presentation) return;
        for (const lineID in linesAffected) {
            const line = this.lines[lineID];
            if (!line) continue;
            line.emit("posChanged", line);
        }
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
        const pasted: TPatcher = { boxes: {}, lines: {} };
        if (!clipboard || !clipboard.boxes) return pasted;
        this.newTimestamp();
        if (Array.isArray(clipboard.boxes)) { // Max Patcher
            this.state.isLoading = true;
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
                const createdBox = this.createBox(box);
                pasted.boxes[createdBox.id] = createdBox;
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
                    const createLine = this.createLine(line);
                    pasted.lines[createLine.id] = line;
                }
            }
            this.state.isLoading = false;
            this.deselectAll();
            this.selects(Object.keys(pasted.boxes));
            this.emit("create", pasted);
            return pasted;
        }
        if (Array.isArray(clipboard.boxes) || Array.isArray(clipboard.lines)) return pasted;
        this.state.isLoading = true;
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
            const createdBox = this.createBox(box);
            pasted.boxes[createdBox.id] = createdBox;
        }
        for (const lineID in clipboard.lines) {
            const line = clipboard.lines[lineID];
            line.id = "line-" + ++this.props.lineIndexCount;
            line.src[0] = idMap[line.src[0]];
            line.dest[0] = idMap[line.dest[0]];
            const createLine = this.createLine(line);
            pasted.lines[createLine.id] = line;
        }
        this.state.isLoading = false;
        this.deselectAll();
        this.selects(Object.keys(pasted.boxes));
        this.emit("create", pasted);
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
        }
        for (const lineID in objects.lines) {
            const lineIn = objects.lines[lineID];
            const line = new Line(this, lineIn);
            this.lines[line.id] = line;
            created.lines[line.id] = line;
            line.enable();
        }
        this.deselectAll();
        this.selects(Object.keys(objects.boxes));
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
        this._state.selected = [];
        const deleted: TPatcher = { boxes: {}, lines: {} };
        Object.keys(map.lines).forEach(id => deleted.lines[id] = this.lines[id].destroy());
        Object.keys(map.boxes).forEach(id => deleted.boxes[id] = this.boxes[id].destroy());
        this.emit("deselected", Object.keys(deleted.lines));
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
        const deselected = Object.keys(deleted.boxes).concat(Object.keys(deleted.lines));
        this.emit("deselected", deselected);
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
