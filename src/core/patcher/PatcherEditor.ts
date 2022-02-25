import type { SemanticICONS } from "semantic-ui-react";
import { getTimestamp, isRectMovable, isRectResizable, isTRect } from "../../utils/utils";
import FileEditor from "../file/FileEditor";
import Box from "./Box";
import Line from "./Line";
import type { RawPatcher, TBox, TLine, TMaxClipboard, TRect, TResizeHandlerType } from "../types";
import type Patcher from "./Patcher";
import type PersistentProjectFile from "../file/PersistentProjectFile";
import type TempPatcherFile from "./TempPatcherFile";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";
import type { PatcherEventMap, TPublicPatcherProps } from "./Patcher";

export interface PatcherEditorEventMap extends PatcherEditorState {
    "create": RawPatcher;
    "delete": RawPatcher;
    "changeBoxText": { boxId: string; oldText: string; text: string };
    "boxChanged": { boxId: string; oldArgs?: any[]; args?: any[]; oldProps?: Record<string, any>; props?: Record<string, any>; oldState?: Record<string, any>; state?: Record<string, any>; oldZIndex?: number; zIndex?: number };
    "zIndexChanged": { boxId: string; zIndex: number };
    "changeLineSrc": { lineId: string; oldSrc: [string, number]; src: [string, number] };
    "changeLineDest": { lineId: string; oldDest: [string, number]; dest: [string, number] };
    "selected": string[];
    "moving": { selected: string[]; delta: { x: number; y: number }; presentation: boolean };
    "moved": { selected: string[]; delta: { x: number; y: number }; presentation: boolean };
    "resized": { selected: string[]; delta: { x: number; y: number }; type: TResizeHandlerType; presentation: boolean };
    "tempLine": { findSrc: boolean; from: [string, number] };
    "inspector": never;
    "dockUI": string;
    "propsChanged": { props: Partial<TPublicPatcherProps>; oldProps: Partial<TPublicPatcherProps> };
}

export interface PatcherHistoryEventMap extends Pick<PatcherEditorEventMap, "create" | "delete" | "changeBoxText" | "changeLineSrc" | "changeLineDest" | "moved" | "resized" | "boxChanged" | "propsChanged"> {}

export interface PatcherEditorState {
    locked: boolean;
    presentation: boolean;
    showGrid: boolean;
    snapToGrid: boolean;
    selectAfterEdit: boolean;
    selected: string[];
}

export default class PatcherEditor extends FileEditor<Patcher, PatcherEditorEventMap> {
    static async fromProjectItem({ file, env, project, instanceId }: { file: PersistentProjectFile | TempPatcherFile; env: IJSPatcherEnv; project?: IProject; instanceId?: string }): Promise<PatcherEditor> {
        const patcher = await file.instantiate({ env, project, instanceId }) as Patcher;
        const editor = new this(patcher);
        return editor.init();
    }
    state: PatcherEditorState = {
        locked: true,
        presentation: false,
        showGrid: true,
        snapToGrid: true,
        selectAfterEdit: true,
        selected: []
    };
    get isLocked() {
        return this.state.locked;
    }
    get boxes() {
        return this.instance.boxes;
    }
    get lines() {
        return this.instance.lines;
    }
    get props() {
        return this.instance.props;
    }
    get publicProps() {
        return this.instance.publicProps;
    }
    get fileExtension() {
        return this.instance.fileExtension;
    }
    get fileName() {
        return this.instance.fileName;
    }
    get fileIcon(): SemanticICONS {
        return "sitemap";
    }
    handleChangeBoxText = (e: PatcherEventMap["changeBoxText"]) => this.emit("changeBoxText", e);
    handlePassiveDeleteLine = (e: PatcherEventMap["passiveDeleteLine"]) => this.emit("delete", { boxes: {}, lines: { [e.id]: e.toSerializable() } });
    handleBoxChanged = (e: PatcherEventMap["boxChanged"]) => this.emit("boxChanged", e);
    handlePropsChanged = (e: PatcherEventMap["propsChanged"]) => this.emit("propsChanged", e);
    handleZIndexChanged = (e: PatcherEventMap["zIndexChanged"]) => this.emit("zIndexChanged", e);
    handleChanged = () => this.instance.emitChanged();
    constructor(instance: Patcher) {
        super(instance);
        const { openInPresentation } = this.props;
        this.setState({
            locked: true,
            presentation: !!openInPresentation,
            showGrid: true,
            snapToGrid: true,
            selectAfterEdit: true,
            selected: []
        });
    }
    async init() {
        if (!this.instance.isReady) {
            await new Promise<void>((resolve, reject) => {
                const handleReady = () => {
                    resolve();
                    this.instance.off("ready", handleReady);
                };
                this.instance.on("ready", handleReady);
            });
        }
        this.on("changed", this.handleChanged);
        this.instance.on("changeBoxText", this.handleChangeBoxText);
        this.instance.on("passiveDeleteLine", this.handlePassiveDeleteLine);
        this.instance.on("boxChanged", this.handleBoxChanged);
        this.instance.on("propsChanged", this.handlePropsChanged);
        this.instance.on("zIndexChanged", this.handleZIndexChanged);
        const { openInPresentation } = this.props;
        this.setState({
            locked: true,
            presentation: !!openInPresentation,
            showGrid: true,
            snapToGrid: true,
            selectAfterEdit: true,
            selected: []
        });
        this._isReady = true;
        this.emit("ready");
        return this;
    }
    setState(state: Partial<PatcherEditorState>) {
        let changed = false;
        for (const keyIn in state) {
            const key = keyIn as keyof PatcherEditorState;
            if (this.state[key] === state[key]) continue;
            changed = true;
            if (key === "locked" || key === "presentation") this.deselectAll();
            this.state[key] = state[key] as any;
            this.emit(key, state[key]);
        }
        // if (changed) this.emit("stateChanged", this.state);
        return changed;
    }
    async createBox(boxIn: TBox) {
        const box = await this.instance.createBox(boxIn);
        this.emit("create", { boxes: { [box.id]: box.toSerializable() }, lines: {} });
        await box.postInit();
        return box;
    }
    async createBoxFromFile(file: PersistentProjectFile, boxIn: Omit<TBox, "text">) {
        const path = file.projectPath;
        const type = file.type;
        const ext = file.fileExtension;
        if (type === "patcher") {
            const extMap: Record<string, string> = this.props.mode === "js"
                ? { json: "p", jspat: "p", maxpat: "max", gendsp: "gen", dsppat: "pfaust" }
                : this.props.mode === "faust"
                    ? { gendsp: "gen", dsppat: "p" }
                    : this.props.mode === "gen"
                        ? { gendsp: "gen" }
                        : {};
            const obj = extMap[ext];
            if (obj) await this.createBox({ text: `${obj} ${path}`, ...boxIn });
        } else if (type === "audio") {
            await this.createBox({ text: `buffer~ ${path}`, ...boxIn });
        } else if (type === "image") {
            await this.createBox({ text: `img ${path}`, ...boxIn });
        }
    }
    async deleteBox(boxId: string) {
        this.deselect(boxId);
        const box = await this.instance.deleteBox(boxId);
        if (!box) return null;
        this.emit("delete", { boxes: { [box.id]: box.toSerializable() }, lines: {} });
        return box;
    }
    createLine(lineIn: TLine) {
        const line = this.instance.createLine(lineIn);
        if (!line) return null;
        this.emit("create", { boxes: {}, lines: { [line.id]: line.toSerializable() } });
        return line;
    }
    deleteLine(lineId: string) {
        this.deselect(lineId);
        const line = this.instance.deleteLine(lineId);
        if (!line) return null;
        this.emit("delete", { boxes: {}, lines: { [line.id]: line.toSerializable() } });
        return line;
    }
    changeLineSrc(lineId: string, srcId: string, srcOutlet: number) {
        const e = this.instance.changeLineSrc(lineId, srcId, srcOutlet);
        this.emit("changeLineSrc", e);
    }
    changeLineDest(lineId: string, destId: string, destOutlet: number) {
        const e = this.instance.changeLineDest(lineId, destId, destOutlet);
        this.emit("changeLineDest", e);
    }
    async changeBox(boxId: string, change: { args?: any[]; props?: Record<string, any>; state?: Record<string, any>; zIndex?: number }) {
        if (typeof change.zIndex === "number") this.instance.boxes[boxId]?.setZIndex(change.zIndex);
        await this.instance.boxes[boxId]?.changeObject(change);
    }

    select(...ids: string[]) {
        ids.forEach((id) => {
            if (this.state.selected.indexOf(id) >= 0) return;
            if (this.boxes[id] || this.lines[id]) this.state.selected.push(id);
        });
        this.emit("selected", this.state.selected.slice());
    }
    selectAllBoxes() {
        let ids = Object.keys(this.boxes);
        if (this.state.presentation) ids = ids.filter(id => this.boxes[id].presentation);
        this.state.selected = ids;
        this.emit("selected", ids);
    }
    selectOnly(...ids: string[]) {
        this.state.selected = [];
        this.select(...ids);
    }
    deselect(...ids: string[]) {
        ids.forEach((id) => {
            const i = this.state.selected.indexOf(id);
            if (i === -1) return;
            this.state.selected.splice(i, 1);
        });
        this.emit("selected", this.state.selected.slice());
    }
    deselectAll() {
        this.state.selected = [];
        this.emit("selected", []);
    }
    selectedToString() {
        const lineSet = new Set<Line>();
        const patcher: RawPatcher = { lines: {}, boxes: {} };
        this.state.selected
            .filter(id => id.startsWith("box") && this.boxes[id])
            .map(id => this.boxes[id])
            .forEach((box) => {
                box.allLines.forEach(line => lineSet.add(line));
                patcher.boxes[box.id] = box.toSerializable();
            });
        lineSet.forEach((line) => {
            if (patcher.boxes[line.srcId] && patcher.boxes[line.destId]) patcher.lines[line.id] = line.toSerializable();
        });
        if (!Object.keys(patcher.boxes)) return undefined;
        return JSON.stringify(patcher, undefined, 4);
    }
    bringToFront() {
        this.state.selected
            .filter(id => id.startsWith("box") && this.boxes[id])
            .map(id => this.boxes[id])
            .forEach((box) => {
                box.setZIndex(getTimestamp());
            });
    }
    sendToBack() {
        this.state.selected
            .filter(id => id.startsWith("box") && this.boxes[id])
            .map(id => this.boxes[id])
            .forEach((box) => {
                box.setZIndex(-getTimestamp());
            });
    }
    async pasteToPatcher(clipboard: RawPatcher | TMaxClipboard) {
        const idMap: Record<string, string> = {};
        const pasted: RawPatcher = { boxes: {}, lines: {} };
        if (!clipboard || !clipboard.boxes) return pasted;
        const $init: Promise<Box>[] = [];
        const $postInit: Promise<Box>[] = [];
        if (Array.isArray(clipboard.boxes)) { // Max Patcher
            this.instance.state.preventEmitChanged = true;
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
                $init.push(this.instance.createBox(box));
            }
            const createdBoxes = (await Promise.all($init)).filter(box => !!box);
            createdBoxes.forEach((box) => {
                pasted.boxes[box.id] = box.toSerializable();
                $postInit.push(box.postInit());
            });
            if (Array.isArray(clipboard.lines)) {
                const maxLines = clipboard.lines;
                for (let i = 0; i < maxLines.length; i++) {
                    const lineArgs = maxLines[i].patchline;
                    const id = "line-" + ++this.props.lineIndexCount;
                    const line: TLine = {
                        id,
                        src: [idMap[lineArgs.source[0].replace(/obj/, "box")], lineArgs.source[1]],
                        dest: [idMap[lineArgs.destination[0].replace(/obj/, "box")], lineArgs.destination[1]]
                    };
                    const createdLine = this.instance.createLine(line);
                    if (createdLine) pasted.lines[createdLine.id] = createdLine.toSerializable();
                }
            }
            this.instance.state.preventEmitChanged = false;
            if (Object.keys(pasted.boxes).length) {
                if (this.state.selectAfterEdit) {
                    this.deselectAll();
                    this.select(...Object.keys(pasted.boxes));
                }
                this.emit("create", pasted);
                this.instance.emitGraphChanged();
                await Promise.all($postInit);
            }
            return pasted;
        }
        if (Array.isArray(clipboard.boxes) || Array.isArray(clipboard.lines)) return pasted;
        this.instance.state.preventEmitChanged = true;
        for (const boxId in clipboard.boxes) {
            const box = clipboard.boxes[boxId];
            if (this.boxes[box.id]) {
                idMap[box.id] = "box-" + ++this.props.boxIndexCount;
                box.id = idMap[box.id];
            } else {
                idMap[box.id] = box.id;
                const numID = parseInt(box.id.match(/\d+/)[0]);
                if (numID > this.props.boxIndexCount) this.props.boxIndexCount = numID;
            }
            box.rect = [box.rect[0] + 30, box.rect[1] + 30, box.rect[2], box.rect[3]];
            $init.push(this.instance.createBox(box));
        }
        const createdBoxes = (await Promise.all($init)).filter(box => !!box);
        createdBoxes.forEach((box) => {
            pasted.boxes[box.id] = box.toSerializable();
            $postInit.push(box.postInit());
        });
        await Promise.all($postInit);
        for (const lineId in clipboard.lines) {
            const line = clipboard.lines[lineId];
            line.id = "line-" + ++this.props.lineIndexCount;
            line.src[0] = idMap[line.src[0]];
            line.dest[0] = idMap[line.dest[0]];
            const createdLine = this.instance.createLine(line);
            if (createdLine) pasted.lines[createdLine.id] = createdLine.toSerializable();
        }
        this.instance.state.preventEmitChanged = false;
        if (Object.keys(pasted.boxes).length) {
            if (this.state.selectAfterEdit) {
                this.deselectAll();
                this.select(...Object.keys(pasted.boxes));
            }
            this.emit("create", pasted);
            this.instance.emitGraphChanged();
        }
        return pasted;
    }
    async create(objects: RawPatcher) {
        const $init: Promise<Box>[] = [];
        const $postInit: Promise<Box>[] = [];
        const created: RawPatcher = { boxes: {}, lines: {} };
        for (const boxId in objects.boxes) {
            const boxIn = objects.boxes[boxId];
            const box = new Box(this.instance, boxIn);
            this.boxes[box.id] = box;
            created.boxes[box.id] = box.toSerializable();
            $init.push(box.init());
            $postInit.push(box.postInit());
        }
        await Promise.all($init);
        await Promise.all($postInit);
        for (const lineId in objects.lines) {
            const lineIn = objects.lines[lineId];
            if (!this.instance.canCreateLine(lineIn)) continue;
            const line = new Line(this.instance, lineIn);
            this.lines[line.id] = line;
            created.lines[line.id] = line.toSerializable();
            line.enable();
        }
        if (this.state.selectAfterEdit) {
            this.deselectAll();
            this.select(...Object.keys(objects.boxes));
        }
        this.emit("create", created);
        this.instance.emitGraphChanged();
    }
    async deleteSelected() {
        const boxSet = new Set<Box>();
        const lineSet = new Set<Line>();
        this.state.selected.filter(id => id.startsWith("line")).forEach(id => lineSet.add(this.lines[id]));
        this.state.selected.filter(id => id.startsWith("box")).forEach((id) => {
            boxSet.add(this.boxes[id]);
            this.boxes[id].allLines.forEach(line => lineSet.add(line));
        });
        if (!boxSet.size && !lineSet.size) return undefined;
        this.state.selected = [];
        const deleted: RawPatcher = { boxes: {}, lines: {} };
        const promises: Promise<Box>[] = [];
        lineSet.forEach((line) => {
            deleted.lines[line.id] = line.toSerializable();
            line.destroy();
        });
        boxSet.forEach((box) => {
            deleted.boxes[box.id] = box.toSerializable();
            promises.push(box.destroy());
        });
        await Promise.all(promises);
        this.emit("selected", this.state.selected.slice());
        this.emit("delete", deleted);
        this.instance.emitGraphChanged();
        return deleted;
    }
    async delete(objects: RawPatcher) {
        const deleted: RawPatcher = { boxes: {}, lines: {} };
        for (const id in objects.lines) {
            deleted.lines[id] = this.lines[id].destroy().toSerializable();
        }
        const promises: Promise<Box>[] = [];
        for (const id in objects.boxes) {
            deleted.boxes[id] = this.boxes[id].toSerializable();
            promises.push(this.boxes[id].destroy());
        }
        await Promise.all(promises);
        this.emit("selected", this.state.selected.slice());
        this.emit("delete", deleted);
        this.instance.emitGraphChanged();
    }
    async cut() {
        if (this.state.locked) return;
        await this.copy();
        this.deleteSelected();
    }
    async copy() {
        if (this.state.locked) return;
        const s = this.selectedToString();
        if (!s) return;
        await navigator.clipboard.writeText(s);
    }
    async paste() {
        if (this.state.locked) return;
        const s = await navigator.clipboard.readText();
        if (!s) return;
        let parsed: RawPatcher | TMaxClipboard;
        try {
            parsed = JSON.parse(s);
        } catch (e) {} // eslint-disable-line no-empty
        await this.pasteToPatcher(parsed);
    }
    async duplicate() {
        if (this.state.locked) return;
        const s = this.selectedToString();
        if (!s) return;
        let parsed: RawPatcher | TMaxClipboard;
        try {
            parsed = JSON.parse(s);
        } catch (e) {} // eslint-disable-line no-empty
        await this.pasteToPatcher(parsed);
    }
    async selectAll() {
        this.selectAllBoxes();
    }
    selectRegion(selectionRect: number[], selectedBefore: string[]) {
        let [left, top, right, bottom] = selectionRect;
        if (left > right) [left, right] = [right, left];
        if (top > bottom) [top, bottom] = [bottom, top];
        const { presentation } = this.state;
        const rectKey = presentation ? "presentationRect" : "rect";
        const select = selectedBefore.slice();
        for (const boxId in this.boxes) {
            const box = this.boxes[boxId];
            if (presentation && !box.presentation) continue;
            const rect = box[rectKey];
            if (!isTRect(rect)) continue;
            const [boxLeft, boxTop, boxWidth, boxHeight] = rect;
            const [boxRight, boxBottom] = [boxLeft + boxWidth, boxTop + boxHeight];
            if (boxLeft < right && boxTop < bottom && boxRight > left && boxBottom > top) {
                const i = select.indexOf(boxId);
                if (i === -1) select.push(boxId);
                else select.splice(i, 1);
            }
        }
        const deselect = this.state.selected.filter(id => select.indexOf(id) === -1);
        this.select(...select);
        this.deselect(...deselect);
    }
    moveSelectedBox(dragOffset: { x: number; y: number }, refBoxID?: string) {
        const { presentation, snapToGrid, selected } = this.state;
        const rectKey = presentation ? "presentationRect" : "rect";
        const delta = { ...dragOffset };
        if (refBoxID) {
            const rect = this.boxes[refBoxID][rectKey];
            if (!isRectMovable(rect)) return { x: 0, y: 0 };
            delta.x = snapToGrid ? Math.round((rect[0] + dragOffset.x) / this.props.grid[0]) * this.props.grid[0] - rect[0] : dragOffset.x;
            delta.y = snapToGrid ? Math.round((rect[1] + dragOffset.y) / this.props.grid[1]) * this.props.grid[1] - rect[1] : dragOffset.y;
        }
        if (!delta.x && !delta.y) return dragOffset;
        this.move(selected, delta, presentation);
        return { x: dragOffset.x - delta.x, y: dragOffset.y - delta.y };
    }
    moveEnd(selected: string[], delta: { x: number; y: number }) {
        const { presentation } = this.state;
        const rectKey = presentation ? "presentationRect" : "rect";
        let ids = selected.filter(id => id.startsWith("box") && this.boxes[id]);
        if (presentation) ids = ids.filter(id => isRectMovable(this.boxes[id][rectKey]));
        const boxes = ids.map(id => this.boxes[id]);
        boxes.forEach(box => box.emit(presentation ? "presentationRectChanged" : "rectChanged", box));
        this.emit("moved", { delta, selected: ids, presentation: this.state.presentation });
    }
    move(selected: string[], delta: { x: number; y: number }, presentation: boolean) {
        if (this.state.selectAfterEdit) this.select(...selected);
        const rectKey = presentation ? "presentationRect" : "rect";
        let ids = selected.filter(id => id.startsWith("box") && this.boxes[id]);
        if (presentation) ids = ids.filter(id => isRectMovable(this.boxes[id][rectKey]));
        const boxes = ids.map(id => this.boxes[id]);
        if (boxes.length === 0) return;
        let [left, top] = boxes[0][rectKey] as TRect;
        for (let i = 1; i < boxes.length; i++) {
            const box = boxes[i];
            const [$left, $top] = box[rectKey] as TRect;
            if ($left < left) left = $left;
            if ($top < top) top = $top;
        }
        // Not allowing resize out of bound
        delta.x = Math.max(delta.x, -left);
        delta.y = Math.max(delta.y, -top);
        if (delta.x) boxes.forEach(box => (box[rectKey] as TRect)[0] += delta.x);
        if (delta.y) boxes.forEach(box => (box[rectKey] as TRect)[1] += delta.y);
        // Emit events
        if (!delta.x && !delta.y) return;
        if (presentation !== this.state.presentation) return;
        // boxes.forEach(box => box.emit(presentation ? "presentationRectChanged" : "rectChanged", box));
        this.emit("moving", { selected: ids, delta, presentation });
        if (presentation) return;
        const lineSet = new Set<Line>();
        boxes.forEach((box) => {
            box.inletLines.forEach(set => set.forEach(line => lineSet.add(line)));
            box.outletLines.forEach(set => set.forEach(line => lineSet.add(line)));
        });
        lineSet.forEach(line => line.emit("posChanged", line));
    }
    resizeSelectedBox(boxId: string, dragOffset: { x: number; y: number }, type: TResizeHandlerType) {
        const { presentation, snapToGrid, selected } = this.state;
        const rectKey = presentation ? "presentationRect" : "rect";
        const rect = this.boxes[boxId][rectKey];
        if (!isRectResizable(rect)) return { x: 0, y: 0 };
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
    resizeEnd(selected: string[], delta: { x: number; y: number }, type: TResizeHandlerType) {
        const { presentation } = this.state;
        this.emit("resized", { delta, type, selected, presentation });
    }
    resize(selected: string[], delta: { x: number; y: number }, type: TResizeHandlerType, presentation: boolean) {
        if (this.state.selectAfterEdit) this.select(...selected);
        const rectKey = presentation ? "presentationRect" : "rect";
        let ids = selected.filter(id => id.startsWith("box") && this.boxes[id]);
        if (presentation) ids = ids.filter(id => isRectResizable(this.boxes[id][rectKey]));
        const boxes = ids.map(id => this.boxes[id]);
        if (boxes.length === 0) return;
        let [left, top, width, height] = boxes[0][rectKey] as TRect;
        for (let i = 1; i < boxes.length; i++) {
            const box = boxes[i];
            const [$left, $top, $width, $height] = box[rectKey] as TRect;
            if ($left < left) left = $left;
            if ($top < top) top = $top;
            if ($width < width) width = $width;
            if ($height < height) height = $height;
        }
        // Not allowing resize out of bound
        if (type === "sw" || type === "w" || type === "nw") delta.x = Math.max(delta.x, -left);
        if (type === "nw" || type === "n" || type === "ne") delta.y = Math.max(delta.y, -top);
        // Not allowing resize below 15px width or height
        if (type === "ne" || type === "e" || type === "se") delta.x = Math.max(delta.x, 15 - width);
        if (type === "sw" || type === "w" || type === "nw") delta.x = Math.min(delta.x, width - 15);
        if (type === "se" || type === "s" || type === "sw") delta.y = Math.max(delta.y, 15 - height);
        if (type === "nw" || type === "n" || type === "ne") delta.y = Math.min(delta.y, height - 15);
        boxes.forEach((box) => {
            const sizingX = box.UI ? box.UI?.sizing === "horizontal" || box.UI?.sizing === "both" : true;
            const sizingY = box.UI ? box.UI?.sizing === "vertical" || box.UI?.sizing === "both" : true;
            if (delta.x && sizingX) {
                if (type === "ne" || type === "e" || type === "se") (box[rectKey] as TRect)[2] += delta.x;
                if (type === "sw" || type === "w" || type === "nw") {
                    (box[rectKey] as TRect)[2] -= delta.x;
                    (box[rectKey] as TRect)[0] += delta.x;
                }
            }
            if (delta.y && sizingY) {
                if (type === "se" || type === "s" || type === "sw") (box[rectKey] as TRect)[3] += delta.y;
                if (type === "nw" || type === "n" || type === "ne") {
                    (box[rectKey] as TRect)[3] -= delta.y;
                    (box[rectKey] as TRect)[1] += delta.y;
                }
            }
        });
        // Emit events
        if (!delta.x && !delta.y) return;
        if (presentation !== this.state.presentation) return;
        boxes.forEach(box => box.emit(presentation ? "presentationRectChanged" : "rectChanged", box));
        if (presentation) return;
        const lineSet = new Set<Line>();
        boxes.forEach((box) => {
            box.inletLines.forEach(set => set.forEach(line => lineSet.add(line)));
            box.outletLines.forEach(set => set.forEach(line => lineSet.add(line)));
        });
        lineSet.forEach(line => line.emit("posChanged", line));
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
                    const canCreate = this.instance.canCreateLine({ src: findSrc ? [id, i] : from, dest: findSrc ? from : [id, i] });
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
    inspector(box?: Box) {
        if (box) this.emit("inspector");
        else if (this.state.selected.length) {
            const found = this.state.selected.find(id => id.startsWith("box"));
            if (found && this.boxes[found]) this.emit("inspector");
        }
    }
    dockUI(box?: Box) {
        if (box && box.UI.dockable) this.emit("dockUI", box.id);
        else if (this.state.selected.length) {
            const found = this.state.selected.find(id => id.startsWith("box"));
            if (found && this.boxes[found] && this.boxes[found].UI.dockable) this.emit("dockUI", found);
        }
    }
    onUiResized() {}
    async toTempData() {
        return this.instance.toSerializable();
    }
}
