import * as React from "react";
import MonacoEditor from "react-monaco-editor";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { Dimmer, Loader } from "semantic-ui-react";
import UIObject from "./Base";
import { BaseUIState, BaseUI } from "../BaseUI";
import { AnyObject, Bang } from "../Base";
import { TMeta } from "../../types";

type CodeUIState = { language: string; value: string; editorLoaded: boolean; editing: boolean } & BaseUIState;
export class CodeUI extends BaseUI<AnyObject, {}, CodeUIState> {
    static sizing = "both" as const;
    static defaultSize: [number, number] = [400, 225];
    state: CodeUIState = { ...this.state, editing: false, value: this.box.data.value, language: "javascript", editorLoaded: false };
    codeEditor: editor.IStandaloneCodeEditor;
    editorJSX: typeof MonacoEditor;
    handleCodeEditorMount = (monaco: editor.IStandaloneCodeEditor) => {
        this.codeEditor = monaco;
        this.object.emit("editorLoaded");
        monaco.onDidBlurEditorText(() => this.object.emit("editorBlur", monaco.getValue()));
    };
    handleResize = () => (this.state.editorLoaded ? this.codeEditor.layout() : undefined);
    handleChange = (value: string, event: editor.IModelContentChangedEvent) => {
        this.setState({ value });
        this.object.data.value = value;
    };
    handleKeyDown = (e: React.KeyboardEvent) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };
    handleKeyUp = (e: React.KeyboardEvent) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };
    async componentDidMount() {
        super.componentDidMount();
        const reactMonacoEditor = await import("react-monaco-editor");
        this.editorJSX = reactMonacoEditor.default;
        this.setState({ editorLoaded: true });
    }
    render() {
        return (
            <BaseUI {...this.props} containerProps={{ onKeyDown: this.handleKeyDown, onKeyUp: this.handleKeyUp }}>
                {
                    this.state.editorLoaded
                        ? <this.editorJSX value={this.state.value} language={this.state.language} theme="vs-dark" editorDidMount={this.handleCodeEditorMount} onChange={this.handleChange} options={{ fontSize: 12 }} width={this.state.width} height={this.state.height} />
                        : <Dimmer active><Loader content="Loading" /></Dimmer>
                }
            </BaseUI>
        );
    }
}
export default class code extends UIObject<{ value: string }, {}, [Bang, string], [string], [string], {}, { language: string; value: string }, { editorBlur: string; editorLoaded: never }> {
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
            if (typeof this.data.value === "undefined") this.setData({ value: "" });
        });
        this.on("editorLoaded", () => this.updateUI({ language: this.box.args[0] || "javascript" }));
        this.on("updateArgs", (args) => {
            if (args[0]) this.updateUI({ language: args[0] });
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (data instanceof Bang) this.outlet(0, this.data.value);
            } else if (inlet === 1) {
                const value = typeof data === "string" ? data : `${data}`;
                this.updateUI({ value });
                this.setData({ value });
            }
        });
    }
    static ui: typeof BaseUI = CodeUI;
}
