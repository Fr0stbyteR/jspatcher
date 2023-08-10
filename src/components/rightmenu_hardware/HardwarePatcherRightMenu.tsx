import * as React from "react";
import { Menu, Icon, MenuItemProps, Header } from "semantic-ui-react";
import HardwarePatcherEditor from "../../core/hardware/HardwareEditor";
import Inspector from "./Inspector";
import Reference from "./Reference";
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
    editor: HardwarePatcherEditor;
}

interface S {
    active: TPanels;
}

export default class PatcherRightMenu extends React.PureComponent<P, S> {
    state = {
        active: TPanels.None,
    };
    refDivPane = React.createRef<HTMLDivElement>();
    refConsole = React.createRef<Console>();
    refInspector = React.createRef<Inspector>();
    refReference = React.createRef<Reference>();
    handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, data: MenuItemProps) => {
        if (this.state.active === data.name) {
            this.setState({ active: TPanels.None });
        } else {
            this.setState({ active: data.name as TPanels });
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
    handleReady = () => {
        this.setState({
            active: TPanels.None,
        });
    };
    handleInspector = () => this.setState({ active: TPanels.Inspector });
    handleDock = () => this.setState({ active: TPanels.Dock });
    handleReference = () => this.setState({ active: TPanels.Reference });
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown);
        this.props.editor.on("ready", this.handleReady);
        this.props.editor.on("inspector", this.handleInspector);
        this.props.editor.on("dockUI", this.handleDock);
        this.props.editor.on("reference", this.handleReference);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
        this.props.editor.off("ready", this.handleReady);
        this.props.editor.off("inspector", this.handleInspector);
        this.props.editor.off("dockUI", this.handleDock);
        this.props.editor.off("reference", this.handleReference);
    }
    handleKeyDown = (e: KeyboardEvent) => {
        const { activeEditor } = this.props.env;
        if (!activeEditor)
            return;

        if (e.target instanceof HTMLInputElement) return;
        if (e.target instanceof HTMLTextAreaElement) return;
        if ((e.target as HTMLElement).contentEditable === "true") return;
        const ctrlKey = this.props.env.os === "MacOS" ? e.metaKey : e.ctrlKey;

        if (ctrlKey && e.shiftKey && e.key === "D") {
            if (this.state.active === TPanels.Reference) {
                this.setState({ active: TPanels.None });
            } else {
                this.setState({ active: TPanels.Reference });
            }
            e.stopPropagation();
            e.preventDefault();
        }
    };
    render() {
        return (
            <>
                <Menu icon vertical inverted size="mini" className="right-menu">
                    <Menu.Item name={TPanels.Inspector} active={this.state.active === TPanels.Inspector} onClick={this.handleItemClick} title={TPanels.Inspector}>
                        <Icon name="info" color={this.state.active === TPanels.Inspector ? "teal" : "grey"} inverted />
                    </Menu.Item>
                    <Menu.Item name={TPanels.Reference} active={this.state.active === TPanels.Reference} onClick={this.handleItemClick} title={TPanels.Reference}>
                        <Icon name="book" color={this.state.active === TPanels.Reference ? "teal" : "grey"} inverted />
                    </Menu.Item>
                    <div style={{ flex: "1 1 auto" }}></div>
                </Menu>
                <div className="right-pane" hidden={this.state.active === TPanels.None} ref={this.refDivPane}>
                    <Header as="h5" inverted color="grey" content={this.state.active} />
                    <div className="right-pane-inspector" hidden={this.state.active !== TPanels.Inspector}>
                        {this.state.active === TPanels.Inspector ? <Inspector {...this.props} editor={this.props.editor} ref={this.refInspector} /> : <></>}
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
