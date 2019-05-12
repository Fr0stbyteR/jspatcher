import * as React from "react";
import { Icon } from "semantic-ui-react";
import { BaseUI, BaseObject, TMeta, Bang } from "./Base";
import Patcher from "../Patcher";
import Box from "../Box";
import "./Std.scss";

export class ButtonUI<T extends BaseObject> extends BaseUI<T> {
    editableOnUnlock = true;
    state = { editing: false, loading: false };
    refSpan = React.createRef<HTMLSpanElement>();
    handleChanged = (text: string) => {};
    toggleEdit = (bool?: boolean) => {
        if (bool === this.state.editing) return this.state.editing;
        if (this.props.object.patcher._state.locked) return this.state.editing;
        if (!this.refSpan.current) return this.state.editing;
        const toggle = !this.state.editing;
        const span = this.refSpan.current;
        if (toggle) {
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
    componentDidMount() {
        this.props.object.on("uiUpdate", this.handleUpdate);
        this.setState({ text: this.props.object.box.text });
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
                        {object.box.text}
                    </span>
                </div>
            </div>
        );
    }
}
class Message extends BaseObject {
    static get _meta(): TMeta {
        return {
            ...super._meta,
            description: "Message",
            inlets: [{
                isHot: true,
                type: "anything",
                description: "First element"
            }],
            outlets: [{
                type: "anything",
                description: "message to send"
            }]
        };
    }
    protected _mem: { buffer: any } = { buffer: new Bang() };
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 1;
        this.outlets = 1;
        this.update(box.parsed.args, box.parsed.props);
    }
    update(args: any[], props: { [key: string]: any }) { // eslint-disable-line @typescript-eslint/no-unused-vars
        this._mem.buffer = args[0];
        return this;
    }
    fn(data: any, inlet: number) {
        if (inlet === 0 && data instanceof Bang) {
            this.outlet(0, this._mem.buffer);
            return this;
        }
        return this;
    }
    get ui(): typeof BaseUI {
        return class MessageUI extends ButtonUI<Message> {
            handleChanged = (text: string) => this.props.object.mem.buffer = text;
            handleClick = (e: React.MouseEvent) => this.props.object.outlet(0, this.props.object.mem.buffer);
        };
    }
}

export default { Message };
