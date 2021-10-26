import * as React from "react";
import { Icon } from "semantic-ui-react";
import Env, { EnvEventMap } from "../../core/Env";
import DeleteModal from "../modals/DeleteModal";
import DeleteAllModal from "../modals/DeleteAllModal";
import I18n from "../../i18n/I18n";
import ProjectItemUI from "./ProjectItemUI";
import type { IFileInstance } from "../../core/file/FileInstance";
import type { IProjectFileOrFolder } from "../../core/file/AbstractProjectItem";
import type { ProjectEventMap } from "../../core/Project";
import NewFolderModal from "../modals/NewFolderModal";
import type { IProjectFolder } from "../../core/file/AbstractProjectFolder";
import { findFromAscendants } from "../../utils/utils";
import "./FileMgrUI.scss";

interface P {
    env: Env;
    lang: string;
    oneSelectionOnly?: true;
    folderSelectionOnly?: true;
    noActions?: true;
    onSelection?: (selection: IProjectFileOrFolder[]) => any;
}

interface S {
    projectName: string;
    items: IProjectFileOrFolder[];
    collapsed: boolean;
    selected: IProjectFileOrFolder[];
    instances: IFileInstance[];
    deleteModalOpen: boolean;
    deleteAllModalOpen: boolean;
    newFolderModalOpen: boolean;
    fileDropping: boolean;
    moving: IProjectFileOrFolder;
    renaming: boolean;
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
        items: this.props.env.fileMgr.projectRoot?.getOrderedItems().filter(i => i.name !== this.props.env.currentProject.projectFilename) || [],
        fileDropping: false,
        moving: undefined,
        renaming: false
    };
    get strings() {
        return I18n[this.props.lang].FileManagerUI;
    }
    handleProjectPropsChanged = ({ name }: ProjectEventMap["propsChanged"]) => this.setState({ projectName: name });
    handleProjectChanged = ({ project, oldProject }: EnvEventMap["projectChanged"]) => {
        oldProject.off("propsChanged", this.handleProjectPropsChanged);
        project.on("propsChanged", this.handleProjectPropsChanged);
        this.setState({ projectName: project.props.name });
    };
    handleEnvInstances = (instances: EnvEventMap["instances"]) => this.setState({ instances });
    handleTreeChanged = () => this.setState({ items: this.props.env.fileMgr.projectRoot?.getOrderedItems().filter(i => i.name !== this.props.env.currentProject.projectFilename) || [] });
    handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.state.fileDropping) return;
        const { dataTransfer } = e;
        if (dataTransfer && dataTransfer.items.length && dataTransfer.items[0].kind === "file") this.setState({ fileDropping: true });
    };
    handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        this.handleDragEnter(e);
    };
    handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ fileDropping: false });
    };
    handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ fileDropping: false });
        const { dataTransfer } = e;
        if (dataTransfer && dataTransfer.files.length) {
            for (const file of e.dataTransfer.files) {
                await this.props.env.fileMgr.importFile(file);
            }
        }
    };
    mouseMoveSubscribed = false;
    handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!this.state.moving) return;
        if (this.state.moving.parent === this.props.env.fileMgr.projectRoot) return;
        if (this.mouseMoveSubscribed) return;
        this.mouseMoveSubscribed = true;
        e.preventDefault();
        e.stopPropagation();
        this.setState({ fileDropping: true });
        const handleMouseUp = (e: MouseEvent) => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove);
            this.setState({ fileDropping: false });
            this.mouseMoveSubscribed = false;
        };
        const handleMouseMove = (e: MouseEvent) => {
            const { target } = e;
            const parent = findFromAscendants(target as HTMLElement, e => e.firstElementChild.classList.contains("folder"));
            if (!parent) {
                this.setState({ fileDropping: false });
            } else {
                const path = (parent.firstChild as HTMLElement).getAttribute("data-id");
                if (this.props.env.fileMgr.projectRoot.path === path) this.setState({ fileDropping: true });
                else this.setState({ fileDropping: false });
            }
        };
        handleMouseMove(e.nativeEvent);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", handleMouseMove);
    };
    handleClickRename = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        const { projectName: oldName } = this.state;
        const container = e.currentTarget.parentElement.parentElement.getElementsByClassName("file-manager-header-name-container")[0] as HTMLSpanElement;
        const span = container.firstChild as HTMLSpanElement;
        const $beforeExt = oldName.lastIndexOf(".");
        this.setState({ renaming: true });
        container.contentEditable = "true";
        const range = document.createRange();
        const selection = window.getSelection();
        range.setStart(span.childNodes[0], 0);
        range.setEnd(span.childNodes[0], $beforeExt === -1 ? oldName.length : $beforeExt);
        selection.removeAllRanges();
        selection.addRange(range);
        container.focus();
        const handleMouseDown = (e: MouseEvent) => {
            e.stopPropagation();
        };
        const handleBlur = async (e?: FocusEvent) => {
            if (e) e.stopPropagation();
            container.removeEventListener("mousedown", handleMouseDown);
            container.removeEventListener("blur", handleBlur);
            container.removeEventListener("keydown", handleKeyDown);
            const newName = span.innerText;
            try {
                this.props.env.currentProject?.setProps({ name: newName });
            } catch (e) {
                span.innerText = oldName;
            } finally {
                container.contentEditable = "false";
                this.setState({ renaming: false });
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleBlur();
            }
            if (e.key === "Escape") {
                span.innerText = oldName;
                container.contentEditable = "false";
                this.setState({ renaming: false });
                container.removeEventListener("mousedown", handleMouseDown);
                container.removeEventListener("blur", handleBlur);
                container.removeEventListener("keydown", handleKeyDown);
                container.blur();
            }
        };
        container.addEventListener("mousedown", handleMouseDown);
        container.addEventListener("blur", handleBlur);
        container.addEventListener("keydown", handleKeyDown);
    };

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
    handleDeleteItem = async (item: IProjectFileOrFolder) => {
        this.setState({ selected: [item] }, () => this.setState({ deleteModalOpen: true }));
    };
    handleClickItem = (item: IProjectFileOrFolder, ctrl = false, shift = false) => {
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
    handleDoubleClickItem = async (item: IProjectFileOrFolder) => {
        if (this.props.noActions) return;
        if (item.isFolder === true) return;
        const editor = await item.instantiateEditor({ env: this.props.env, project: this.props.env.currentProject });
        this.props.env.openEditor(editor);
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
        this.setState({ deleteAllModalOpen: false });
    };
    handleDeleteAllModalClose = () => {
        this.setState({ deleteAllModalOpen: false });
    };
    handleNewFolderModalClose = () => {
        this.setState({ newFolderModalOpen: false });
    };
    handleNewFolderModalConfirm = async (parent: IProjectFolder, folderName: string) => {
        await parent.addFolder(folderName);
        this.setState({ newFolderModalOpen: false });
    };
    handleMoving = (moving: IProjectFileOrFolder) => {
        if (this.state.moving !== moving) this.setState({ moving });
    };
    handleMoveTo = async (item?: IProjectFileOrFolder, folder?: IProjectFolder) => {
        if (this.props.noActions) return;
        this.setState({ moving: undefined });
        if (!item) return;
        await item.move(folder);
    };
    render() {
        const classNameArray = ["left-pane-component", "file-manager-container"];
        const headerClassNameArray = ["left-pane-component-header", "file-manager-header", "folder"];
        const { items, collapsed, fileDropping, projectName, selected, moving, renaming, deleteModalOpen, deleteAllModalOpen, newFolderModalOpen } = this.state;
        if (fileDropping) classNameArray.push("filedropping");
        if (selected.indexOf(this.props.env.fileMgr.projectRoot) !== -1) headerClassNameArray.push("selected");
        if (renaming) headerClassNameArray.push("renaming");
        return (
            <div className={classNameArray.join(" ")} onDragEnter={this.handleDragEnter} onDragOver={this.handleDragOver} onDragLeave={this.handleDragLeave} onDrop={this.handleDrop} onMouseMove={this.handleMouseMove}>
                <div className={headerClassNameArray.join(" ")} onClick={this.handleClickHeader} tabIndex={0} data-id={this.props.env.fileMgr.projectRoot?.path}>
                    <span className="file-manager-header-collapse" onClick={this.handleClickCollapse}><Icon name={collapsed ? "caret right" : "caret down"} inverted size="small" /></span>
                    <span className="file-manager-header-name-container" {...(renaming ? { tabIndex: 0 } : {})} contentEditable={renaming} suppressContentEditableWarning>
                        <span className="file-manager-header-name">{projectName}</span>
                    </span>
                    {this.props.noActions
                        ? undefined
                        : <span className="file-manager-header-actions" hidden={renaming}>
                            <span className="file-manager-header-icon" title={this.strings.rename} onClick={this.handleClickRename}><Icon name="pencil alternate" inverted size="small" /></span>
                            <span className="file-manager-header-icon" title={this.strings.newFile} onClick={this.handleClickNewFolder}><Icon name="folder outline" inverted size="small" /></span>
                            <span className="file-manager-header-icon" title={this.strings.deleteAll} onClick={this.handleClickDeleteAll}><Icon name="trash" inverted size="small" /></span>
                        </span>
                    }
                </div>
                {this.props.noActions
                    ? undefined
                    : <>
                        <DeleteModal lang={this.props.lang} open={deleteModalOpen} onClose={this.handleDeleteModalClose} onConfirm={this.handleDeleteModalConfirm} fileNames={selected.map(item => item.name)} />
                        <DeleteAllModal lang={this.props.lang} open={deleteAllModalOpen} onClose={this.handleDeleteAllModalClose} onConfirm={this.handleDeleteAll} />
                        <NewFolderModal lang={this.props.lang} open={newFolderModalOpen} onClose={this.handleNewFolderModalClose} onConfirm={this.handleNewFolderModalConfirm} folder={this.props.env.fileMgr.projectRoot} />
                    </>
                }
                {collapsed
                    ? undefined
                    : <div className="file-manager-item-tree">
                        {items.map(item => <ProjectItemUI {...this.props} key={item.path} item={item} selected={selected} onDelete={this.handleDeleteItem} onClick={this.handleClickItem} onDoubleClick={this.handleDoubleClickItem} moving={moving} onMoveTo={this.handleMoveTo} onMoving={this.handleMoving} />)}
                    </div>}
            </div>
        );
    }
}
