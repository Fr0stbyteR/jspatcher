import * as React from "react";
import BaseUI, { BaseUIProps, BaseUIState } from "./BaseUI";
import { selectElementRange } from "../../../utils/utils";
import type comment from "./Comment";
import type { CommentProps } from "./Comment";
import "./CommentUI.scss";

export interface CommentUIState extends BaseUIState, CommentProps {
    value: string;
}
export default class CommentUI extends BaseUI<comment, {}, { value: string }> {
    static editableOnUnlock = true;
    state: CommentUIState = { ...this.state, value: this.object.data.value };
    refSpan = React.createRef<HTMLSpanElement>();
    componentDidMount() {
        super.componentDidMount();
        if (this.refSpan.current) this.refSpan.current.innerText = this.state.value || "";
        if (this.props.editing) this.toggleEdit(this.props.editing);
    }
    componentDidUpdate(prevProps: Readonly<BaseUIProps>) {
        if (this.props.editing !== prevProps.editing) this.toggleEdit(this.props.editing);
    }
    toggleEdit(toggle: boolean) {
        const { editor, box } = this;
        if (editor.state.locked) return;
        if (!this.refSpan.current) return;
        const span = this.refSpan.current;
        if (toggle) {
            editor.selectOnly(box.id);
            span.focus();
            selectElementRange(span);
        } else {
            window.getSelection().removeAllRanges();
            span.blur();
            this.props.object.setData({ value: span.innerText });
        }
    }
    handleMouseDown = (e: React.MouseEvent) => (this.props.editing ? e.stopPropagation() : null);
    handleClick = (e: React.MouseEvent) => (this.props.editing ? e.stopPropagation() : null);
    handleKeyDown = (e: React.KeyboardEvent) => { // propagate for parent for focus on boxUI
        if (!this.props.editing) return;
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };
    handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        document.execCommand("insertHTML", false, e.clipboardData.getData("text/plain"));
    };
    render() {
        const containerStyle: React.CSSProperties = {
            backgroundColor: this.state.bgColor
        };
        const containerProps = { ...this.props.containerProps };
        containerProps.style = { ...containerProps.style, ...containerStyle };
        const spanStyle: React.CSSProperties = {
            color: this.state.textColor,
            fontFamily: `${this.state.fontFamily}, Tahoma, sans-serif`,
            fontSize: `${this.state.fontSize}px`,
            lineHeight: `${this.state.fontSize}px`,
            fontWeight: this.state.fontWeight,
            fontStyle: this.state.fontStyle,
            textAlign: this.state.textAlign,
            textDecoration: this.state.textDecoration
        };
        return (
            <BaseUI {...this.props} containerProps={containerProps}>
                <span contentEditable={this.props.editing} className={"editable" + (this.props.editing ? " editing" : "")} ref={this.refSpan} style={spanStyle} onMouseDown={this.handleMouseDown} onClick={this.handleClick} onPaste={this.handlePaste} onKeyDown={this.handleKeyDown} onBlur={this.props.onEditEnd} suppressContentEditableWarning={true}>
                    {this.state.value}
                </span>
            </BaseUI>
        );
    }
}
