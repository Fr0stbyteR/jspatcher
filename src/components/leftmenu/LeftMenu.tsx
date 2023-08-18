import * as React from "react";
import { MenuItemProps, Menu, Icon, Header } from "semantic-ui-react";
import Objects from "./Objects";
import Packages from "./Packages";
import Env, { EnvEventMap } from "../../core/Env";
import { IFileEditor } from "../../core/file/FileEditor";
import FileManagerUI from "./FileMgrUI";
import PatcherEditor from "../../core/patcher/PatcherEditor";
import AudioEditor from "../../core/audio/AudioEditor";
import PluginManagerUI from "./PluginMgrUI";
import "./LeftMenu.scss";

enum TPanels {
    None = "None",
    FileMgr = "Files",
    Objects = "Objects",
    Packages = "Packages",
    Plugins = "Plugins"
}

interface P {
    env: Env;
    lang: string;
    noFileMgr?: boolean;
}

interface S {
    active: TPanels;
    editor: IFileEditor;
}

export default class LeftMenu extends React.PureComponent<P, S> {
    state: S = {
        active: this.props.noFileMgr ? TPanels.None : TPanels.FileMgr,
        editor: this.props.env.activeEditor
    };
    refDivPane = React.createRef<HTMLDivElement>();
    refFileMgr = React.createRef<FileManagerUI>();
    refObjects = React.createRef<Objects>();
    refPackages = React.createRef<Packages>();
    refPlugins = React.createRef<PluginManagerUI>();
    handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, data: MenuItemProps) => {
        if (this.state.active === data.name) {
            this.setState({ active: TPanels.None });
        } else {
            this.setState({ active: data.name as TPanels });
        }
    };
    handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const origin = { x: e.clientX, y: e.clientY };
        const curWidth = this.refDivPane.current.getBoundingClientRect().width;
        const panel = this.state.active;
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.refDivPane.current && e.movementX) {
                const width = curWidth - (origin.x - e.clientX);
                if (width < 100) {
                    this.setState({ active: TPanels.None });
                } else {
                    if (this.state.active === TPanels.None) this.setState({ active: panel });
                    this.refDivPane.current.style.width = width + "px";
                }
                this.state.editor?.onUiResized();
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
    handleActiveEditor = ({ editor, oldEditor }: EnvEventMap["activeEditor"]) => {
        if (editor?.constructor.name === oldEditor?.constructor.name || this.state.active === TPanels.FileMgr) this.setState({ editor });
        else this.setState({ editor, active: TPanels.None });
    };
    componentDidMount() {
        this.props.env.on("activeEditor", this.handleActiveEditor);
    }
    componentWillUnmount() {
        this.props.env.off("activeEditor", this.handleActiveEditor);
    }
    render() {
        return (
            <>
                <div className="left-pane" hidden={this.state.active === TPanels.None} ref={this.refDivPane}>
                    <Header as="h5" inverted color="grey" content={this.state.active} />
                    {this.props.noFileMgr
                        ? undefined
                        : <div className="left-pane-filemanager" hidden={this.state.active !== TPanels.FileMgr}>
                            <FileManagerUI {...this.props} ref={this.refFileMgr} />
                        </div>
                    }
                    <div className="left-pane-objects" hidden={this.state.active !== TPanels.Objects}>
                        {this.state.active === TPanels.Objects ? <Objects {...this.props} ref={this.refObjects} /> : <></> }
                    </div>
                    <div className="left-pane-packages" hidden={this.state.active !== TPanels.Packages}>
                        {this.state.active === TPanels.Packages ? <Packages {...this.props} ref={this.refPackages} /> : <></> }
                    </div>
                    <div className="left-pane-plugins" hidden={this.state.active !== TPanels.Plugins}>
                        {this.state.active === TPanels.Plugins ? <PluginManagerUI {...this.props} ref={this.refPlugins} /> : <></> }
                    </div>
                </div>
                <Menu icon vertical inverted size="mini" className="left-menu">
                    {this.props.noFileMgr
                        ? undefined
                        : <Menu.Item name={TPanels.FileMgr} active={this.state.active === TPanels.FileMgr} onClick={this.handleItemClick} title={TPanels.FileMgr}>
                            <Icon name="folder" color={this.state.active === TPanels.FileMgr ? "teal" : "grey"} inverted />
                        </Menu.Item>
                    }
                    {this.state.editor instanceof PatcherEditor
                        ? <>
                            <Menu.Item name={TPanels.Objects} active={this.state.active === TPanels.Objects} onClick={this.handleItemClick} title={TPanels.Objects}>
                                <Icon name="add" color={this.state.active === TPanels.Objects ? "teal" : "grey"} inverted />
                            </Menu.Item>
                            <Menu.Item name={TPanels.Packages} active={this.state.active === TPanels.Packages} onClick={this.handleItemClick} title={TPanels.Packages}>
                                <Icon name="box" color={this.state.active === TPanels.Packages ? "teal" : "grey"} inverted />
                            </Menu.Item>
                        </>
                        : undefined
                    }
                    {this.state.editor instanceof AudioEditor
                        ? <>
                            <Menu.Item name={TPanels.Plugins} active={this.state.active === TPanels.Plugins} onClick={this.handleItemClick} title={TPanels.Plugins}>
                                <Icon name="plug" color={this.state.active === TPanels.Plugins ? "teal" : "grey"} inverted />
                            </Menu.Item>
                        </>
                        : undefined
                    }
                    <div style={{ flex: "1 1 auto" }}></div>
                </Menu>
                <div className="resize-handler resize-handler-e" onMouseDown={this.handleResizeMouseDown} hidden={this.state.active === TPanels.None}></div>
            </>
        );
    }
}
