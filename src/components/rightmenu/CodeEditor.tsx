import * as React from "react";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { Loader, Dimmer } from "semantic-ui-react";
import MonacoEditor from "react-monaco-editor";
import Patcher from "../../core/patcher/Patcher";
import Env from "../../core/Env";

interface P {
    env: Env;
    patcher: Patcher;
}

interface S {
    value: string;
    editorLoaded: boolean;
}

export default class CodeEditor extends React.PureComponent<P, S> {
    state = { value: this.code, editorLoaded: false };
    codeEditor: editor.IStandaloneCodeEditor;
    editorJSX: typeof MonacoEditor;
    handleCodeEditorMount = (monaco: editor.IStandaloneCodeEditor) => {
        monaco.updateOptions({ readOnly: true });
        this.codeEditor = monaco;
    };
    handleGraphChanged = (e?: string[]) => {
        if (!e && !this.props.patcher.state.isLoading && this.state.editorLoaded) this.setState({ value: this.code });
    };
    handleResize = () => (this.state.editorLoaded ? this.codeEditor.layout() : undefined);
    async componentDidMount() {
        const reactMonacoEditor = await import("react-monaco-editor");
        this.editorJSX = reactMonacoEditor.default;
        this.setState({ editorLoaded: true });
        this.props.patcher.on("loading", this.handleGraphChanged);
        this.props.patcher.on("graphChanged", this.handleGraphChanged);
        window.addEventListener("resize", this.handleResize);
    }
    componentWillUnmount() {
        this.props.patcher.off("loading", this.handleGraphChanged);
        this.props.patcher.off("graphChanged", this.handleGraphChanged);
        window.removeEventListener("resize", this.handleResize);
    }
    componentDidUpdate(prevProps: Readonly<P>) {
        if (prevProps.patcher !== this.props.patcher) this.handleGraphChanged();
    }
    render() {
        return this.state.editorLoaded
            ? <this.editorJSX value={this.state.value} language="faust" theme="vs-dark" editorDidMount={this.handleCodeEditorMount} options={{ fontSize: 12 }} />
            : <Dimmer active><Loader content="Loading" /></Dimmer>;
    }
    get code() {
        const { patcher } = this.props;
        return patcher.props.mode === "faust" || patcher.props.mode === "gen" ? patcher.toFaustDspCode() : "";
    }
}
