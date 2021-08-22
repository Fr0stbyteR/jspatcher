import * as React from "react";
import { Icon, StrictModalProps, Modal, Dimmer, Loader, Button } from "semantic-ui-react";
import type MonacoEditor from "react-monaco-editor";
import type { monaco } from "react-monaco-editor";
import DefaultPopupUI from "./DefaultPopupUI";
import type DefaultObject from "./DefaultObject";
import type { DefaultPopupUIProps, DefaultPopupUIState } from "./DefaultPopupUI";

export interface CodePopupUIState extends DefaultPopupUIState {
    editorLoaded: boolean;
}
export default class CodePopupUI<T extends DefaultObject = DefaultObject, P extends Partial<DefaultPopupUIProps> & Record<string, any> = {}, S extends Partial<CodePopupUIState> & Record<string, any> = {}> extends DefaultPopupUI<T, P, S & CodePopupUIState> {
    static dockable = true;
    state: S & CodePopupUIState = {
        ...this.state,
        editorLoaded: false
    };
    codeEditor: monaco.editor.IStandaloneCodeEditor;
    editorJSX: typeof MonacoEditor;
    editorLanguage = "javascript";
    get code() {
        return "";
    }
    handleSave = (code: string): any => undefined;
    handleCloseAndSave = () => {
        this.setState({ modalOpen: false });
        this.handleSave(this.codeEditor.getValue());
    };
    handleCodeEditorMount = (monaco: monaco.editor.IStandaloneCodeEditor) => this.codeEditor = monaco;
    handleResize = () => ((this.state.editorLoaded && this.codeEditor) ? this.codeEditor.layout() : undefined);
    async componentDidMount() {
        super.componentDidMount();
        window.addEventListener("resize", this.handleResize);
        const reactMonacoEditor = await import("react-monaco-editor");
        this.editorJSX = reactMonacoEditor.default;
        this.setState({ editorLoaded: true });
    }
    componentWillUnmount() {
        super.componentWillUnmount();
        window.removeEventListener("resize", this.handleResize);
    }
    componentDidUpdate(prevProps: Readonly<DefaultPopupUIProps>, prevState: Readonly<S & CodePopupUIState>) {
        if (this.props.inDock) {
            if (this.state.width !== prevState.width || this.state.height !== prevState.height) this.handleResize();
        }
    }
    render() {
        if (this.props.inDock) {
            if (!this.state.editorLoaded) return <Dimmer active><Loader content="Loading" /></Dimmer>;
            return (
                <div style={{ display: "flex", flexDirection: "column", flex: "1 1 auto", width: "100%", height: "100%" }}>
                    <div style={{ flex: "1 1 auto", overflow: "hidden" }}>
                        <this.editorJSX value={this.code} language={this.editorLanguage} theme="vs-dark" editorDidMount={this.handleCodeEditorMount} options={{ fontSize: 12 }} />
                    </div>
                    <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "row-reverse", padding: "10px" }}>
                        <Button icon="checkmark" content="OK" color="green" onClick={this.handleCloseAndSave} inverted />
                    </div>
                </div>
            );
        }
        const children = (
            <>
                <Modal.Content>
                    <div style={{ height: window.innerHeight * 0.8 }}>
                        {
                            this.state.editorLoaded
                                ? <this.editorJSX value={this.code} language={this.editorLanguage} theme="vs-dark" editorDidMount={this.handleCodeEditorMount} options={{ fontSize: 12 }} />
                                : <Dimmer active><Loader content="Loading" /></Dimmer>
                        }
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Button basic color="red" onClick={this.handleClose} inverted>
                        <Icon name="remove" /> Cancel
                    </Button>
                    <Button color="green" onClick={this.handleCloseAndSave} inverted>
                        <Icon name="checkmark" /> OK
                    </Button>
                </Modal.Actions>
            </>
        );
        const containerProps = { ...this.props.containerProps };
        if (!containerProps.onDoubleClick) containerProps.onDoubleClick = this.handleDoubleClick;
        const modalProps: StrictModalProps = { ...this.props.modalProps, children, open: this.state.modalOpen, onClose: this.handleClose, basic: true, size: "fullscreen" };
        return <DefaultPopupUI {...this.props} modalProps={modalProps} containerProps={containerProps} />;
    }
}
