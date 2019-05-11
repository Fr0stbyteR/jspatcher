import * as React from "react";
import Patcher from "../Patcher";
import Box from "../Box";
import { BaseObject, BaseUI, TMeta } from "./Base";
import "./UI.scss";

export class Comment extends BaseObject {
    static get _meta(): TMeta {
        return {
            ...super._meta,
            package: "UI",
            author: "Fr0stbyteR",
            version: "1.0.0",
            description: "Text Comment"
        };
    }
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.update(box.parsed.args);
    }
    update(args: any[]) {
        if (!this.box.data.hasOwnProperty("text")) this.box.data.text = args.join(" ");
        return this;
    }
    get ui() {
        return class CommentUI extends BaseUI {
            editableOnUnlock = true;
            state = { editing: false };
            refSpan = React.createRef<HTMLSpanElement>();
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
                    this.props.object.box.data.text = span.textContent;
                }
                return toggle;
            }
            handleMouseDown = (e: React.MouseEvent) => (this.state.editing ? e.stopPropagation() : null);
            handleClick = (e: React.MouseEvent) => (this.state.editing ? e.stopPropagation() : null);
            handleKeyDown = (e: React.KeyboardEvent) => (this.state.editing ? e.stopPropagation() : null);
            handlePaste = (e: React.ClipboardEvent) => {
                e.preventDefault();
                document.execCommand("insertHTML", false, e.clipboardData.getData("text/plain"));
            }
            render() {
                const object = this.props.object;
                return (
                    <BaseUI {...this.props}>
                        <span contentEditable={false} className={"editable" + (this.state.editing ? " editing" : "")} ref={this.refSpan} onMouseDown={this.handleMouseDown} onClick={this.handleClick} onPaste={this.handlePaste} onKeyDown={this.handleKeyDown} suppressContentEditableWarning={true}>
                            {object.box.data.text}
                        </span>
                    </BaseUI>
                );
            }
        };
    }
}
export default { Comment };
