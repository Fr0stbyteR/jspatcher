import * as React from "react";
import { MenuItemProps, Menu, Icon, Header, Segment, List, Input, Dropdown, Table, Button } from "semantic-ui-react";
import Patcher from "../core/Patcher";
import "./LeftMenu.scss";
import { TPackage } from "../core/types";
import { BaseObject } from "../core/objects/Base";
import { ImporterDirSelfObject } from "../utils/symbols";
import VERSION from "../scripts/version";

enum TPanels {
    None = "None",
    Objects = "Objects",
    Packages = "Packages"
}
class ObjectsItems extends React.PureComponent<{ patcher: Patcher; pkg: TPackage; path: string[]; search?: string }, { selected: (string | symbol)[] }> {
    state = { selected: [] as (string | symbol)[] };
    refIcon = React.createRef<Icon>();
    get list() {
        const { pkg, path: pathIn, search } = this.props;
        const { selected } = this.state;
        const list: JSX.Element[] = [];
        if (search) {
            const searchResult = this.props.patcher._state.pkgMgr.searchInPkg(search, 128, false, pkg);
            searchResult.forEach((r, i) => {
                const { object, path } = r;
                const key = path[path.length - 1];
                const sel = selected.length === path.length && selected.every((e, i) => e === path[i]);
                if (typeof object === "object") {
                    list.push(<List.Item key={i} icon={sel ? "folder open" : "folder"} className={key ? "folder-item" : "abstract folder-item"} header={path.join(".")} onClick={() => this.handleSelect(path)} />);
                    if (sel) {
                        list.push(
                            <List.Item key={`${i}_Folder`} className="folder-content">
                                <ObjectsItems {...this.props} search={undefined} pkg={object} path={path} />
                            </List.Item>
                        );
                    }
                } else {
                    const props = sel ? { className: "selected", description: this.getDescription(path) } : {};
                    list.push(<List.Item key={i} {...props} icon="window maximize" header={path.join(".")} onClick={() => this.handleSelect(path)} onMouseDown={(e: React.MouseEvent) => this.handleMouseDown(e, path)} />);
                }
            });
            return list;
        }
        if (pathIn.length && ImporterDirSelfObject in pkg) {
            const path = [...pathIn, ImporterDirSelfObject];
            const sel = selected.length === path.length && selected.every((e, i) => e === path[i]);
            const props = sel ? { className: "abstract selected", description: this.getDescription(path) } : { className: "abstract" };
            list.push(<List.Item key={"__JSPatcher_ImporterDirSelfObject"} {...props} icon="window maximize" header={pathIn[pathIn.length - 1]} onClick={() => this.handleSelect(path)} onMouseDown={(e: React.MouseEvent) => this.handleMouseDown(e, path)} />);
        }
        for (const key in pkg) {
            const path = [...pathIn, key];
            const sel = selected.length === path.length && selected.every((e, i) => e === path[i]);
            if (typeof pkg[key] === "object") {
                list.push(<List.Item key={key} icon={sel ? "folder open" : "folder"} className={key ? "folder-item" : "abstract folder-item"} header={key || "prototype"} onClick={() => this.handleSelect(path)} />);
                if (sel) {
                    list.push(
                        <List.Item key={1} className="folder-content">
                            <ObjectsItems {...this.props} pkg={pkg[key] as TPackage} path={path} />
                        </List.Item>
                    );
                }
            } else {
                const props = sel ? { className: "selected", description: this.getDescription(path) } : {};
                list.push(<List.Item key={key} {...props} icon="window maximize" header={key || "prototype"} onClick={() => this.handleSelect(path)} onMouseDown={(e: React.MouseEvent) => this.handleMouseDown(e, path)} />);
            }
        }
        return list;
    }
    getDescription(path: (string | symbol)[]) {
        const obj = this.props.patcher._state.pkgMgr.getFromPath(path);
        return typeof obj === "function" && obj.prototype instanceof BaseObject ? obj.description : undefined;
    }
    isFolder(path: (string | symbol)[]) {
        const obj = this.props.patcher._state.pkgMgr.getFromPath(path);
        return typeof obj === "object";
    }
    isObject(path: (string | symbol)[]) {
        const obj = this.props.patcher._state.pkgMgr.getFromPath(path);
        return typeof obj === "function" && obj.prototype instanceof BaseObject;
    }
    getObjText(pathIn: (string | symbol)[]) {
        const path = pathIn.slice();
        const key = path[path.length - 1];
        const lib = this.props.patcher.activeLib;
        const isConstructor = key === ImporterDirSelfObject;
        if (isConstructor) path.pop();
        let id = path.join(".");
        const refObj = lib[id];
        if (!refObj) return undefined;
        while (path.length > 1) {
            path.shift();
            const newID = path.join(".");
            if (lib[newID] === refObj) id = newID;
            else break;
        }
        if (isConstructor) return `new ${id}`;
        return id;
    }
    handleSelect = (path: (string | symbol)[]) => {
        const { selected } = this.state;
        const same = selected.length === path.length && selected.every((e, i) => e === path[i]);
        this.setState({ selected: same && this.isFolder(path) ? [] : path });
    };
    handleMouseDown = (e: React.MouseEvent, path: (string | symbol)[]) => {
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
            const { patcher } = this.props;
            const { presentation } = patcher._state;
            patcher.createBox({ text: this.getObjText(path), inlets: 0, outlets: 0, rect: [x, y, 0, 0], presentation });
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
class Objects extends React.PureComponent<{ patcher: Patcher }, { pkg: TPackage; search: string }> {
    state = { pkg: this.props.patcher.activePkg, search: "" };
    timer: number = undefined;
    handlePkgChanged: (e: { pkg: TPackage }) => void = ({ pkg }) => this.setState({ pkg: {} }, () => this.setState({ pkg }));
    componentDidMount() {
        this.props.patcher.on("libChanged", this.handlePkgChanged);
    }
    componentWillUnmount() {
        this.props.patcher.off("libChanged", this.handlePkgChanged);
    }
    handleKeyDown = (e: React.KeyboardEvent<Input>) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };
    applySearch = (search: string) => {
        this.setState({ search });
        this.timer = undefined;
    };
    handleChange = (e: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => {
        if (this.timer) window.clearTimeout(this.timer);
        window.setTimeout(this.applySearch, 500, data.value);
    };
    handleClickClose = (e: React.MouseEvent) => {
        const input = e.currentTarget.previousSibling as HTMLInputElement;
        if (input) {
            input.value = "";
            input.focus();
        }
        this.setState({ search: "" });
    };
    render() {
        return (
            <>
                <Segment inverted size="mini">
                    <ObjectsItems {...this.props} pkg={this.state.pkg} path={[]} search={this.state.search} />
                </Segment>
                <Menu icon inverted size="mini">
                    <Input inverted size="mini" fluid icon={this.state.search ? { name: "close", link: true, onClick: this.handleClickClose } : "search"} placeholder="Search..." onKeyDown={this.handleKeyDown} onChange={this.handleChange} />
                </Menu>
            </>
        );
    }
}
class Packages extends React.PureComponent<{ patcher: Patcher }, { imports: [string, string][]; adding: boolean }> {
    state = { imports: this.props.patcher.state.pkgMgr.imported.slice(), adding: false };
    refTable = React.createRef<HTMLTableElement>();
    handleLibChanged = () => {
        this.setState({ imports: this.props.patcher.state.pkgMgr.imported.slice() });
    };
    handleAdd = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const tdID = e.currentTarget.parentElement.nextSibling as HTMLTableRowElement;
        const tdURL = tdID.nextSibling as HTMLTableRowElement;
        const id = tdID.getElementsByTagName("input")[0].value.trim();
        const url = tdURL.getElementsByTagName("input")[0].value.trim();
        if (id && url) {
            this.setState({ adding: true });
            try {
                await this.props.patcher.addPackage(id, url);
            } catch (e) {
                this.setState({ adding: false });
                this.props.patcher.error(`Loading dependency: ${id} from ${url} failed`);
            }
            this.setState({ adding: false });
        }
    };
    handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const tdID = e.currentTarget.parentElement.nextSibling as HTMLTableRowElement;
        const tdURL = tdID.nextSibling as HTMLTableRowElement;
        // const id = tdID.innerText;
        const url = tdURL.innerText;
        this.props.patcher.removePackage(url);
    };
    handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const row = e.currentTarget.parentElement.parentElement.parentElement as HTMLTableRowElement;
            const btn = row.firstChild.firstChild as HTMLButtonElement;
            btn.click();
        }
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };
    componentDidMount() {
        this.props.patcher.on("ready", this.handleLibChanged);
        this.props.patcher.on("libChanged", this.handleLibChanged);
        this.props.patcher.on("propsChanged", this.handleLibChanged);
    }
    componentWillUnmount() {
        this.props.patcher.off("ready", this.handleLibChanged);
        this.props.patcher.off("libChanged", this.handleLibChanged);
        this.props.patcher.off("propsChanged", this.handleLibChanged);
    }
    render() {
        const logs = this.state.imports.map(([id, url], i) => (
            <Table.Row key={i}>
                <Table.Cell style={{ padding: 0 }} width={1}>
                    <Button icon="minus" size="mini" compact inverted color="red" onClick={this.handleRemove} title="Remove the package" />
                </Table.Cell>
                <Table.Cell>{id}</Table.Cell>
                <Table.Cell>{url}</Table.Cell>
            </Table.Row>
        ));
        return (
            <>
                <Table inverted celled striped selectable unstackable singleLine size="small" compact="very">
                    <Table.Body>
                        {logs}
                        <Table.Row key="input">
                            <Table.Cell style={{ padding: 0 }} width={1}>
                                <Button icon="add" size="mini" compact inverted disabled={this.state.adding} loading={this.state.adding} onClick={this.handleAdd} title="Add a package" />
                            </Table.Cell>
                            <Table.Cell width={logs.length ? undefined : 4} style={{ padding: 0 }}>
                                <Input fluid size="mini" placeholder={"Namespace"} onKeyDown={this.handleInputKeyDown} />
                            </Table.Cell>
                            <Table.Cell style={{ padding: 0 }}>
                                <Input fluid size="mini" placeholder={"URL"} onKeyDown={this.handleInputKeyDown} />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <Menu icon inverted size="mini">
                </Menu>
            </>
        );
    }
}
class ConfigMenu extends React.PureComponent<{ patcher: Patcher }> {
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
export default class LeftMenu extends React.PureComponent<{ patcher: Patcher }, { active: TPanels; codePanel: boolean; audioOn: boolean }> {
    state = { active: TPanels.None, codePanel: false, audioOn: this.props.patcher.env.audioCtx.state === "running" };
    refDivPane = React.createRef<HTMLDivElement>();
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
    };
    handleAudioSwitch = () => {
        const audioCtx = this.props.patcher.env.audioCtx;
        if (this.state.audioOn) audioCtx.suspend();
        else audioCtx.resume();
    };
    handleAudioCtxStateChange = () => {
        const audioCtx = this.props.patcher.env.audioCtx;
        const { state } = audioCtx;
        this.setState({ audioOn: state === "running" });
    };
    handlePatcherLoading = (loading?: string[]) => {
        if (loading) return;
        const codePanel = this.props.patcher.props.mode === "faust" || this.props.patcher.props.mode === "gen";
        this.setState({ active: TPanels.None, codePanel });
    };
    componentDidMount() {
        const audioCtx = this.props.patcher.env.audioCtx;
        audioCtx.addEventListener("statechange", this.handleAudioCtxStateChange);
        this.props.patcher.on("loading", this.handlePatcherLoading);
        this.handlePatcherLoading();
    }
    componentWillUnmount() {
        const audioCtx = this.props.patcher.env.audioCtx;
        audioCtx.removeEventListener("statechange", this.handleAudioCtxStateChange);
        this.props.patcher.off("loading", this.handlePatcherLoading);
    }
    render() {
        return (
            <>
                <div className="left-pane" hidden={this.state.active === TPanels.None} ref={this.refDivPane}>
                    <Header as="h5" inverted color="grey" content={this.state.active} />
                    <div className="left-pane-objects" hidden={this.state.active !== TPanels.Objects}>
                        {this.state.active === TPanels.Objects ? <Objects { ...this.props } ref={this.refObjects} /> : <></> }
                    </div>
                    <div className="left-pane-packages" hidden={this.state.active !== TPanels.Packages}>
                        {this.state.active === TPanels.Packages ? <Packages { ...this.props } ref={this.refPackages} /> : <></> }
                    </div>
                </div>
                <Menu icon vertical inverted size="mini" className="left-menu">
                    <Menu.Item name={TPanels.Objects} active={this.state.active === TPanels.Objects} onClick={this.handleItemClick} title={TPanels.Objects}>
                        <Icon name="add" color={this.state.active === TPanels.Objects ? "teal" : "grey"} inverted />
                    </Menu.Item>
                    <Menu.Item name={TPanels.Packages} active={this.state.active === TPanels.Packages} onClick={this.handleItemClick} title={TPanels.Packages}>
                        <Icon name="box" color={this.state.active === TPanels.Packages ? "teal" : "grey"} inverted />
                    </Menu.Item>
                    <div style={{ flex: "1 1 auto" }}></div>
                    <ConfigMenu {...this.props} />
                </Menu>
                <div className="resize-handler resize-handler-e" onMouseDown={this.handleResizeMouseDown} hidden={this.state.active === TPanels.None}></div>
            </>
        );
    }
}
