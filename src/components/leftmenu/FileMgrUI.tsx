import * as React from "react";
import { Icon } from "semantic-ui-react";
import Env, { EnvEventMap } from "../../core/Env";
import DeleteModal from "../modals/DeleteModal";
import DeleteAllModal from "../modals/DeleteAllModal";
import "./FileMgrUI.scss";
import I18n from "../../i18n/I18n";
import { ProjectItemUI } from "./ProjectItemUI";
import { AnyFileInstance } from "../../core/file/FileInstance";
import ProjectItem from "../../core/file/ProjectItem";
import { ProjectEventMap } from "../../core/Project";
import NewFolderModal from "../modals/NewFolderModal";
import Folder from "../../core/file/Folder";

interface P {
    env: Env;
    lang: string;
    oneSelectionOnly?: true;
    folderSelectionOnly?: true;
    noActions?: true;
    onSelection?: (selection: ProjectItem[]) => any;
}

interface S {
    projectName: string;
    items: ProjectItem[];
    collapsed: boolean;
    selected: ProjectItem[];
    instances: AnyFileInstance[];
    deleteModalOpen: boolean;
    deleteAllModalOpen: boolean;
    newFolderModalOpen: boolean;
}

export default class FileManagerUI extends React.PureComponent<P, S> {
    state: S = {
        projectName: this.props.env.currentProject?.props.name,
        collapsed: false,
        selected: [],
        instances: [],
        deleteModalOpen: false,
        deleteAllModalOpen: false,
        newFolderModalOpen: false,
        items: this.props.env.fileMgr.projectRoot?.getOrderedItems?.() || []
    };
    get strings() {
        return I18n[this.props.lang].FileManagerUI;
    }
    handleProjectPropsChanged = ({ name }: ProjectEventMap["propsChanged"]) => this.setState({ projectName: name });
    handleProjectChanged = ({ project, oldProject }: EnvEventMap["projectChanged"]) => {
        oldProject.off("propsChanged", this.handleProjectPropsChanged);
        project.on("propsChanged", this.handleProjectPropsChanged);
    };
    handleEnvInstances = (instances: EnvEventMap["instances"]) => this.setState({ instances });
    handleTreeChanged = () => this.setState({ items: this.props.env.fileMgr.projectRoot?.getOrderedItems?.() || [] });

    componentDidMount() {
        const { env } = this.props;
        const { fileMgr } = this.props.env;
        env.on("projectChanged", this.handleProjectChanged);
        env.on("instances", this.handleEnvInstances);
        fileMgr.on("treeChanged", this.handleTreeChanged);
    }
    componentWillUnmount() {
        const { env } = this.props;
        const { fileMgr } = env;
        env.off("projectChanged", this.handleProjectChanged);
        env.off("instances", this.handleEnvInstances);
        fileMgr.off("treeChanged", this.handleTreeChanged);
    }
    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>) {
        if (this.state.selected !== prevState.selected) this.props.onSelection?.(this.state.selected);
    }
    handleClickCollapse = () => this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
    handleClickNewFolder = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        this.setState({ newFolderModalOpen: true });
    };
    handleDeleteItem = async (item: ProjectItem) => {
        this.setState({ selected: [item] }, () => this.setState({ deleteModalOpen: true }));
    };
    handleClickItem = (item: ProjectItem, ctrl = false, shift = false) => {
        const itemSelected = this.state.selected.indexOf(item) !== -1;
        if (this.props.oneSelectionOnly || (!ctrl && !shift) || this.state.selected.length === 0) {
            if (this.props.folderSelectionOnly && item.type !== "folder") return;
            this.setState({ selected: [item] });
        } else if (ctrl) {
            if (itemSelected) this.setState(({ selected }) => ({ selected: selected.filter($item => $item !== item) }));
            else this.setState(({ selected }) => ({ selected: [...selected, item] }));
        } else if (shift) {
            const from = this.state.selected[this.state.selected.length - 1];
            const to = item;
            if (from === to) return;
            const parent = from.parent;
            if (to.parent === parent) {
                const items = parent.getOrderedItems();
                let $from = items.indexOf(from);
                let $to = items.indexOf(to);
                if ($from > $to) [$from, $to] = [$to, $from];
                const selected = [];
                for (let i = $from; i <= $to; i++) {
                    const $item = items[i];
                    const found = selected.indexOf($item);
                    if (found === -1) selected.push($item);
                    else selected.splice(found, 1);
                }
                this.setState({ selected });
            } else {
                this.setState(({ selected }) => ({ selected: [...selected, item] }));
            }
        }
    };
    handleClickHeader = (e: React.MouseEvent<HTMLDivElement>) => {
        const { shiftKey: shift, metaKey, ctrlKey } = e;
        const ctrl = this.props.env.os === "MacOS" ? metaKey : ctrlKey;
        this.handleClickItem(this.props.env.fileMgr.projectRoot, ctrl, shift);
    };
    handleDoubleClickItem = async (item: ProjectItem) => {
        if (this.props.noActions) return;
        if (item.type === "folder") return;
        const instance = await item.instantiate();
        this.props.env.openInstance(instance);
    };
    handleDeleteModalClose = () => this.setState({ deleteModalOpen: false });
    handleDeleteModalConfirm = async () => {
        this.setState({ deleteModalOpen: false });
        for (const item of this.state.selected) {
            for (const instance of this.state.instances) {
                if (instance.file === item) await instance.destroy();
            }
            await item.destroy();
        }
    };
    handleClickDeleteAll = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        this.setState({ deleteAllModalOpen: true });
    };
    handleDeleteAll = async () => {
        await this.props.env.newProject();
    };
    handleDeleteAllModalClose = () => {
        this.setState({ deleteAllModalOpen: false });
    };
    handleNewFolderModalClose = () => {
        this.setState({ newFolderModalOpen: false });
    };
    handleNewFolderModalConfirm = async (parent: Folder, folderName: string) => {
        await parent.addFolder(folderName);
        this.setState({ newFolderModalOpen: false });
    };
    render() {
        const classNameArray = ["left-pane-component-header", "file-manager-header"];
        if (this.state.selected.indexOf(this.props.env.fileMgr.projectRoot) !== -1) classNameArray.push("selected");
        return (
            <div className="left-pane-component file-manager-container">
                <div className={classNameArray.join(" ")} onClick={this.handleClickHeader} tabIndex={0}>
                    <span className="file-manager-header-collapse" onClick={this.handleClickCollapse}><Icon name={this.state.collapsed ? "caret right" : "caret down"} inverted size="small" /></span>
                    <span className="file-manager-header-title">{this.state.projectName}</span>
                    {this.props.noActions
                        ? undefined
                        : <>
                            <span className="file-manager-header-icon" title={this.strings.newFile} onClick={this.handleClickNewFolder}><Icon name="folder outline" inverted size="small" /></span>
                            <span className="file-manager-header-icon" title={this.strings.deleteAll} onClick={this.handleClickDeleteAll}><Icon name="trash" inverted size="small" /></span>
                        </>
                    }
                </div>
                {this.props.noActions
                    ? undefined
                    : <>
                        <DeleteModal lang={this.props.lang} open={this.state.deleteModalOpen} onClose={this.handleDeleteModalClose} onConfirm={this.handleDeleteModalConfirm} fileNames={this.state.selected.map(item => item.name)} />
                        <DeleteAllModal lang={this.props.lang} open={this.state.deleteAllModalOpen} onClose={this.handleDeleteAllModalClose} onConfirm={this.handleDeleteAll} />
                        <NewFolderModal lang={this.props.lang} open={this.state.newFolderModalOpen} onClose={this.handleNewFolderModalClose} onConfirm={this.handleNewFolderModalConfirm} folder={this.props.env.fileMgr.projectRoot} />
                    </>
                }
                {this.state.collapsed
                    ? undefined
                    : <div className="file-manager-item-tree">
                        {this.state.items.map(item => <ProjectItemUI {...this.props} key={item.path} item={item} selected={this.state.selected} onDelete={this.handleDeleteItem} onClick={this.handleClickItem} onDoubleClick={this.handleDoubleClickItem} />)}
                    </div>}
            </div>
        );
    }
}
