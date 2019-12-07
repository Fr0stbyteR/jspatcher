import * as React from "react";
import { Icon, SemanticICONS } from "semantic-ui-react";
import { stringifyError, MappedEventEmitter } from "../../utils";
import Patcher from "../Patcher";
import Box from "../Box";
import "./Default.scss";
import "./Base.scss";
import { BaseUIState, DefaultUIState, TAudioNodeInletConnection, TAudioNodeOutletConnection, TMeta, ObjectEventMap } from "../types";

export abstract class AbstractUI<T extends AbstractObject = AbstractObject, P extends Partial<{ object: T }> & { [key: string]: any } = {}, S extends { [key: string]: any } = {}> extends React.Component<{ object: T } & P, S> {
    static sizing: "horizontal" | "vertical" | "both" | "ratio";
    static defaultSize: [number, number];
    state = {} as Readonly<S>;
    get object(): T {
        return this.props.object;
    }
    get patcher() {
        return this.props.object.patcher;
    }
    get box(): Box<T> {
        return this.props.object.box;
    }
    componentDidMount() {
        this.object.on("uiUpdate", e => this.setState(e));
    }
    componentWillUnmount() {
        this.object.off("uiUpdate", e => this.setState(e));
    }
    render() {
        return <></>;
    }
}
export type BaseUIProps = {
    containerProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
    additionalClassName?: string;
};
export type BaseUIAdditionalState = { editing: boolean };
export class BaseUI<T extends BaseObject = AnyObject, P extends Partial<BaseUIProps> & { [key: string]: any } = {}, S extends Partial<BaseUIState & BaseUIAdditionalState> & { [key: string]: any } = {}> extends AbstractUI<T, P & BaseUIProps, S & BaseUIAdditionalState & BaseUIState> {
    state: S & BaseUIAdditionalState & BaseUIState = {
        ...this.state,
        hidden: this.box.props.hidden || false,
        background: this.box.background || false,
        presentation: this.box.presentation || false,
        ignoreClick: this.box.props.ignoreClick || false,
        hint: this.box.props.hint || "",
        editing: false
    };
    static sizing: "horizontal" | "vertical" | "both" | "ratio" = "horizontal";
    editableOnUnlock = false;
    toggleEdit = (bool?: boolean) => false;
    handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((this.props.object as T).patcher.state.locked) e.currentTarget.title = this.state.hint;
    }
    handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.title = "";
    render() {
        const { object } = this;
        const packageName = "package-" + object.meta.package.toLowerCase();
        const className = packageName + "-" + object.meta.name.toLowerCase();
        const classArray = [packageName, className, "box-ui-container", this.props.additionalClassName];
        if (this.state.hidden) classArray.push("hidden");
        if (this.state.ignoreClick) classArray.push("ignore-click");
        return (
            <div className={classArray.join(" ")} {...this.props.containerProps} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                {this.props.children}
            </div>
        );
    }
}
export type DefaultUIProps = {
    textContainerProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
    prependProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
    spanProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLSpanElement> & React.HTMLAttributes<HTMLSpanElement>;
    appendProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
} & BaseUIProps;
export type DefaultUIAdditionalState = { text: string; loading: boolean; dropdown$: number } & BaseUIAdditionalState;
export class DefaultUI<T extends DefaultObject = DefaultObject, P extends Partial<DefaultUIProps> & { [key: string]: any } = {}, S extends Partial<DefaultUIState & DefaultUIAdditionalState> & { [key: string]: any } = {}> extends BaseUI<T, P & DefaultUIProps, S & DefaultUIState & DefaultUIAdditionalState> {
    editableOnUnlock = true;
    state: S & DefaultUIState & DefaultUIAdditionalState = {
        ...this.state,
        bgColor: this.box.props.bgColor || "rgb(51, 51, 51)",
        borderColor: this.box.props.borderColor || "rgb(125, 126, 132)",
        textColor: this.box.props.textColor || "rgb(255, 255, 255)",
        fontFamily: this.box.props.fontFamily || "Lato",
        fontSize: this.box.props.fontSize || 12,
        fontStyle: this.box.props.fontStyle || "normal",
        fontWeight: this.box.props.fontWeight || "normal",
        textAlign: this.box.props.textAlign || "left",
        editing: false,
        text: this.box.text || "",
        loading: false,
        dropdown$: -1
    };
    refSpan = React.createRef<HTMLSpanElement>();
    refDropdown = React.createRef<HTMLTableSectionElement>();
    dropdownOptions: { key: string; value: string; text: string; icon: SemanticICONS; description: string }[] = [];
    toggleEdit = (bool?: boolean) => {
        const { patcher, box } = this;
        if (bool === this.state.editing) return this.state.editing;
        if (patcher.state.locked) return this.state.editing;
        if (!this.refSpan.current) return this.state.editing;
        const toggle = !this.state.editing;
        const span = this.refSpan.current;
        if (toggle) {
            patcher.selectOnly(box.id);
            this.setState({ editing: true, text: span.innerText });
            span.contentEditable = "true";
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(span);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            this.setState({ editing: false, text: span.innerText });
            span.contentEditable = "false";
            window.getSelection().removeAllRanges();
            patcher.changeBoxText(box.id, span.textContent);
        }
        return toggle;
    }
    handleMouseDown = (e: React.MouseEvent) => (this.state.editing ? e.stopPropagation() : null);
    handleClick = (e: React.MouseEvent) => (this.state.editing ? e.stopPropagation() : null);
    handleKeyDown = (e: React.KeyboardEvent) => { // propagate for parent for focus on boxUI
        if (!this.state.editing) return;
        if (e.key === "Enter") {
            e.preventDefault();
            if (this.state.dropdown$ >= 0 && this.dropdownOptions[this.state.dropdown$] && this.refSpan.current) {
                this.refSpan.current.innerText = this.state.text.split(" ").slice(0, -1).concat(this.dropdownOptions[this.state.dropdown$].key).join(" ");
            }
            return;
        }
        if ((e.key === " " || e.key === "Tab") && this.refSpan.current) {
            if (this.state.dropdown$ >= 0 && this.dropdownOptions[this.state.dropdown$]) {
                const span = this.refSpan.current;
                const text = this.state.text.split(" ").slice(0, -1).concat(this.dropdownOptions[this.state.dropdown$].key).join(" ") + " ";
                span.innerText = text;
                const range = document.createRange();
                const selection = window.getSelection();
                range.setStart(span.childNodes[0], text.length);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
                this.setState({ text, dropdown$: -1 });
            }
        }
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            let dropdown$;
            if (e.key === "ArrowUp") dropdown$ = Math.max(-1, this.state.dropdown$ - 1);
            if (e.key === "ArrowDown") dropdown$ = Math.min(this.dropdownOptions.length - 1, this.state.dropdown$ + 1);
            this.setState({ dropdown$ });
            if (dropdown$ >= 0 && this.refDropdown.current && this.dropdownOptions[this.state.dropdown$]) {
                (this.refDropdown.current.children[dropdown$] as HTMLTableRowElement).scrollIntoView(false);
            }
        }
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }
    handleKeyUp = (e: React.KeyboardEvent) => {
        if (!this.refSpan.current) return;
        if (this.refSpan.current.innerText === this.state.text) return;
        const { patcher } = this;
        this.dropdownOptions = [];
        const splitted = this.refSpan.current.innerText.split(" ");
        if (splitted.length === 1) {
            const keys = Object.keys(patcher.state.lib).sort();
            for (let i = 0; i < keys.length; i++) {
                if (this.dropdownOptions.length > 10) break;
                const key = keys[i];
                if (key.startsWith(splitted[splitted.length - 1])) {
                    const o = patcher.state.lib[key];
                    this.dropdownOptions.push({ key, value: key, text: key, icon: o.meta.icon, description: o.meta.description });
                }
            }
        } else if (splitted[0] === "new" && splitted.length === 2) {
            const keys = Object.keys(patcher.state.lib).sort();
            for (let i = 0; i < keys.length; i++) {
                if (this.dropdownOptions.length > 10) break;
                const key = keys[i];
                if (key.startsWith(splitted[splitted.length - 1])) {
                    const o = patcher.state.lib[key];
                    if (o.meta.description === "Auto-imported static method") {
                        this.dropdownOptions.push({ key, value: key, text: key, icon: o.meta.icon, description: o.meta.description });
                    }
                }
            }
        }
        this.setState({ text: this.refSpan.current.innerText });
    }
    handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        document.execCommand("insertHTML", false, e.clipboardData.getData("text/plain"));
    }
    handleMouseDownDropdown = (e: React.MouseEvent, key: string, i: number) => {
        e.preventDefault();
        if (i >= 0 && this.dropdownOptions[i] && this.refSpan.current) {
            const span = this.refSpan.current;
            const text = this.state.text.split(" ").slice(0, -1).concat(this.dropdownOptions[i].key).join(" ");
            span.innerText = text;
            const range = document.createRange();
            const selection = window.getSelection();
            range.setStart(span.childNodes[0], text.length);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            this.setState({ text, dropdown$: i });
        }
    }
    render() {
        const { object } = this;
        const textContainerStyle: React.CSSProperties = {
            borderColor: this.state.borderColor,
            color: this.state.textColor,
            fontFamily: `${this.state.fontFamily}, Tahoma, sans-serif`,
            fontSize: this.state.fontSize,
            fontWeight: this.state.fontWeight,
            fontStyle: this.state.fontStyle,
            textAlign: this.state.textAlign
        };
        return (
            <BaseUI {...this.props} additionalClassName="box-ui-default" containerProps={{ style: { backgroundColor: this.state.bgColor } }}>
                <div className="box-ui-text-container" {...this.props.textContainerProps} style={textContainerStyle}>
                    <div className="box-ui-text-container-prepend" {...this.props.prependProps}>
                        {object.meta.icon ? <Icon inverted={true} loading={this.state.loading} size="small" name={this.state.loading ? "spinner" : object.meta.icon} /> : null}
                    </div>
                    <span contentEditable={false} className={"editable" + (this.state.editing ? " editing" : "")} ref={this.refSpan} onMouseDown={this.handleMouseDown} onClick={this.handleClick} onPaste={this.handlePaste} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} suppressContentEditableWarning={true} {...this.props.spanProps}>
                        {object.box.text}
                    </span>
                    {
                        this.state.editing && this.state.text.length
                            ? <div className="box-ui-text-dropdown">
                                <table className="ui small inverted selectable striped unstackable very compact table box-ui-text-autocomplete">
                                    <tbody ref={this.refDropdown}>
                                        {this.dropdownOptions.map((option, i) => (
                                            <tr key={option.key} className={i === this.state.dropdown$ ? "focused" : ""} onMouseDown={e => this.handleMouseDownDropdown(e, option.key, i)}>
                                                <td>{option.icon ? <Icon inverted={true} size="small" name={option.icon} /> : undefined}</td>
                                                <td>{option.key}</td>
                                                <td>{option.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            : undefined
                    }
                    <div className="box-ui-text-container-append" {...this.props.appendProps}>
                    </div>
                </div>
            </BaseUI>
        );
    }
}
export abstract class AbstractObject<
    D extends {} = {}, S extends {} = {},
    I extends any[] = any[], O extends any[] = any[],
    A extends any[] = any[], P extends {} = {},
    U extends {} = {}, E extends Partial<ObjectEventMap<I, A, P, U, {}>> & { [key: string]: any } = {}
> extends MappedEventEmitter<ObjectEventMap<I, A, P, U, E>> {
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
    init() {
        // build UI
        this.uiRef = React.createRef();
        this.uiProps = { object: this, ref: this.uiRef, key: this.box.id };
        this.ui = <this.uiComponent {...this.uiProps} key={new Date().getTime()} />;
        // process args and props
        this.subscribe();
        this.emit("preInit");
        this.update(this.box.args, this.box.props);
        this.emit("postInit");
        return this;
    }
    /**
     * Do everything here
     *
     * @returns {void}
     * @memberof AbstractObject
     */
    subscribe(): void {}
    /**
     * React.Component related
     *
     * @type {typeof BaseUI}
     * @memberof AbstractObject
     */
    uiComponent: typeof BaseUI = BaseUI;
    /**
     * React ref of UI
     *
     * @memberof AbstractObject
     */
    uiRef: React.RefObject<BaseUI<AnyObject>>;
    /**
     * Props give to Component
     *
     * @memberof AbstractObject
     */
    uiProps: JSX.IntrinsicClassAttributes<BaseUI<AnyObject>> & { object: AnyObject };
    /**
     * Build new ui on page, return a React Component, override this
     *
     * @readonly
     * @type {JSX.Element}
     * @memberof AbstractObject
     */
    ui: JSX.Element;
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
    }
    /**
     *
     * Will be called when arguments and properties are changed
     *
     * @param {Partial<A>} [args]
     * @param {Partial<P>} [props]
     * @returns {this}
     * @memberof AbstractObject
     */
    update(args?: Partial<A>, props?: Partial<P>): this {
        this.emit("update", { args, props });
        if (args && args.length) this.emit("updateArgs", args);
        if (props && Object.keys(props).length) this.emit("updateProps", props);
        return this;
    }
    /**
     * Main function when receive data from a inlet (base 0)
     *
     * @private
     * @template $
     * @param {I[$]} data
     * @param {$} inlet
     * @returns {this}
     * @memberof AbstractObject
     */
    fn<$ extends keyof Pick<I, number> = keyof Pick<I, number>>(data: I[$], inlet: $): this {
        this.emit("inlet", { data, inlet });
        return this;
    }
    // use this function to output data with ith outlet.
    outlet<$ extends keyof Pick<O, number>>(outlet: $, data: O[$]) {
        if (outlet >= this.outlets) return this;
        const outletLines = this.outletLines[outlet].sort((id1, id2) => { // eslint-disable-line arrow-body-style
            return this._patcher.lines[id2].positionHash - this._patcher.lines[id1].positionHash;
        });
        for (let j = 0; j < outletLines.length; j++) {
            const lineID = outletLines[j];
            this._patcher.lines[lineID].pass(data);
        }
        return this;
    }
    outletAll(outputs: Partial<O>) {
        for (let i = outputs.length - 1; i >= 0; i--) {
            const e = outputs[i];
            if (typeof e !== "undefined") this.outlet(i, e);
        }
        return this;
    }
    destroy() {
        this.emit("destroy", this);
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
type BaseAdditionalProps = {
    background: boolean;
    presentation: boolean;
    rect: [number, number, number, number];
    presentationRect: [number, number, number, number];
};
export class BaseObject<
    D extends {} = {}, S extends {} = {},
    I extends any[] = [], O extends any[] = [],
    A extends any[] = [], P extends Partial<BaseUIState & BaseAdditionalProps> & { [key: string]: any } = {},
    U extends Partial<BaseUIState> & { [key: string]: any } = {}, E extends {} = {}
> extends AbstractObject<D, S, I, O, A, P & BaseUIState & BaseAdditionalProps, U & BaseUIState, E> {
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
            inlets: this.inlets,
            outlets: this.outlets,
            args: this.args,
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
        const updateUIFromProps = (props: Partial<P & BaseUIState & BaseAdditionalProps>) => {
            if (props) {
                const uiState: Partial<U & BaseUIState> = {};
                for (const key in props) {
                    if (key === "rect") this.box.setRect(props[key]);
                    else if (key === "presentationRect") this.box.setPresentationRect(props[key]);
                    else if (key === "presentation") this.box.setPresentation(props[key]);
                    else if (key === "background") this.box.setBackground(props[key]);
                    else if (isUIStateKey(key)) uiState[key as keyof (U & BaseUIState)] = props[key] as any;
                }
                this.updateUI(uiState);
            }
        };
        this.on("updateProps", updateUIFromProps);
    }
}
export class DefaultObject<
    D extends {} = {}, S extends {} = {},
    I extends any[] = [], O extends any[] = [],
    A extends any[] = [], P extends Partial<DefaultUIState> & { [key: string]: any } = {},
    U extends Partial<DefaultUIState> & { [key: string]: any } = {}, E extends {} = {}
> extends BaseObject<D, S, I, O, A, P & DefaultUIState, U & DefaultUIState, E> {
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
    uiComponent = DefaultUI;
}
export class AnyObject extends BaseObject<any, any, any, any, any, any, any, any> {}
export class BaseAudioObject<D extends {} = {}, S extends {} = {}, I extends any[] = [], O extends any[] = [], A extends any[] = [], P extends Partial<BaseUIState & BaseAdditionalProps> & { [key: string]: any } = {}, U extends Partial<BaseUIState> & { [key: string]: any } = {}, E extends {} = {}> extends BaseObject<D, S, I, O, A, P & BaseUIState & BaseAdditionalProps, U & BaseUIState, E> {
    static isConnectable(from: any, outlet: number, to: any, inlet: number) {
        if (!(from instanceof BaseAudioObject)) return false;
        if (!(to instanceof BaseAudioObject)) return false;
        const fromConnection = from.outletConnections[outlet];
        const toConnection = to.inletConnections[inlet];
        if (!fromConnection) return false;
        if (!toConnection) return false;
        if (!fromConnection.node) return false;
        if (!toConnection.node) return false;
        return true;
    }
    static applyCurve(param: AudioParam, curve: number[][], audioCtx: AudioContext) {
        param.cancelScheduledValues(audioCtx.currentTime);
        let t = 0;
        curve.forEach((a) => {
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
    get audioCtx() {
        return this.patcher.env.audioCtx;
    }
    inletConnections: TAudioNodeInletConnection[] = [];
    outletConnections: TAudioNodeOutletConnection[] = [];
    subscribe() {
        super.subscribe();
        this.on("connectedInlet", ({ inlet, srcBox, srcOutlet }) => {
            const srcObj = srcBox.object;
            if (BaseAudioObject.isConnectable(srcObj, srcOutlet, this, inlet)) {
                const from = (srcObj as BaseAudioObject).outletConnections[srcOutlet];
                const to = this.inletConnections[inlet];
                const isAudioParam = to.node instanceof AudioParam;
                if (isAudioParam) from.node.connect(to.node as AudioParam, from.index);
                else from.node.connect(to.node as AudioNode, from.index, to.index);
            }
        });
        this.on("disconnectedInlet", ({ inlet, srcBox, srcOutlet }) => {
            const srcObj = srcBox.object;
            if (BaseAudioObject.isConnectable(srcObj, srcOutlet, this, inlet)) {
                const from = (srcObj as BaseAudioObject).outletConnections[srcOutlet];
                const to = this.inletConnections[inlet];
                const isAudioParam = to.node instanceof AudioParam;
                if (isAudioParam) from.node.disconnect(to.node as AudioParam, from.index);
                else from.node.disconnect(to.node as AudioNode, from.index, to.index);
            }
        });
        this.on("destroy", () => this.outletConnections.forEach(con => con.node.disconnect(con.index)));
    }
    connectAll() {
        this.box.allLines.forEach(el => this._patcher.lines[el].enable());
        return this;
    }
    disconnectAll() {
        this.box.allLines.forEach(el => this._patcher.lines[el].disable());
        return this;
    }
}
export class DefaultAudioObject<D extends {} = {}, S extends {} = {}, I extends any[] = [], O extends any[] = [], A extends any[] = [], P extends Partial<DefaultUIState> & { [key: string]: any } = {}, U extends Partial<DefaultUIState> & { [key: string]: any } = {}, E extends {} = {}> extends BaseAudioObject<D, S, I, O, A, P, U & DefaultUIState, E> {
    static props = DefaultObject.props;
    uiComponent = DefaultUI;
}
class EmptyObjectUI extends DefaultUI<EmptyObject> {
    componentDidMount() {
        super.componentDidMount();
        if (this.object.state.editing) this.toggleEdit(true);
    }
}
class EmptyObject extends DefaultObject<{}, { editing: boolean }, [any], [any]> {
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
    }]
    state = { editing: false };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.outlets = 1;
            this.inlets = 1;
            this.state.editing = !!this.box._editing;
            delete this.box._editing;
        });
        this.on("inlet", ({ data, inlet }) => this.outlet(0, data));
    }
    uiComponent: typeof DefaultUI = EmptyObjectUI;
}
class InvalidObject extends DefaultObject<{}, {}, [any], [undefined]> {
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
}
export class Bang {
    toString() {
        return "bang";
    }
}
export default { BaseObject, EmptyObject, InvalidObject };
