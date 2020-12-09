import * as React from "react";
import UIObject from "./Base";
import { BaseUIState, BaseUI, BaseUIProps } from "../BaseUI";
import { selectElementRange } from "../../../utils/utils";
import { TMeta, TPropsMeta } from "../../types";

interface CommentProps {
    bgColor: string;
    textColor: string;
    fontFamily: string;
    fontSize: number;
    fontStyle: "normal" | "italic" | "oblique";
    fontWeight: "normal" | "bold" | "lighter" | "bolder" | number;
    textAlign: "center" | "left" | "right";
}
interface CommentUIState extends BaseUIState, CommentProps {
    value: string;
}
class CommentUI extends BaseUI<comment, {}, { value: string }> {
    static editableOnUnlock = true;
    state: CommentUIState = { ...this.state, value: this.object.data.value };
    refSpan = React.createRef<HTMLSpanElement>();
    componentDidMount() {
        super.componentDidMount();
        if (this.props.editing) this.toggleEdit(this.props.editing);
    }
    componentDidUpdate(prevProps: Readonly<BaseUIProps>) {
        if (this.props.editing !== prevProps.editing) this.toggleEdit(this.props.editing);
    }
    toggleEdit(toggle: boolean) {
        const { patcher, box } = this;
        if (patcher.state.locked) return;
        if (!this.refSpan.current) return;
        const span = this.refSpan.current;
        if (toggle) {
            patcher.selectOnly(box.id);
            span.focus();
            selectElementRange(span);
        } else {
            window.getSelection().removeAllRanges();
            span.blur();
            this.props.object.setData({ value: span.textContent });
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
            textAlign: this.state.textAlign
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
export default class comment extends UIObject<{ value: string }, {}, [string], [], [string], CommentProps, CommentUIState> {
    static description = "Text Comment";
    static args: TMeta["args"] = [{
        type: "string",
        optional: true,
        varLength: true,
        description: "Initial text"
    }];
    static props: TPropsMeta<CommentProps> = {
        bgColor: {
            type: "color",
            default: "transparent",
            description: "Background color",
            isUIState: true
        },
        textColor: {
            type: "color",
            default: "rgb(255, 255, 255)",
            description: "Text color",
            isUIState: true
        },
        fontFamily: {
            type: "enum",
            enums: ["Lato", "Georgia", "Times New Roman", "Arial", "Tahoma", "Verdana", "Courier New"],
            default: "Lato",
            description: "Font family",
            isUIState: true
        },
        fontSize: {
            type: "number",
            default: 12,
            description: "Text font size",
            isUIState: true
        },
        fontStyle: {
            type: "enum",
            enums: ["normal", "italic", "oblique"],
            default: "normal",
            description: "Text style",
            isUIState: true
        },
        fontWeight: {
            type: "string",
            default: "normal",
            description: 'Text style: "normal" | "bold" | "lighter" | "bolder" | number',
            isUIState: true
        },
        textAlign: {
            type: "enum",
            enums: ["left", "center", "right"],
            default: "left",
            description: "Text style",
            isUIState: true
        }
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 0;
        });
        this.on("updateArgs", (args) => {
            if (!this.data.hasOwnProperty("value")) this.setData({ value: args.join(" ") });
        });
        this.on("inlet", ({ data, inlet }) => {
            if (typeof data === "string") {
                this.setData({ value: data });
                this.updateUI({ value: data });
            }
        });
    }
    static UI: typeof BaseUI = CommentUI;
}
