import * as React from "react";
import { Menu, Icon, MenuItemProps, Header, Loader, Dimmer, Table, Ref } from "semantic-ui-react";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import MonacoEditor from "react-monaco-editor";
import Patcher from "../core/Patcher";
import "./RightMenu.scss";
import { TPatcherLog } from "../core/types";

enum TPanels {
    None = "None",
    Console = "Console",
    Code = "Code"
}
class Console extends React.Component<{ patcher: Patcher }, { cached: TPatcherLog[] }> {
    state = { cached: this.props.patcher.state.log.slice() };
    refTable = React.createRef<HTMLTableElement>();
    logDuringLoading: TPatcherLog[] = [];
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
class CodeEditor extends React.Component<{ patcher: Patcher }, { editorLoaded: boolean }> {
    state = { editorLoaded: false };
    codeEditor: monacoEditor.editor.IStandaloneCodeEditor;
    editorJSX: typeof MonacoEditor;
    handleCodeEditorMount = (monaco: monacoEditor.editor.IStandaloneCodeEditor) => {
        this.codeEditor = monaco;
        this.codeEditor.setValue(this.code);
    }
    handleGraphChanged = () => {
        if (!this.props.patcher.state.isLoading && this.state.editorLoaded) this.codeEditor.setValue(this.code);
    }
    handleResize = () => (this.state.editorLoaded ? this.codeEditor.layout() : undefined);
    componentDidMount() {
        import("react-monaco-editor").then((reactMonacoEditor) => {
            this.editorJSX = reactMonacoEditor.default;
            this.setState({ editorLoaded: true });
        });
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
        return this.state.editorLoaded
            ? <MonacoEditor language="javascript" theme="vs-dark" editorDidMount={this.handleCodeEditorMount} options={{ fontSize: 12 }} />
            : <Dimmer active><Loader content="Loading" /></Dimmer>;
    }
    get code() {
        return this.props.patcher.props.mode === "faust" ? this.props.patcher.toFaustDspCode() : "";
    }
}
export default class RightMenu extends React.Component<{ patcher: Patcher }, { active: TPanels; codePanel: boolean; audioOn: boolean }> {
    state = { active: TPanels.None, codePanel: false, audioOn: false };
    refDivPane = React.createRef<HTMLDivElement>();
    refCode = React.createRef<CodeEditor>();
    refConsole = React.createRef<Console>();
    handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, data: MenuItemProps) => {
        if (this.state.active === data.name) {
            this.setState({ active: TPanels.None });
        } else {
            this.setState({ active: data.name as TPanels }, () => {
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
    handleAudioSwitch = (e: React.MouseEvent) => {
        const audioCtx = this.props.patcher.state.audioCtx;
        if (this.state.audioOn) audioCtx.suspend();
        else audioCtx.resume();
    }
    handleAudioCtxStateChange = () => {
        const audioCtx = this.props.patcher.state.audioCtx;
        const { state } = audioCtx;
        this.setState({ audioOn: state === "running" });
    }
    handlePatcherLoaded = () => {
        const codePanel = this.props.patcher.props.mode === "faust" || this.props.patcher.props.mode === "gen";
        this.setState({ active: TPanels.None, codePanel });
    }
    componentDidMount() {
        const audioCtx = this.props.patcher.state.audioCtx;
        audioCtx.addEventListener("statechange", this.handleAudioCtxStateChange);
        this.props.patcher.on("loaded", this.handlePatcherLoaded);
    }
    componentWillUnmount() {
        const audioCtx = this.props.patcher.state.audioCtx;
        audioCtx.removeEventListener("statechange", this.handleAudioCtxStateChange);
        this.props.patcher.off("loaded", this.handlePatcherLoaded);
    }
    render() {
        return (
            <>
                <Menu icon vertical inverted size="mini" fixed={"left"} id="right-menu">
                    <Menu.Item name={TPanels.Console} active={this.state.active === TPanels.Console} onClick={this.handleItemClick}>
                        <Icon name="bars" color={this.state.active === TPanels.Console ? "teal" : "grey"} inverted />
                    </Menu.Item>
                    <Menu.Item name={TPanels.Code} hidden={!this.state.codePanel} active={this.state.active === TPanels.Code} onClick={this.handleItemClick}>
                        <Icon name="code" color={this.state.active === TPanels.Code ? "teal" : "grey"} inverted />
                    </Menu.Item>
                    <div style={{ flex: "1 1 auto" }}></div>
                    <Menu.Item name="Audio Switch" active={false} onClick={this.handleAudioSwitch}>
                        <Icon name={this.state.audioOn ? "volume up" : "volume off"} color={this.state.audioOn ? "teal" : "grey"} inverted />
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
