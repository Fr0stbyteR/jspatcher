import type { SemanticICONS } from "semantic-ui-react";
import TypedEventEmitter from "../../utils/TypedEventEmitter";
import { stringifyError } from "../../utils/utils";
import Line from "../patcher/Line";
import type Box from "../patcher/Box";
import type Patcher from "../patcher/Patcher";
import type { ProjectItemType, TempItemByType, SharedItemByType, TempItemType, TAudioNodeInletConnection, TAudioNodeOutletConnection } from "../types";
import type { AbstractUI } from "./BaseUI";

export const isJSPatcherObjectConstructor = (x: any): x is typeof AbstractObject => typeof x === "function" && x?.isJSPatcherObjectConstructor;

export const isJSPatcherObject = (x: any): x is AbstractObject => typeof x === "object" && x?.isJSPatcherObject;

export type TMetaType = "anything" | "signal" | "object" | "number" | "boolean" | "string" | "function" | "bang" | "color" | "enum";
export interface IInletMeta {
    isHot: boolean;
    type: TMetaType;
    enums?: string[];
    varLength?: boolean;
    description: string;
}
export type IInletsMeta = IInletMeta[];
export interface IOutletMeta {
    type: TMetaType;
    enums?: string[];
    varLength?: boolean;
    description: string;
}
export type IOutletsMeta = IOutletMeta[];
export interface IArgMeta {
    type: TMetaType;
    enums?: string[];
    optional: boolean;
    default?: any;
    varLength?: boolean;
    description: string;
}
export type IArgsMeta = IArgMeta[];
export interface IPropMeta<T extends any = any> {
    type: TMetaType;
    enums?: T[];
    default: T;
    group?: string;
    description: string;
    isUIState?: boolean;
}
export type IPropsMeta<T extends Record<string, any> = Record<string, any>> = { [K in keyof T]: IPropMeta<T[K]> };
export interface IJSPatcherObjectMeta<P extends Record<string, any> = Record<string, any>> {
    package: string; // div will have class "package-name" "package-name-objectname"
    name: string;
    icon: SemanticICONS; // semantic icon to display in UI
    author: string;
    version: string;
    description: string;
    inlets: IInletsMeta;
    outlets: IOutletMeta[];
    args: IArgMeta[];
    props: IPropsMeta<P>;
}

export type Data<T> = T extends AbstractObject<infer D, any, any, any, any, any, any, any> ? D : never;
export type State<T> = T extends AbstractObject<any, infer S, any, any, any, any, any, any> ? S : never;
export type Inputs<T> = T extends AbstractObject<any, any, infer I, any, any, any, any, any> ? I : never;
export type Outputs<T> = T extends AbstractObject<any, any, any, infer O, any, any, any, any> ? O : never;
export type Args<T> = T extends AbstractObject<any, any, any, any, infer A, any, any, any> ? A : never;
export type Props<T> = T extends AbstractObject<any, any, any, any, any, infer P, any, any> ? P : never;
export type UIState<T> = T extends AbstractObject<any, any, any, any, any, any, infer U, any> ? U : never;
export type EventMap<T> = T extends AbstractObject<any, any, any, any, any, any, any, infer E> ? E : never;
export type TInletEvent<I extends any[] = any[], $ extends keyof Pick<I, number> = keyof Pick<I, number>> = { inlet: $; data: I[$] };
export type TOutletEvent<O extends any[] = any[], $ extends keyof Pick<O, number> = keyof Pick<O, number>> = { outlet: $; data: O[$] };
export type JSPatcherObjectEventMap<D, S, I extends any[], A extends any[], P, U, E> = {
    /** Emitted before any connection */
    "preInit": never;
    /** Emitted after connections */
    "postInit": never;
    /** Emitted on any changes to the args/props */
    "update": { args?: Partial<A>; props?: Partial<P> };
    /** Emitted immediately after update if there are any changes to the args */
    "updateArgs": Partial<A>;
    /** Emitted immediately after update if there are any changes to the props */
    "updateProps": Partial<P>;
    /** The UI will listen to this event type. */
    "updateUI": Partial<U> | never;
    /** Emitted when the object's state should be changed (by others). */
    "setState": Partial<S>;
    /** Emitted if received any input */
    "inlet": TInletEvent<I>;
    /** Emitted when a new connection/disconnection is made on any I/O */
    "connectedInlet": { inlet: number; srcBoxId: string; srcOutlet: number; lineId: string };
    "connectedOutlet": { outlet: number; destBoxId: string; destInlet: number; lineId: string };
    "disconnectedInlet": { inlet: number; srcBoxId: string; srcOutlet: number; lineId: string };
    "disconnectedOutlet": { outlet: number; destBoxId: string; destInlet: number; lineId: string };
    /** Emitted when the object will be destroyed, attach a callback to clean up. */
    "destroy": never;
    /** Emitted when the object's metadata is changed (by itself). */
    "metaChanged": IJSPatcherObjectMeta;
    /** Emitted when the object's data is changed (by itself). */
    "dataUpdated": Partial<D>;
    /** Emitted when the object's state is changed (by itself). */
    "stateUpdated": Partial<S>;
} & E;

/**
 * All JSPatcher Object should extends this class
 *
 * @template D serializable, type of `data` property, use `setData` to update. Data will be stored with the box in the serialized patcher.
 * @template S serializable, type of `state` property, use `setState` to update. State is temporary to the object instance. Can be updated from the host.
 * @template I type of inlets as an array.
 * @template O type of outlets as an array.
 * @template A serializable, type of args as an array.
 * @template P serializable, type of props as a map.
 * @template U type of UI state as a map, the UI will listen to any update of this map. If the object can be running on another thread, this should be serializable.
 * @template E type of additional event map
 */
export interface IJSPatcherObject<
    D extends {} = {},
    S extends {} = {},
    I extends any[] = any[],
    O extends any[] = any[],
    A extends any[] = any[],
    P extends {} = {},
    U extends {} = {},
    E extends Partial<JSPatcherObjectEventMap<D, S, I, A, P, U, {}>> & Record<string, any> = {}
> extends TypedEventEmitter<JSPatcherObjectEventMap<D, S, I, A, P, U, E>> {
    /** Should be true */
    readonly isJSPatcherObject: true;
    /** constructor (class) name */
    readonly class: string;
    /** the patcher that the object lives in */
    readonly patcher: Patcher;
    /** Patcher constructor */
    readonly Patcher: typeof Patcher;
    /** the box that the object lives in */
    readonly box: Box<this>;
    readonly audioCtx?: AudioContext;
    meta: IJSPatcherObjectMeta<P>;
    setMeta(metaIn: Partial<IJSPatcherObjectMeta>): void;
    /** Serializable, use `setState` to update. State is temporary to the object instance. Can be updated from the host. */
    state: S;
    setState(stateIn: Partial<S>): void;
    /** Serializable, type of `data` property, use `setData` to update. Data will be stored with the box in the serialized patcher. */
    data: D;
    setData(dataIn: Partial<D>): void;
    /** Get all props from box, if not defined, get from metadata default */
    readonly props: Partial<P>;
    /** Get prop value from box, if not defined, get from metadata default. */
    getProp<K extends keyof P = keyof P>(key: K): P[K];
    inlets: number;
    outlets: number;
    readonly inletLines: Set<Line>[];
    readonly outletLines: Set<Line>[];
    inletAudioConnections: TAudioNodeInletConnection<AudioNode | AudioParam>[];
    outletAudioConnections: TAudioNodeOutletConnection[];

    // for box
    /** Will be called just after constructed */
    init(): Promise<void>;
    /** Will be called after the object attached to box */
    postInit(): Promise<void>;
    /** Will be called when arguments and properties are changed. */
    update(args?: Partial<A>, props?: Partial<P>): Promise<void>;
    /** Main function when receive data from a inlet (base 0). */
    fn<$ extends number = number>(inlet: $, data: I[$]): void;
    /** Called when object will be destroyed. */
    destroy(): Promise<void>;
    // called when inlet or outlet are connected or disconnected
    connectedInlet(inlet: number, srcBoxId: string, srcOutlet: number, lineId: string): void;
    disconnectedInlet(inlet: number, srcBoxId: string, srcOutlet: number, lineId: string): void;
    connectedOutlet(outlet: number, destBoxId: string, destInlet: number, lineId: string): void;
    disconnectedOutlet(outlet: number, destBoxId: string, destInlet: number, lineId: string): void;
    /** Highlight the UI box. */
    highlight(): void;

    // for developer
    /** Update UI's React State. */
    updateUI(state: Partial<U>): void;
    /** Store the input args and props with the box. */
    updateBox: (e: { args?: Partial<A>; props?: Partial<P> }) => void;
    /** Output data with ith outlet. */
    outlet<$ extends number>(outlet: $, data: O[$]): void;
    /**
     * Outlet all values in an array with corresponding index,
     * use sparse array to omit an outlet,
     * `[, 1]` will outlet 1 on second outlet,
     * but `[undefined, 1]` will also outlet undefined on first outlet
     */
    outletAll(outputs: Partial<O>): void;
    /**
     * Get a shared item from files or temp
     * If no ID provided, this will create a new key in temp
     * if no such ID found in files or in temp, will put the result of data() into it.
     */
    getSharedItem<T extends ProjectItemType>(id?: string, type?: T, data?: () => Promise<TempItemByType<T>["data"]>, onceCreate?: (aitem: SharedItemByType<T>) => any): Promise<{ id: string; item: SharedItemByType<T>; newItem: boolean; off?: () => any }>;
    // output to console
    post(data: any): void;
    error(data: any): void;
    info(data: any): void;
    warn(data: any): void;
    connectAudio(): void;
    connectAudioInlet(portIn?: number): void;
    connectAudioOutlet(portIn?: number): void;
    disconnectAudio(): void;
    disconnectAudioInlet(portIn?: number): void;
    disconnectAudioOutlet(portIn?: number): void;
    applyBPF(param: AudioParam, bpf: number[][]): void;
}
export declare const IJSPatcherObject: {
    /** Should be true */
    readonly isJSPatcherObjectConstructor: true;
    /** div will have class "packageName" "packageName-objectName" */
    package: string;
    readonly _name: string;
    icon: SemanticICONS;
    author: string;
    version: string;
    description: string;
    inlets: IInletsMeta;
    outlets: IOutletsMeta;
    args: IArgsMeta;
    props: IPropsMeta;
    readonly meta: IJSPatcherObjectMeta;
    /** The UI that the object uses to display in the patcher, not available in other threads. */
    UI?: typeof AbstractUI;
    new (box: Box, patcher: Patcher): IJSPatcherObject;
};

export default abstract class AbstractObject<
    D extends {} = {},
    S extends {} = {},
    I extends any[] = any[],
    O extends any[] = any[],
    A extends any[] = any[],
    P extends {} = {},
    U extends {} = {},
    E extends Partial<JSPatcherObjectEventMap<D, S, I, A, P, U, {}>> & Record<string, any> = {}
> extends TypedEventEmitter<JSPatcherObjectEventMap<D, S, I, A, P, U, E>> implements IJSPatcherObject<D, S, I, O, A, P, U, E> {
    static readonly isJSPatcherObjectConstructor = true as const;
    static package = "Base";
    static get _name() {
        return this.name;
    }
    static icon = null as SemanticICONS;
    static author = "";
    static version = "0.0.0";
    static description = "";
    static inlets: IInletsMeta = [];
    static outlets: IOutletsMeta = [];
    static args: IArgsMeta = [];
    static props: IPropsMeta = {};
    static get meta(): IJSPatcherObjectMeta {
        return {
            package: this.package, // div will have class "package-name" "package-name-objectname"
            name: this._name,
            icon: this.icon, // semantic icon to display in UI
            author: this.author,
            version: this.version,
            description: this.description,
            inlets: this.inlets,
            outlets: this.outlets,
            args: this.args,
            props: this.props
        };
    }
    static UI: typeof AbstractUI;

    readonly isJSPatcherObject = true as const;
    protected readonly _patcher: Patcher;
    get patcher() {
        return this._patcher;
    }
    get Patcher() {
        return this._patcher.constructor as typeof Patcher;
    }
    protected readonly _box: Box<this>;
    get box() {
        return this._box;
    }
    get audioCtx() {
        return this.patcher.audioCtx;
    }
    private _meta = (this.constructor as typeof AbstractObject).meta as IJSPatcherObjectMeta<P>;
    get meta() {
        return this._meta;
    }
    set meta(metaIn: IJSPatcherObjectMeta<P>) {
        this._meta = metaIn;
        this.emit("metaChanged", this._meta);
    }
    setMeta(metaIn: Partial<IJSPatcherObjectMeta<P>>) {
        this.meta = Object.assign(this.meta, metaIn);
    }
    state: S;
    setState(stateIn: Partial<S>) {
        this.state = Object.assign(this.state, stateIn);
        this.emit("stateUpdated", this.state);
    }
    get data() {
        return this._box.data;
    }
    set data(dataIn: D) {
        this._box.data = dataIn as any;
        this.emit("dataUpdated", dataIn);
    }
    setData(dataIn: Partial<D>) {
        this.data = Object.assign(this.data, dataIn);
    }
    async getSharedItem<T extends ProjectItemType>(id = this.box.id, type: T = "unknown" as T, data?: () => Promise<TempItemByType<T>["data"]>, onceCreate?: (aitem: SharedItemByType<T>) => any): Promise<{ id: string; item: SharedItemByType<T>; newItem: boolean; off?: () => any }> {
        let item: SharedItemByType<T>;
        let newItem = false;
        const { fileMgr, tempMgr } = this.patcher.env;
        try {
            item = fileMgr.getProjectItemFromPath(id) as SharedItemByType<T>;
        } catch {
            try {
                item = tempMgr.getProjectItemFromPath(id) as SharedItemByType<T>;
            } catch {
                if (data) {
                    const d = await data();
                    try {
                        item = await tempMgr.root.addFile(id, d, type as TempItemType) as SharedItemByType<T>;
                        newItem = true;
                    } catch {
                        item = tempMgr.getProjectItemFromPath(id) as SharedItemByType<T>;
                    }
                } else {
                    if (onceCreate) {
                        const off = () => {
                            fileMgr.off("treeChanged", handleFileMgrTreeChanged);
                            tempMgr.off("treeChanged", handleTempMgrTreeChanged);
                        };
                        const handleFileMgrTreeChanged = () => {
                            try {
                                item = fileMgr.getProjectItemFromPath(id) as SharedItemByType<T>;
                                off();
                                onceCreate(item);
                            } catch {}
                        };
                        const handleTempMgrTreeChanged = () => {
                            try {
                                item = tempMgr.getProjectItemFromPath(id) as SharedItemByType<T>;
                                off();
                                onceCreate(item);
                            } catch {}
                        };
                        fileMgr.on("treeChanged", handleFileMgrTreeChanged);
                        tempMgr.on("treeChanged", handleTempMgrTreeChanged);
                        return { id, item: null, newItem, off };
                    }
                    return { id, item: null, newItem };
                }
            }
        }
        if (item.type !== type) throw new Error(`Getting shared item ${id}, but returned item is of type ${item.type}, not of type ${type}.`);
        return { id, item, newItem };
    }
    getProp<K extends keyof P = keyof P>(key: K): P[K] {
        if (key === "rect") return this.box.rect as any;
        if (key === "presentationRect") return this.box.presentationRect as any;
        if (key === "background") return this.box.background as any;
        if (key === "presentation") return this.box.presentation as any;
        return typeof this.box.props[key] === "undefined" ? this.meta.props[key].default : this.box.props[key];
    }
    get props(): Partial<P> {
        const props: Partial<P> = {};
        for (const key in this.meta.props) {
            props[key as keyof P] = this.getProp(key as keyof P);
        }
        return props;
    }
    get inlets() {
        return this._box.inlets;
    }
    set inlets(i: number) {
        this._box.setInlets(i);
    }
    get outlets() {
        return this._box.outlets;
    }
    set outlets(i: number) {
        this._box.setOutlets(i);
    }
    get outletLines() {
        return this._box.outletLines;
    }
    get inletLines() {
        return this._box.inletLines;
    }
    get class() {
        return this.constructor.name;
    }
    constructor(box: Box, patcher: Patcher) {
        super();
        // line connected = metaChange event subscribed
        // patcher object outside, use _ for prevent recursive stringify
        this._patcher = patcher;
        // the box which create this instance, use _ for prevent recursive stringify
        this._box = box as Box<this>;
    }
    async init() {
        // process args and props
        this.subscribe();
        await this.emit("preInit");
    }
    async postInit() {
        await this.emit("postInit");
    }
    /** Do everything here */
    subscribe(): void {}
    updateUI(state: Partial<U>) {
        this.emit("updateUI", state);
    }
    updateBox = (e: { args?: Partial<A>; props?: Partial<P> }) => {
        this.box.update(e);
    };
    async update(args?: Partial<A>, props?: Partial<P>) {
        const promises: Promise<void[]>[] = [];
        promises.push(this.emit("update", { args, props }));
        if (args && args.length) promises.push(this.emit("updateArgs", args));
        if (props && Object.keys(props).length) promises.push(this.emit("updateProps", props));
        await Promise.all(promises);
    }
    fn<$ extends keyof Pick<I, number> = keyof Pick<I, number>>(inlet: $, data: I[$]) {
        if (inlet === 0) { // allow change props via first inlet with an props object
            if (data !== null && typeof data === "object") {
                const propsInKeys = Object.keys(data);
                const propsKeys = Object.keys(this.meta.props);
                if (propsInKeys.length && propsInKeys.every(k => propsKeys.indexOf(k) !== -1)) {
                    this.update(undefined, data);
                    return;
                }
            }
        }
        this.emit("inlet", { data, inlet });
    }
    outlet<$ extends keyof Pick<O, number>>(outlet: $, data: O[$]) {
        if (outlet >= this.outlets) return;
        Array.from(this.outletLines[outlet]).sort(Line.compare).map(line => line.pass(data));
    }
    outletAll(outputs: Partial<O>) {
        for (let i = outputs.length - 1; i >= 0; i--) {
            if (i in outputs) this.outlet(i, outputs[i]);
        }
    }
    async destroy() {
        await this.emit("destroy");
    }
    connectedOutlet(outlet: number, destBoxId: string, destInlet: number, lineId: string) {
        this.emit("connectedOutlet", { outlet, destBoxId, destInlet, lineId });
    }
    connectedInlet(inlet: number, srcBoxId: string, srcOutlet: number, lineId: string) {
        this.emit("connectedInlet", { inlet, srcBoxId, srcOutlet, lineId });
    }
    disconnectedOutlet(outlet: number, destBoxId: string, destInlet: number, lineId: string) {
        this.emit("disconnectedOutlet", { outlet, destBoxId, destInlet, lineId });
    }
    disconnectedInlet(inlet: number, srcBoxId: string, srcOutlet: number, lineId: string) {
        this.emit("disconnectedInlet", { inlet, srcBoxId, srcOutlet, lineId });
    }
    post(data: any) {
        this._patcher.newLog("none", this.meta.name, stringifyError(data), this._box);
    }
    error(data: any) {
        const s = stringifyError(data);
        this._patcher.newLog("error", this.meta.name, s, this._box);
        this._box.error(s);
    }
    info(data: any) {
        this._patcher.newLog("info", this.meta.name, stringifyError(data), this._box);
    }
    warn(data: any) {
        this._patcher.newLog("warn", this.meta.name, stringifyError(data), this._box);
    }
    highlight() {
        this._box.highlight();
    }

    inletAudioConnections: TAudioNodeInletConnection[] = [];
    outletAudioConnections: TAudioNodeOutletConnection[] = [];
    connectAudio() {
        this.box.allLines.forEach(line => line.enable());
    }
    connectAudioInlet(portIn?: number) {
        this.inletLines.forEach((lines, port) => {
            if (typeof portIn === "undefined" || port === portIn) lines.forEach(line => line.enable());
        });
    }
    connectAudioOutlet(portIn?: number) {
        this.outletLines.forEach((lines, port) => {
            if (typeof portIn === "undefined" || port === portIn) lines.forEach(line => line.enable());
        });
    }
    disconnectAudio() {
        this.box.allLines.forEach(line => line.disable());
    }
    disconnectAudioInlet(portIn?: number) {
        this.inletLines.forEach((lines, port) => {
            if (typeof portIn === "undefined" || port === portIn) lines.forEach(line => line.disable());
        });
    }
    disconnectAudioOutlet(portIn?: number) {
        this.outletLines.forEach((lines, port) => {
            if (typeof portIn === "undefined" || port === portIn) lines.forEach(line => line.disable());
        });
    }
    applyBPF(param: AudioParam, bpf: number[][]) {
        const { audioCtx } = this;
        const { currentTime } = audioCtx;
        param.cancelScheduledValues(currentTime);
        param.setValueAtTime(param.value, currentTime);
        let t = 0;
        bpf.forEach((a) => {
            if (a.length === 1) {
                param.setValueAtTime(a[0], currentTime + t);
            } else if (a.length > 1) {
                t += a[1];
                param.linearRampToValueAtTime(a[0], currentTime + t);
            }
        });
    }
}
