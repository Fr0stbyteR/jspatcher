import { max2js, js2max } from "../../utils/utils";
import Line from "./Line";
import Box from "./Box";
import SharedData from "../Shared";
import { TLine, TBox, PatcherEventMap, TPatcherProps, TPatcherState, PatcherMode, RawPatcher, TMaxPatcher, TErrorLevel, TPatcherAudioConnection, TMeta, TPropsMeta, TPublicPatcherProps, TSharedData, TPatcherEnv } from "../types";

import { toFaustDspCode } from "../objects/Faust";
import { AudioIn, AudioOut, In, Out } from "../objects/SubPatcher";
import FileInstance from "../file/FileInstance";
import PatcherFile from "./PatcherFile";
import PatcherEditor from "./PatcherEditor";
import Env from "../Env";
import Project from "../Project";

export default class Patcher extends FileInstance<PatcherEventMap, PatcherFile> {
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
    static async fromProjectItem(item: PatcherFile): Promise<Patcher> {
        return new this(item).init();
    }
    async getEditor() {
        const editor = new PatcherEditor(this);
        return editor.init();
    }
    lines: Record<string, Line> = {};
    boxes: Record<string, Box> = {};
    props: TPatcherProps;
    _state: TPatcherState;
    data: TSharedData;
    _inletAudioConnections: TPatcherAudioConnection[] = [];
    _outletAudioConnections: TPatcherAudioConnection[] = [];
    constructor(ctxIn?: PatcherFile | Project | Env) {
        super(ctxIn);
        this._state = {
            name: "patcher",
            isReady: false,
            log: [],
            history: undefined,
            selected: [],
            pkgMgr: undefined,
            dataConsumers: {},
            dataMgr: undefined,
            preventEmitChanged: false
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
    get isReady() {
        return true;
    }
    get audioCtx() {
        return this.project?.audioCtx || this.env.audioCtx;
    }
    get fileExtension() {
        return {
            js: "jspat",
            max: "maxpat",
            gen: "gendsp",
            faust: "dsppat"
        }[this.props.mode];
    }
    get fileName() {
        return `${this.file?.name || this._state.name}.${this.fileExtension}`;
    }
    emitGraphChanged() {
        if (this._state.preventEmitChanged) return;
        this.emit("graphChanged");
        this.emitChanged();
    }
    emitChanged() {
        if (this._state.preventEmitChanged) return;
        this.emit("changed");
    }
    async clear() {
        if (Object.keys(this.boxes).length) {
            this._state.preventEmitChanged = true;
            await Promise.all(Object.keys(this.boxes).map(id => this.boxes[id].destroy()));
            this._state.preventEmitChanged = false;
            this.emitGraphChanged();
        }
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
        this._state.dataMgr = new SharedData(this);
    }
    async init(data = this.file?.data, fileName = this.fileName) {
        if (!data.byteLength) return this.load({});
        const patcherIn = await new Response(data).json();
        const splitName = fileName.split(".");
        const ext = splitName.pop();
        const extMap: Record<string, PatcherMode> = { json: "js", jspat: "js", maxpat: "max", gendsp: "gen", dsppat: "faust" };
        return this.load(patcherIn, extMap[ext] || "js");
    }
    async load(patcherIn: RawPatcher | TMaxPatcher | any, modeIn?: PatcherMode, data?: TSharedData) {
        this._state.isReady = false;
        this._state.preventEmitChanged = true;
        await this.unload();
        if (typeof patcherIn !== "object") {
            this._state.isReady = true;
            this._state.preventEmitChanged = false;
            this.emit("ready");
            return this;
        }
        if (typeof data === "object") this._state.dataMgr.mergeEnvData(data);
        this.props.mode = (patcherIn.props && patcherIn.props.mode ? patcherIn.props.mode : modeIn) || "js";
        const { mode } = this.props;
        const $init: Promise<Box>[] = [];
        let patcher;
        if (mode === "max" || mode === "gen") {
            if (!(patcherIn as TMaxPatcher).patcher) {
                patcher = patcherIn;
            } else {
                patcher = max2js(patcherIn as TMaxPatcher);
            }
        } else if (mode === "js" || mode === "faust") {
            if ("data" in patcherIn && "patcher" in patcherIn) {
                this._state.dataMgr.mergeEnvData(patcherIn.data);
                patcher = patcherIn.patcher;
            } else {
                patcher = patcherIn;
            }
        }
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
            try {
                await this.env.taskMgr.newTask(this, `${this.file?.name || ""} Loading dependencies`, async (onUpdate: (newMsg: string) => any) => {
                    for (let i = 0; i < this.props.dependencies.length; i++) {
                        const [name, url] = this.props.dependencies[i];
                        onUpdate(`${name} from ${url}`);
                        try {
                            await this._state.pkgMgr.importFromURL(url, name);
                        } catch (e) {
                            throw new Error(`Loading dependency: ${name} from ${url} failed`);
                        }
                        depNames = depNames.splice(i, 1);
                    }
                });
            } catch (error) {
                this.error((error as Error).message);
            }
        }
        if (patcher.boxes) { // Boxes & data
            for (const id in patcher.boxes) {
                const $ = this.createBox(patcher.boxes[id]);
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
        this._state.isReady = true;
        this._state.preventEmitChanged = false;
        this.emitGraphChanged();
        this.emit("ready");
        await Promise.all(Object.keys(this.boxes).map(id => this.boxes[id].postInit()));
        this.emit("postInited");
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
        const extMap: Record<string, PatcherMode> = { json: "js", jspat: "js", maxpat: "max", gendsp: "gen", dsppat: "faust" };
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
    async createBox(boxIn: TBox) {
        if (!boxIn.hasOwnProperty("id")) boxIn.id = "box-" + ++this.props.boxIndexCount;
        const box = new Box(this, boxIn);
        this.boxes[box.id] = box;
        await box.init();
        this.emitGraphChanged();
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
        if (!box) return null;
        await box.destroy();
        this.emitGraphChanged();
        return box;
    }
    createLine(lineIn: TLine) {
        if (!this.canCreateLine(lineIn)) return null;
        if (!lineIn.hasOwnProperty("id")) lineIn.id = "line-" + ++this.props.lineIndexCount;
        const line = new Line(this, lineIn);
        this.lines[line.id] = line;
        line.enable();
        this.emitGraphChanged();
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
        if (!line) return null;
        line.destroy();
        this.emitGraphChanged();
        return line;
    }
    changeLineSrc(lineID: string, srcID: string, srcOutlet: number) {
        const line = this.lines[lineID];
        // if (this.instance.getLinesByBox(srcID, line.destID, srcOutlet, line.destInlet).length > 0) return line;
        const oldSrc: [string, number] = [line.srcID, line.srcOutlet];
        const src: [string, number] = [srcID, srcOutlet];
        line.setSrc(src);
        this.emitGraphChanged();
        return { line, oldSrc, src };
    }
    changeLineDest(lineID: string, destID: string, destOutlet: number) {
        const line = this.lines[lineID];
        // if (this.getLinesByBox(line.srcID, destID, line.destInlet, destOutlet).length > 0) return line;
        const oldDest: [string, number] = [line.destID, line.destInlet];
        const dest: [string, number] = [destID, destOutlet];
        line.setDest(dest);
        this.emitGraphChanged();
        return { line, oldDest, dest };
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
        this.env.newLog(errorLevel, title, message, emitter);
        this.emit("newLog", log);
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
        if (changed) {
            this.emit("propsChanged", props);
            this.emitChanged();
        }
    }
    get publicProps() {
        const { dependencies, bgColor, editingBgColor, grid, openInPresentation } = this.props;
        return { dependencies, bgColor, editingBgColor, grid, openInPresentation } as TPublicPatcherProps;
    }
    toFaustDspCode() {
        const code = toFaustDspCode(this);
        this.emit("generateCode", code);
        return code;
    }
    toString(spacing?: number) {
        const obj: TMaxPatcher | Patcher = this.props.mode === "max" || this.props.mode === "gen" ? js2max(this) : this;
        return JSON.stringify(obj, (k, v) => (k.charAt(0) === "_" ? undefined : v), spacing);
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
