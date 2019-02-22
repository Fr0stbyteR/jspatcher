import * as React from "react";
import { Patcher } from "../Patcher";
import { Box } from "../Box";
import { BaseObject, BaseUI } from "./Base";
import "./UI.scss";
export class Comment extends BaseObject {
    static get _meta() {
        return Object.assign(BaseObject._meta, {
            package: "UI",
            name: this.name,
            author: "Fr0stbyteR",
            version: "1.0.0",
            icon: "",
            description: "Text Comment"
        });
    }
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.update(box.parsed.args, box.parsed.props);
    }
    update(args: any[], props: { [key: string]: any }) {
        if (!this.box.data.hasOwnProperty("text")) this.box.data.text = args.join(" ");
        return this;
    }
    ui() {
        return class CommentUI extends BaseUI {
            editableOnUnlock = true;
            state = { editing: false };
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
                    this.props.object.box.data.text = span.textContent;
                }
                return toggle;
            }
            handleBlur = (e: React.FocusEvent) => {}
            handleClick = (e: React.MouseEvent) => {
                e.stopPropagation();
            }
            handleKeyDown = (e: React.KeyboardEvent) => {
                if (e.key === "Enter") return; // propagate for parent for focus on boxUI
                e.stopPropagation();
            }
            handlePaste = (e: React.ClipboardEvent) => {
                e.preventDefault();
                document.execCommand("insertHTML", false, e.clipboardData.getData("text/plain"));
            }
            render() {
                const object = this.props.object;
                return (
                    <BaseUI {...this.props}>
                        <span contentEditable={false} className={"editable" + (this.state.editing ? " editing" : "")} ref={this.refSpan} onBlur={this.handleBlur} onClick={this.handleClick} onPaste={this.handlePaste} onKeyDown={this.handleKeyDown} suppressContentEditableWarning={true}>
                            {object.box.data.text}
                        </span>
                    </BaseUI>
                );
            }
        };
    }
}
export default { Comment };
