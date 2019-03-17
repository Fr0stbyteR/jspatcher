import { EventEmitter } from "events";
import * as React from "react";
import { Patcher } from "../Patcher";
import { Box } from "../Box";
import "./Default.scss";
import "./Base.scss";
import { Icon, SemanticICONS } from "semantic-ui-react";
export type TInletsMeta = {
    isHot: boolean,
    type: "anything" | "signal" | "object" | "number" | "boolean" | string,
    varLength?: boolean,
    description: string
}[];
export type TOutletMeta = {
    type: "anything" | "signal" | "object" | "number" | "boolean" | string,
    varLength?: boolean,
    description: string
}[];
export type TArgsMeta = {
    type: "anything" | "signal" | "object" | "number" | "boolean" | string,
    optional: boolean,
    default?: any,
    varLength?: boolean,
    description: string
}[];
export type TPropsMeta = {
    name: string,
    default?: any,
    type: "anything" | "signal" | "object" | "number" | "boolean" | string,
    description: string
}[];
export type TMeta = {
    package: string, // div will have class "package-name" "package-name-objectname"
    name: string,
    icon: SemanticICONS, // semantic icon to display in UI
    author: string,
    version: string,
    description: string,
    inlets: TInletsMeta,
    outlets: TOutletMeta,
    args: TArgsMeta,
    props: TPropsMeta
};
export class BaseObject extends EventEmitter {
    protected static get _meta(): TMeta {
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
    get _meta() {
        return (this.constructor as typeof BaseObject)._meta;
    }
    private readonly _patcher: Patcher;
    private readonly _box: Box;
    protected _mem: { [key: string]: any };
    constructor(box: Box, patcher: Patcher) {
        super();
        // patcher object outside, use _ for pre`vent recursive stringify
        this._patcher = patcher;
        // the box which create this instance, use _ for prevent recursive stringify
        this._box = box;
        // should save all temporary variables here
        this._mem = {};
        // usually do this after initialization
        // this.update(box._args, box._props);
    }
    // build new ui on page, return a React Component, override this
    ui() {
        return DefaultUI as typeof BaseUI;
    }
    // update UI's React State
    uiUpdate(state: { [key: string]: any }) {
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
        const outletLines = this.outletLines[outlet].sort((id1, id2) => {
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
        this._patcher.newLog(0, this._meta.name, data);
        return this;
    }
    error(data: string) {
        this._patcher.newLog(1, this._meta.name, data);
        return this;
    }
    info(data: string) {
        this._patcher.newLog(-2, this._meta.name, data);
        return this;
    }
    warn(data: string) {
        this._patcher.newLog(-1, this._meta.name, data);
        return this;
    }
    get patcher() {
        return this._patcher;
    }
    get mem() {
        return this._mem;
    }
    get box() {
        return this._box;
    }
    get inlets() {
        return this._box.inlets;
    }
    get outlets() {
        return this._box.outlets;
    }
    set inlets(i: number) {
        this._box.inlets = i;
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
class EmptyObject extends BaseObject {
    static get _meta(): TMeta {
        return { ...super._meta,
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
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.outlets = 1;
        this.inlets = 1;
    }
    fn(data: any, inlet: number) {
        this.outlet(0, data);
        return this;
    }
}
class InvalidObject extends BaseObject {
    static get _meta(): TMeta {
        return { ...super._meta,
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
export class BaseUI extends React.Component {
    props: { object: BaseObject, children?: React.ReactNode };
    editableOnUnlock = false;
    toggleEdit = (bool?: boolean) => false;
    render() {
        const object = this.props.object;
        const packageName = "package-" + object._meta.package.toLowerCase();
        const className = packageName + "-" + object._meta.name.toLowerCase();
        const classArray = [packageName, className, "box-ui-container"];
        return (
            <div className={classArray.join(" ")}>
                {this.props.children}
            </div>
        );
    }
}
export class DefaultUI extends BaseUI {
    editableOnUnlock = true;
    state = { editing: false, loading: false };
    refSpan = React.createRef() as React.RefObject<HTMLSpanElement>;
    toggleEdit = (bool?: boolean) => {
        if (bool === this.state.editing) return this.state.editing;
        if (this.props.object.patcher._state.locked) return this.state.editing;
        if (!this.refSpan.current) return this.state.editing;
        const toggle = !this.state.editing;
        const span = this.refSpan.current;
        if (toggle) {
            this.setState({ editing: true });
            span.contentEditable = "true";
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(span);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            this.setState({ editing: false });
            span.contentEditable = "false";
            window.getSelection().removeAllRanges();
            this.props.object.patcher.changeBoxText(this.props.object.box.id, span.textContent);
        }
        return toggle;
    }
    handleMouseDown = (e: React.MouseEvent) => this.state.editing ? e.stopPropagation() : null;
    handleClick = (e: React.MouseEvent) => this.state.editing ? e.stopPropagation() : null;
    handleKeyDown = (e: React.KeyboardEvent) => e.key === "Enter" ? null : this.state.editing ? e.stopPropagation() : null; // propagate for parent for focus on boxUI
    handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        document.execCommand("insertHTML", false, e.clipboardData.getData("text/plain"));
    }
    componentDidMount() {
        this.props.object.on("uiUpdate", this.handleUpdate);
    }
    componentWillUnmount() {
        this.props.object.off("uiUpdate", this.handleUpdate);
    }
    handleUpdate = (state: { [key: string]: any }) => {
        this.setState(state);
    }
    render() {
        const object = this.props.object;
        const packageName = "package-" + object._meta.package.toLowerCase();
        const className = packageName + "-" + object._meta.name.toLowerCase();
        const classArray = [packageName, className, "box-ui-container", "box-ui-default"];
        return (
            <div className={classArray.join(" ")}>
                <div className="box-ui-text-container">
                    {object._meta.icon ? <Icon inverted={true} loading={this.state.loading} size="small" name={this.state.loading ? "spinner" : object._meta.icon} /> : null}
                    <span contentEditable={false} className={"editable" + (this.state.editing ? " editing" : "")} ref={this.refSpan} onMouseDown={this.handleMouseDown} onClick={this.handleClick} onPaste={this.handlePaste} onKeyDown={this.handleKeyDown} suppressContentEditableWarning={true}>
                        {object.box.text}
                    </span>
                </div>
            </div>
        );
    }
}
export class Bang {
    toString() {
        return "bang";
    }
}
export default { BaseObject, EmptyObject, InvalidObject };
