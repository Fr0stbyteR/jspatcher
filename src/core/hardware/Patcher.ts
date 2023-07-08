import FileInstance from "../file/FileInstance";
import PatcherEditor from "./HardwareEditor";
import Line from "./Line";
import Box from "./Box";
import PatcherHistory from "./HardwareHistory";
import BaseHardwareObjects from "./objects/base/BaseHardwareObjects";
// import PackageManager, { IPackageManager } from "../PackageManager";
// import { max2js, js2max } from "../../utils/utils";
// import { toFaustDspCode } from "../patcher/FaustPatcherAnalyser";
import type Env from "../Env";
import type Project from "../Project";
import type TempHardwareFile from "./TempHardwareFile";
import type PersistentProjectFile from "../file/PersistentProjectFile";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";
import type { IHardwarePatcherObjectMeta, IPropsMeta, IHardwarePatcherObject, THardwareMetaType, IPropMeta, IArgsMeta } from "./objects/base/AbstractHardwareObject";
import type { TErrorLevel, TFlatPackage, TPackage, ILogInfo, TDependencies } from "../types";
import type { RawHardwarePatcher } from "./types";
import type { THardwareBox, THardwareLine, PatcherMode } from "./types";
import type PatcherNode from "../worklets/PatcherNode";
import type PatcherProcessor from "../worklets/Patcher.worklet";
import SomObjects from "./objects/soms/SomObjects";
import HardwareObjects from "./objects/hardware/HardwareObjects";
import { IInletMeta, IOutletMeta } from "../objects/base/AbstractObject";
import { SemanticICONS } from "semantic-ui-react";

export type THardwareSubpatcherInlet = {
    boxId: string;
    inlet: number;
}

export type THardwareSubpatcherOutlet = {
    boxId: string;
    outlet: number;
}

export interface TPatcherProps {
    mode: PatcherMode;
    dependencies: TDependencies;
    bgColor: string;
    editingBgColor: string;
    grid: [number, number];
    boxIndexCount: number;
    lineIndexCount: number;
    package?: string;
    name?: string;
    author?: string;
    version?: string;
    description?: string;
    openInPresentation: boolean;
    objectInit: boolean;
    // inlets: THardwareSubpatcherInlet[],
    // outlets: THardwareSubpatcherOutlet[],
}
export type TPublicPatcherProps = Pick<TPatcherProps, "dependencies" | "bgColor" | "editingBgColor" | "grid" | "openInPresentation">;

export interface TPatcherState {
    name: string;
    isReady: boolean;
    log: ILogInfo[];
    selected: string[];
    // pkgMgr: IPackageManager;
    preventEmitChanged: boolean;
    patcherNode?: PatcherNode;
    patcherProcessor?: PatcherProcessor;
}

export interface PatcherEventMap extends TPublicPatcherProps {
    "postInited": never;
    "ready": never;
    "unload": never;
    "changeBoxText": { boxId: string; oldText: string; text: string };
    "boxChanged": { boxId: string; oldArgs?: any[]; args?: any[]; oldProps?: Record<string, any>; props?: Record<string, any>; oldState?: Record<string, any>; state?: Record<string, any>; oldZIndex?: number; zIndex?: number };
    "zIndexChanged": { boxId: string; zIndex: number };
    "passiveDeleteLine": Line;
    "graphChanged": never;
    "changed": never;
    "ioChanged": IHardwarePatcherMeta;
    // "dataInput": TInletEvent<any[]>;
    // "dataOutput": TOutletEvent<any[]>;
    "audioInput": { input: number; buffer: Float32Array };
    "paramInput": { param: string; buffer: Float32Array };
    "audioOutput": { output: number; buffer: Float32Array };
    "propsChanged": { props: Partial<TPublicPatcherProps>; oldProps: Partial<TPublicPatcherProps> };
    "libChanged": { pkg: TPackage; lib: TFlatPackage };
    "highlightBox": string;
    "highlightPort": { boxId: string; isSrc: boolean; i: number } | null;
}

export interface IHardwarePatcherMeta<P extends Record<string, any> = Record<string, any>> {
    name: string;
    icon: SemanticICONS;
    version: string;
    description: string;
    args: IArgsMeta;
    props: IPropMeta<P>;
    patcherInlets: Map<[string, number], IInletMeta>;
    patcherOutlets: Map<[string, number], IOutletMeta>;
}

export default class Patcher extends FileInstance<PatcherEventMap, PersistentProjectFile | TempHardwareFile> {
    static props: IPropsMeta<TPublicPatcherProps> = {
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
    static async fromProjectItem(options: { file: PersistentProjectFile | TempHardwareFile; env: IJSPatcherEnv; project?: IProject; instanceId?: string }): Promise<Patcher> {
        return new this(options).init();
    }
    async getEditor() {
        const editor = new PatcherEditor(this);
        return editor.init();
    }
    lib: { [key: string]: typeof IHardwarePatcherObject } = { ...BaseHardwareObjects, ...SomObjects, ...HardwareObjects };
    lines: Record<string, Line> = {};
    boxes: Record<string, Box> = {};
    props: TPatcherProps;
    _state: TPatcherState;
    _history = new PatcherHistory();
    constructor(options: { env: IJSPatcherEnv; project?: IProject; file?: PersistentProjectFile | TempHardwareFile; instanceId?: string; objectInit?: boolean }) {
        super(options);
        this._state = {
            name: "patcher",
            isReady: false,
            log: [],
            selected: [],
            // pkgMgr: undefined,
            preventEmitChanged: false
        };
        this.lines = {};
        this.boxes = {};
        this.props = {
            mode: "daisy",
            dependencies: Patcher.props.dependencies.default.slice(),
            bgColor: Patcher.props.bgColor.default,
            editingBgColor: Patcher.props.editingBgColor.default,
            grid: Patcher.props.grid.default.slice() as [number, number],
            openInPresentation: Patcher.props.openInPresentation.default,
            boxIndexCount: 0,
            lineIndexCount: 0,
            objectInit: typeof options.objectInit === "boolean" ? options.objectInit : true,
            // inlets: [],
            // outlets: []
        };
    }
    get state() {
        return this._state;
    }
    // get activePkg() {
    //     return this._state.pkgMgr.pkg;
    // }
    // get activeLib() {
    //     return this._state.pkgMgr.lib;
    // }
    get activeLib() {
        return this.lib;
    }
    get isReady() {
        return !!this._state?.isReady;
    }
    get audioCtx() {
        return (this.project as Project)?.audioCtx || (this.env as Env).audioCtx;
    }
    get fileExtension() {
        return {
            daisy: "daisy"
        }[this.props.mode];
    }
    get fileName() {
        return this.file?.name || `${this._state.name}.${this.fileExtension}`;
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
    boxChanged(boxId: string, changed: { oldArgs?: any[]; args?: any[]; oldProps?: Record<string, any>; props?: Record<string, any>; oldState?: Record<string, any>; state?: Record<string, any> }) {
        this.emit("boxChanged", { boxId, ...changed });
    }
    async init(data = this.file?.data, fileName = this.fileName) {
        if (data instanceof ArrayBuffer) {
            if (!data.byteLength) return this.load({});
            const patcherIn = await new Response(data).json();
            const splitName = fileName.split(".");
            const ext = splitName.pop();
            const extMap: Record<string, PatcherMode> = { daisy: "daisy" };
            return this.load(patcherIn, extMap[ext] || "daisy");
        }
        return this.load(data || {});
    }
    async load(patcherIn: RawHardwarePatcher | any, modeIn?: PatcherMode) {
        this._state.isReady = false;
        this._state.preventEmitChanged = true;
        await this.unload();
        if (typeof patcherIn !== "object") {
            this._state.isReady = true;
            this._state.preventEmitChanged = false;
            this.emit("ready");
            return this;
        }
        await this.env.taskMgr.newTask(this, "Loading patcher...", async (onUpdate) => {
            this.props.mode = patcherIn.props?.mode || modeIn || "js";
            // this.state.pkgMgr = new PackageManager(this);
            const { mode } = this.props;
            const $init: Promise<Box>[] = [];
            onUpdate("Decoding Patcher...");
            let patcher;
            // if (mode === "max" || mode === "gen") {
            //     if (!(patcherIn as TMaxPatcher).patcher) {
            //         patcher = patcherIn;
            //     } else {
            //         patcher = max2js(patcherIn as TMaxPatcher);
            //     }
            // } else if (mode === "js" || mode === "faust" || mode === "jsaw") {
            if ("data" in patcherIn && "hardware" in patcherIn) {
                patcher = patcherIn.patcher;
            } else {
                patcher = patcherIn;
            }
            // }
            if (patcher.props) this.props = { ...this.props, ...patcher.props, mode };
            if (Array.isArray(this.props.bgColor)) this.props.bgColor = `rgba(${this.props.bgColor.join(", ")})`;
            if (Array.isArray(this.props.editingBgColor)) this.props.editingBgColor = `rgba(${this.props.editingBgColor.join(", ")})`;
            if (mode === "daisy" && this.props.dependencies) {
                const { dependencies } = this.props;
                if (!Array.isArray(dependencies)) {
                    this.props.dependencies = [];
                    for (const key in dependencies as Record<string, string>) {
                        this.props.dependencies.push([key, dependencies[key]]);
                    }
                }
            }
            // onUpdate("Initializing Packages...");
            // await this._state.pkgMgr.init();
            onUpdate("Creating Boxes...");
            if (patcher.boxes) { // Boxes & data
                for (const id in patcher.boxes) {
                    onUpdate(`Creating Boxes ${id}`);
                    const $ = this.createBox(patcher.boxes[id]);
                    $init.push($);
                    const numID = parseInt(id.match(/\d+/)[0]);
                    if (numID > this.props.boxIndexCount) this.props.boxIndexCount = numID;
                }
            }
            onUpdate("Initializing Boxes...");
            await Promise.all($init);
            onUpdate("Creating Lines...");
            if (patcher.lines) { // Lines
                for (const id in patcher.lines) {
                    this.createLine(patcher.lines[id]);
                    const numID = parseInt(id.match(/\d+/)[0]);
                    if (numID > this.props.lineIndexCount) this.props.lineIndexCount = numID;
                }
            }
            onUpdate("Finishing...");
            this._state.isReady = true;
            this._state.preventEmitChanged = false;
            this.emitGraphChanged();
            this.emit("ready");
            await Promise.all(Object.keys(this.boxes).map(id => this.boxes[id].postInit()));
            this.emit("postInited");
        });
        return this;
    }
    // async getPatcherNode(inputs = 2, outputs = 2) {
    //     if (this.props.mode === "jsaw" && this.env.thread === "main") {
    //         const PatcherNode = (await import("../worklets/PatcherNode")).default;
    //         await PatcherNode.register(this.audioCtx.audioWorklet);
    //         this.state.patcherNode = new PatcherNode(this.audioCtx, { env: this.env, instanceId: this.id, fileId: this.file?.id, data: this.file ? undefined : this.toSerializable(), inputs, outputs });
    //         await this.state.patcherNode.init();
    //         return this.state.patcherNode;
    //     }
    //     return null;
    // }
    async loadFromURL(url: string) {
        try {
            const file = await fetch(url);
            if (!file.ok) throw new Error();
            const parsed = await file.json() as RawHardwarePatcher;
            return this.load(parsed);
        } catch (e) {
            this.error(`Fetch file ${url} failed.`);
        }
        return this;
    }
    async loadFromString(sIn: string) {
        try {
            const parsed = JSON.parse(sIn) as RawHardwarePatcher;
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
        const extMap: Record<string, PatcherMode> = { daisy: "daisy" };
        if (!extMap[ext]) return this;
        const reader = new FileReader();
        reader.onload = () => {
            let parsed: RawHardwarePatcher;
            try {
                parsed = JSON.parse(reader.result.toString());
            } catch (e) {
                this.error((e as Error).message);
            }
            if (parsed) {
                this.load(parsed, extMap[ext]);
                this._state.name = name;
            }
        };
        reader.onerror = () => this.error(reader.error.message);
        reader.readAsText(file, "UTF-8");
        return this;
    }
    async unload() {
        await this.emit("unload");
        if (Object.keys(this.boxes).length) {
            this._state.preventEmitChanged = true;
            await Promise.all(Object.keys(this.boxes).map(id => this.boxes[id].destroy()));
            this._state.preventEmitChanged = false;
            this.emitGraphChanged();
        }
        this.lines = {};
        this.boxes = {};
        this.props = {
            mode: "daisy",
            dependencies: Patcher.props.dependencies.default.slice(),
            bgColor: Patcher.props.bgColor.default,
            editingBgColor: Patcher.props.editingBgColor.default,
            grid: Patcher.props.grid.default.slice() as [number, number],
            openInPresentation: Patcher.props.openInPresentation.default,
            boxIndexCount: 0,
            lineIndexCount: 0,
            objectInit: true,
            // inlets: [],
            // outlets: [],
        };
        this._state.selected = [];
    }
    async destroy() {
        await this.unload();
        await super.destroy();
    }
    // async addPackage(namespace: string, url: string) {
    //     const { dependencies } = this.props;
    //     dependencies.push([namespace, url]);
    //     this.setProps({ dependencies: dependencies.slice() });
    //     await this.state.pkgMgr.init();
    //     if (!(namespace in this.activePkg)) {
    //         this.setProps({ dependencies: dependencies.filter(([id]) => id !== namespace) });
    //     }
    // }
    // async removePackage(id: string) {
    //     const { dependencies } = this.props;
    //     const i = dependencies.findIndex(t => t[0] === id);
    //     if (i === -1) return;
    //     dependencies.splice(i, 1);
    //     this.setProps({ dependencies: dependencies.slice() });
    //     await this.state.pkgMgr.init();
    // }
    async createBox(boxIn: THardwareBox) {
        if (!boxIn.id || (boxIn.id in this.boxes)) boxIn.id = "box-" + ++this.props.boxIndexCount;
        const box = new Box(this, boxIn);
        this.boxes[box.id] = box;
        await box.init();
        this.emitGraphChanged();
        this.changeIO();
        return box;
    }
    getObjectConstructor(parsed: { class: string; args: any[]; props: Record<string, any> }) {
        const className = parsed.class;
        if (typeof className !== "string" || className.length === 0)
            return this.activeLib.EmptyObject;
        if (this.activeLib[className])
            return this.activeLib[className];
        return this.activeLib.InvalidObject;
    }
    getObjectMeta(parsed: { class: string; args: any[]; props: Record<string, any> }) {
        return this.getObjectConstructor(parsed).meta;
    }
    async changeBoxText(boxId: string, text: string) {
        const oldText = this.boxes[boxId].text;
        if (oldText === text) return this.boxes[boxId];
        await this.boxes[boxId].changeText(text);
        this.emit("changeBoxText", { oldText, text, boxId });
        this.emitGraphChanged();
        return this.boxes[boxId];
    }
    async deleteBox(boxId: string) {
        const box = this.boxes[boxId];
        if (!box) return null;
        await box.destroy();
        this.emitGraphChanged();
        this.changeIO();
        return box;
    }
    createLine(lineIn: THardwareLine) {
        if (!this.canCreateLine(lineIn)) return null;
        if (!lineIn.id || (lineIn.id in this.lines)) lineIn.id = "line-" + ++this.props.lineIndexCount;
        const line = new Line(this, lineIn);
        this.lines[line.id] = line;
        line.enable();
        this.emitGraphChanged();
        return line;
    }
    canCreateLine(lineIn: THardwareLine) {
        if (lineIn.aIo[1] >= this.boxes[lineIn.aIo[0]].ios.length)
            return false;
        if (this.getLinesByBox(lineIn.aIo[0], lineIn.bIo[0], lineIn.aIo[1], lineIn.bIo[1]).length > 0)
            return false;
        return true;
    }
    deleteLine(lineId: string) {
        const line = this.lines[lineId];
        if (!line) return null;
        line.destroy();
        if (!this._state.preventEmitChanged) this.emit("passiveDeleteLine", line);
        this.emitGraphChanged();
        return line;
    }

    changeLineA(lineId: string, aId: string, aIo: number) {
        const line = this.lines[lineId];
        const oldA: [string, number] = [...line.aIo];
        const newA: [string, number] = [aId, aIo];
        line.setA(newA);
        this.emitGraphChanged();
        return { lineId, oldA, newA };
    }

    changeLineB(lineId: string, bId: string, bIo: number) {
        const line = this.lines[lineId];
        const oldB: [string, number] = [...line.bIo];
        const newB: [string, number] = [bId, bIo];
        line.setB(newB);
        this.emitGraphChanged();
        return { lineId, oldB, newB };
    }

    // changeLineSrc(lineId: string, srcId: string, srcOutlet: number) {
    //     const line = this.lines[lineId];
    //     // if (this.instance.getLinesByBox(srcId, line.destId, srcOutlet, line.destInlet).length > 0) return line;
    //     const oldSrc: [string, number] = [line.srcId, line.srcOutlet];
    //     const src: [string, number] = [srcId, srcOutlet];
    //     line.setSrc(src);
    //     this.emitGraphChanged();
    //     return { lineId, oldSrc, src };
    // }
    // changeLineDest(lineId: string, destId: string, destOutlet: number) {
    //     const line = this.lines[lineId];
    //     // if (this.getLinesByBox(line.srcId, destId, line.destInlet, destOutlet).length > 0) return line;
    //     const oldDest: [string, number] = [line.destId, line.destInlet];
    //     const dest: [string, number] = [destId, destOutlet];
    //     line.setDest(dest);
    //     this.emitGraphChanged();
    //     return { lineId, oldDest, dest };
    // }
    getLinesByAId(aId: string) {
        const result = [];
        for (let i = 0; i < this.boxes[aId].ios.length; i++) { // Array.fill fills the array with same instance
            result[i] = [];
        }
        for (const id in this.lines) {
            const line = this.lines[id];
            if (line && line.aId === aId) {
                const bIo = line.bIo;
                if (!result[bIo[1]])
                    result[bIo[1]] = [id];
                else
                    result[bIo[1]].push(id);
            }
        }
        return result;
    }
    getLinesByBId(bId: string) {
        const result = [];
        for (let i = 0; i < this.boxes[bId].ios.length; i++) { // Array.fill fills the array with same instance
            result[i] = [];
        }
        for (const id in this.lines) {
            const line = this.lines[id];
            if (line && line.bId === bId) {
                const aIo = line.aIo;
                if (!result[aIo[1]])
                    result[aIo[1]] = [id];
                else
                    result[aIo[1]].push(id);
            }
        }
        return result;
    }
    // getLinesBySrcID(srcId: string) {
    //     const result = [];
    //     for (let i = 0; i < this.boxes[srcId].outlets; i++) { // Array.fill fills the array with same instance
    //         result[i] = [];
    //     }
    //     for (const id in this.lines) {
    //         const line = this.lines[id];
    //         if (line && line.srcId === srcId) {
    //             const srcOutlet = line.srcOutlet;
    //             if (!result[srcOutlet]) result[srcOutlet] = [id];
    //             else result[srcOutlet].push(id);
    //         }
    //     }
    //     return result;
    // }
    // getLinesByDestID(destId: string) {
    //     const result = [];
    //     for (let i = 0; i < this.boxes[destId].inlets; i++) {
    //         result[i] = [];
    //     }
    //     for (const id in this.lines) {
    //         const line = this.lines[id];
    //         if (line && line.destId === destId) {
    //             const destInlet = line.destInlet;
    //             if (!result[destInlet]) result[destInlet] = [id];
    //             else result[destInlet].push(id);
    //         }
    //     }
    //     return result;
    // }
    getLinesByBox(aId: string, bId: string, aIo?: number, bIo?: number) {
        const result: string[] = [];
        let aIds: string[] = [];
        let bIds: string[] = [];
        const aIosWrapped = this.getLinesByAId(aId);
        if (aIo !== undefined)
            aIds = aIosWrapped[aIo];
        else
            aIosWrapped.forEach(el => aIds = aIds.concat(el));

        const bIosWrapped = this.getLinesByBId(bId);
        if (bIo !== undefined)
            bIds = bIosWrapped[bIo];
        else
            bIosWrapped.forEach(el => bIds = bIds.concat(el));

        if (!aIds || !bIds)
            return result;

        bIds.forEach(idOut => bIds.forEach(idIn => (idIn === idOut ? result.push(idIn) : undefined)));
        return result;
    }
    // getLinesByIo(boxId: string, io: number) {
    //     const box = this.boxes[boxId];
    //     if (!box || io > box.ios.length) {
    //         return [];
    //     }

    //     const lines = [];

    //     if (box.text.startsWith("tie")) {
    //         for (let key in this.lines) {
    //             let line = this.lines[key];
    //             if (line.aId === boxId || line.bId === boxId) {
    //                 lines.push(line);
    //             }
    //         }
    //     } else {
    //         for (let key in this.lines) {
    //             let line = this.lines[key];
    //             if ((line.aId === boxId && line.aIo[1] === io) || (line.bId === boxId && line.bIo[1] === io)) {
    //                 lines.push(line);
    //             }
    //         }
    //     }
    //     return lines;
    // }
    // getConnectedPins(boxId: string, io: number) {
    //     let lines = this.getLinesByIo(boxId, io);

    //     let all_boxes = lines.flatMap(line => [line.aIo, line.bIo]);
    //     let unique_boxes = Array.from(new Set(all_boxes));

    //     return unique_boxes.map(([id, io]) => this.boxes[id].meta.ios[io].pin);
    // }
    fn(data: any, inlet: number) {
        // this.emit("dataInput", { data, inlet });
    }
    inputAudio(input: number, buffer: Float32Array) {
        this.emitSync("audioInput", { input, buffer });
    }
    inputParam(param: string, buffer: Float32Array) {
        this.emitSync("paramInput", { param, buffer });
    }
    outputAudio(output: number, buffer: Float32Array) {
        this.emitSync("audioOutput", { output, buffer });
    }
    // outlet(outlet: number, data: any) {
    //     this.emit("dataOutput", { data, outlet });
    // }
    changeIO() {
        this.emit("ioChanged", this.meta);
    }
    get meta(): IHardwarePatcherMeta {
        const { metaFromPatcher } = this;
        return {
            name: this.props.name || "",
            icon: null,
            version: this.props.version || "",
            description: this.props.description || "",
            ...metaFromPatcher
        };
    }
    get metaFromPatcher(): Pick<IHardwarePatcherMeta, "args" | "props" | "patcherInlets" | "patcherOutlets"> {
        const inlets: Map<[string, number], IInletMeta> = new Map();
        const outlets: Map<[string, number], IOutletMeta> = new Map();
        for (const boxId in this.boxes) {

            const box = this.boxes[boxId];

            if (box.meta.patcherInlets) {
                for (const [index, inlet] of box.meta.patcherInlets.entries()) {
                    inlets.set([boxId, index], inlet);
                }
            }

            if (box.meta.patcherOutlets) {
                for (const [index, outlet] of box.meta.patcherOutlets.entries()) {
                    outlets.set([boxId, index], outlet);
                }
            }
        }
        // console.log(`inlets: ${JSON.stringify(Array.from(inlets.entries()))}, outlets: ${JSON.stringify(Array.from(outlets.entries()))}`);
        return { args: [], props: {}, patcherInlets: inlets, patcherOutlets: outlets };
    }
    log(message: string) {
        this.newLog("none", "Patcher", message, this);
    }
    error(message: string) {
        this.newLog("error", "Patcher", message, this);
    }
    newLog(errorLevel: TErrorLevel, title: string, message: string, emitter?: any) {
        this.env.newLog(errorLevel, title, message, emitter);
    }
    setProps(props: Partial<TPublicPatcherProps>) {
        let changed = false;
        const oldProps: Partial<TPublicPatcherProps> = {};
        for (const keyIn in props) {
            const key = keyIn as keyof TPublicPatcherProps;
            if (this.props[key] === props[key]) continue;
            changed = true;
            (oldProps as any)[key] = this.props[key];
            (this.props as any)[key] = props[key];
            this.emit(key, props[key]);
        }
        if (changed) {
            this.emit("propsChanged", { props, oldProps });
            this.emitChanged();
        }
    }
    get publicProps() {
        const { dependencies, bgColor, editingBgColor, grid, openInPresentation } = this.props;
        return { dependencies, bgColor, editingBgColor, grid, openInPresentation } as TPublicPatcherProps;
    }
    toString(spacing?: number) {
        const { props, meta } = this;
        const boxes: RawHardwarePatcher["boxes"] = {};
        const lines: RawHardwarePatcher["lines"] = {};

        const inlets = Array.from(meta.patcherInlets.entries()).map(([key, _]) => key);
        const outlets = Array.from(meta.patcherOutlets.entries()).map(([key, _]) => key);

        for (const id in this.boxes) {
            boxes[id] = this.boxes[id].toSerializable();
        }
        for (const id in this.lines) {
            lines[id] = this.lines[id].toSerializable();
        }
        return JSON.stringify({ boxes, lines, props, inlets, outlets }, undefined, spacing);
    }
    toSerializable(): RawHardwarePatcher {
        return JSON.parse(this.toString());
    }
    serialize() {
        return new Blob([this.toString()]).arrayBuffer();
    }
}
