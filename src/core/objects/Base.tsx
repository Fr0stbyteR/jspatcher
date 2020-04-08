import { SemanticICONS } from "semantic-ui-react";
import { stringifyError } from "../../utils/utils";
import { TypedEventEmitter } from "../../utils/TypedEventEmitter";
import Patcher from "../Patcher";
import Box from "../Box";
import Line from "../Line";
import "./Default.scss";
import "./Base.scss";
import { TAudioNodeInletConnection, TAudioNodeOutletConnection, TMeta, ObjectEventMap, TRect } from "../types";
import { BaseUI, DefaultUI, BaseUIState, DefaultUIState } from "./BaseUI";

export abstract class AbstractObject<
    D extends {} = {}, S extends {} = {},
    I extends any[] = any[], O extends any[] = any[],
    A extends any[] = any[], P extends {} = {},
    U extends {} = {}, E extends Partial<ObjectEventMap<I, A, P, U, {}>> & { [key: string]: any } = {}
> extends TypedEventEmitter<ObjectEventMap<I, A, P, U, E>> {
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
    get meta() {
        return (this.constructor as typeof AbstractObject).meta;
    }
    /**
     * should save all temporary variables here
     *
     * @type {S}
     * @memberof AbstractBaseObject
     */
    state: S;
    protected readonly _patcher: Patcher;
    protected readonly _box: Box<this>;
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
     *
     * @memberof AbstractObject
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
     *
     * @memberof AbstractObject
     */
    async postInit() {
        await this.emit("postInit");
    }
    /**
     * Do everything here
     *
     * @returns {void}
     * @memberof AbstractObject
     */
    subscribe(): void {}
    /**
     * React.PureComponent related
     *
     * @type {typeof BaseUI}
     * @memberof AbstractObject
     */
    static ui: typeof BaseUI = BaseUI;
    /**
     * Update UI's React State
     *
     * @param {(Partial<U>)} state
     * @returns {this}
     * @memberof AbstractObject
     */
    updateUI(state: Partial<U>): this {
        this.emit("uiUpdate", state);
        return this;
    }
    /**
     * Store the input args and props with the box
     *
     * @returns {this}
     * @memberof AbstractObject
     */
    updateBox = (e: { args?: Partial<A>; props?: Partial<P> }): this => {
        this.box.update(e);
        return this;
    };
    /**
     * Will be called when arguments and properties are changed
     *
     * @param {Partial<A>} [args]
     * @param {Partial<P>} [props]
     * @returns {Promise<this>}
     * @memberof AbstractObject
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
     *
     * @private
     * @template $
     * @param {I[$]} data
     * @param {$} inlet
     * @returns {Promise<this>}
     * @memberof AbstractObject
     */
    fn<$ extends keyof Pick<I, number> = keyof Pick<I, number>>(data: I[$], inlet: $): this {
        if (inlet === 0) { // allow change props via first inlet with an props object
            if (typeof data === "object") {
                const propsKeys = Object.keys(this.meta.props);
                if (Object.keys(data).every(k => propsKeys.indexOf(k) !== -1)) {
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
     *
     * @template $
     * @param {$} outlet
     * @param {O[$]} data
     * @returns {this}
     * @memberof AbstractObject
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
     *
     * @param {Partial<O>} outputs
     * @returns {Promise<this>}
     * @memberof AbstractObject
     */
    outletAll(outputs: Partial<O>): this {
        for (let i = outputs.length - 1; i >= 0; i--) {
            if (i in outputs) this.outlet(i, outputs[i]);
        }
        return this;
    }
    /**
     * Called when object will be destroyed
     *
     * @returns {Promise<this>}
     * @memberof AbstractObject
     */
    async destroy(): Promise<this> {
        await this.emit("destroy", this);
        return this;
    }
    // called when inlet or outlet are connected or disconnected
    connectedOutlet(outlet: number, destBox: Box, destInlet: number, lineID: string) {
        this.emit("connectedOutlet", { outlet, destBox, destInlet, lineID });
        return this;
    }
    connectedInlet(inlet: number, srcBox: Box, srcOutlet: number, lineID: string) {
        this.emit("connectedInlet", { inlet, srcBox, srcOutlet, lineID });
        return this;
    }
    disconnectedOutlet(outlet: number, destBox: Box, destInlet: number, lineID: string) {
        this.emit("disconnectedOutlet", { outlet, destBox, destInlet, lineID });
        return this;
    }
    disconnectedInlet(inlet: number, srcBox: Box, srcOutlet: number, lineID: string) {
        this.emit("disconnectedInlet", { inlet, srcBox, srcOutlet, lineID });
        return this;
    }
    // output to console
    post(data: any) {
        this._patcher.newLog("none", this.meta.name, stringifyError(data), this._box);
        return this;
    }
    error(data: any) {
        this._patcher.newLog("error", this.meta.name, stringifyError(data), this._box);
        return this;
    }
    info(data: any) {
        this._patcher.newLog("info", this.meta.name, stringifyError(data), this._box);
        return this;
    }
    warn(data: any) {
        this._patcher.newLog("warn", this.meta.name, stringifyError(data), this._box);
        return this;
    }
    get patcher() {
        return this._patcher;
    }
    /**
     * this will be stored with patcher
     *
     * @memberof BaseObject
     */
    get data() {
        return this._box.data;
    }
    set data(dataIn: D) {
        this._box.data = dataIn as any;
    }
    /**
     * Get the shared data manager
     *
     * @readonly
     * @memberof AbstractObject
     */
    get sharedData() {
        return this._patcher.state.dataMgr;
    }
    /**
     * Get prop value from box, if not defined, get from metadata default
     *
     * @template K
     * @param {K} key
     * @returns {P[K]}
     * @memberof AbstractObject
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
     *
     * @readonly
     * @memberof AbstractObject
     */
    get props(): Partial<P> {
        const props: Partial<P> = {};
        for (const key in this.meta.props) {
            props[key as keyof P] = this.getProp(key as keyof P);
        }
        return props;
    }
    get box() {
        return this._box;
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
    A extends any[] = any[], P extends Partial<BaseObjectProps> & { [key: string]: any } = {},
    U extends Partial<BaseUIState> & { [key: string]: any } = {}, E extends {} = {}
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
    A extends any[] = any[], P extends Partial<DefaultObjectProps> & { [key: string]: any } = {},
    U extends Partial<DefaultUIState> & { [key: string]: any } = {}, E extends {} = {}
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
    static ui = DefaultUI;
}
export class AnyObject extends BaseObject<{ [key: string]: any }, { [key: string]: any }, any[], any[], any[], { [key: string]: any }, { [key: string]: any }, { [key: string]: any }> {}
export class BaseAudioObject<D extends {} = {}, S extends {} = {}, I extends any[] = any[], O extends any[] = any[], A extends any[] = any[], P extends Partial<BaseObjectProps> & { [key: string]: any } = {}, U extends Partial<BaseUIState> & { [key: string]: any } = {}, E extends {} = {}> extends BaseObject<D, S, I, O, A, P & BaseObjectProps, U & BaseUIState, E> {
    get audioCtx() {
        return this.patcher.env.audioCtx;
    }
    applyBPF(param: AudioParam, bpf: number[][]) {
        const { audioCtx } = this;
        param.cancelScheduledValues(audioCtx.currentTime);
        param.setValueAtTime(param.value, audioCtx.currentTime);
        let t = 0;
        bpf.forEach((a) => {
            if (a.length === 1) {
                param.setValueAtTime(a[0], audioCtx.currentTime + t);
            } else if (a.length > 1) {
                t += a[1];
                if (a.length === 3 && a[2] === 1) {
                    param.exponentialRampToValueAtTime(a[0], audioCtx.currentTime + t);
                } else {
                    param.linearRampToValueAtTime(a[0], audioCtx.currentTime + t);
                }
            }
        });
    }
    inletConnections: TAudioNodeInletConnection[] = [];
    outletConnections: TAudioNodeOutletConnection[] = [];
    connectAudio() {
        this.box.allLines.forEach(line => line.enable());
        return this;
    }
    connectAudioInlet(portIn?: number) {
        this.inletLines.forEach((lines, port) => {
            if (typeof portIn === "undefined" || port === portIn) lines.forEach(line => line.enable());
        });
        return this;
    }
    connectAudioOutlet(portIn?: number) {
        this.outletLines.forEach((lines, port) => {
            if (typeof portIn === "undefined" || port === portIn) lines.forEach(line => line.enable());
        });
        return this;
    }
    disconnectAudio() {
        this.box.allLines.forEach(line => line.disable());
        return this;
    }
    disconnectAudioInlet(portIn?: number) {
        this.inletLines.forEach((lines, port) => {
            if (typeof portIn === "undefined" || port === portIn) lines.forEach(line => line.disable());
        });
        return this;
    }
    disconnectAudioOutlet(portIn?: number) {
        this.outletLines.forEach((lines, port) => {
            if (typeof portIn === "undefined" || port === portIn) lines.forEach(line => line.disable());
        });
        return this;
    }
}
export class DefaultAudioObject<D extends {} = {}, S extends {} = {}, I extends any[] = any[], O extends any[] = any[], A extends any[] = any[], P extends Partial<DefaultUIState> & { [key: string]: any } = {}, U extends Partial<DefaultUIState> & { [key: string]: any } = {}, E extends {} = {}> extends BaseAudioObject<D, S, I, O, A, P, U & DefaultUIState, E> {
    static props = DefaultObject.props;
    static ui = DefaultUI;
}
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
    static ui: typeof DefaultUI = EmptyObjectUI;
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
}
export class Bang {
    toString() {
        return "bang";
    }
}
export default { BaseObject, EmptyObject, InvalidObject };
