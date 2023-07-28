import * as React from "react";
import { Menu, Icon, MenuItemProps, Header } from "semantic-ui-react";
import PatcherEditor from "../../core/patcher/PatcherEditor";
import Console from "./Console";
import Inspector from "./Inspector";
import UIDock from "./UIDock";
import Reference from "./Reference";
import CodeEditor from "./CodeEditor";
import Env from "../../core/Env";
import "./PatcherRightMenu.scss";

enum TPanels {
    None = "None",
    Console = "Console",
    Inspector = "Inspector",
    Code = "Code",
    Dock = "Dock",
    Reference = "Reference"
}

interface P {
    env: Env;
    lang: string;
    editor: PatcherEditor;
}

interface S {
    active: TPanels;
    codePanel: boolean;
    audioOn: boolean;
}

export default class PatcherRightMenu extends React.PureComponent<P, S> {
    state = {
        active: TPanels.None,
        codePanel: this.props.editor.props.mode === "faust" || this.props.editor.props.mode === "gen",
        audioOn: this.props.env.audioCtx.state === "running"
    };
    refDivPane = React.createRef<HTMLDivElement>();
    refCode = React.createRef<CodeEditor>();
    refConsole = React.createRef<Console>();
    refInspector = React.createRef<Inspector>();
    refDock = React.createRef<UIDock>();
    refReference = React.createRef<Reference>();
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
        const origin = { x: e.clientX, y: e.clientY };
        const rect = this.refDivPane.current.getBoundingClientRect();
        const { width: curWidth } = rect;
        const panel = this.state.active;
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.refDivPane.current && e.movementX) {
                const width = curWidth - (e.clientX - origin.x);
                if (width < 100) {
                    this.setState({ active: TPanels.None });
                } else {
                    if (this.state.active === TPanels.None) this.setState({ active: panel });
                    this.refDivPane.current.style.width = width + "px";
                    if (this.state.active === TPanels.Code && this.refCode.current && this.refCode.current.codeEditor) {
                        this.refCode.current.codeEditor.layout();
                    }
                    if (this.state.active === TPanels.Dock && this.refDock.current) {
                        this.refDock.current.handleResize();
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
    };
    handleAudioSwitch = () => {
        const envAudioCtx = this.props.env.audioCtx;
        const projAudioCtx = this.props.env.currentProject?.audioCtx;
        if (this.state.audioOn) {
            projAudioCtx?.suspend();
            envAudioCtx.suspend();
        } else {
            projAudioCtx?.resume();
            envAudioCtx.resume();
        }
    };
    handleEnvAudioCtxStateChange = () => {
        const { state } = this.props.env.audioCtx;
        if (state === "running") {
            this.props.env.currentProject?.audioCtx?.resume();
        } else {
            this.props.env.currentProject?.audioCtx?.suspend();
        }
        this.setState({ audioOn: state === "running" });
    };
    handleReady = () => {
        this.setState({
            active: TPanels.None,
            codePanel: this.props.editor.props.mode === "faust" || this.props.editor.props.mode === "gen",
            audioOn: this.props.env.audioCtx.state === "running"
        });
    };
    handleInspector = () => this.setState({ active: TPanels.Inspector });
    handleDock = () => this.setState({ active: TPanels.Dock });
    handleReference = () => this.setState({ active: TPanels.Reference });
    componentDidMount() {
        const audioCtx = this.props.env.audioCtx;
        audioCtx.addEventListener("statechange", this.handleEnvAudioCtxStateChange);
        this.props.editor.on("ready", this.handleReady);
        this.props.editor.on("inspector", this.handleInspector);
        this.props.editor.on("dockUI", this.handleDock);
        this.props.editor.on("reference", this.handleReference);
    }
    componentWillUnmount() {
        const audioCtx = this.props.env.audioCtx;
        audioCtx.removeEventListener("statechange", this.handleEnvAudioCtxStateChange);
        this.props.editor.off("ready", this.handleReady);
        this.props.editor.off("inspector", this.handleInspector);
        this.props.editor.off("dockUI", this.handleDock);
        this.props.editor.off("reference", this.handleReference);
    }
    render() {
        return (
            <>
                <Menu icon vertical inverted size="mini" className="right-menu">
                    <Menu.Item name={TPanels.Console} active={this.state.active === TPanels.Console} onClick={this.handleItemClick} title={TPanels.Console}>
                        <Icon name="terminal" color={this.state.active === TPanels.Console ? "teal" : "grey"} inverted />
                    </Menu.Item>
                    <Menu.Item name={TPanels.Inspector} active={this.state.active === TPanels.Inspector} onClick={this.handleItemClick} title={TPanels.Inspector}>
                        <Icon name="info" color={this.state.active === TPanels.Inspector ? "teal" : "grey"} inverted />
                    </Menu.Item>
                    <Menu.Item name={TPanels.Code} hidden={!this.state.codePanel} active={this.state.active === TPanels.Code} onClick={this.handleItemClick} title={TPanels.Code}>
                        <Icon name="code" color={this.state.active === TPanels.Code ? "teal" : "grey"} inverted />
                    </Menu.Item>
                    <Menu.Item name={TPanels.Dock} active={this.state.active === TPanels.Dock} onClick={this.handleItemClick} title={TPanels.Dock}>
                        <Icon name="edit" color={this.state.active === TPanels.Dock ? "teal" : "grey"} inverted />
                    </Menu.Item>
                    <Menu.Item name={TPanels.Reference} active={this.state.active === TPanels.Reference} onClick={this.handleItemClick} title={TPanels.Reference}>
                        <Icon name="book" color={this.state.active === TPanels.Reference ? "teal" : "grey"} inverted />
                    </Menu.Item>
                    <div style={{ flex: "1 1 auto" }}></div>
                    <Menu.Item name="Audio Switch" active={false} onClick={this.handleAudioSwitch} title="Audio Switch">
                        <Icon name={this.state.audioOn ? "volume up" : "volume off"} color={this.state.audioOn ? "teal" : "grey"} inverted />
                    </Menu.Item>
                </Menu>
                <div className="right-pane" hidden={this.state.active === TPanels.None} ref={this.refDivPane}>
                    <Header as="h5" inverted color="grey" content={this.state.active} />
                    <div className="right-pane-console" hidden={this.state.active !== TPanels.Console}>
                        <Console {...this.props} ref={this.refConsole} display={this.state.active === TPanels.Console} />
                    </div>
                    <div className="right-pane-code-editor" hidden={this.state.active !== TPanels.Code}>
                        {this.state.active === TPanels.Code ? <CodeEditor {...this.props} patcher={this.props.editor.instance} ref={this.refCode} /> : <></>}
                    </div>
                    <div className="right-pane-inspector" hidden={this.state.active !== TPanels.Inspector}>
                        {this.state.active === TPanels.Inspector ? <Inspector {...this.props} editor={this.props.editor} ref={this.refInspector} /> : <></>}
                    </div>
                    <div className="right-pane-dock" hidden={this.state.active !== TPanels.Dock}>
                        <UIDock {...this.props} editor={this.props.editor} ref={this.refDock} display={this.state.active === TPanels.Dock} />
                    </div>
                    <div className="right-pane-reference" hidden={this.state.active !== TPanels.Reference}>
                        {this.state.active === TPanels.Reference ? <Reference {...this.props} ref={this.refReference} /> : <></>}
                    </div>
                </div>
                <div className="resize-handler resize-handler-w" onMouseDown={this.handleResizeMouseDown} hidden={this.state.active === TPanels.None}></div>
            </>
        );
    }
}
