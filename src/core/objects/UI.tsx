import * as React from "react";
import { Patcher } from "../Patcher";
import { Box } from "../Box";
import { BaseObject } from "./Base";
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
        this.update(box._parsed.args, box._parsed.props);
    }
    update(args: any[], props: { [key: string]: any }) {
        if (!this._box.data.hasOwnProperty("text")) this._box.data.text = args.join(" ");
        return this;
    }
    ui() {
        class CommentUI extends React.Component {
            props: { object: BaseObject };
            state = { editing: false };
            handleBlur = (e: React.FocusEvent) => {
                const span = e.target as HTMLSpanElement;
                this.setState({ editing: false });
                this.props.object._box.data.text = span.textContent;
                span.contentEditable = "false";
                window.getSelection().removeAllRanges();
            }
            handleClick = (e: React.MouseEvent) => {
                if (this.state.editing) return;
                if (this.props.object._patcher._state.locked) return;
                this.setState({ editing: true });
                const span = e.target as HTMLSpanElement;
                span.contentEditable = "true";
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(span);
                selection.removeAllRanges();
                selection.addRange(range);
            }
            handleKeyDown = (e: React.KeyboardEvent) => {
                if (e.key === "Enter") {
                    window.getSelection().removeAllRanges();
                    const span = e.target as HTMLSpanElement;
                    span.contentEditable = "false";
                    this.setState({ editing: !this.state.editing });
                    e.stopPropagation();
                }
            }
            handlePaste = (e: React.ClipboardEvent) => {
                e.preventDefault();
                document.execCommand("insertHTML", false, e.clipboardData.getData("text/plain"));
            }
            render() {
                const object = this.props.object;
                const packageName = "package-" + object._meta.package.toLowerCase();
                const className = packageName + "-" + object._meta.name.toLowerCase();
                const classArray = [packageName, className, "box-ui-container"];
                return (
                    <div className={classArray.join(" ")}>
                        <span contentEditable={false} className={"editable" + (this.state.editing ? " editing" : "")} onBlur={this.handleBlur} onClick={this.handleClick} onPaste={this.handlePaste} onKeyDown={this.handleKeyDown} suppressContentEditableWarning={true}>
                            {object._box.data.text}
                        </span>
                    </div>
                );
            }
        }
        return <CommentUI object={this} />;
    }
}
export default { Comment };
