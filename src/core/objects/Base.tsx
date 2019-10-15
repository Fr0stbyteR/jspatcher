/* eslint-disable @typescript-eslint/no-unused-vars */
import { EventEmitter } from "events";
import * as React from "react";
import { Icon, SemanticICONS } from "semantic-ui-react";
import Patcher from "../Patcher";
import Box from "../Box";
import "./Default.scss";
import "./Base.scss";
import { BaseUIState, DefaultUIState, BaseObjectEventMap } from "../types";

export type TInletsMeta = {
    isHot: boolean;
    type: "anything" | "signal" | "object" | "number" | "boolean" | string;
    varLength?: boolean;
    description: string;
}[];
export type TOutletMeta = {
    type: "anything" | "signal" | "object" | "number" | "boolean" | string;
    varLength?: boolean;
    description: string;
}[];
export type TArgsMeta = {
    type: "anything" | "signal" | "object" | "number" | "boolean" | string;
    optional: boolean;
    default?: any;
    varLength?: boolean;
    description: string;
}[];
export type TPropsMeta = {
    name: string;
    default?: any;
    type: "anything" | "signal" | "object" | "number" | "boolean" | string;
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
export class BaseUI<T extends BaseObject, P = {}, S = {}> extends React.Component<{ object: T } & P, BaseUIState & S> {
    static sizing: "horizontal" | "vertical" | "both" | "ratio" = "horizontal";
    editableOnUnlock = false;
    toggleEdit = (bool?: boolean) => false;
    render() {
        const { object } = this.props;
        const packageName = "package-" + object.meta.package.toLowerCase();
        const className = packageName + "-" + object.meta.name.toLowerCase();
        const classArray = [packageName, className, "box-ui-container"];
        return (
            <div className={classArray.join(" ")}>
                {this.props.children}
            </div>
        );
    }
}
export class DefaultUI<T extends BaseObject> extends BaseUI<T, {}, DefaultUIState> {
    editableOnUnlock = true;
    state = { editing: false, text: "", loading: false, dropdown$: -1 };
    refSpan = React.createRef<HTMLSpanElement>();
    refDropdown = React.createRef<HTMLTableSectionElement>();
    dropdownOptions: { key: string; value: string; text: string; icon: SemanticICONS; description: string }[] = [];
    toggleEdit = (bool?: boolean) => {
        if (bool === this.state.editing) return this.state.editing;
        if (this.props.object.patcher._state.locked) return this.state.editing;
        if (!this.refSpan.current) return this.state.editing;
        const toggle = !this.state.editing;
        const span = this.refSpan.current;
        if (toggle) {
            this.props.object.patcher.selectOnly(this.props.object.box.id);
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
            this.props.object.patcher.changeBoxText(this.props.object.box.id, span.textContent);
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
                const text = this.dropdownOptions[this.state.dropdown$].key + " ";
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
        this.dropdownOptions = [];
        const splited = this.refSpan.current.innerText.split(" ");
        for (const key in this.props.object.patcher._state.lib) {
            if (this.dropdownOptions.length > 10) break;
            if (key.indexOf(splited[0]) !== -1) {
                const o = this.props.object.patcher._state.lib[key];
                this.dropdownOptions.push({ key, value: key, text: key, icon: o.meta.icon, description: o.meta.description });
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
            const text = this.dropdownOptions[i].key;
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
        this.props.object.on("uiUpdate", this.handleUpdate);
        this.setState({ text: this.props.object.box.text });
    }
    componentWillUnmount() {
        this.props.object.off("uiUpdate", this.handleUpdate);
    }
    handleUpdate = <K extends keyof DefaultUIState>(state: Pick<DefaultUIState, K> | DefaultUIState | null) => this.setState(state);
    render() {
        const object = this.props.object;
        const packageName = "package-" + object.meta.package.toLowerCase();
        const className = packageName + "-" + object.meta.name.toLowerCase();
        const classArray = [packageName, className, "box-ui-container", "box-ui-default"];
        return (
            <div className={classArray.join(" ")}>
                <div className="box-ui-text-container">
                    {object.meta.icon ? <Icon inverted={true} loading={this.state.loading} size="small" name={this.state.loading ? "spinner" : object.meta.icon} /> : null}
                    <span contentEditable={false} className={"editable" + (this.state.editing ? " editing" : "")} ref={this.refSpan} onMouseDown={this.handleMouseDown} onClick={this.handleClick} onPaste={this.handlePaste} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} suppressContentEditableWarning={true}>
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
                </div>
            </div>
        );
    }
}
export class BaseObject<D = {}, S = {}, UIS = {}> extends EventEmitter<BaseObjectEventMap<UIS & BaseUIState>> {
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
        return (this.constructor as typeof BaseObject).meta;
    }
    private readonly _patcher: Patcher;
    private readonly _box: Box<D>;
    /**
     * should save all temporary variables here
     *
     * @type {S}
     * @memberof BaseObject
     */
    state: S;
    constructor(box: Box<D>, patcher: Patcher) {
        super();
        // patcher object outside, use _ for prevent recursive stringify
        this._patcher = patcher;
        // the box which create this instance, use _ for prevent recursive stringify
        this._box = box;
        // usually do this after initialization
        // this.update(box.parsed.args, box.parsed.props);
    }
    // build new ui on page, return a React Component, override this
    get ui(): typeof BaseUI {
        return DefaultUI;
    }
    // update UI's React State
    uiUpdate<State = UIS & BaseUIState>(state: Pick<State, keyof State> | State | null) {
        this.emit("uiUpdate", state);
    }
    // when arguments and @properties are changed, can use this in constructor
    update(args: any[], props: { [key: string]: any }) {
        return this;
    }
    // main function when receive data from a inlet (base 0)
    fn(data: any, inlet: number) {
        return this;
    }
    // use this function to output data with ith outlet.
    outlet(outlet: number, data: any) {
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
    post(data: string) {
        this._patcher.newLog("none", this.meta.name, data, this._box);
        return this;
    }
    error(data: string) {
        this._patcher.newLog("error", this.meta.name, data, this._box);
        return this;
    }
    info(data: string) {
        this._patcher.newLog("info", this.meta.name, data, this._box);
        return this;
    }
    warn(data: string) {
        this._patcher.newLog("warn", this.meta.name, data, this._box);
        return this;
    }
    get patcher() {
        return this._patcher;
    }
    /**
     * this will be stored with patcher
     *
     * @readonly
     * @memberof BaseObject
     */
    get data() {
        return this._box.data;
    }
    set data(dataIn: D) {
        this._box.data = dataIn;
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
class EmptyObject extends BaseObject<{}, { editing: boolean }> {
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
    fn(data: any, inlet: number) {
        this.outlet(0, data);
        return this;
    }
    get ui(): typeof BaseUI {
        return class EmptyObjectUI extends DefaultUI<EmptyObject> {
            componentDidMount() {
                super.componentDidMount();
                if (this.props.object.state.editing) this.toggleEdit(true);
            }
        };
    }
}
class InvalidObject extends BaseObject {
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
