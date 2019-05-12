import * as React from "react";
import { Menu, Icon, MenuItemProps, Header, Loader, Dimmer, Table, Ref } from "semantic-ui-react";
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
    state: { cached: TPatcherLog[] } = { cached: [] };
    refTable = React.createRef<HTMLTableElement>();
    handleNewLog = (log: TPatcherLog) => {
        let bottom = true;
        let table: HTMLTableElement;
        if (this.refTable.current) {
            table = this.refTable.current;
            if (table.scrollTop + table.clientHeight !== table.scrollHeight) bottom = false;
        }
        const cached = this.state.cached;
        cached.push(log);
        this.setState({ cached }, () => (table && bottom ? table.scrollTop = table.scrollHeight : undefined));
    }
    handleClear = () => {
        this.setState({ cached: [] });
    }
    componentDidMount() {
        this.props.patcher.on("newLog", this.handleNewLog);
    }
    componentWillUnmount() {
        this.props.patcher.off("newLog", this.handleNewLog);
    }
    render() {
        const logs = this.state.cached.map((log, i) => (
            <Table.Row key={i} negative={log.errorLevel === "error"} warning={log.errorLevel === "warn"} positive={log.errorLevel === "info"}>
                <Table.Cell width={4}>{log.title}</Table.Cell>
                <Table.Cell width={12}>{log.message}</Table.Cell>
            </Table.Row>
        ));
        return (
            <>
                <Ref innerRef={this.refTable}>
                    <Table inverted celled striped selectable unstackable size="small" compact="very">
                        <Table.Body>
                            {logs}
                        </Table.Body>
                    </Table>
                </Ref>
                <Menu icon inverted size="mini">
                    <Menu.Item onClick={this.handleClear}>
                        <Icon name="delete" inverted />
                    </Menu.Item>
                </Menu>
            </>
        );
    }
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
            this.codeEditorJSX = <MonacoEditor language="javascript" theme="vs-dark" editorDidMount={this.handleCodeEditorMount} options={{ fontSize: 12 }} />;
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
        return this.props.patcher.props.mode === "faust" ? this.props.patcher.toFaustDspCode() : "";
    }
}
export default class RightMenu extends React.Component {
    props: { patcher: Patcher };
    state = { active: TPanels.None };
    refDivPane = React.createRef<HTMLDivElement>();
    refCode = React.createRef<CodeEditor>();
    refConsole = React.createRef<Console>();
    handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, data: MenuItemProps) => {
        if (this.state.active === data.name) {
            this.setState({ active: TPanels.None });
        } else {
            this.setState({ active: data.name }, () => {
                if (data.name === TPanels.Code && this.refCode.current && this.refCode.current.codeEditor) {
                    this.refCode.current.codeEditor.layout();
                }
            });
        }
    };
    handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const origin = { x: e.pageX, y: e.pageY };
        const curWidth = this.refDivPane.current.getBoundingClientRect().width;
        const panel = this.state.active;
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.refDivPane.current && e.movementX) {
                const width = curWidth - (e.pageX - origin.x);
                if (width < 100) {
                    this.setState({ active: TPanels.None });
                } else {
                    if (this.state.active === TPanels.None) this.setState({ active: panel });
                    this.refDivPane.current.style.width = width + "px";
                    if (this.state.active === TPanels.Code && this.refCode.current && this.refCode.current.codeEditor) {
                        this.refCode.current.codeEditor.layout();
                    }
                }
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }
    componentWillMount() {
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    render() {
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
                <div id="right-pane" hidden={this.state.active === TPanels.None} ref={this.refDivPane}>
                    <Header as="h5" inverted color="grey" content={this.state.active} />
                    <div hidden={this.state.active !== TPanels.Code}>
                        <CodeEditor { ...this.props } ref={this.refCode} />
                    </div>
                    <div hidden={this.state.active !== TPanels.Console}>
                        <Console { ...this.props } ref={this.refConsole} />
                    </div>
                </div>
                <div className="resize-handler resize-handler-w" onMouseDown={this.handleResizeMouseDown} hidden={this.state.active === TPanels.None}></div>
            </>
        );
    }
}
