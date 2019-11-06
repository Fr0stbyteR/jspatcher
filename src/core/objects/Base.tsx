/* eslint-disable @typescript-eslint/no-unused-vars */
import { EventEmitter } from "events";
import * as React from "react";
import { Icon, SemanticICONS } from "semantic-ui-react";
import Patcher from "../Patcher";
import Box from "../Box";
import "./Default.scss";
import "./Base.scss";
import { BaseUIState, DefaultUIState, BaseObjectEventMap } from "../types";
import { stringifyError } from "../../utils";

export type TInletsMeta = {
    isHot: boolean;
    type: "anything" | "signal" | "object" | "number" | "boolean" | "string" | "bang";
    varLength?: boolean;
    description: string;
}[];
export type TOutletMeta = {
    type: "anything" | "signal" | "object" | "number" | "boolean" | "string" | "bang";
    varLength?: boolean;
    description: string;
}[];
export type TArgsMeta = {
    type: "anything" | "signal" | "object" | "number" | "boolean" | "string" | "bang";
    optional: boolean;
    default?: any;
    varLength?: boolean;
    description: string;
}[];
export type TPropsMeta = {
    name: string;
    default?: any;
    type: "anything" | "signal" | "object" | "number" | "boolean" | "string" | "bang";
    description: string;
}[];
export type TMeta = {
    package: string; // div will have class "package-name" "package-name-objectname"
    name: string;
    icon: SemanticICONS; // semantic icon to display in UI
    author: string;
    version: string;
    description: string;
    inlets: TInletsMeta;
    outlets: TOutletMeta;
    args: TArgsMeta;
    props: TPropsMeta;
};
export class BaseUI<T extends BaseObject<any, any, any, any, any, any, any>, S = {}> extends React.Component<{ object: T; custom?: React.HTMLAttributes<HTMLDivElement> }, BaseUIState & S> {
    static sizing: "horizontal" | "vertical" | "both" | "ratio" = "horizontal";
    editableOnUnlock = false;
    get object() {
        return this.props.object;
    }
    get patcher() {
        return this.props.object.patcher;
    }
    get box() {
        return this.props.object.box;
    }
    toggleEdit = (bool?: boolean) => false;
    componentDidMount() {
        this.object.on("uiUpdate", this.handleUpdate);
    }
    componentWillUnmount() {
        this.object.off("uiUpdate", this.handleUpdate);
    }
    handleUpdate = <K extends keyof (BaseUIState & S)>(state: Pick<BaseUIState & S, K> | BaseUIState & S | null) => this.setState(state);
    render() {
        const { object } = this;
        const packageName = "package-" + object.meta.package.toLowerCase();
        const className = packageName + "-" + object.meta.name.toLowerCase();
        const classArray = [packageName, className, "box-ui-container"];
        return (
            <div className={classArray.join(" ")} {...this.props.custom}>
                {this.props.children}
            </div>
        );
    }
}
export class DefaultUI<T extends BaseObject<any, any, any, any, any, any, any>> extends BaseUI<T, DefaultUIState> {
    editableOnUnlock = true;
    state = { editing: false, text: "", loading: false, dropdown$: -1 };
    refSpan = React.createRef<HTMLSpanElement>();
    refDropdown = React.createRef<HTMLTableSectionElement>();
    dropdownOptions: { key: string; value: string; text: string; icon: SemanticICONS; description: string }[] = [];
    toggleEdit = (bool?: boolean) => {
        const { patcher, box } = this;
        if (bool === this.state.editing) return this.state.editing;
        if (patcher._state.locked) return this.state.editing;
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
                this.refSpan.current.innerText = this.dropdownOptions[this.state.dropdown$].key;
            }
            return;
        }
        if (e.key === " " && this.refSpan.current) {
            if (this.state.dropdown$ >= 0 && this.dropdownOptions[this.state.dropdown$]) {
                const span = this.refSpan.current;
                const text = this.state.text.split(" ").slice(0, -1).join(" ") + this.dropdownOptions[this.state.dropdown$].key + " ";
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
            const keys = Object.keys(patcher._state.lib).sort();
            for (let i = 0; i < keys.length; i++) {
                if (this.dropdownOptions.length > 10) break;
                const key = keys[i];
                if (key.startsWith(splitted[splitted.length - 1])) {
                    const o = patcher._state.lib[key];
                    this.dropdownOptions.push({ key, value: key, text: key, icon: o.meta.icon, description: o.meta.description });
                }
            }
        } else if (splitted[0] === "new" && splitted.length === 2) {
            const keys = Object.keys(patcher._state.lib).sort();
            for (let i = 0; i < keys.length; i++) {
                if (this.dropdownOptions.length > 10) break;
                const key = keys[i];
                if (key.startsWith(splitted[splitted.length - 1])) {
                    const o = patcher._state.lib[key];
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
            const text = this.state.text.split(" ").slice(0, -1).join(" ") + this.dropdownOptions[i].key;
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
    get containerProps(): JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> {
        return {};
    }
    get textContainerProps(): JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> {
        return {};
    }
    get prependProps(): JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> {
        return {};
    }
    get spanProps(): JSX.IntrinsicAttributes & React.ClassAttributes<HTMLSpanElement> & React.HTMLAttributes<HTMLSpanElement> {
        return {};
    }
    get appendProps(): JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> {
        return {};
    }
    render() {
        const { object } = this;
        const packageName = "package-" + object.meta.package.toLowerCase();
        const className = packageName + "-" + object.meta.name.toLowerCase();
        const classArray = [packageName, className, "box-ui-container", "box-ui-default"];
        return (
            <div className={classArray.join(" ")} {...this.containerProps}>
                <div className="box-ui-text-container" {...this.textContainerProps}>
                    <div className="box-ui-text-container-prepend" {...this.prependProps}>
                        {object.meta.icon ? <Icon inverted={true} loading={this.state.loading} size="small" name={this.state.loading ? "spinner" : object.meta.icon} /> : null}
                    </div>
                    <span contentEditable={false} className={"editable" + (this.state.editing ? " editing" : "")} ref={this.refSpan} onMouseDown={this.handleMouseDown} onClick={this.handleClick} onPaste={this.handlePaste} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} suppressContentEditableWarning={true} {...this.spanProps}>
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
                    <div className="box-ui-text-container-append" {...this.appendProps}>
                    </div>
                </div>
            </div>
        );
    }
}
export type Data<T> = T extends BaseObject<infer D, any, any, any, any, any, any> ? D : never;
export type State<T> = T extends BaseObject<any, infer S, any, any, any, any, any> ? S : never;
export type Inputs<T> = T extends BaseObject<any, any, infer I, any, any, any, any> ? I : never;
export type Outputs<T> = T extends BaseObject<any, any, any, infer O, any, any, any> ? O : never;
export type Args<T> = T extends BaseObject<any, any, any, any, infer A, any, any> ? A : never;
export type Props<T> = T extends BaseObject<any, any, any, any, any, infer P, any> ? P : never;
export type UIState<T> = T extends BaseObject<any, any, any, any, any, any, infer U> ? U : never;
export abstract class AbstractObject<D extends { [key: string]: any } = { [key: string]: any }, S extends { [key: string]: any } = { [key: string]: any }, I extends any[] = any[], O extends any[] = any[], A extends any[] = any[], P extends { [key: string]: any } = { [key: string]: any }, U extends { [key: string]: any } = { [key: string]: any }> extends EventEmitter<BaseObjectEventMap<U & BaseUIState>> {
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
     * @param {(Partial<U & BaseUIState> | null)} state
     * @returns {this}
     * @memberof AbstractObject
     */
    uiUpdate(state: Partial<U & BaseUIState> | null): this {
        this.emit("uiUpdate", state);
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
    update(args?: Partial<A>, props?: Partial<P>): this {
        this.updateBox(args, props);
        return this;
    }
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
        this._box.inlets = i;
    }
    get outlets() {
        return this._box.outlets;
    }
    set outlets(i: number) {
        this._box.outlets = i;
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
export class BaseObject<D extends { [key: string]: any } = {}, S extends { [key: string]: any } = {}, I extends any[] = [], O extends any[] = [], A extends any[] = [], P extends { [key: string]: any } = {}, U extends { [key: string]: any } = {}> extends AbstractObject<D, S, I, O, A, P, U> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            package: "Base"
        };
    }
    get ui(): typeof BaseUI {
        return DefaultUI;
    }
}
class EmptyObject extends BaseObject<{}, { editing: boolean }, [any], [any]> {
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
class InvalidObject extends BaseObject<{}, {}, [any], [undefined]> {
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
