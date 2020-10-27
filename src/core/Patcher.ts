import { rgbaMax2Css, isTRect, isRectMovable, isRectResizable } from "../utils/utils";
import Line from "./Line";
import Box from "./Box";
import PatcherHistory from "./PatcherHistory";
import SharedData from "./Shared";
import { TLine, TBox, PatcherEventMap, TPatcherProps, TPatcherState, PatcherMode, RawPatcher, TMaxPatcher, TMaxClipboard, TResizeHandlerType, TErrorLevel, TRect, TPatcherAudioConnection, TMeta, TPropsMeta, TPublicPatcherProps, TPublicPatcherState, TSharedData, TPatcherEnv } from "./types";

import { toFaustDspCode } from "./objects/Faust";
import { AudioIn, AudioOut, In, Out } from "./objects/SubPatcher";
import FileInstance from "./file/FileInstance";
import ProjectItem from "./file/ProjectItem";
import Env from "./Env";
import Project from "./Project";

export default class Patcher extends FileInstance<PatcherEventMap> {
    static props: TPropsMeta<TPublicPatcherProps> = {
        dependencies: {
            type: "object",
            description: "Patcher dependencies",
            default: []
        },
        bgColor: {
            type: "color",
            description: "Background color",
            default: "rgba(61, 65, 70, 1)"
        },
        editingBgColor: {
            type: "color",
            description: "Background color while unlocked",
            default: "rgba(82, 87, 94, 1)"
        },
        grid: {
            type: "object",
            description: "Grid size",
            default: [15, 15]
        },
        openInPresentation: {
            type: "boolean",
            description: "Open patcher in presentation",
            default: false
        }
    };
    lines: Record<string, Line>;
    boxes: Record<string, Box>;
    props: TPatcherProps;
    _state: TPatcherState;
    data: TSharedData;
    _inletAudioConnections: TPatcherAudioConnection[] = [];
    _outletAudioConnections: TPatcherAudioConnection[] = [];
    constructor(ctxIn?: ProjectItem | Project | Env) {
        super(ctxIn);
        this.observeGraphChange();
        this.observeChange();
        this._state = {
            name: "patcher",
            isLoading: false,
            locked: true,
            presentation: false,
            showGrid: true,
            snapToGrid: true,
            log: [],
            history: undefined,
            selected: [],
            pkgMgr: undefined,
            dataConsumers: {},
            dataMgr: undefined
        };
        this.clear();
    }
    get state() {
        return this._state;
    }
    get activePkg() {
        return this._state.pkgMgr.getPkg(this.props.mode);
    }
    get activeLib() {
        return this._state.pkgMgr.getLib(this.props.mode);
    }
    get history(): PatcherHistory {
        return this._state.history;
    }
    get audioCtx() {
        return this.project?.audioCtx || this.env.audioCtx;
    }
    private observeGraphChange() {
        const eventNames = [
            "ready", "createBox", "deleteBox", "createLine", "deleteLine", "create", "delete",
            "changeBoxText", "changeLineSrc", "changeLineDest"
        ] as const;
        eventNames.forEach(e => this.on(e, () => this.emit("graphChanged")));
    }
    private observeChange() {
        const eventNames = [
            "ready", "graphChanged", "moved", "resized", "propsChanged"
        ] as const;
        eventNames.forEach(type => this.on(type, () => this.emit("changed")));
    }
    setActive() {
        this.env.activeInstance = this;
    }
    get isActive() {
        return this.env.activeInstance === this;
    }
    async clear() {
        if (this.boxes) await Promise.all(Object.keys(this.boxes).map(id => this.boxes[id].destroy()));
        this.lines = {};
        this.boxes = {};
        this.props = {
            mode: "js",
            dependencies: Patcher.props.dependencies.default,
            bgColor: Patcher.props.bgColor.default,
            editingBgColor: Patcher.props.editingBgColor.default,
            grid: Patcher.props.grid.default,
            openInPresentation: Patcher.props.openInPresentation.default,
            boxIndexCount: 0,
            lineIndexCount: 0
        };
        this.data = {};
        this._state.selected = [];
        this._state.pkgMgr = this.project.pkgMgr;
        this._state.history = new PatcherHistory(this);
        this._state.dataMgr = new SharedData(this);
    }
    async init(data: ArrayBuffer) {
        if (!data.byteLength) return this.load({});
        const patcherIn = await new Response(data).json();
        return this.load(patcherIn);
    }
    async load(patcherIn: RawPatcher | TMaxPatcher | any, modeIn?: PatcherMode, data?: TSharedData) {
        this._state.isLoading = true;
        this.emit("loading", []);
        await this.unload();
        if (typeof patcherIn !== "object") {
            this._state.isLoading = false;
            this.emit("loading");
            return this;
        }
        if (typeof data === "object") this._state.dataMgr.mergeEnvData(data);
        this.props.mode = (patcherIn.props && patcherIn.props.mode ? patcherIn.props.mode : modeIn) || "js";
        const { mode } = this.props;
        const $init: Promise<Box>[] = [];
        if (mode === "max" || mode === "gen") {
            const patcher = (patcherIn as TMaxPatcher).patcher;
            if (!patcher) {
                this._state.isLoading = false;
                this.emit("loading");
                return this;
            }
            this.props.bgColor = rgbaMax2Css(patcher.bgcolor);
            this.props.editingBgColor = rgbaMax2Css(patcher.editing_bgcolor);
            const maxBoxes = patcher.boxes;
            const maxLines = patcher.lines;
            for (let i = 0; i < maxBoxes.length; i++) {
                const maxBox = maxBoxes[i].box;
                const numID = parseInt(maxBox.id.match(/\d+/)[0]);
                if (numID > this.props.boxIndexCount) this.props.boxIndexCount = numID;
                const id = "box-" + numID;
                const $ = this.createBox({
                    id,
                    inlets: maxBox.numinlets,
                    outlets: maxBox.numoutlets,
                    rect: maxBox.patching_rect,
                    text: (maxBox.maxclass === "newobj" ? "" : maxBox.maxclass + " ") + (maxBox.text ? maxBox.text : "")
                }, true);
                $init.push($);
            }
            await Promise.all($init);
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
            const patcher = patcherIn;
            if (patcher.props) this.props = { ...this.props, ...patcher.props };
            if (Array.isArray(this.props.bgColor)) this.props.bgColor = `rgba(${this.props.bgColor.join(", ")})`;
            if (Array.isArray(this.props.editingBgColor)) this.props.editingBgColor = `rgba(${this.props.editingBgColor.join(", ")})`;
            if (mode === "js" && this.props.dependencies) {
                const { dependencies } = this.props;
                if (!Array.isArray(dependencies)) {
                    this.props.dependencies = [];
                    for (const key in dependencies as Record<string, string>) {
                        this.props.dependencies.push([key, dependencies[key]]);
                    }
                }
                let depNames = this.props.dependencies.map(t => t[0]);
                this.emit("loading", depNames);
                for (let i = 0; i < this.props.dependencies.length; i++) {
                    const [name, url] = this.props.dependencies[i];
                    try {
                        // eslint-disable-next-line no-await-in-loop
                        await this._state.pkgMgr.importFromURL(url, name);
                    } catch (e) {
                        this.error(`Loading dependency: ${name} from ${url} failed`);
                    }
                    depNames = depNames.splice(i, 1);
                    this.emit("loading", depNames);
                }
            }
            if (patcher.boxes) { // Boxes & data
                for (const id in patcher.boxes) {
                    const $ = this.createBox(patcher.boxes[id], true);
                    $init.push($);
                    const numID = parseInt(id.match(/\d+/)[0]);
                    if (numID > this.props.boxIndexCount) this.props.boxIndexCount = numID;
                }
            }
            await Promise.all($init);
            if (patcher.lines) { // Lines
                for (const id in patcher.lines) {
                    this.createLine(patcher.lines[id]);
                    const numID = parseInt(id.match(/\d+/)[0]);
                    if (numID > this.props.lineIndexCount) this.props.lineIndexCount = numID;
                }
            }
        }
        this._state.presentation = !!this.props.openInPresentation;
        this._state.isLoading = false;
        this.emit("loading");
        await Promise.all(Object.keys(this.boxes).map(id => this.boxes[id].postInit()));
        this.emit("ready");
        return this;
    }
    async loadFromURL(url: string) {
        try {
            const file = await fetch(url);
            const parsed = await file.json() as RawPatcher | TPatcherEnv | TMaxPatcher;
            if ("patcher" in parsed && "data" in parsed) return this.load(parsed.patcher, undefined, parsed.data);
            return this.load(parsed);
        } catch (e) {
            this.error(`Fetch file ${url} failed.`);
        }
        return this;
    }
    async loadFromString(sIn: string) {
        try {
            const parsed = JSON.parse(sIn) as RawPatcher | TPatcherEnv | TMaxPatcher;
            if ("patcher" in parsed && "data" in parsed) return this.load(parsed.patcher, undefined, parsed.data);
            return this.load(parsed);
        } catch (e) {
            this.error(`Load from string: ${sIn.slice(20)}... failed.`);
        }
        return this;
    }
    async loadFromFile(file: File) {
        const splitName = file.name.split(".");
        const ext = splitName.pop();
        const name = splitName.join(".");
        const extMap: Record<string, PatcherMode> = { json: "js", maxpat: "max", gendsp: "gen", dsppat: "faust" };
        if (!extMap[ext]) return this;
        const reader = new FileReader();
        reader.onload = () => {
            let parsed: RawPatcher | TPatcherEnv | TMaxPatcher;
            try {
                parsed = JSON.parse(reader.result.toString());
            } catch (e) {
                this.error((e as Error).message);
            }
            if (parsed) {
                if ("patcher" in parsed && "data" in parsed) this.load(parsed.patcher, extMap[ext], parsed.data);
                else this.load(parsed, extMap[ext]);
                this._state.name = name;
            }
        };
        reader.onerror = () => this.error(reader.error.message);
        reader.readAsText(file, "UTF-8");
        return this;
    }
    async unload() {
        await this.emit("unload");
        await this.clear();
    }
    async destroy() {
        await this.unload();
        await this.emit("destroy");
    }
    get fileName() {
        return `${this._state.name}.${{ js: "json", max: "maxpat", gen: "gendsp", faust: "dsppat" }[this.props.mode]}`;
    }
    async addPackage(namespace: string, url: string) {
        const { dependencies } = this.props;
        await this.state.pkgMgr.importFromURL(url, namespace);
        dependencies.push([namespace, url]);
        this.setProps({ dependencies: dependencies.slice() });
    }
    removePackage(url: string) {
        const { dependencies } = this.props;
        const i = dependencies.findIndex(t => t[1] === url);
        if (i === -1) return;
        dependencies.splice(i, 1);
        this.state.pkgMgr.remove(url);
        this.setProps({ dependencies: dependencies.slice() });
    }
    async createBox(boxIn: TBox, noPostInit?: boolean) {
        if (!boxIn.hasOwnProperty("id")) boxIn.id = "box-" + ++this.props.boxIndexCount;
        const box = new Box(this, boxIn);
        this.boxes[box.id] = box;
        await box.init();
        if (!this._state.isLoading) this.emit("createBox", box);
        if (!noPostInit) await box.postInit();
        return box;
    }
    getObjectConstructor(parsed: { class: string; args: any[]; props: Record<string, any> }) {
        const className = parsed.class;
        if (typeof className !== "string" || className.length === 0) return this.activeLib.EmptyObject;
        if (this.activeLib[className]) return this.activeLib[className];
        this.error(`Object ${className} not found.`);
        return this.activeLib.InvalidObject;
    }
    getObjectMeta(parsed: { class: string; args: any[]; props: Record<string, any> }) {
        return this.getObjectConstructor(parsed).meta;
    }
    async changeBoxText(boxID: string, text: string) {
        const oldText = this.boxes[boxID].text;
        if (oldText === text) return this.boxes[boxID];
        await this.boxes[boxID].changeText(text);
        this.emit("changeBoxText", { oldText, text, box: this.boxes[boxID] });
        return this.boxes[boxID];
    }
    async deleteBox(boxID: string) {
        const box = this.boxes[boxID];
        await box.destroy();
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
    fn(data: any, inlet: number) {
        this.emit("inlet", { data, inlet });
    }
    outlet(outlet: number, data: any) {
        this.emit("outlet", { data, outlet });
    }
    get inletAudioConnections() {
        return this._inletAudioConnections;
    }
    get outletAudioConnections() {
        return this._outletAudioConnections;
    }
    connectAudioInlet(index: number) {
        this.emit("connectAudioInlet", index);
    }
    connectAudioOutlet(index: number) {
        this.emit("connectAudioOutlet", index);
    }
    disconnectAudioInlet(index: number) {
        this.emit("disconnectAudioInlet", index);
    }
    disconnectAudioOutlet(index: number) {
        this.emit("disconnectAudioOutlet", index);
    }
    changeIO() {
        this.emit("ioChanged", this.meta);
    }
    inspectAudioIO() {
        const iMap: boolean[] = [];
        const oMap: boolean[] = [];
        for (const boxID in this.boxes) {
            const box = this.boxes[boxID];
            if (box.object instanceof AudioIn) iMap[box.object.state.index - 1] = true;
            else if (box.object instanceof AudioOut) oMap[box.object.state.index - 1] = true;
        }
        for (let i = 0; i < this._inletAudioConnections.length; i++) {
            if (!iMap[i]) delete this._inletAudioConnections[i];
        }
        for (let i = 0; i < this._outletAudioConnections.length; i++) {
            if (!oMap[i]) delete this._outletAudioConnections[i];
        }
    }
    get meta(): TMeta {
        const { metaFromPatcher } = this;
        return {
            package: this.props.package || "",
            name: this.props.name || "",
            icon: null,
            author: this.props.author || "",
            version: this.props.version || "",
            description: this.props.description || "",
            ...metaFromPatcher
        };
    }
    get metaFromPatcher(): { inlets: TMeta["inlets"]; outlets: TMeta["outlets"]; args: TMeta["args"]; props: TMeta["props"] } {
        const inlets: TMeta["inlets"] = [];
        const outlets: TMeta["outlets"] = [];
        for (const boxID in this.boxes) {
            const box = this.boxes[boxID];
            if (box.object instanceof In) {
                inlets[box.object.state.index - 1] = {
                    isHot: true,
                    type: (box as Box<In>).props.type || "anything",
                    description: (box as Box<In>).props.description || ""
                };
            } else if (box.object instanceof AudioIn) {
                inlets[box.object.state.index - 1] = {
                    isHot: true,
                    type: "signal",
                    description: (box as Box<AudioIn>).props.description || ""
                };
            } else if (box.object instanceof Out) {
                outlets[box.object.state.index - 1] = {
                    type: (box as Box<Out>).props.type || "anything",
                    description: (box as Box<Out>).props.description || ""
                };
            } else if (box.object instanceof AudioOut) {
                outlets[box.object.state.index - 1] = {
                    type: "signal",
                    description: (box as Box<AudioOut>).props.description || ""
                };
            }
        }
        return { inlets, outlets, args: [], props: {} };
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
    setState(state: Partial<TPublicPatcherState>) {
        let changed = false;
        for (const keyIn in state) {
            const key = keyIn as keyof TPublicPatcherState;
            if (this._state[key] === state[key]) continue;
            changed = true;
            if (key === "locked" || key === "presentation") this.deselectAll();
            this._state[key] = state[key] as any;
            this.emit(key, state[key]);
        }
        if (changed) this.emit("stateChanged", state);
    }
    setProps(props: Partial<TPublicPatcherProps>) {
        let changed = false;
        for (const keyIn in props) {
            const key = keyIn as keyof TPublicPatcherProps;
            if (this.props[key] === props[key]) continue;
            changed = true;
            (this.props as any)[key] = props[key];
            this.emit(key, props[key]);
        }
        if (changed) this.emit("propsChanged", props);
    }
    get publicProps() {
        const { dependencies, bgColor, editingBgColor, grid, openInPresentation } = this.props;
        return { dependencies, bgColor, editingBgColor, grid, openInPresentation } as TPublicPatcherProps;
    }
    selectAllBoxes() {
        let ids = Object.keys(this.boxes);
        if (this.state.presentation) ids = ids.filter(id => this.boxes[id].presentation);
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
        const { selected } = this._state;
        const $ = selected.indexOf(id);
        if ($ === -1) {
            this.deselectAll();
            this.select(id);
        } else {
            selected.splice($, 1);
            this.emit("deselected", selected);
            this._state.selected = [id];
        }
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
            const rect = box[rectKey];
            if (!isTRect(rect)) continue;
            const [boxLeft, boxTop, boxWidth, boxHeight] = rect;
            const [boxRight, boxBottom] = [boxLeft + boxWidth, boxTop + boxHeight];
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
        const lineSet = new Set<Line>();
        const patcher: RawPatcher = { lines: {}, boxes: {} };
        this._state.selected
            .filter(id => id.startsWith("box") && this.boxes[id])
            .map(id => this.boxes[id])
            .forEach((box) => {
                box.allLines.forEach(line => lineSet.add(line));
                patcher.boxes[box.id] = box;
            });
        lineSet.forEach((line) => {
            if (patcher.boxes[line.srcID] && patcher.boxes[line.destID]) patcher.lines[line.id] = line;
        });
        if (!Object.keys(patcher.boxes)) return undefined;
        return JSON.stringify(patcher, (k, v) => (k.charAt(0) === "_" ? undefined : v), 4);
    }
    moveSelectedBox(dragOffset: { x: number; y: number }, refBoxID?: string) {
        const { presentation, snapToGrid, selected } = this._state;
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
    moveEnd(delta: { x: number; y: number }) {
        const { presentation, selected } = this._state;
        const rectKey = presentation ? "presentationRect" : "rect";
        let ids = selected.filter(id => id.startsWith("box") && this.boxes[id]);
        if (presentation) ids = ids.filter(id => isRectMovable(this.boxes[id][rectKey]));
        this.emit("moved", { delta, selected: ids, presentation: this._state.presentation });
    }
    move(selected: string[], delta: { x: number; y: number }, presentation: boolean) {
        this.selects(selected);
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
        if (presentation !== this._state.presentation) return;
        this.emit("moving", { selected: ids, delta, presentation });
        if (presentation) return;
        const lineSet = new Set<Line>();
        boxes.forEach((box) => {
            box.inletLines.forEach(set => set.forEach(line => lineSet.add(line)));
            box.outletLines.forEach(set => set.forEach(line => lineSet.add(line)));
        });
        lineSet.forEach(line => line.emit("posChanged", line));
    }
    resizeSelectedBox(boxID: string, dragOffset: { x: number; y: number }, type: TResizeHandlerType) {
        const { presentation, snapToGrid, selected } = this._state;
        const rectKey = presentation ? "presentationRect" : "rect";
        const rect = this.boxes[boxID][rectKey];
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
    resizeEnd(delta: { x: number; y: number }, type: TResizeHandlerType) {
        const { selected, presentation } = this._state;
        this.emit("resized", { delta, type, selected, presentation });
    }
    resize(selected: string[], delta: { x: number; y: number }, type: TResizeHandlerType, presentation: boolean) {
        this.selects(selected);
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
            const sizingX = box.uiComponent.sizing === "horizontal" || box.uiComponent.sizing === "both";
            const sizingY = box.uiComponent.sizing === "vertical" || box.uiComponent.sizing === "both";
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
        if (presentation !== this._state.presentation) return;
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
    async pasteToPatcher(clipboard: RawPatcher | TMaxClipboard) {
        const idMap: Record<string, string> = {};
        const pasted: RawPatcher = { boxes: {}, lines: {} };
        if (!clipboard || !clipboard.boxes) return pasted;
        const $init: Promise<Box>[] = [];
        const $postInit: Promise<Box>[] = [];
        if (Array.isArray(clipboard.boxes)) { // Max Patcher
            this._state.isLoading = true;
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
                $init.push(this.createBox(box, true));
            }
            const createdBoxes = (await Promise.all($init)).filter(box => !!box);
            createdBoxes.forEach((box) => {
                pasted.boxes[box.id] = box;
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
                    const createdLine = this.createLine(line);
                    if (createdLine) pasted.lines[createdLine.id] = line;
                }
            }
            this._state.isLoading = false;
            if (Object.keys(pasted.boxes).length) {
                this.deselectAll();
                this.selects(Object.keys(pasted.boxes));
                this.emit("create", pasted);
                await Promise.all($postInit);
            }
            return pasted;
        }
        if (Array.isArray(clipboard.boxes) || Array.isArray(clipboard.lines)) return pasted;
        this._state.isLoading = true;
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
            box.rect = [box.rect[0] + 30, box.rect[1] + 30, box.rect[2], box.rect[3]];
            $init.push(this.createBox(box, true));
        }
        const createdBoxes = (await Promise.all($init)).filter(box => !!box);
        createdBoxes.forEach((box) => {
            pasted.boxes[box.id] = box;
            $postInit.push(box.postInit());
        });
        await Promise.all($postInit);
        for (const lineID in clipboard.lines) {
            const line = clipboard.lines[lineID];
            if (this.lines[line.id]) line.id = "line-" + ++this.props.lineIndexCount;
            line.src[0] = idMap[line.src[0]];
            line.dest[0] = idMap[line.dest[0]];
            const createdLine = this.createLine(line);
            if (createdLine) pasted.lines[createdLine.id] = line;
        }
        this._state.isLoading = false;
        if (Object.keys(pasted.boxes).length) {
            this.deselectAll();
            this.selects(Object.keys(pasted.boxes));
            this.emit("create", pasted);
        }
        return pasted;
    }
    async create(objects: RawPatcher) {
        const $init: Promise<Box>[] = [];
        const $postInit: Promise<Box>[] = [];
        const created: RawPatcher = { boxes: {}, lines: {} };
        for (const boxID in objects.boxes) {
            const boxIn = objects.boxes[boxID];
            const box = new Box(this, boxIn);
            this.boxes[box.id] = box;
            created.boxes[box.id] = box;
            $init.push(box.init());
            $postInit.push(box.postInit());
        }
        await Promise.all($init);
        await Promise.all($postInit);
        for (const lineID in objects.lines) {
            const lineIn = objects.lines[lineID];
            if (!this.canCreateLine(lineIn)) continue;
            const line = new Line(this, lineIn);
            this.lines[line.id] = line;
            created.lines[line.id] = line;
            line.enable();
        }
        this.deselectAll();
        this.selects(Object.keys(objects.boxes));
        this.emit("create", created);
    }
    async deleteSelected() {
        const boxSet = new Set<Box>();
        const lineSet = new Set<Line>();
        this._state.selected.filter(id => id.startsWith("line")).forEach(id => lineSet.add(this.lines[id]));
        this._state.selected.filter(id => id.startsWith("box")).forEach((id) => {
            boxSet.add(this.boxes[id]);
            this.boxes[id].allLines.forEach(line => lineSet.add(line));
        });
        if (!boxSet.size && !lineSet.size) return undefined;
        this._state.selected = [];
        const deleted: RawPatcher = { boxes: {}, lines: {} };
        const promises: Promise<Box>[] = [];
        lineSet.forEach((line) => {
            deleted.lines[line.id] = line;
            line.destroy();
        });
        boxSet.forEach((box) => {
            deleted.boxes[box.id] = box.toSerializable();
            promises.push(box.destroy());
        });
        await Promise.all(promises);
        this.emit("deselected", Object.keys(deleted.lines));
        this.emit("delete", deleted);
        return deleted;
    }
    async delete(objects: RawPatcher) {
        const deleted: RawPatcher = { boxes: {}, lines: {} };
        for (const id in objects.lines) {
            deleted.lines[id] = this.lines[id].destroy();
        }
        const promises: Promise<Box>[] = [];
        for (const id in objects.boxes) {
            deleted.boxes[id] = this.boxes[id].toSerializable();
            promises.push(this.boxes[id].destroy());
        }
        await Promise.all(promises);
        const deselected = Object.keys(deleted.boxes).concat(Object.keys(deleted.lines));
        this.emit("deselected", deselected);
        this.emit("delete", deleted);
    }
    toFaustDspCode() {
        const code = toFaustDspCode(this);
        this.emit("generateCode", code);
        return code;
    }
    inspector(box?: Box) {
        if (box) this.emit("inspector", box);
        else if (this._state.selected.length) {
            const found = this._state.selected.find(id => id.startsWith("box"));
            if (found && this.boxes[found]) this.emit("inspector", this.boxes[found]);
        }
    }
    dockUI(box?: Box) {
        if (box && box.uiComponent.dockable) this.emit("dockUI", box);
        else if (this._state.selected.length) {
            const found = this._state.selected.find(id => id.startsWith("box"));
            if (found && this.boxes[found] && this.boxes[found].uiComponent.dockable) this.emit("dockUI", this.boxes[found]);
        }
    }
    toString(spacing?: number) {
        return JSON.stringify(this, (k, v) => (k.charAt(0) === "_" ? undefined : v), spacing);
    }
    toSerializable(): RawPatcher {
        return JSON.parse(this.toString());
    }
    toStringEnv(spacing = 4) {
        return JSON.stringify({ patcher: this, data: this.env.data }, (k, v) => (k.charAt(0) === "_" ? undefined : v), spacing);
    }
    serialize() {
        return new Blob([this.toString()]).arrayBuffer();
    }
}
