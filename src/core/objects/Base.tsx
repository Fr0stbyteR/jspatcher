import { SemanticICONS } from "semantic-ui-react";
import { stringifyError } from "../../utils/utils";
import { TypedEventEmitter } from "../../utils/TypedEventEmitter";
import Patcher from "../patcher/Patcher";
import Box from "../patcher/Box";
import Line from "../patcher/Line";
import { TAudioNodeInletConnection, TAudioNodeOutletConnection, TMeta, ObjectEventMap, TRect, TempItemType, SharedItemByType, TempItemByType } from "../types";
import { BaseUI, DefaultUI, BaseUIState, DefaultUIState } from "./BaseUI";
import "./Default.scss";
import "./Base.scss";

export const isJSPatcherObjectConstructor = (x: any): x is typeof AbstractObject => typeof x === "function" && x?.isJSPatcherObjectConstructor;

export const isJSPatcherObject = (x: any): x is AbstractObject => typeof x === "object" && x?.isJSPatcherObject;

/**
 * All JSPatcher Object should extends this class
 *
 * @template D type of `data` property
 * @template S type of `state` property
 * @template I type of inlets as an array
 * @template O type of outlets as an array
 * @template A type of args as an array
 * @template P type of props as a map
 * @template U type of UI state as a map
 * @template E type of additional event map
 */
export abstract class AbstractObject<
    D extends {} = {}, S extends {} = {},
    I extends any[] = any[], O extends any[] = any[],
    A extends any[] = any[], P extends {} = {},
    U extends {} = {}, E extends Partial<ObjectEventMap<D, S, I, A, P, U, {}>> & Record<string, any> = {}
> extends TypedEventEmitter<ObjectEventMap<D, S, I, A, P, U, E>> {
    /**
     * Should be true in the JSPatcher Object Constructor
     */
    static isJSPatcherObjectConstructor = true as const;
    static package = "Base"; // div will have class "packageName" "packageName-objectName"
    static get _name() {
        return this.name;
    }
    static icon = null as SemanticICONS;
    static author = "";
    static version = "0.0.0";
    static description = "";
    static inlets: TMeta["inlets"] = [];
    static outlets: TMeta["outlets"] = [];
    static args: TMeta["args"] = [];
    static props: TMeta["props"] = {};
    static get meta(): TMeta {
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
    /**
     * The UI that the object uses to display in the patcher
     */
    static UI: typeof BaseUI = BaseUI;

    /**
     * should be true in a JSPatcher object instance
     */
    isJSPatcherObject = true as const;
    protected readonly _patcher: Patcher;
    /**
     * the patcher that the object lives in
     */
    get patcher() {
        return this._patcher;
    }
    /**
     * Patcher constructor
     */
    get Patcher() {
        return this._patcher.constructor as typeof Patcher;
    }
    protected readonly _box: Box<this>;
    /**
     * the box that the object lives in
     */
    get box() {
        return this._box;
    }
    get audioCtx() {
        return this.patcher.audioCtx;
    }
    private _meta = (this.constructor as typeof AbstractObject).meta;
    get meta() {
        return this._meta;
    }
    set meta(metaIn: TMeta) {
        this._meta = metaIn;
        this.emit("metaChanged", this._meta);
    }
    setMeta(metaIn: Partial<TMeta>) {
        this.meta = Object.assign(this.meta, metaIn);
    }
    /**
     * should save all temporary variables here
     */
    state: S;
    setState(stateIn: Partial<S>) {
        this.state = Object.assign(this.state, stateIn);
        this.emit("stateUpdated", this.state);
    }
    /**
     * this will be stored with patcher
     */
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
    /**
     * Get a shared item from files or temp
     * If no ID provided, this will create a new key in temp
     * if no such ID found in files or in temp, will put the result of data() into it.
     */
    async getSharedItem<T extends TempItemType>(id = this.box.id, type: T = "unknown" as T, data?: () => Promise<TempItemByType<T>["data"]>): Promise<{ id: string; item: SharedItemByType<T>; newItem: boolean }> {
        let item: SharedItemByType<T>;
        let newItem = false;
        try {
            item = this.patcher.env.fileMgr.getProjectItemFromPath(id) as SharedItemByType<T>;
        } catch {
            try {
                item = this.patcher.env.tempMgr.getProjectItemFromPath(id) as SharedItemByType<T>;
            } catch {
                if (data) {
                    const d = await data();
                    try {
                        item = await this.patcher.env.tempMgr.root.addProjectItem(id, d, type) as SharedItemByType<T>;
                        newItem = true;
                    } catch {
                        item = this.patcher.env.tempMgr.getProjectItemFromPath(id) as SharedItemByType<T>;
                    }
                } else {
                    return { id, item: null, newItem };
                }
            }
        }
        if (item.type !== type) throw new Error(`Getting shared item ${id}, but returned item is of type ${item.type}, not of type ${type}.`);
        return { id, item, newItem };
    }
    /**
     * Get prop value from box, if not defined, get from metadata default
     */
    getProp<K extends keyof P = keyof P>(key: K): P[K] {
        if (key === "rect") return this.box.rect as any;
        if (key === "presentationRect") return this.box.presentationRect as any;
        if (key === "background") return this.box.background as any;
        if (key === "presentation") return this.box.presentation as any;
        return typeof this.box.props[key] === "undefined" ? this.meta.props[key as string].default : this.box.props[key];
    }
    /**
     * Get all props from box, if not defined, get from metadata default
     */
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
    /**
     * constructor (class) name
     */
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
    /**
     * Will be called just after constructed
     */
    async init() {
        // process args and props
        this.subscribe();
        await this.emit("preInit");
        await this.update(this.box.args, this.box.props);
        return this;
    }
    /**
     * Will be called after the object attached to box
     */
    async postInit() {
        await this.emit("postInit");
    }
    /**
     * Do everything here
     */
    subscribe(): void {}
    /**
     * Update UI's React State
     */
    updateUI(state: Partial<U>) {
        this.emit("uiUpdate", state);
    }
    /**
     * Store the input args and props with the box
     */
    updateBox = (e: { args?: Partial<A>; props?: Partial<P> }) => {
        this.box.update(e);
    };
    /**
     * Will be called when arguments and properties are changed
     */
    async update(args?: Partial<A>, props?: Partial<P>): Promise<this> {
        const promises: Promise<void[]>[] = [];
        promises.push(this.emit("update", { args, props }));
        if (args && args.length) promises.push(this.emit("updateArgs", args));
        if (props && Object.keys(props).length) promises.push(this.emit("updateProps", props));
        await Promise.all(promises);
        return this;
    }
    /**
     * Main function when receive data from a inlet (base 0)
     */
    fn<$ extends keyof Pick<I, number> = keyof Pick<I, number>>(inlet: $, data: I[$]): this {
        if (inlet === 0) { // allow change props via first inlet with an props object
            if (typeof data === "object") {
                const propsInKeys = Object.keys(data);
                const propsKeys = Object.keys(this.meta.props);
                if (propsInKeys.length && propsInKeys.every(k => propsKeys.indexOf(k) !== -1)) {
                    this.update(undefined, data);
                    return this;
                }
            }
        }
        this.emit("inlet", { data, inlet });
        return this;
    }
    /**
     * Output data with ith outlet.
     */
    outlet<$ extends keyof Pick<O, number>>(outlet: $, data: O[$]): this {
        if (outlet >= this.outlets) return this;
        Array.from(this.outletLines[outlet]).sort(Line.compare).map(line => line.pass(data));
        return this;
    }
    /**
     * Outlet all values in an array with corresponding index,
     * use sparse array to omit an outlet,
     * `[, 1]` will outlet 1 on second outlet,
     * but `[undefined, 1]` will also outlet undefined on first outlet
     */
    outletAll(outputs: Partial<O>): this {
        for (let i = outputs.length - 1; i >= 0; i--) {
            if (i in outputs) this.outlet(i, outputs[i]);
        }
        return this;
    }
    /**
     * Called when object will be destroyed
     */
    async destroy() {
        await this.emit("destroy", this);
    }
    // called when inlet or outlet are connected or disconnected
    connectedOutlet(outlet: number, destBox: Box, destInlet: number, lineID: string) {
        this.emit("connectedOutlet", { outlet, destBox, destInlet, lineID });
    }
    connectedInlet(inlet: number, srcBox: Box, srcOutlet: number, lineID: string) {
        this.emit("connectedInlet", { inlet, srcBox, srcOutlet, lineID });
    }
    disconnectedOutlet(outlet: number, destBox: Box, destInlet: number, lineID: string) {
        this.emit("disconnectedOutlet", { outlet, destBox, destInlet, lineID });
    }
    disconnectedInlet(inlet: number, srcBox: Box, srcOutlet: number, lineID: string) {
        this.emit("disconnectedInlet", { inlet, srcBox, srcOutlet, lineID });
    }
    // output to console
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
    /**
     * Highlight the UI box
     */
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
export interface BaseObjectAdditionalProps {
    background: boolean;
    presentation: boolean;
    rect: TRect;
    presentationRect: TRect;
}
export interface BaseObjectProps extends BaseObjectAdditionalProps, BaseUIState {}
export class BaseObject<
    D extends {} = {}, S extends {} = {},
    I extends any[] = any[], O extends any[] = any[],
    A extends any[] = any[], P extends Partial<BaseObjectProps> & Record<string, any> = {},
    U extends Partial<BaseUIState> & Record<string, any> = {}, E extends {} = {}
> extends AbstractObject<D, S, I, O, A, P & BaseObjectProps, U & BaseUIState, E> {
    static props: TMeta["props"] = {
        hidden: {
            type: "boolean",
            default: false,
            description: "Hide on lock",
            isUIState: true
        },
        background: {
            type: "boolean",
            default: false,
            description: "Include in background"
        },
        presentation: {
            type: "boolean",
            default: false,
            description: "Include in presentation"
        },
        rect: {
            type: "object",
            default: [],
            description: "Position and dimensions in patch"
        },
        presentationRect: {
            type: "object",
            default: [],
            description: "Position and dimensions in presentation"
        },
        ignoreClick: {
            type: "boolean",
            default: false,
            description: "Ignore Click",
            isUIState: true
        },
        hint: {
            type: "string",
            default: "",
            description: "Hint on hover",
            isUIState: true
        }
    };
    static get meta(): TMeta {
        const thisName = this._name;
        const superMeta = Object.getPrototypeOf(this).meta;
        const superProps = superMeta.props;
        const thisProps = this.props;
        for (const key in thisProps) {
            thisProps[key].group = key in superProps ? superProps[key].group : thisName;
        }
        return {
            package: this.package,
            name: this._name,
            icon: this.icon,
            author: this.author,
            version: this.version,
            description: this.description,
            inlets: [...this.inlets],
            outlets: [...this.outlets],
            args: [...this.args],
            props: {
                ...superProps,
                ...thisProps
            }
        };
    }
    subscribe() {
        super.subscribe();
        this.on("metaChanged", meta => this.box.emit("metaChanged", meta));
        this.on("dataUpdated", data => this.box.emit("dataUpdated", data));
        this.on("update", this.updateBox);
        const isUIStateKey = (x: any): x is keyof (U & BaseUIState) => this.meta.props[x] && this.meta.props[x].isUIState;
        const updateUIFromProps = (props: Partial<P & BaseObjectProps>) => {
            if (props) {
                const uiState: Partial<U & BaseUIState> = {};
                for (const key in props) {
                    if (isUIStateKey(key)) uiState[key as keyof (U & BaseUIState)] = props[key] as any;
                }
                this.updateUI(uiState);
            }
        };
        this.on("updateProps", updateUIFromProps);
    }
}
export interface DefaultObjectUIProps {
    bgColor: string;
    borderColor: string;
    textColor: string;
    fontFamily: string;
    fontSize: number;
    fontStyle: "normal" | "italic" | "oblique";
    fontWeight: "normal" | "bold" | "lighter" | "bolder" | number;
    textAlign: "center" | "left" | "right";
}
export interface DefaultObjectProps extends DefaultObjectUIProps, BaseObjectProps {}
export class DefaultObject<
    D extends {} = {}, S extends {} = {},
    I extends any[] = any[], O extends any[] = any[],
    A extends any[] = any[], P extends Partial<DefaultObjectProps> & Record<string, any> = {},
    U extends Partial<DefaultUIState> & Record<string, any> = {}, E extends {} = {}
> extends BaseObject<D, S, I, O, A, P & DefaultObjectProps, U & DefaultUIState, E> {
    static props: TMeta["props"] = {
        bgColor: {
            type: "color",
            default: "rgb(51, 51, 51)",
            description: "Background color",
            isUIState: true
        },
        borderColor: {
            type: "color",
            default: "rgb(125, 126, 132)",
            description: "Border color",
            isUIState: true
        },
        textColor: {
            type: "color",
            default: "rgb(255, 255, 255)",
            description: "Text color",
            isUIState: true
        },
        fontFamily: {
            type: "enum",
            enums: ["Lato", "Georgia", "Times New Roman", "Arial", "Tahoma", "Verdana", "Courier New"],
            default: "Lato",
            description: "Font family",
            isUIState: true
        },
        fontSize: {
            type: "number",
            default: 12,
            description: "Text font size",
            isUIState: true
        },
        fontStyle: {
            type: "enum",
            enums: ["normal", "italic", "oblique"],
            default: "normal",
            description: "Text style",
            isUIState: true
        },
        fontWeight: {
            type: "string",
            default: "normal",
            description: 'Text style: "normal" | "bold" | "lighter" | "bolder" | number',
            isUIState: true
        },
        textAlign: {
            type: "enum",
            enums: ["left", "center", "right"],
            default: "left",
            description: "Text style",
            isUIState: true
        }
    };
    static UI = DefaultUI;
}
export class AnyObject extends BaseObject<Record<string, any>, Record<string, any>, any[], any[], any[], Record<string, any>, Record<string, any>, Record<string, any>> {}

class EmptyObjectUI extends DefaultUI<EmptyObject> {}
export class EmptyObject extends DefaultObject<{}, { editing: boolean }, [any], [any]> {
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Bypass input";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "output same thing"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "anything",
        description: "output same thing"
    }];
    state = { editing: false };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.outlets = 1;
            this.inlets = 1;
        });
        this.on("inlet", ({ data }) => this.outlet(0, data));
    }
    static UI: typeof DefaultUI = EmptyObjectUI;
}
export class InvalidObject extends DefaultObject<{}, {}, [any], [undefined]> {
    static description = "invalid object";
    static inlets: TMeta["inlets"] = [{
        isHot: false,
        type: "anything",
        varLength: true,
        description: "nothing"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "anything",
        varLength: true,
        description: "nothing"
    }];
    static props: TMeta["props"] = {
        bgColor: {
            type: "color",
            default: "rgb(128, 64, 64)",
            description: "Background color",
            isUIState: true
        }
    };
    subscribe() {
        this.patcher.on("libChanged", () => this.box.changeText(this.box.text, true));
    }
}
export class Bang {
    isBang = true;
    toString() {
        return "bang";
    }
}
export const isBang = (x: any): x is Bang => typeof x === "object" && x?.isBang;
export default { BaseObject, EmptyObject, InvalidObject };
