import * as React from "react";
import { Menu, Icon, Segment, List, Input } from "semantic-ui-react";
import Patcher from "../../core/patcher/Patcher";
import "./LeftMenu.scss";
import { TPackage } from "../../core/types";
import { BaseObject } from "../../core/objects/Base";
import { ImporterDirSelfObject } from "../../utils/symbols";
import Env, { EnvEventMap } from "../../core/Env";

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
        const { patcher } = this.props;
        const obj = patcher._state.pkgMgr.getFromPath(path, patcher.activePkg);
        return typeof obj === "function" && obj.prototype instanceof BaseObject ? obj.description : undefined;
    }
    isFolder(path: (string | symbol)[]) {
        const { patcher } = this.props;
        const obj = patcher._state.pkgMgr.getFromPath(path, patcher.activePkg);
        return typeof obj === "object";
    }
    isObject(path: (string | symbol)[]) {
        const { patcher } = this.props;
        const obj = patcher._state.pkgMgr.getFromPath(path, patcher.activePkg);
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
        const patcherDiv = document.body.querySelector(`.patcher-container[data-id="${this.props.patcher.instanceId}"]`);
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
                cloned.style.left = `${e.clientX - 10}px`;
                cloned.style.top = `${e.clientY - 10}px`;
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (cloned) cloned.remove();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            const { clientX, clientY } = e;
            const { left, top, width, height } = patcherRect;
            if (clientX < left) return;
            if (clientX > left + width) return;
            if (clientY < top) return;
            if (clientY > top + height) return;
            const { scrollLeft, scrollTop } = patcherDiv;
            const x = clientX - left + scrollLeft;
            const y = clientY - top + scrollTop;
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

export default class Objects extends React.PureComponent<{ env: Env; patcher: Patcher }, { patcher: Patcher; pkg: TPackage; search: string }> {
    state = { patcher: this.props.env.activeInstance instanceof Patcher ? this.props.env.activeInstance : null, pkg: this.props.env.activeInstance instanceof Patcher ? this.props.env.activeInstance.activePkg : null, search: "" };
    timer: number = undefined;
    handlePkgChanged = ({ pkg }: { pkg: TPackage }) => this.setState({ pkg: {} }, () => this.setState({ pkg }));
    handleEnvActiveInstance = ({ instance }: EnvEventMap["activeInstance"]) => {
        this.state.patcher?.off?.("libChanged", this.handlePkgChanged);
        if (instance instanceof Patcher) {
            this.state.patcher.on("libChanged", this.handlePkgChanged);
            this.setState({ patcher: instance, pkg: instance.activePkg });
        } else {
            this.setState({ patcher: null, pkg: null });
        }
    };
    componentDidMount() {
        this.props.env.on("activeInstance", this.handleEnvActiveInstance);
    }
    componentWillUnmount() {
        this.state.patcher?.off?.("libChanged", this.handlePkgChanged);
        this.props.env.off("activeInstance", this.handleEnvActiveInstance);
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
        if (!this.state.pkg) return <></>;
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
