import * as React from "react";
import { MenuItemProps, Menu, Icon, Header, Segment, List } from "semantic-ui-react";
import Patcher from "../core/Patcher";
import "./LeftMenu.scss";
import { TPackage } from "../core/types";
import Importer from "../core/objects/importer/Importer";
import { BaseObject } from "../core/objects/Base";

enum TPanels {
    None = "None",
    Objects = "Objects",
    Packages = "Packages"
}
class ObjectsItems extends React.PureComponent<{ patcher: Patcher; pkg: TPackage; path: string[] }, { selected: string | symbol }> {
    state = { selected: undefined as string | symbol };
    refIcon = React.createRef<Icon>();
    get list() {
        const { pkg, path } = this.props;
        const { selected } = this.state;
        const list = [];
        if (path.length && Importer.$self in pkg) {
            const sel = selected === Importer.$self;
            const props = sel ? { className: "abstract selected", description: this.getDescription(Importer.$self) } : { className: "abstract" };
            list.push(<List.Item key={0} {...props} icon="window maximize" header={path[path.length - 1]} onClick={() => this.handleSelect(Importer.$self)} onMouseDown={(e: React.MouseEvent) => this.handleMouseDown(e, Importer.$self)} />);
        }
        for (const key in pkg) {
            if (typeof pkg[key] === "object") {
                list.push(<List.Item key={key} icon={selected === key ? "folder open" : "folder"} className={key ? "folder-item" : "abstract folder-item"} header={key || "prototype"} onClick={() => this.handleSelect(key)} />);
                if (selected === key) {
                    list.push(
                        <List.Item key={1} className="folder-content">
                            <ObjectsItems {...this.props} pkg={pkg[key] as TPackage} path={[...path, key]} />
                        </List.Item>
                    );
                }
            } else {
                const sel = selected === key;
                const props = sel ? { className: "selected", description: this.getDescription(key) } : {};
                list.push(<List.Item key={key} {...props} icon="window maximize" header={key || "prototype"} onClick={() => this.handleSelect(key)} onMouseDown={(e: React.MouseEvent) => this.handleMouseDown(e, key)} />);
            }
        }
        return list;
    }
    getDescription(key: string | symbol) {
        const obj = this.props.pkg[key as string];
        return typeof obj === "function" && obj.prototype instanceof BaseObject ? obj.description : undefined;
    }
    isFolder(key: string | symbol) {
        return typeof this.props.pkg[key as string] === "object";
    }
    isObject(key: string | symbol) {
        const obj = this.props.pkg[key as string];
        return typeof obj === "function" && obj.prototype instanceof BaseObject;
    }
    getObjText(key: string | symbol) {
        const path = this.props.path.slice();
        const lib = this.props.patcher.activeLib;
        if (key !== Importer.$self) path.push(key as string);
        let id = path.join(".");
        const refObj = lib[id];
        if (!refObj) return undefined;
        while (path.length > 1) {
            path.shift();
            const newID = path.join(".");
            if (lib[newID] === refObj) id = newID;
            else break;
        }
        return id;
    }
    handleSelect = (key: string | symbol) => this.setState({ selected: this.state.selected === key && this.isFolder(key) ? undefined : key });
    handleMouseDown = (e: React.MouseEvent, key: string | symbol) => {
        if (this.props.patcher.state.locked) return;
        const currentTarget = e.currentTarget as HTMLDivElement;
        // Find Patcher Div
        let patcherDiv = currentTarget.parentElement;
        while (!patcherDiv.classList.contains("ui-left") && patcherDiv !== document.body) patcherDiv = patcherDiv.parentElement;
        if (patcherDiv === document.body) return;
        patcherDiv = Array.from(patcherDiv.parentElement.children).find(e => e.classList.contains("ui-center")) as HTMLElement;
        if (!patcherDiv) return;
        patcherDiv = patcherDiv.getElementsByClassName("patcher-container")[0] as HTMLElement;
        if (!patcherDiv) return;
        const patcherRect = patcherDiv.getBoundingClientRect();
        // Clone Node to follow cursor
        const cloned = currentTarget.cloneNode(true) as HTMLDivElement;
        cloned.style.position = "fixed";
        cloned.style.display = "none";
        cloned.style.zIndex = "1000";
        cloned.style.width = `${currentTarget.clientWidth}px`;
        cloned.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        currentTarget.parentElement.appendChild(cloned);
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (cloned) {
                cloned.style.display = "block";
                cloned.style.left = `${e.pageX - 10}px`;
                cloned.style.top = `${e.pageY - 10}px`;
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (cloned) cloned.remove();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            const { pageX, pageY } = e;
            const { left, top, width, height } = patcherRect;
            if (pageX < left) return;
            if (pageX > left + width) return;
            if (pageY < top) return;
            if (pageY > top + height) return;
            const { scrollLeft, scrollTop } = patcherDiv;
            const x = pageX - left + scrollLeft;
            const y = pageY - top + scrollTop;
            const w = 90;
            const h = 20;
            const { patcher } = this.props;
            const { presentation } = patcher._state;
            patcher.createBox({ text: "", inlets: 0, outlets: 0, rect: [x, y, w, h], presentation }).changeText(this.getObjText(key));
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    render() {
        return (
            <List inverted selection>
                {this.list}
            </List>
        );
    }
}
class Objects extends React.PureComponent<{ patcher: Patcher }, { pkg: TPackage }> {
    state = { pkg: this.props.patcher.activePkg };
    handlePkgChanged: (e: { pkg: TPackage }) => void = ({ pkg }) => this.setState({ pkg });
    componentDidMount() {
        this.props.patcher.on("libChanged", this.handlePkgChanged);
    }
    componentWillUnmount() {
        this.props.patcher.off("libChanged", this.handlePkgChanged);
    }
    render() {
        return (
            <Segment inverted size="mini">
                <ObjectsItems {...this.props} pkg={this.state.pkg} path={[]} />
            </Segment>
        );
    }
}
export default class LeftMenu extends React.PureComponent<{ patcher: Patcher }, { active: TPanels; codePanel: boolean; audioOn: boolean }> {
    state = { active: TPanels.None, codePanel: false, audioOn: this.props.patcher.env.audioCtx.state === "running" };
    refDivPane = React.createRef<HTMLDivElement>();
    refObjects = React.createRef<Objects>();
    handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, data: MenuItemProps) => {
        if (this.state.active === data.name) {
            this.setState({ active: TPanels.None });
        } else {
            this.setState({ active: data.name as TPanels });
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
                const width = curWidth - (origin.x - e.pageX);
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
    }
    handleAudioSwitch = () => {
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
        this.handlePatcherLoaded();
    }
    componentWillUnmount() {
        const audioCtx = this.props.patcher.env.audioCtx;
        audioCtx.removeEventListener("statechange", this.handleAudioCtxStateChange);
        this.props.patcher.off("loaded", this.handlePatcherLoaded);
    }
    render() {
        return (
            <>
                <div className="left-pane" hidden={this.state.active === TPanels.None} ref={this.refDivPane}>
                    <Header as="h5" inverted color="grey" content={this.state.active} />
                    <div className="left-pane-objects" hidden={this.state.active !== TPanels.Objects}>
                        {this.state.active === TPanels.Objects ? <Objects { ...this.props } ref={this.refObjects} /> : <></> }
                    </div>
                </div>
                <Menu icon vertical inverted size="mini" className="left-menu">
                    <Menu.Item name={TPanels.Objects} active={this.state.active === TPanels.Objects} onClick={this.handleItemClick}>
                        <Icon name="add" color={this.state.active === TPanels.Objects ? "teal" : "grey"} inverted />
                    </Menu.Item>
                    <div style={{ flex: "1 1 auto" }}></div>
                    <Menu.Item name="Config" active={false}>
                        <Icon name="cog" color="grey" inverted />
                    </Menu.Item>
                </Menu>
                <div className="resize-handler resize-handler-e" onMouseDown={this.handleResizeMouseDown} hidden={this.state.active === TPanels.None}></div>
            </>
        );
    }
}
