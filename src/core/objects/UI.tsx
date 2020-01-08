import * as React from "react";
import * as Util from "util";
import { Dimmer, Loader, Icon } from "semantic-ui-react";
import MonacoEditor from "react-monaco-editor";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { Bang, BaseObject } from "./Base";
import "./UI.scss";
import { TMeta } from "../types";
import { BaseUI, BaseUIProps, BaseUIState } from "./BaseUI";
import { selectElementRange } from "../../utils/utils";

type ButtonUIState = { text: string; loading: boolean } & BaseUIState;
export class ButtonUI<T extends BaseObject<{ text: string }, { editing: boolean }, any, any, any, any, { text: string }>> extends BaseUI<T, {}, ButtonUIState> {
    state: ButtonUIState = { ...this.state, loading: false, text: this.props.object.data.text };
    refSpan = React.createRef<HTMLSpanElement>();
    componentDidMount() {
        super.componentDidMount();
        if (this.props.editing) this.toggleEdit(this.props.editing);
    }
    componentDidUpdate(prevProps: Readonly<BaseUIProps>) {
        if (this.props.editing !== prevProps.editing) this.toggleEdit(this.props.editing);
    }
    handleChanged = (text: string) => {};
    toggleEdit(toggle: boolean) {
        const { patcher, box } = this;
        if (patcher.state.locked) return;
        if (!this.refSpan.current) return;
        const span = this.refSpan.current;
        if (toggle) {
            patcher.selectOnly(box.id);
            this.setState({ text: span.textContent }, () => {
                span.focus();
                selectElementRange(span);
            });
        } else {
            window.getSelection().removeAllRanges();
            span.blur();
            this.setState({ text: span.textContent });
            this.handleChanged(span.textContent);
        }
    }
    handleMouseDown = (e: React.MouseEvent) => (this.props.editing ? e.stopPropagation() : null);
    handleClickSpan = (e: React.MouseEvent) => (this.props.editing ? e.stopPropagation() : null);
    handleClick = (e: React.MouseEvent) => {};
    handleKeyDown = (e: React.KeyboardEvent) => { // propagate for parent for focus on boxUI
        if (!this.props.editing) return;
        if (e.key === "Enter") {
            e.preventDefault();
            return;
        }
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }
    handlePaste = (e: React.ClipboardEvent) => {
        if (!this.props.editing) return;
        e.preventDefault();
        document.execCommand("insertHTML", false, e.clipboardData.getData("text/plain"));
    }
    render() {
        const { object } = this;
        const classArray = ["box-ui-button", "ui", "button", "compact", "mini"];
        return (
            <BaseUI {...this.props} additionalClassName={classArray.join(" ")} containerProps={{ onClick: this.handleClick }}>
                <div className="box-ui-text-container">
                    {object.meta.icon ? <Icon inverted={true} loading={this.state.loading} size="small" name={this.state.loading ? "spinner" : object.meta.icon} /> : null}
                    <span contentEditable={this.props.editing} className={"editable" + (this.props.editing ? " editing" : "")} ref={this.refSpan} onMouseDown={this.handleMouseDown} onClick={this.handleClickSpan} onPaste={this.handlePaste} onKeyDown={this.handleKeyDown} onBlur={this.props.onEditEnd} suppressContentEditableWarning={true}>
                        {this.state.text}
                    </span>
                </div>
            </BaseUI>
        );
    }
}
class MessageUI extends ButtonUI<message> {
    static editableOnUnlock = true;
    handleChanged = (text: string) => this.object.handleUpdateArgs([text]);
    handleClick = (e: React.MouseEvent) => {
        if (this.patcher.state.locked) this.object.outlet(0, this.object.state.buffer);
    }
}
class message extends BaseObject<{ text: string }, { buffer: any; editing: boolean }, [any, any], [any], [any], {}, { text: string }> {
    static package = "UI";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Message";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Trigger output the message"
    }, {
        isHot: false,
        type: "anything",
        description: "Set the message"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "anything",
        description: "Message to send"
    }];
    state = { buffer: new Bang(), editing: false };
    handleUpdateArgs = (args: any[]) => {
        if (typeof args[0] !== "undefined") {
            this.data.text = this.stringify(args[0]);
            this.state.buffer = this.parse(args[0]);
        } else {
            this.state.buffer = new Bang();
        }
        this.updateUI({ text: this.data.text });
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 1;
            const args = this.box.args;
            if (typeof this.data.text === "string") this.state.buffer = this.parse(this.data.text);
            else if (typeof args[0] !== "undefined") {
                this.data.text = this.stringify(args[0]);
                this.state.buffer = args[0];
            } else {
                this.data.text = "";
                this.state.buffer = new Bang();
            }
        });
        this.on("updateArgs", this.handleUpdateArgs);
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) this.outlet(0, this.state.buffer);
            else if (inlet === 1) this.handleUpdateArgs([data]);
        });
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
    uiComponent: typeof BaseUI = MessageUI;
}
class CommentUI extends BaseUI<comment> {
    static editableOnUnlock = true;
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
            this.props.object.data.value = span.textContent;
        }
    }
    handleMouseDown = (e: React.MouseEvent) => (this.props.editing ? e.stopPropagation() : null);
    handleClick = (e: React.MouseEvent) => (this.props.editing ? e.stopPropagation() : null);
    handleKeyDown = (e: React.KeyboardEvent) => { // propagate for parent for focus on boxUI
        if (!this.props.editing) return;
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
                <span contentEditable={this.props.editing} className={"editable" + (this.props.editing ? " editing" : "")} ref={this.refSpan} onMouseDown={this.handleMouseDown} onClick={this.handleClick} onPaste={this.handlePaste} onKeyDown={this.handleKeyDown} onBlur={this.props.onEditEnd} suppressContentEditableWarning={true}>
                    {object.data.value}
                </span>
            </BaseUI>
        );
    }
}
export class comment extends BaseObject<{ value: string }, {}, [], [], [string]> {
    static package = "UI";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Text Comment";
    static args: TMeta["args"] = [{
        type: "string",
        optional: true,
        description: "Initial text"
    }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 0;
            this.outlets = 0;
        });
        this.on("updateArgs", (args) => {
            if (!this.data.hasOwnProperty("value")) this.data.value = args.join(" ");
        });
    }
    uiComponent: typeof BaseUI = CommentUI;
}
type CodeUIState = { language: string; value: string; editorLoaded: boolean; editing: boolean } & BaseUIState;
class CodeUI extends BaseUI<comment, {}, CodeUIState> {
    static sizing = "both" as const;
    static defaultSize: [number, number] = [400, 225];
    state: CodeUIState = { ...this.state, editing: false, value: this.box.data.value, language: this.box.args[0] || "javascript", editorLoaded: false };
    codeEditor: editor.IStandaloneCodeEditor;
    editorJSX: typeof MonacoEditor;
    handleCodeEditorMount = (monaco: editor.IStandaloneCodeEditor) => this.codeEditor = monaco;
    handleResize = () => (this.state.editorLoaded ? this.codeEditor.layout() : undefined);
    handleChange = (value: string, event: editor.IModelContentChangedEvent) => {
        this.setState({ value });
        this.object.data.value = value;
    };
    handleKeyDown = (e: React.KeyboardEvent) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }
    handleKeyUp = (e: React.KeyboardEvent) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }
    async componentDidMount() {
        super.componentDidMount();
        const reactMonacoEditor = await import("react-monaco-editor");
        this.editorJSX = reactMonacoEditor.default;
        this.setState({ editorLoaded: true });
    }
    render() {
        return <BaseUI {...this.props} containerProps={{ onKeyDown: this.handleKeyDown, onKeyUp: this.handleKeyUp }}>
            {
                this.state.editorLoaded
                    ? <this.editorJSX value={this.state.value} language={this.state.language} theme="vs-dark" editorDidMount={this.handleCodeEditorMount} onChange={this.handleChange} options={{ fontSize: 12 }} width={this.state.width} height={this.state.height} />
                    : <Dimmer active><Loader content="Loading" /></Dimmer>
            }
        </BaseUI>;
    }
}
export class code extends BaseObject<{ value: string }, {}, [Bang, string], [string], [string], {}, { language: string; value: string }> {
    static package = "UI";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Code Editor";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "bang",
        description: "Trigger output the code"
    }, {
        isHot: false,
        type: "string",
        description: "Set the code"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "string",
        description: "Code"
    }];
    static args: TMeta["args"] = [{
        type: "string",
        optional: true,
        default: "javascript",
        description: "language"
    }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 1;
            if (typeof this.box.data.value === "undefined") this.box.data.value = "";
        });
        this.on("updateArgs", (args) => {
            if (args[0]) this.updateUI({ language: args[0] });
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (data instanceof Bang) this.outlet(0, this.box.data.value);
            } else if (inlet === 1) {
                const value = typeof data === "string" ? data : `${data}`;
                this.updateUI({ value });
                this.box.data.value = value;
            }
        });
    }
    uiComponent: typeof BaseUI = CodeUI;
}
export default { message, comment, code };
