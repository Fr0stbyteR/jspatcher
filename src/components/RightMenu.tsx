import * as React from "react";
import { Menu, Icon, MenuItemProps, Header, Loader, Dimmer } from "semantic-ui-react";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import Patcher from "../core/Patcher";
import "./RightMenu.scss";

enum TPanels {
    None = "None",
    Console = "Console",
    Code = "Code"
}
export default class RightMenu extends React.Component {
    props: { patcher: Patcher };
    state = { active: TPanels.None };
    codeEditorJSX: JSX.Element;
    codeEditor: monacoEditor.editor.IStandaloneCodeEditor;
    code: string = "";
    handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, data: MenuItemProps) => {
        if (this.state.active === data.name) this.setState({ active: TPanels.None });
        else this.setState({ active: data.name });
    };
    handleCodeEditorMount = (monaco: monacoEditor.editor.IStandaloneCodeEditor) => {
        this.codeEditor = monaco;
        this.codeEditor.setValue(this.code);
    }
    handleGenerateCode = (code: string) => {
        this.code = code;
        if (this.codeEditor) this.codeEditor.setValue(code);
    }
    handleResize = () => (this.state.active === TPanels.Code && this.codeEditor ? this.codeEditor.layout() : undefined);
    componentWillMount() {
        this.codeEditorJSX = <Dimmer active><Loader content="Loading" /></Dimmer>;
        import("react-monaco-editor").then((reactMonacoEditor) => {
            const MonacoEditor = reactMonacoEditor.default;
            this.codeEditorJSX = <div className="monaco-editor-container"><MonacoEditor language="javascript" theme="vs-dark" editorDidMount={this.handleCodeEditorMount} value={this.code} options={{ fontSize: 12 }} /></div>;
            this.forceUpdate();
        });
    }
    componentDidMount() {
        this.props.patcher.on("generateCode", this.handleGenerateCode);
        window.addEventListener("resize", this.handleResize);
    }
    componentWillUnmount() {
        this.props.patcher.off("generateCode", this.handleGenerateCode);
        window.removeEventListener("resize", this.handleResize);
    }
    render() {
        const pane = this.state.active === TPanels.None
            ? undefined
            : this.state.active === TPanels.Console
                ? undefined
                : this.state.active === TPanels.Code
                    ? this.codeEditorJSX
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
