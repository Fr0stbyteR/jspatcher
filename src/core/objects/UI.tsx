import * as React from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import MonacoEditor from "react-monaco-editor";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import Patcher from "../Patcher";
import Box from "../Box";
import { DefaultObject, BaseUI, Bang } from "./Base";
import "./UI.scss";
import { PatcherEventMap, TMeta } from "../types";

export class comment extends DefaultObject<{ value: string }, {}, [], [], [string]> {
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
        this.update((box as Box<this>).args);
    }
    update(args?: [string?]) {
        this.updateBox(args);
        if (args && !this.data.hasOwnProperty("text")) this.data.value = args.join(" ");
        return this;
    }
    get ui(): typeof BaseUI {
        return class CommentUI extends BaseUI<comment> {
            editableOnUnlock = true;
            state = { ...super.state, editing: false };
            refSpan = React.createRef<HTMLSpanElement>();
            toggleEdit = (bool?: boolean) => {
                if (bool === this.state.editing) return this.state.editing;
                if (this.props.object.patcher.state.locked) return this.state.editing;
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
                    this.props.object.data.value = span.textContent;
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
                            {object.data.value}
                        </span>
                    </BaseUI>
                );
            }
        };
    }
}
export class code extends DefaultObject<{ value: string }, {}, [Bang, string], [string], [string], {}, { language: string; value: string }> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            package: "UI",
            author: "Fr0stbyteR",
            version: "1.0.0",
            description: "Code Editor",
            inlets: [{
                isHot: true,
                type: "bang",
                description: "Trigger output the code"
            }, {
                isHot: false,
                type: "string",
                description: "Set the code"
            }],
            outlets: [{
                type: "string",
                description: "Code"
            }],
            args: [{
                type: "string",
                optional: true,
                default: "javascript",
                description: "language"
            }]
        };
    }
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 2;
        this.outlets = 1;
        if (typeof this.box.data.value === "undefined") this.box.data.value = "";
        box.setRect([...box.rect.slice(0, 2), 400, 225] as [number, number, number, number]);
        this.update((box as Box<this>).args, (box as Box<this>).props);
    }
    update(args?: [string?], props?: {}) {
        this.updateBox(args);
        if (args && args[0]) this.updateUI({ language: args[0] });
        return this;
    }
    fn<$ extends number>(data: [Bang, string][$], inlet: $) {
        if (inlet === 0) {
            if (data instanceof Bang) this.outlet(0, this.box.data.value);
        } else if (inlet === 1) {
            const value = typeof data === "string" ? data : `${data}`;
            this.updateUI({ value });
            this.box.data.value = value;
        }
        return this;
    }
    get ui(): typeof BaseUI {
        return class CodeUI extends BaseUI<comment, {}, { language: string; value: string; editorLoaded: boolean }> {
            static sizing = "both" as const;
            editableOnUnlock = false;
            state = { ...super.state, editing: false, value: this.box.data.value, language: "javascript", editorLoaded: false };
            codeEditor: monacoEditor.editor.IStandaloneCodeEditor;
            editorJSX: typeof MonacoEditor;
            handleCodeEditorMount = (monaco: monacoEditor.editor.IStandaloneCodeEditor) => this.codeEditor = monaco;
            handleResize = (e: PatcherEventMap["resized"]) => (this.state.editorLoaded && e.selected.indexOf(this.box.id) >= 0 ? this.codeEditor.layout() : undefined);
            handleChange = (value: string, event: monacoEditor.editor.IModelContentChangedEvent) => this.object.data.value = value;
            handleKeyDown = (e: React.KeyboardEvent) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
            }
            handleKeyUp = (e: React.KeyboardEvent) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
            }
            componentDidMount() {
                super.componentDidMount();
                import("react-monaco-editor").then((reactMonacoEditor) => {
                    this.editorJSX = reactMonacoEditor.default;
                    this.setState({ editorLoaded: true });
                });
                this.patcher.on("resized", this.handleResize);
            }
            componentWillUnmount() {
                super.componentWillUnmount();
                this.patcher.off("resized", this.handleResize);
            }
            render() {
                return <BaseUI {...this.props} containerProps={{ onKeyDown: this.handleKeyDown, onKeyUp: this.handleKeyUp }}>
                    {
                        this.state.editorLoaded
                            ? <this.editorJSX value={this.state.value} language={this.state.language} theme="vs-dark" editorDidMount={this.handleCodeEditorMount} onChange={this.handleChange} options={{ fontSize: 12 }} />
                            : <Dimmer active><Loader content="Loading" /></Dimmer>
                    }
                </BaseUI>;
            }
        };
    }
}
export default { comment, code };
