import * as React from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import type MonacoEditor from "react-monaco-editor";
import type { monaco } from "react-monaco-editor";
import BaseUI, { BaseUIState } from "./BaseUI";
import type BaseObject from "./BaseObject";

export interface CodeUIState extends BaseUIState {
    language: string;
    value: string;
    editorLoaded: boolean;
    editing: boolean;
}

export default class CodeUI extends BaseUI<BaseObject<any, any, any, any, any, any, any, { "editorLoaded": never; "editorBlur": string; "change": never }>, {}, CodeUIState> {
    static sizing = "both" as const;
    static defaultSize: [number, number] = [400, 225];
    state: CodeUIState = { ...this.state, editing: false, value: this.box.data.value, language: "javascript", editorLoaded: false };
    codeEditor: monaco.editor.IStandaloneCodeEditor;
    editorJSX: typeof MonacoEditor;
    handleCodeEditorMount = (monaco: monaco.editor.IStandaloneCodeEditor) => {
        this.codeEditor = monaco;
        this.object.emit("editorLoaded");
        monaco.onDidBlurEditorText(() => this.object.emit("editorBlur", monaco.getValue()));
    };
    handleResize = () => (this.state.editorLoaded ? this.codeEditor.layout() : undefined);
    handleChange = (value: string, event: monaco.editor.IModelContentChangedEvent) => {
        this.setState({ value });
        this.object.setData({ value });
        this.object.emit("change");
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
