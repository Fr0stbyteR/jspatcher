import type { SemanticICONS } from "semantic-ui-react";
import TypedEventEmitter from "../../../../utils/TypedEventEmitter";
import { stringifyError } from "../../../../utils/utils";
import Line from "../../Line";
import type Box from "../../Box";
import type Patcher from "../../Patcher";
import type { ProjectItemType, TempItemByType, SharedItemByType, TempItemType, TAudioNodeInletConnection, TAudioNodeOutletConnection } from "../../../types";
import type AbstractUI from "./AbstractHardwareUI";
import type { IJSPatcherEnv } from "../../../Env";

export const isJSPatcherObjectConstructor = (x: any): x is typeof AbstractObject => typeof x === "function" && x?.isJSPatcherObjectConstructor;

export const isJSPatcherObject = (x: any): x is AbstractObject => typeof x === "object" && x?.isJSPatcherObject;

export type TMetaType = "analog" | "digital" | "both";
export interface IIoMeta {
    isHot: boolean;
    type: TMetaType;
    enums?: string[];
    varLength?: boolean;
    description: string;
}
export type IIosMeta = IIosMeta[];
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
export interface IHardwarePatcherObjectMeta<P extends Record<string, any> = Record<string, any>> {
    name: string;
    icon: SemanticICONS; // semantic icon to display in UI
    version: string;
    description: string;
    ios: IIosMeta;
    args: IArgsMeta;
    props: IPropsMeta<P>;
    // isPatcherInlet: "data" | "audio" | "parameter" | false;
    // isPatcherOutlet: "data" | "audio" | false;
}

export interface ObjectUpdateOptions {
    /** The ID will be passed through update*, set* and *Updated events */
    id?: string;
    undoable?: boolean;
}

export type Data<T> = T extends IHardwarePatcherObject<infer D, any, any, any, any, any, any> ? D : never;
export type State<T> = T extends IHardwarePatcherObject<any, infer S, any, any, any, any, any> ? S : never;
export type Ios<T> = T extends IHardwarePatcherObject<any, any, infer IO, any, any, any> ? IO : never;
export type Args<T> = T extends IHardwarePatcherObject<any, any, any, infer A, any, any, any> ? A : never;
export type Props<T> = T extends IHardwarePatcherObject<any, any, any, any, infer P, any, any> ? P : never;
export type UIState<T> = T extends IHardwarePatcherObject<any, any, any, any, any, infer U, any> ? U : never;
export type EventMap<T> = T extends IHardwarePatcherObject<any, any, any, any, any, any, infer E> ? E : never;
export type TIoEvent<IO extends any[] = any[], $ extends keyof Pick<IO, number> = keyof Pick<IO, number>> = { io: $; data: IO[$] };
export type HardwarePatcherObjectEventMap<D, S, IO extends any[], A extends any[], P, U, E> = {
    /** Emitted before any connection */
    "preInit": never;
    /** Emitted after connections */
    "postInit": never;
    /** Emitted immediately when the editor request changes to the args */
    "updateArgs": Partial<A>;
    /** Emitted immediately when the editor request changes to the props */
    "updateProps": Partial<P>;
    /** Emitted immediately when the editor request changes to the state */
    "updateState": { id?: string; state: Partial<S> };
    /** The UI will listen to this event type */
    "updateUI": Partial<U> | never;
    /** Emitted if data is sent through a cable */
    "io": TIoEvent<IO>;
    /** Emitted when a new connection/disconnection is made on any I/O */
    // "connectedIo": { aIo: number; bIo: number; bBoxId: string; lineId: string; };
    // "disconnectedIo": { aIo: number; bIo: number; bBoxId: string; lineId: string; };

    "connectedIo": { io: number; otherIo: number; otherBox: string; lineId: string; };
    "disconnectedIo": { io: number; otherIo: number; otherBox: string; lineId: string; };


    /** Emitted when the object will be destroyed, attach a callback to clean up */
    "destroy": never;
    /** Emitted when the object's metadata is changed (by itself) */
    "metaUpdated": { oldMeta: IHardwarePatcherObjectMeta; meta: IHardwarePatcherObjectMeta };
    /** Emitted when the object's args is changed */
    "argsUpdated": { oldArgs: A; args: A };
    /** Emitted when the object's data is changed */
    "propsUpdated": { oldProps: Partial<P>; props: Partial<P> };
    /** Emitted when the object's data is changed (by itself) */
    "dataUpdated": { oldData: D; data: D };
    /** Emitted when the object's state is changed */
    "stateUpdated": { oldState: S; state: S; id?: string };
} & E;

/**
 * All JSPatcher Object should extends this class
 *
 * @template D serializable, type of `data` property, use `setData` to update. Data will be stored with the box in the serialized patcher. Will mark the patcher `dirty`.
 * @template S serializable, type of `state` property, use `setState` to update. State is temporary to the object instance. Can be updated from the host.
 * @template IO type of I/O as an array.
 * @template A serializable, type of args as an array.
 * @template P serializable, type of props as a map.
 * @template U type of UI state as a map, the UI will listen to any update of this map. If the object can be running on another thread, this should be serializable.
 * @template E type of additional event map
 */
export interface IHardwarePatcherObject<
    D extends {} = {},
    S extends {} = {},
    IO extends any[] = any[],
    A extends any[] = any[],
    P extends {} = {},
    U extends {} = {},
    E extends Partial<HardwarePatcherObjectEventMap<D, S, IO, A, P, U, {}>> & Record<string, any> = {}
> extends TypedEventEmitter<HardwarePatcherObjectEventMap<D, S, IO, A, P, U, E>> {
    /** Should be true */
    readonly isJSPatcherObject: true;
    /** Unique identifier of the object */
    readonly id: string;
    /** constructor (class) name */
    readonly class: string;
    /** the patcher that the object lives in */
    readonly patcher: Patcher;
    /** Patcher constructor */
    readonly Patcher: typeof Patcher;
    /** the box that the object lives in */
    readonly box: Box<this>;
    /** the env that the object lives in */
    readonly env: IJSPatcherEnv;
    readonly audioCtx?: AudioContext;
    readonly meta: IHardwarePatcherObjectMeta<P>;
    setMeta(metaIn: Partial<IHardwarePatcherObjectMeta>): void;
    /** Serializable, use `setState` to update. State is temporary to the object instance. Can be updated from the host. */
    state: S;
    setState(stateIn: Partial<S>, id?: string): void;
    /** Serializable, type of `data` property, use `setData` to update. Data will be stored with the box in the serialized patcher. */
    readonly data: D;
    setData(dataIn: Partial<D>): void;
    /** Get all props from box, if not defined, get from metadata default */
    readonly props: Partial<P>;
    /** Get prop value from box, if not defined, get from metadata default. */
    getProp<K extends keyof P = keyof P>(key: K): P[K];
    setProps(props: Partial<P>): void;
    readonly args: Partial<A>;
    setArgs(args: Partial<A>): void;
    ios: number;
    readonly ioLines: Set<Line>[];
    // inletAudioConnections: TAudioNodeInletConnection<AudioNode | AudioParam>[];
    // outletAudioConnections: TAudioNodeOutletConnection[];

    // for box
    /** Will be called just after constructed */
    init(): Promise<void>;
    /** Will be called after the object attached to box */
    postInit(): Promise<void>;
    /** Will be called when need to change arguments */
    updateArgs(args: A, options?: ObjectUpdateOptions): Promise<void>;
    /** Will be called when need to change properties */
    updateProps(props: Partial<P>, options?: ObjectUpdateOptions): Promise<void>;
    /** Will be called when need to change state */
    updateState(state: Partial<S>, options?: ObjectUpdateOptions): Promise<void>;
    /** Main function when receive data from an I/O (base 0). */
    fn<$ extends number = number>(io: $, data: IO[$]): void;
    /** Called when object will be destroyed. */
    destroy(): Promise<void>;
    // called when inlet or outlet are connected or disconnected
    // connectedIo(aIo: number, bIo: number, bBoxId: string, lineId: string): void;
    // disconnectedIo(aIo: number, bIo: number, bBoxId: string, lineId: string): void;

    connectedIo(io: number, otherIo: number, otherBox: string, lineId: string): void;
    disconnectedIo(io: number, otherIo: number, otherBox: string, lineId: string): void;
    /** Highlight the UI box. */
    highlight(): void;

    // for developer
    /** Update UI's React State. */
    updateUI(state: Partial<U>): void;
    /** Output data with ith outlet. */
    outlet<$ extends number>(io: $, data: IO[$]): void;
    // /**
    //  * Outlet all values in an array with corresponding index,
    //  * use sparse array to omit an outlet,
    //  * `[, 1]` will outlet 1 on second outlet,
    //  * but `[undefined, 1]` will also outlet undefined on first outlet
    //  */
    // outletAll(outputs: Partial<O>): void;
    /** Record an undoable operation to the patcher history */
    undoable(e: { oldArgs?: A; args?: A; oldProps?: Partial<P>; props?: Partial<P>; oldState?: S; state?: S }): void;
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
export declare const IHardwarePatcherObject: {
    /** Should be true */
    readonly isJSPatcherObjectConstructor: true;
    /** div will have class "packageName" "packageName-objectName" */
    package: string;
    readonly _name: string;
    icon: SemanticICONS;
    author: string;
    version: string;
    description: string;
    ios: IIosMeta;
    args: IArgsMeta;
    props: IPropsMeta;
    // isPatcherInlet: "data" | "audio" | false;
    // isPatcherOutlet: "data" | "audio" | false;
    readonly meta: IHardwarePatcherObjectMeta;
    /**
     * The UI that the object uses to display in the patcher, not available in other threads.
     * is `BaseUI` by default
     */
    UI?: typeof AbstractUI;
    new (box: Box, patcher: Patcher): IHardwarePatcherObject;
};

export interface AnyJSPatcherObject extends IHardwarePatcherObject<Record<string, any>, Record<string, any>, any[], any[], Record<string, any>, Record<string, any>, Record<string, any>> {}

export default abstract class AbstractObject<
    D extends {} = {},
    S extends {} = {},
    IO extends any[] = any[],
    A extends any[] = any[],
    P extends {} = {},
    U extends {} = {},
    E extends Partial<HardwarePatcherObjectEventMap<D, S, IO, A, P, U, {}>> & Record<string, any> = {}
> extends TypedEventEmitter<HardwarePatcherObjectEventMap<D, S, IO, A, P, U, E>> implements IHardwarePatcherObject<D, S, IO, A, P, U, E> {
    static readonly isJSPatcherObjectConstructor = true as const;
    static package = "Base";
    static get _name() {
        return this.name;
    }
    static icon = null as SemanticICONS;
    static author = "";
    static version = "0.0.0";
    static description = "";
    static ios: IIosMeta = [];
    static args: IArgsMeta = [];
    static props: IPropsMeta = {};
    static isPatcherInlet: "data" | "audio" | false = false;
    static isPatcherOutlet: "data" | "audio" | false = false;
    static get meta(): IHardwarePatcherObjectMeta {
        return {
            name: this._name,
            icon: this.icon, // semantic icon to display in UI
            version: this.version,
            description: this.description,
            ios: this.ios,
            args: this.args,
            props: this.props,
        };
    }
    static UI: typeof AbstractUI;

    readonly isJSPatcherObject = true as const;
    readonly id: string;
    get class() {
        return this.constructor.name;
    }
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
    get env() {
        return this.patcher.env;
    }
    get audioCtx() {
        return this.patcher.audioCtx;
    }
    private _meta = (this.constructor as typeof AbstractObject).meta as IHardwarePatcherObjectMeta<P>;
    get meta(): IHardwarePatcherObjectMeta<P> {
        return this._meta;
    }
    setMeta(metaIn: Partial<IHardwarePatcherObjectMeta<P>>) {
        const oldMeta = { ...this.meta };
        this._meta = Object.assign(this.meta, metaIn);
        this.emit("metaUpdated", { oldMeta, meta: { ...this.meta } });
    }
    state: S;
    setState = (stateIn: Partial<S>, id?: string) => {
        const oldState = { ...this.state };
        this.state = Object.assign(this.state, stateIn);
        this.emit("stateUpdated", { oldState, state: { ...this.state }, id });
    };
    get data(): D {
        return this._box.data;
    }
    setData(dataIn: Partial<D>) {
        const oldData = { ...this._box.data };
        this._box.data = Object.assign(this.data, dataIn) as any;
        this.emit("dataUpdated", { oldData, data: { ...this.data } });
    }
    get props(): Partial<P> {
        const props: Partial<P> = {};
        for (const key in this.meta.props) {
            props[key as keyof P] = this.getProp(key as keyof P);
        }
        return props;
    }
    getProp<K extends keyof P = keyof P>(key: K): P[K] {
        if (key === "rect") return this.box.rect as any;
        if (key === "presentationRect") return this.box.presentationRect as any;
        if (key === "background") return this.box.background as any;
        if (key === "presentation") return this.box.presentation as any;
        return typeof this.box.props[key] === "undefined" ? this.meta.props[key].default : this.box.props[key];
    }
    setProps = (propsIn: Partial<P>) => {
        const keys = Object.keys(propsIn);
        const oldProps = { ...this.props } as Partial<P>;
        this.box.update({ props: propsIn });
        const props = { ...this.props } as Partial<P>;
        for (const key in oldProps) {
            if (keys.indexOf(key) === -1) {
                delete oldProps[key];
                delete props[key];
            }
        }
        this.emit("propsUpdated", { oldProps, props });
    };
    get args(): Partial<A> {
        return this.box.args as any;
    }
    setArgs = (args: Partial<A>) => {
        const oldArgs = this.args.slice() as A;
        this.box.update({ args });
        this.emit("argsUpdated", { oldArgs, args: this.args.slice() as A });
    };
    get ios() {
        return this._box.ios;
    }
    set ios(i: number) {
        this._box.setIos(i);
    }
    get ioLines() {
        return this._box.ioLines;
    }
    inletAudioConnections: TAudioNodeInletConnection[] = [];
    outletAudioConnections: TAudioNodeOutletConnection[] = [];
    constructor(box: Box, patcher: Patcher) {
        super();
        // line connected = metaChange event subscribed
        // patcher object outside, use _ for prevent recursive stringify
        this._patcher = patcher;
        // the box which create this instance, use _ for prevent recursive stringify
        this._box = box as Box<this>;
        this.id = this.env.generateId(this);
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
    async updateArgs(args: A, options?: ObjectUpdateOptions) {
        if (args?.length) {
            const oldArgs = this.args.slice() as A;
            await this.emit("updateArgs", args);
            if (options?.undoable) this.undoable({ oldArgs, args: this.args.slice() as A });
        }
    }
    async updateProps(propsIn: Partial<P>, options?: ObjectUpdateOptions) {
        if (propsIn && Object.keys(propsIn).length) {
            const keys = Object.keys(propsIn);
            const oldProps = { ...this.props };
            await this.emit("updateProps", propsIn);
            const props = { ...this.props };
            for (const key in oldProps) {
                if (keys.indexOf(key) === -1) {
                    delete oldProps[key];
                    delete props[key];
                }
            }
            if (options?.undoable) this.undoable({ oldProps, props });
        }
    }
    async updateState(state: Partial<S>, options?: ObjectUpdateOptions) {
        if (state && Object.keys(state).length) {
            const oldState = { ...this.state };
            await this.emit("updateState", { id: options?.id, state });
            if (options?.undoable) this.undoable({ oldState, state: { ...this.state } });
        }
    }
    fn<$ extends keyof Pick<IO, number> = keyof Pick<IO, number>>(io: $, data: IO[$]) {
        if (io === 0) { // allow change props via first inlet with an props object
            if (data !== null && typeof data === "object") {
                const propsInKeys = Object.keys(data);
                const propsKeys = Object.keys(this.meta.props);
                if (propsInKeys.length && propsInKeys.every(k => propsKeys.indexOf(k) !== -1)) {
                    this.updateProps(data);
                    return;
                }
            }
        }
        this.emit("inlet", { data, io });
    }
    outlet<$ extends keyof Pick<IO, number>>(io: $, data: IO[$]) {
        if (io >= this.outlets) return;
        Array.from(this.outletLines[outlet]).sort(Line.compare).map(line => line.pass(data));
    }
    // outletAll(outputs: Partial<O>) {
    //     for (let i = outputs.length - 1; i >= 0; i--) {
    //         if (i in outputs) this.outlet(i, outputs[i]);
    //     }
    // }
    undoable(e: { oldArgs?: A; args?: A; oldProps?: Partial<P>; props?: Partial<P>; oldState?: S; state?: S }) {
        this.box.undoable(e as any);
    }
    async destroy() {
        await this.emit("destroy");
    }
    connectedIo(io: number, otherIo: number, otherBox: string, lineId: string): void {
        this.emit("connectedIo", { io, otherIo, otherBox, lineId });
    }
    disconnectedIo(io: number, otherIo: number, otherBox: string, lineId: string): void {
        this.emit("disconnectedIo", { io, otherIo, otherBox, lineId });
    }
    // connectedIo(aIo: number, bIo: number, bBoxId: string, lineId: string): void {
    //     this.emit("connectedIo", { aIo, bIo, bBoxId, lineId })
    // }
    // disconnectedIo(aIo: number, bIo: number, bBoxId: string, lineId: string): void {
    //     this.emit("disconnectedIo", { aIo, bIo, bBoxId, lineId })
    // }
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
}
