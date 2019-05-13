import * as React from "react";
import * as Util from "util";
import { Icon } from "semantic-ui-react";
import { BaseUI, BaseObject, TMeta, Bang } from "./Base";
import Patcher from "../Patcher";
import Box from "../Box";
import "./Std.scss";

class StdObject extends BaseObject {
    static get _meta(): TMeta {
        return {
            ...super._meta,
            package: "Std",
            author: "Fr0stbyteR",
            version: "1.0.0",
            description: "Standard Object"
        };
    }
}
export class ButtonUI<T extends BaseObject> extends BaseUI<T> {
    editableOnUnlock = true;
    state = { editing: false, loading: false, text: "" };
    refSpan = React.createRef<HTMLSpanElement>();
    handleChanged = (text: string) => {};
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
            this.handleChanged(span.textContent);
        }
        return toggle;
    }
    handleMouseDown = (e: React.MouseEvent) => (this.state.editing ? e.stopPropagation() : null);
    handleClickSpan = (e: React.MouseEvent) => (this.state.editing ? e.stopPropagation() : null);
    handleClick = (e: React.MouseEvent) => {};
    handleKeyDown = (e: React.KeyboardEvent) => { // propagate for parent for focus on boxUI
        if (!this.state.editing) return;
        if (e.key === "Enter") {
            e.preventDefault();
            return;
        }
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }
    handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        document.execCommand("insertHTML", false, e.clipboardData.getData("text/plain"));
    }
    componentWillMount() {
        this.setState({ text: this.props.object.data.text });
    }
    componentDidMount() {
        this.props.object.on("uiUpdate", this.handleUpdate);
        if (this.props.object.mem.editing) this.toggleEdit(true);
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
        const classArray = [packageName, className, "box-ui-container", "box-ui-button", "ui", "button", "compact", "mini"];
        return (
            <div className={classArray.join(" ")} onClick={this.handleClick}>
                <div className="box-ui-text-container">
                    {object._meta.icon ? <Icon inverted={true} loading={this.state.loading} size="small" name={this.state.loading ? "spinner" : object._meta.icon} /> : null}
                    <span contentEditable={false} className={"editable" + (this.state.editing ? " editing" : "")} ref={this.refSpan} onMouseDown={this.handleMouseDown} onClick={this.handleClickSpan} onPaste={this.handlePaste} onKeyDown={this.handleKeyDown} suppressContentEditableWarning={true}>
                        {this.state.text}
                    </span>
                </div>
            </div>
        );
    }
}
class Message extends StdObject {
    static get _meta(): TMeta {
        return {
            ...super._meta,
            description: "Message",
            inlets: [{
                isHot: true,
                type: "anything",
                description: "Trigger output the message"
            }, {
                isHot: false,
                type: "anything",
                description: "Set the message"
            }],
            outlets: [{
                type: "anything",
                description: "message to send"
            }]
        };
    }
    protected _mem: { buffer: any; editing: boolean } = { buffer: new Bang(), editing: false };
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 2;
        this.outlets = 1;
        this._mem.editing = box._editing;
        const args = box.parsed.args;
        if (typeof this.data.text === "string") this._mem.buffer = this.parse(this.data.text);
        else if (args[0]) {
            this.data.text = this.stringify(args[0]);
            this._mem.buffer = args[0];
        } else {
            this.data.text = "";
            this._mem.buffer = new Bang();
        }
        this.uiUpdate({ text: this.data.text });
    }
    update(args: any[]) {
        this.data.text = this.stringify(args[0]);
        if (args[0]) this._mem.buffer = this.parse(args[0]);
        else this._mem.buffer = new Bang();
        this.uiUpdate({ text: this.data.text });
        return this;
    }
    fn(data: any, inlet: number) {
        if (inlet === 0) {
            this.outlet(0, this._mem.buffer);
            return this;
        }
        if (inlet === 1) {
            this.update([Util.inspect(data)]);
            return this;
        }
        return this;
    }
    parse(o: any) {
        if (typeof o === "string") {
            if (o.length > 0) {
                try {
                    return JSON.parse(o);
                } catch (e) {
                    return o;
                }
            }
            return new Bang();
        }
        return o;
    }
    stringify(o: any) {
        if (typeof o === "string") return o;
        return Util.inspect(o);
    }
    get ui(): typeof BaseUI {
        return class MessageUI extends ButtonUI<Message> {
            handleChanged = (text: string) => this.props.object.update([text]);
            handleClick = (e: React.MouseEvent) => this.props.object.outlet(0, this.props.object.mem.buffer);
        };
    }
}

export default { Message };
