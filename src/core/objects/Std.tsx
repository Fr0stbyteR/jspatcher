import * as React from "react";
import * as Util from "util";
import { Icon } from "semantic-ui-react";
import { BaseUI, DefaultObject, Bang } from "./Base";
import Patcher from "../Patcher";
import Box from "../Box";
import "./Std.scss";
import { BaseUIState, TMeta } from "../types";

class StdObject<D = {}, S = {}, I extends any[] = [], O extends any[] = [], A extends any[] = [], P = {}, U = {}> extends DefaultObject<D, S, I, O, A, P, U> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            package: "Std",
            author: "Fr0stbyteR",
            version: "1.0.0",
            description: "Standard Object"
        };
    }
}
type ButtonUIState = { editing: boolean; text: string; loading: boolean } & BaseUIState;
export class ButtonUI<T extends DefaultObject<{ text: string }, { editing: boolean }, any, any, any, any, { text: string }>> extends BaseUI<T, {}, ButtonUIState> {
    editableOnUnlock = true;
    state = { ...super.state, editing: false, loading: false, text: this.props.object.data.text };
    refSpan = React.createRef<HTMLSpanElement>();
    handleChanged = (text: string) => {};
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
            this.props.object.state.editing = true;
            span.contentEditable = "true";
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(span);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            this.setState({ editing: false, text: span.innerText });
            this.props.object.state.editing = false;
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
        if (!this.state.editing) return;
        e.preventDefault();
        document.execCommand("insertHTML", false, e.clipboardData.getData("text/plain"));
    }
    componentDidMount() {
        super.componentDidMount();
        if (this.object.state.editing) this.toggleEdit(true);
    }
    render() {
        const { object } = this;
        const classArray = ["box-ui-button", "ui", "button", "compact", "mini"];
        return (
            <BaseUI {...this.props} additionalClassName={classArray.join(" ")} containerProps={{ onClick: this.handleClick }}>
                <div className="box-ui-text-container">
                    {object.meta.icon ? <Icon inverted={true} loading={this.state.loading} size="small" name={this.state.loading ? "spinner" : object.meta.icon} /> : null}
                    <span contentEditable={false} className={"editable" + (this.state.editing ? " editing" : "")} ref={this.refSpan} onMouseDown={this.handleMouseDown} onClick={this.handleClickSpan} onPaste={this.handlePaste} onKeyDown={this.handleKeyDown} suppressContentEditableWarning={true}>
                        {this.state.text}
                    </span>
                </div>
            </BaseUI>
        );
    }
}
class message extends StdObject<{ text: string }, { buffer: any; editing: boolean }, [any, any], [any], [any], {}, { text: string }> {
    static get meta(): TMeta {
        return {
            ...super.meta,
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
                description: "Message to send"
            }]
        };
    }
    state = { buffer: new Bang(), editing: false };
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 2;
        this.outlets = 1;
        this.state.editing = box._editing;
        const args = box.args;
        if (typeof this.data.text === "string") this.state.buffer = this.parse(this.data.text);
        else if (args[0]) {
            this.data.text = this.stringify(args[0]);
            this.state.buffer = args[0];
        } else {
            this.data.text = "";
            this.state.buffer = new Bang();
        }
        this.updateUI({ text: this.data.text });
    }
    update(args?: [any?]) {
        this.updateBox(args);
        if (!args) return this;
        this.data.text = this.stringify(args[0]);
        if (args[0]) this.state.buffer = this.parse(args[0]);
        else this.state.buffer = new Bang();
        this.updateUI({ text: this.data.text });
        return this;
    }
    fn(data: any, inlet: number) {
        if (inlet === 0) {
            this.outlet(0, this.state.buffer);
            return this;
        }
        if (inlet === 1) {
            this.update([data]);
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
        return class MessageUI extends ButtonUI<message> {
            handleChanged = (text: string) => this.object.update([text]);
            handleClick = (e: React.MouseEvent) => {
                if (this.patcher.state.locked) this.object.outlet(0, this.object.state.buffer);
            }
        };
    }
}

class print extends StdObject<{}, { title: string }, [any], [], [string]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Print to console",
            inlets: [{
                isHot: true,
                type: "anything",
                description: "Anything to stringify"
            }],
            args: [{
                type: "string",
                optional: true,
                default: "Print",
                description: "Title"
            }]
        };
    }
    state = { title: "Print" };
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 1;
        this.outlets = 0;
        this.update((box as Box<this>).args, (box as Box<this>).props);
    }
    update(args?: [string?], props?: { [key: string]: any }) {
        this.updateBox(args, props);
        if (args && args[0]) this.state.title = args[0];
        return this;
    }
    fn(data: any, inlet: number) {
        if (inlet === 0) {
            if (data instanceof Bang) {
                this.patcher.newLog("none", this.state.title, "Bang");
            } else {
                this.patcher.newLog("none", this.state.title, typeof data === "string" ? data : Util.inspect(data));
            }
            return this;
        }
        return this;
    }
}
export default { message, print };
