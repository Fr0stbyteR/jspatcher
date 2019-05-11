import * as React from "react";
import { Menu, Icon, MenuItemProps, Header, Loader, Dimmer } from "semantic-ui-react";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import Patcher from "../core/Patcher";
import "./RightMenu.scss";
import { TPatcherLog } from "../core/types";

enum TPanels {
    None = "None",
    Console = "Console",
    Code = "Code"
}
class Console extends React.Component {
    props: { patcher: Patcher };
    state: { cached: TPatcherLog[] };
}
class CodeEditor extends React.Component {
    props: { patcher: Patcher };
    codeEditorJSX: JSX.Element;
    codeEditor: monacoEditor.editor.IStandaloneCodeEditor;
    handleCodeEditorMount = (monaco: monacoEditor.editor.IStandaloneCodeEditor) => {
        this.codeEditor = monaco;
        this.codeEditor.setValue(this.code);
    }
    handleGraphChanged = () => {
        if (!this.props.patcher._state.isLoading && this.codeEditor) this.codeEditor.setValue(this.code);
    }
    handleResize = () => (this.codeEditor ? this.codeEditor.layout() : undefined);
    componentWillMount() {
        this.codeEditorJSX = <Dimmer active><Loader content="Loading" /></Dimmer>;
        import("react-monaco-editor").then((reactMonacoEditor) => {
            const MonacoEditor = reactMonacoEditor.default;
            this.codeEditorJSX = <div className="monaco-editor-container"><MonacoEditor language="javascript" theme="vs-dark" editorDidMount={this.handleCodeEditorMount} options={{ fontSize: 12 }} /></div>;
            this.forceUpdate();
        });
    }
    componentDidMount() {
        this.props.patcher.on("loaded", this.handleGraphChanged);
        this.props.patcher.on("graphChanged", this.handleGraphChanged);
        window.addEventListener("resize", this.handleResize);
    }
    componentWillUnmount() {
        this.props.patcher.off("loaded", this.handleGraphChanged);
        this.props.patcher.off("graphChanged", this.handleGraphChanged);
        window.removeEventListener("resize", this.handleResize);
    }
    render() {
        return this.codeEditorJSX;
    }
    get code() {
        return this.props.patcher.toFaustDspCode();
    }
}
export default class RightMenu extends React.Component {
    props: { patcher: Patcher };
    state = { active: TPanels.None };
    handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, data: MenuItemProps) => {
        if (this.state.active === data.name) this.setState({ active: TPanels.None });
        else this.setState({ active: data.name });
    };
    componentWillMount() {
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    render() {
        const pane = this.state.active === TPanels.None
            ? undefined
            : this.state.active === TPanels.Console
                ? undefined
                : this.state.active === TPanels.Code
                    ? <CodeEditor { ...this.props } />
                    : undefined;
        return (
            <>
                <Menu icon vertical inverted size="mini" fixed={"left"} id="right-menu">
                    <Menu.Item name={TPanels.Console} active={this.state.active === TPanels.Console} onClick={this.handleItemClick}>
                        <Icon name="bars" color={this.state.active === TPanels.Console ? "teal" : "grey"} inverted />
                    </Menu.Item>
                    <Menu.Item name={TPanels.Code} active={this.state.active === TPanels.Code} onClick={this.handleItemClick}>
                        <Icon name="code" color={this.state.active === TPanels.Code ? "teal" : "grey"} inverted />
                    </Menu.Item>
                </Menu>
                {this.state.active === TPanels.None ? undefined
                    : <div id="right-pane">
                        <Header as="h5" inverted color="grey" content={this.state.active} />
                        {pane}
                    </div>
                }
            </>
        );
    }
}
