import * as React from "react";
import { Menu, Icon, MenuItemProps, Header, Loader, Dimmer, Table, Ref } from "semantic-ui-react";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import MonacoEditor from "react-monaco-editor";
import Patcher from "../core/Patcher";
import "./RightMenu.scss";
import { TPatcherLog, TMeta, PatcherEventMap } from "../core/types";

enum TPanels {
    None = "None",
    Console = "Console",
    Inspector = "Inspector",
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
class Inspector extends React.Component<{ patcher: Patcher }, { meta: TMeta; args: any[]; props: { [key: string]: any } }> {
    state: { meta: TMeta; args: any[]; props: { [key: string]: any } } = { meta: null, args: [], props: {} };
    handleSelected = (e: PatcherEventMap["selected"]) => {
        const boxes = this.props.patcher.state.selected.filter(id => id.includes("box") && this.props.patcher.boxes[id]).map(id => this.props.patcher.boxes[id]);
        if (boxes.length === 0) {
            this.setState({ meta: null, args: [], props: {} });
            return;
        }
        const { meta, args, props } = boxes[0];
        if (boxes.length === 1) {
            this.setState({ meta, args, props });
            return;
        }
        const commonProps = meta.props.slice();
        for (let i = commonProps.length - 1; i >= 0; i--) {
            const prop = commonProps[i];
            const value = typeof props[prop.name] === "undefined" ? prop.default : props[prop.name];
            for (let j = 1; j < boxes.length; j++) {
                let found = false;
                const $props = boxes[j].props;
                const $metaProps = boxes[j].meta.props;
                for (let k = 0; k < $metaProps.length; k++) {
                    const $prop = $metaProps[k];
                    const $value = typeof $props[$prop.name] === "undefined" ? $prop.default : $props[$prop.name];
                    if ($prop.name === prop.name && value === $value) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    commonProps.pop();
                    break;
                }
            }
        }
        this.setState({ meta, args, props });
    };
    componentDidMount() {
        this.props.patcher.on("selected", this.handleSelected);
        this.props.patcher.on("deselected", this.handleSelected);
    }
    componentWillUnmount() {
        this.props.patcher.off("selected", this.handleSelected);
        this.props.patcher.off("deselected", this.handleSelected);
    }
    render() {
        const { meta, args, props } = this.state;
        if (!meta) {
            return (
                <Menu icon inverted size="mini">
                </Menu>
            );
        }
        const argsTable = meta.args.map(({ type, enum: enums, optional, default: defaultValue, varLength, description }, i) => (
            <Table.Row key={i}>
                <Table.Cell width={4}>arg{i}{optional ? "?" : ""}</Table.Cell>
                <Table.Cell width={12}>{typeof args[i] === "undefined" ? defaultValue : args[i]}</Table.Cell>
            </Table.Row>
        ));
        const propsTable = meta.props.map(({ name, type, enum: enums, default: defaultValue, description }, i) => (
            <Table.Row key={i}>
                <Table.Cell width={4}>{name}</Table.Cell>
                <Table.Cell width={12}>{typeof props[name] === "undefined" ? defaultValue : props[name]}</Table.Cell>
            </Table.Row>
        ));
        return (
            <>
                <Header as="h5" inverted color="grey" content={"Arguments"} />
                <Table inverted celled striped selectable unstackable size="small" compact="very">
                    <Table.Body>
                        {argsTable}
                    </Table.Body>
                </Table>
                <Header as="h5" inverted color="grey" content={"Properties"} />
                <Table inverted celled striped selectable unstackable size="small" compact="very">
                    <Table.Body>
                        {propsTable}
                    </Table.Body>
                </Table>
                <Menu icon inverted size="mini">
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
    refInspector = React.createRef<Inspector>();
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
        const audioCtx = this.props.patcher.env.audioCtx;
        if (this.state.audioOn) audioCtx.suspend();
        else audioCtx.resume();
    }
    handleAudioCtxStateChange = () => {
        const audioCtx = this.props.patcher.env.audioCtx;
        const { state } = audioCtx;
        this.setState({ audioOn: state === "running" });
    }
    handlePatcherLoaded = () => {
        const codePanel = this.props.patcher.props.mode === "faust" || this.props.patcher.props.mode === "gen";
        this.setState({ active: TPanels.None, codePanel });
    }
    componentDidMount() {
        const audioCtx = this.props.patcher.env.audioCtx;
        audioCtx.addEventListener("statechange", this.handleAudioCtxStateChange);
        this.props.patcher.on("loaded", this.handlePatcherLoaded);
    }
    componentWillUnmount() {
        const audioCtx = this.props.patcher.env.audioCtx;
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
                    <Menu.Item name={TPanels.Inspector} active={this.state.active === TPanels.Inspector} onClick={this.handleItemClick}>
                        <Icon name="info" color={this.state.active === TPanels.Code ? "teal" : "grey"} inverted />
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
                    <div hidden={this.state.active !== TPanels.Inspector}>
                        <Inspector { ...this.props } ref={this.refInspector} />
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
