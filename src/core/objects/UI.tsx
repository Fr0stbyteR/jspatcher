import * as React from "react";
import Patcher from "../Patcher";
import Box from "../Box";
import { BaseObject, BaseUI, TMeta } from "./Base";
import "./UI.scss";

export class Comment extends BaseObject<{ text: string }, {}, [], [], [string]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            package: "UI",
            author: "Fr0stbyteR",
            version: "1.0.0",
            description: "Text Comment",
            args: [{
                type: "string",
                optional: true,
                description: "Initial text"
            }]
        };
    }
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.update((box as Box<this>).parsed.args);
    }
    update(args: [string]) {
        if (!this.data.hasOwnProperty("text")) this.data.text = args.join(" ");
        return this;
    }
    get ui(): typeof BaseUI {
        return class CommentUI extends BaseUI<Comment> {
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
                    this.props.object.data.text = span.textContent;
                }
                return toggle;
            }
            handleMouseDown = (e: React.MouseEvent) => (this.state.editing ? e.stopPropagation() : null);
            handleClick = (e: React.MouseEvent) => (this.state.editing ? e.stopPropagation() : null);
            handleKeyDown = (e: React.KeyboardEvent) => { // propagate for parent for focus on boxUI
                if (!this.state.editing) return;
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
            }
            handlePaste = (e: React.ClipboardEvent) => {
                e.preventDefault();
                document.execCommand("insertHTML", false, e.clipboardData.getData("text/plain"));
            }
            render() {
                const object = this.props.object;
                return (
                    <BaseUI {...this.props}>
                        <span contentEditable={false} className={"editable" + (this.state.editing ? " editing" : "")} ref={this.refSpan} onMouseDown={this.handleMouseDown} onClick={this.handleClick} onPaste={this.handlePaste} onKeyDown={this.handleKeyDown} suppressContentEditableWarning={true}>
                            {object.data.text}
                        </span>
                    </BaseUI>
                );
            }
        };
    }
}
export default { Comment };
