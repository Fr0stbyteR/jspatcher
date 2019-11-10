import * as React from "react";
import { Icon, SemanticICONS } from "semantic-ui-react";
import { stringifyError, MappedEventEmitter } from "../../utils";
import Patcher from "../Patcher";
import Box from "../Box";
import "./Default.scss";
import "./Base.scss";
import { BaseUIState, DefaultUIState, TAudioNodeInletConnection, TAudioNodeOutletConnection, TMeta, ObjectEventMap } from "../types";

export abstract class AbstractUI<T extends AbstractObject = AbstractObject, P extends Partial<{ object: T }> & { [key: string]: any } = {}, S extends { [key: string]: any } = {}> extends React.Component<{ object: T } & P, S> {
    // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
    state = {} as Readonly<S>;
    get object() {
        return this.props.object;
    }
    get patcher() {
        return this.props.object.patcher;
    }
    get box() {
        return this.props.object.box;
    }
    componentDidMount() {
        this.object.on("uiUpdate", e => this.setState(e));
    }
    componentWillUnmount() {
        this.object.off("uiUpdate", e => this.setState(e));
    }
}
type BaseUIProps = {
    containerProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
    additionalClassName?: string;
};
type BaseUIAdditionalState = { editing: boolean };
export class BaseUI<T extends BaseObject = BaseObject, P extends Partial<BaseUIProps> & { [key: string]: any } = {}, S extends Partial<BaseUIState & BaseUIAdditionalState> & { [key: string]: any } = {}> extends AbstractUI<T, P & BaseUIProps, S & BaseUIAdditionalState & BaseUIState> {
    state = {
        ...super.state,
        hidden: false,
        background: false,
        presentation: false,
        ignoreClick: false,
        hint: "",
        editing: false
    };
    static sizing: "horizontal" | "vertical" | "both" | "ratio" = "horizontal";
    editableOnUnlock = false;
    toggleEdit = (bool?: boolean) => false;
    render() {
        const { object } = this;
        const packageName = "package-" + object.meta.package.toLowerCase();
        const className = packageName + "-" + object.meta.name.toLowerCase();
        const classArray = [packageName, className, "box-ui-container", this.props.additionalClassName];
        return (
            <div className={classArray.join(" ")} {...this.props.containerProps}>
                {this.props.children}
            </div>
        );
    }
}
type DefaultUIProps = {
    textContainerProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
    prependProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
    spanProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLSpanElement> & React.HTMLAttributes<HTMLSpanElement>;
    appendProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
}
type DefaultUIAdditionalState = { text: string; loading: boolean; dropdown$: number } & BaseUIAdditionalState;
export class DefaultUI<T extends DefaultObject = DefaultObject, P extends Partial<DefaultUIProps> & { [key: string]: any } = {}, S extends Partial<DefaultUIState & DefaultUIAdditionalState> & { [key: string]: any } = {}> extends BaseUI<T, P & DefaultUIProps, S & DefaultUIState & DefaultUIAdditionalState> {
    editableOnUnlock = true;
    state = {
        ...super.state,
        bgColor: "rgb(51, 51, 51)",
        borderColor: "rgb(125, 126, 132)",
        textColor: "rgb(255, 255, 255)",
        fontFamily: "Lato",
        fontSize: 12,
        fontStyle: "normal",
        fontWeight: "normal",
        textAlign: "left",
        editing: false,
        text: "",
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
    componentDidMount() {
        super.componentDidMount();
        this.setState({ text: this.object.box.text });
    }
    render() {
        const { object } = this;
        return (
            <BaseUI {...this.props} additionalClassName="box-ui-default">
                <div className="box-ui-text-container" {...this.props.textContainerProps}>
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
export type Data<T> = T extends BaseObject<infer D, any, any, any, any, any, any, any> ? D : never;
export type State<T> = T extends BaseObject<any, infer S, any, any, any, any, any, any> ? S : never;
export type Inputs<T> = T extends BaseObject<any, any, infer I, any, any, any, any, any> ? I : never;
export type Outputs<T> = T extends BaseObject<any, any, any, infer O, any, any, any, any> ? O : never;
export type Args<T> = T extends BaseObject<any, any, any, any, infer A, any, any, any> ? A : never;
export type Props<T> = T extends BaseObject<any, any, any, any, any, infer P, any, any> ? P : never;
export type UIState<T> = T extends BaseObject<any, any, any, any, any, any, infer U, any> ? U : never;
export type EventMap<T> = T extends BaseObject<any, any, any, any, any, any, any, infer E> ? E : never;
export abstract class AbstractObject<D extends {} = {}, S extends {} = {}, I extends any[] = any[], O extends any[] = any[], A extends any[] = any[], P extends {} = {}, U extends {} = {}, E extends {} = {}> extends MappedEventEmitter<E & ObjectEventMap<U>> {
    static get meta(): TMeta {
        return {
            package: "Base", // div will have class "package-name" "package-name-objectname"
            name: this.name,
            icon: null as SemanticICONS, // semantic icon to display in UI
            author: "",
            version: "0.0.0",
            description: "",
            inlets: [],
            outlets: [],
            args: [],
            props: []
        };
    }
    get meta() {
        return (this.constructor as typeof AbstractObject).meta;
    }
    superMeta: TMeta = null;
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
        // usually do this after initialization
        // this.update(box.args, box.props);
    }
    /**
     * Build new ui on page, return a React Component, override this
     *
     * @readonly
     * @type {typeof BaseUI}
     * @memberof AbstractObject
     */
    get ui(): typeof BaseUI {
        return BaseUI;
    }
    /**
     * Update UI's React State
     *
     * @param {(Partial<U> | null)} state
     * @returns {this}
     * @memberof AbstractObject
     */
    updateUI(state: Partial<U> | null): this {
        this.emit("uiUpdate", state as any);
        return this;
    }
    /**
     *
     * When arguments and properties are changed, can use this in constructor
     *
     * @param {Partial<A>} [args]
     * @param {Partial<P>} [props]
     * @returns {this}
     * @memberof AbstractObject
     */
    update(args?: Partial<A>, props?: Partial<P> & { [key: string]: any }): this {
        this.updateBox(args, props);
        return this;
    }
    /**
     * From a props update, retrieve those who can affect UI, then updateUI with them
     *
     * @param {(Partial<P> & { [key: string]: any })} props
     * @returns
     * @memberof AbstractObject
     */
    updateUIFromProps(props: Partial<P> & { [key: string]: any }) {
        return this;
    }
    /**
     * Store the input args and props with the box
     *
     * @param {Partial<A>} [args]
     * @param {Partial<P>} [props]
     * @memberof AbstractObject
     */
    updateBox(args?: Partial<A>, props?: Partial<P>) {
        if (args) this.box.args = Object.assign(this.box.args, args);
        if (props) this.box.props = Object.assign(this.box.props, props);
    }
    // main function when receive data from a inlet (base 0)
    fn<$ extends keyof Pick<I, number>>(data: I[$], inlet: $): this {
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
        return this;
    }
    // called when inlet or outlet are connected or disconnected
    connectedOutlet(outlet: number, destBox: Box, destInlet: number, lineID: string) {
        return this;
    }
    connectedInlet(inlet: number, srcBox: Box, srcOutlet: number, lineID: string) {
        return this;
    }
    disconnectedOutlet(outlet: number, destBox: Box, destInlet: number, lineID: string) {
        return this;
    }
    disconnectedInlet(inlet: number, srcBox: Box, srcOutlet: number, lineID: string) {
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
        this._box.data = dataIn as Data<this>;
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
export class BaseObject<D extends {} = {}, S extends {} = {}, I extends any[] = [], O extends any[] = [], A extends any[] = [], P extends Partial<BaseUIState & BaseAdditionalProps> & { [key: string]: any } = {}, U extends Partial<BaseUIState> & { [key: string]: any } = {}, E extends {} = {}> extends AbstractObject<D, S, I, O, A, P & BaseUIState & BaseAdditionalProps, U & BaseUIState, E> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            package: "Base",
            props: [{
                name: "hidden",
                type: "boolean",
                default: false,
                description: "Hide on lock"
            }, {
                name: "background",
                type: "boolean",
                default: false,
                description: "Include in background"
            }, {
                name: "presentation",
                type: "boolean",
                default: false,
                description: "Include in presentation"
            }, {
                name: "rect",
                type: "object",
                description: "Position and dimensions in patch"
            }, {
                name: "presentationRect",
                type: "object",
                description: "Position and dimensions in presentation"
            }, {
                name: "ignoreClick",
                type: "boolean",
                default: false,
                description: "Ignore Click"
            }, {
                name: "hint",
                type: "string",
                default: "",
                description: "Hint on hover"
            }]
        };
    }
    get superMeta() {
        return super.meta || null;
    }
    update(args?: Partial<A>, props?: Partial<P> & { [key: string]: any }): this {
        super.update(args, props);
        this.updateUIFromProps(props);
        return this;
    }
    updateUIFromProps(props: Partial<P> & { [key: string]: any }) {
        if (props) {
            const uiState: Partial<U & BaseUIState> = {};
            for (const key in props) {
                if (key === "hint") uiState[key] = props[key];
                else if (key === "rect") this.box.setRect(props[key]);
                else if (key === "presentationRect") this.box.setPresentationRect(props[key]);
                else if (key === "presentation") this.box.setPresentation(props[key]);
                else if (key === "background") this.box.setBackground(props[key]);
                else if (key === "ignoreClick") uiState[key] = props[key];
                else if (key === "hidden") uiState[key] = props[key];
            }
            this.updateUI(uiState);
        }
        return this;
    }
}
export class DefaultObject<D extends {} = {}, S extends {} = {}, I extends any[] = [], O extends any[] = [], A extends any[] = [], P extends Partial<DefaultUIState> & { [key: string]: any } = {}, U extends Partial<DefaultUIState> & { [key: string]: any } = {}, E extends {} = {}> extends BaseObject<D, S, I, O, A, P, U & DefaultUIState, E> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            props: [{
                name: "bgColor",
                type: "color",
                default: "rgb(51, 51, 51)",
                description: "Background color"
            }, {
                name: "borderColor",
                type: "color",
                default: "rgb(125, 126, 132)",
                description: "Border color"
            }, {
                name: "textColor",
                type: "color",
                default: "rgb(255, 255, 255)",
                description: "Text color"
            }, {
                name: "fontFamily",
                type: "enum",
                enum: ["Lato", "Georgia", "Times New Roman", "Arial", "Tahoma", "Verdana", "Courier New"],
                default: "Lato",
                description: "Font family"
            }, {
                name: "fontSize",
                type: "number",
                default: 12,
                description: "Text font size"
            }, {
                name: "fontStyle",
                type: "enum",
                enum: ["normal", "italic", "oblique"],
                default: "normal",
                description: "Text style"
            }, {
                name: "fontWeight",
                type: "string",
                default: "normal",
                description: 'Text style: "normal" | "bold" | "lighter" | "bolder" | number'
            }, {
                name: "textAlign",
                type: "enum",
                enum: ["center", "left", "right"],
                default: "left",
                description: "Text style"
            }]
        };
    }
    updateUIFromProps(props: Partial<P> & { [key: string]: any }) {
        super.updateUIFromProps(props);
        if (props) {
            const uiState: Partial<U & DefaultUIState> = {};
            for (const key in props) {
                if (key === "bgColor") uiState[key] = props[key];
                else if (key === "borderColor") uiState[key] = props[key];
                else if (key === "textColor") uiState[key] = props[key];
                else if (key === "fontFamily") uiState[key] = props[key];
                else if (key === "fontSize") uiState[key] = props[key];
                else if (key === "fontStyle") uiState[key] = props[key];
                else if (key === "fontWeight") uiState[key] = props[key];
                else if (key === "textAlign") uiState[key] = props[key];
            }
            this.updateUI(uiState);
        }
        return this;
    }
    get ui(): typeof BaseUI {
        return DefaultUI;
    }
}
export class AnyObject extends BaseObject<any, any, any, any, any, any, any, any> {}
export class BaseAudioObject<D extends {} = {}, S extends {} = {}, I extends any[] = [], O extends any[] = [], A extends any[] = [], P extends Partial<BaseUIState & BaseAdditionalProps> & { [key: string]: any } = {}, U extends Partial<BaseUIState> & { [key: string]: any } = {}, E extends {} = {}> extends BaseObject<D, S, I, O, A, P & BaseUIState & BaseAdditionalProps, U & BaseUIState, E> {
    static isConnectable(from: any, outlet: number, to: any, inlet: number) {
        if (!(from instanceof BaseAudioObject)) return false;
        if (!(to instanceof BaseAudioObject)) return false;
        if (!from.outletConnections[outlet]) return false;
        if (!to.inletConnections[inlet]) return false;
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
    get dummyAudioNode() {
        return this.patcher.env.dummyAudioNode;
    }
    inletConnections: TAudioNodeInletConnection[] = [];
    outletConnections: TAudioNodeOutletConnection[] = [];
    keepAlive() {}
    connectedInlet(inlet: number, srcBox: Box, srcOutlet: number, lineID: string) {
        const srcObj = srcBox.object;
        if (BaseAudioObject.isConnectable(srcObj, srcOutlet, this, inlet)) {
            const from = (srcObj as BaseAudioObject).outletConnections[srcOutlet];
            const to = this.inletConnections[inlet];
            const isAudioParam = to.node instanceof AudioParam;
            if (isAudioParam) from.node.connect(to.node as AudioParam, from.index);
            else from.node.connect(to.node as AudioNode, from.index, to.index);
        }
        return this;
    }
    disconnectedInlet(inlet: number, srcBox: Box, srcOutlet: number, lineID: string) {
        const srcObj = srcBox.object;
        if (BaseAudioObject.isConnectable(srcObj, srcOutlet, this, inlet)) {
            const from = (srcObj as BaseAudioObject).outletConnections[srcOutlet];
            const to = this.inletConnections[inlet];
            const isAudioParam = to.node instanceof AudioParam;
            if (isAudioParam) from.node.disconnect(to.node as AudioParam, from.index);
            else from.node.disconnect(to.node as AudioNode, from.index, to.index);
        }
        return this;
    }
    connectAll() {
        const lines = this.box.allLines;
        for (let i = 0; i < lines.length; i++) {
            const line = this.patcher.lines[lines[i]];
            line.enable();
        }
        return this;
    }
    disconnectAll() {
        const lines = this.box.allLines;
        for (let i = 0; i < lines.length; i++) {
            const line = this.patcher.lines[lines[i]];
            line.disable();
        }
        return this;
    }
}
export class DefaultAudioObject<D extends {} = {}, S extends {} = {}, I extends any[] = [], O extends any[] = [], A extends any[] = [], P extends Partial<DefaultUIState> & { [key: string]: any } = {}, U extends Partial<DefaultUIState> & { [key: string]: any } = {}, E extends {} = {}> extends BaseAudioObject<D, S, I, O, A, P, U & DefaultUIState, E> {
    static get meta(): TMeta {
        return DefaultObject.meta;
    }
    updateUIFromProps(props: Partial<P> & { [key: string]: any }) {
        super.updateUIFromProps(props);
        if (props) {
            const uiState: Partial<U & DefaultUIState> = {};
            for (const key in props) {
                if (key === "bgColor") uiState[key] = props[key];
                else if (key === "borderColor") uiState[key] = props[key];
                else if (key === "textColor") uiState[key] = props[key];
                else if (key === "fontFamily") uiState[key] = props[key];
                else if (key === "fontSize") uiState[key] = props[key];
                else if (key === "fontStyle") uiState[key] = props[key];
                else if (key === "fontWeight") uiState[key] = props[key];
                else if (key === "textAlign") uiState[key] = props[key];
            }
            this.updateUI(uiState);
        }
        return this;
    }
    get ui(): typeof BaseUI {
        return DefaultUI;
    }
}
class EmptyObject extends DefaultObject<{}, { editing: boolean }, [any], [any]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            author: "Fr0stbyteR",
            version: "1.0.0",
            description: "Bypass input",
            inlets: [{
                isHot: true,
                type: "anything",
                description: "output same thing"
            }],
            outlets: [{
                type: "anything",
                description: "output same thing"
            }]
        };
    }
    state = { editing: false };
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.outlets = 1;
        this.inlets = 1;
        this.state.editing = !!box._editing;
        delete box._editing;
    }
    fn<I extends keyof [any]>(data: [any][I], inlet: I) {
        this.outlet(0, data);
        return this;
    }
    get ui(): typeof BaseUI {
        return class EmptyObjectUI extends DefaultUI<EmptyObject> {
            componentDidMount() {
                super.componentDidMount();
                if (this.object.state.editing) this.toggleEdit(true);
            }
        };
    }
}
class InvalidObject extends DefaultObject<{}, {}, [any], [undefined]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "invalid object",
            inlets: [{
                isHot: false,
                type: "anything",
                varLength: true,
                description: "nothing"
            }],
            outlets: [{
                type: "anything",
                varLength: true,
                description: "nothing"
            }]
        };
    }
}
export class Bang {
    toString() {
        return "bang";
    }
}
export default { BaseObject, EmptyObject, InvalidObject };
