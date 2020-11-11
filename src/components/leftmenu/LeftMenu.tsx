import * as React from "react";
import { MenuItemProps, Menu, Icon, Header, Dropdown } from "semantic-ui-react";
import "./LeftMenu.scss";
import Objects from "./Objects";
import Packages from "./Packages";
import VERSION from "../../scripts/version";
import Env, { EnvEventMap } from "../../core/Env";
import Patcher from "../../core/Patcher";
import { AnyFileInstance } from "../../core/file/FileInstance";
import FileManagerUI from "./FileMgrUI";

enum TPanels {
    None = "None",
    FileMgr = "Files",
    Objects = "Objects",
    Packages = "Packages"
}

class ConfigMenu extends React.PureComponent {
    render() {
        return (
            <Dropdown item={true} icon={<Icon name="cog" color="grey" inverted />}>
                <Dropdown.Menu style={{ minWidth: "max-content", zIndex: 200 }}>
                    <Dropdown.Item href="https://github.com/fr0stbyter/jspatcher" target="_blank" text="Visit GitHub" />
                    <Dropdown.Item disabled text={`Version: ${VERSION}`} />
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

interface P {
    env: Env;
    lang: string;
    noFileMgr?: boolean;
}

interface S {
    active: TPanels;
    instance: AnyFileInstance;
}

export default class LeftMenu extends React.PureComponent<P, S> {
    state = {
        active: this.props.noFileMgr ? TPanels.None : TPanels.FileMgr,
        instance: this.props.env.activeInstance
    };
    refDivPane = React.createRef<HTMLDivElement>();
    refFileMgr = React.createRef<FileManagerUI>();
    refObjects = React.createRef<Objects>();
    refPackages = React.createRef<Packages>();
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
    handleActiveInstance = ({ instance }: EnvEventMap["activeInstance"]) => {
        const active = this.state.active === TPanels.None || instance instanceof Patcher ? this.state.active : this.state.active === TPanels.FileMgr ? this.state.active : TPanels.None;
        this.setState({ instance, active });
    };
    componentDidMount() {
        this.props.env.on("activeInstance", this.handleActiveInstance);
    }
    componentWillUnmount() {
        this.props.env.off("activeInstance", this.handleActiveInstance);
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
                        {this.state.active === TPanels.Objects ? <Objects {...this.props} patcher={this.state.instance as Patcher} ref={this.refObjects} /> : <></> }
                    </div>
                    <div className="left-pane-packages" hidden={this.state.active !== TPanels.Packages}>
                        {this.state.active === TPanels.Packages ? <Packages {...this.props} patcher={this.state.instance as Patcher} ref={this.refPackages} /> : <></> }
                    </div>
                </div>
                <Menu icon vertical inverted size="mini" className="left-menu">
                    {this.props.noFileMgr
                        ? undefined
                        : <Menu.Item name={TPanels.FileMgr} active={this.state.active === TPanels.FileMgr} onClick={this.handleItemClick} title={TPanels.FileMgr}>
                            <Icon name="folder" color={this.state.active === TPanels.FileMgr ? "teal" : "grey"} inverted />
                        </Menu.Item>
                    }
                    {this.state.instance instanceof Patcher
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
                    <div style={{ flex: "1 1 auto" }}></div>
                    <ConfigMenu />
                </Menu>
                <div className="resize-handler resize-handler-e" onMouseDown={this.handleResizeMouseDown} hidden={this.state.active === TPanels.None}></div>
            </>
        );
    }
}
