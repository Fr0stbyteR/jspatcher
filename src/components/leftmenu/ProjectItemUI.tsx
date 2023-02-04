import * as React from "react";
import { Icon } from "semantic-ui-react";
import Env, { EnvEventMap } from "../../core/Env";
import PatcherEditor from "../../core/patcher/PatcherEditor";
import I18n from "../../i18n/I18n";
import { findFromAscendants } from "../../utils/utils";
import NewFolderModal from "../modals/NewFolderModal";
import type { IProjectFolder } from "../../core/file/AbstractProjectFolder";
import type { IProjectFileOrFolder, IProjectItem, ProjectItemEventMap } from "../../core/file/AbstractProjectItem";
import type PersistentProjectFile from "../../core/file/PersistentProjectFile";

interface P {
    env: Env;
    lang: string;
    item: IProjectFileOrFolder;
    selected: IProjectFileOrFolder[];
    onClick: (item: IProjectFileOrFolder, ctrl?: boolean, shift?: boolean) => any;
    onDoubleClick: (item: IProjectFileOrFolder) => any;
    onDelete: (item: IProjectFileOrFolder) => any;
    onMoving: (item: IProjectFileOrFolder) => any;
    onMoveTo: (item?: IProjectFileOrFolder, folder?: IProjectFolder) => any;
    moving: IProjectFileOrFolder;
    noActions?: true;
    folderSelectionOnly?: true;
}

interface S {
    fileName: string;
    filePath: string;
    loading: boolean;
    dirty: boolean;
    renaming: boolean;
    active: boolean;
    collapsed: boolean;
    children: IProjectFileOrFolder[];
    newFolderModalOpen: boolean;
    fileDropping: boolean;
}

export default class ProjectItemUI extends React.PureComponent<P, S> {
    state: S = {
        fileName: this.props.item.name,
        filePath: this.props.item.path,
        loading: this.props.item.type !== "folder" && !this.props.item.data,
        dirty: this.props.item.isDirty,
        renaming: false,
        active: this.props.item === this.props.env.activeEditor?.file,
        collapsed: this.props.item.type === "folder" && !!this.props.selected.find(item => (this.props.item as IProjectFolder).isParentOf(item)),
        children: (this.props.item as IProjectFolder)?.getOrderedItems?.() || [],
        newFolderModalOpen: false,
        fileDropping: false
    };
    dragged = false;
    get strings() {
        return I18n[this.props.lang].FileManagerUI;
    }
    handleClickCollapse = () => this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
    handleClickItem = (e: React.MouseEvent<HTMLDivElement>) => {
        if (this.state.renaming) return;
        if (this.dragged) return;
        const { shiftKey: shift, metaKey, ctrlKey } = e;
        const ctrl = this.props.env.os === "MacOS" ? metaKey : ctrlKey;
        this.props.onClick(this.props.item, ctrl, shift);
        e.currentTarget.focus();
    };
    handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (this.state.renaming) return;
        if (this.dragged) return;
        this.props.onDoubleClick(this.props.item);
    };
    handleClickRename = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        const { fileName: oldName } = this.state;
        const container = e.currentTarget.parentElement.parentElement.getElementsByClassName("file-manager-item-name-container")[0] as HTMLSpanElement;
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
                await this.props.item.rename(newName);
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
    handleClickDelete = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        this.props.onDelete(this.props.item);
    };
    handleClickNewFolder = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        this.setState({ newFolderModalOpen: true });
    };
    handleNewFolderModalClose = () => {
        this.setState({ newFolderModalOpen: false });
    };
    handleNewFolderModalConfirm = async (parent: IProjectFolder, folderName: string) => {
        await parent.addFolder(folderName);
        this.setState({ newFolderModalOpen: false });
    };
    handleItemReady = () => this.setState({ loading: false });
    handleItemDirty = (dirty: ProjectItemEventMap["dirty"]) => this.setState({ dirty });
    handleItemNameChanged = ({ newName }: ProjectItemEventMap["nameChanged"]) => this.setState({ fileName: newName, filePath: this.props.item.path });
    handleItemPathChanged = () => this.setState({ filePath: this.props.item.path });
    handleItemTreeChanged = () => this.setState({ children: (this.props.item as IProjectFolder)?.getOrderedItems?.() || [] });
    handleEnvActiveEditor = ({ editor }: EnvEventMap["activeEditor"]) => this.setState({ active: this.props.item === editor?.file });
    handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        if (this.props.item.type !== "folder") return;
        e.preventDefault();
        e.stopPropagation();
        if (this.state.fileDropping) return;
        const { dataTransfer } = e;
        if (dataTransfer && dataTransfer.items.length && dataTransfer.items[0].kind === "file") this.setState({ fileDropping: true });
    };
    handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        if (this.props.item.type !== "folder") return;
        this.handleDragEnter(e);
    };
    handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        if (this.props.item.type !== "folder") return;
        e.preventDefault();
        e.stopPropagation();
        this.setState({ fileDropping: false });
    };
    handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        if (this.props.item.type !== "folder") return;
        e.preventDefault();
        e.stopPropagation();
        this.setState({ fileDropping: false });
        const { dataTransfer } = e;
        if (dataTransfer && dataTransfer.files.length) {
            for (const file of e.dataTransfer.files) {
                await this.props.env.fileMgr.importFile(file, this.props.item as IProjectFolder);
            }
        }
    };
    mouseMoveSubscribed = false;
    handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (this.props.item.type !== "folder") return;
        if (!this.props.moving) return;
        if (this.props.moving === this.props.item) return;
        if (this.props.moving.parent === this.props.item) return;
        if (this.mouseMoveSubscribed) return;
        this.mouseMoveSubscribed = true;
        e.preventDefault();
        e.stopPropagation();
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
                if (this.props.item.path === path) this.setState({ fileDropping: true });
                else this.setState({ fileDropping: false });
            }
        };
        handleMouseMove(e.nativeEvent);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", handleMouseMove);
    };
    handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (this.props.moving) return;
        this.dragged = false;
        e.stopPropagation();
        e.preventDefault();
        const { currentTarget } = e;
        // Clone Node to follow cursor
        const cloned = currentTarget.cloneNode(true) as HTMLDivElement;
        cloned.style.position = "fixed";
        cloned.style.display = "none";
        cloned.style.zIndex = "1000";
        cloned.style.width = `${currentTarget.clientWidth}px`;
        cloned.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        currentTarget.parentElement.appendChild(cloned);
        this.props.onMoving(this.props.item);
        const handleMouseMove = (e: MouseEvent) => {
            this.dragged = true;
            if (cloned) {
                cloned.style.display = "block";
                cloned.style.left = `${e.clientX + 10}px`;
                cloned.style.top = `${e.clientY + 10}px`;
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            if (cloned) cloned.remove();
            if (!this.dragged) {
                this.props.onMoveTo();
                return;
            }
            this.dragged = false;
            const { target, clientX, clientY } = e;
            const parent = findFromAscendants(target as HTMLElement, e => e.firstElementChild.classList.contains("folder"));
            if (!parent) {
                this.props.onMoveTo();
                const patcherDiv = findFromAscendants(target as HTMLElement, e => e.classList.contains("patcher-container"));
                if (patcherDiv) {
                    const editorId = patcherDiv.getAttribute("data-id");
                    const editor = this.props.env.editorContainer.findEditorFromId(editorId);
                    if (editor instanceof PatcherEditor) {
                        if (editor.state.locked) return;
                        const patcherRect = patcherDiv.getBoundingClientRect();
                        const { left, top, width, height } = patcherRect;
                        if (clientX < left) return;
                        if (clientX > left + width) return;
                        if (clientY < top) return;
                        if (clientY > top + height) return;
                        const { scrollLeft, scrollTop } = patcherDiv;
                        const x = clientX - left + scrollLeft;
                        const y = clientY - top + scrollTop;
                        const { presentation } = editor.state;
                        editor.createBoxFromFile(this.props.item as PersistentProjectFile, { inlets: 0, outlets: 0, rect: [x, y, 0, 0], presentation });
                    }
                }
            } else {
                const path = (parent.firstChild as HTMLElement).getAttribute("data-id");
                if (!path) this.props.onMoveTo();
                else this.props.onMoveTo(this.props.item, this.props.env.fileMgr.getProjectItemFromPath(path.replace(new RegExp(`^/${this.props.env.fileMgr.projectFolderName}`), "")) as IProjectFolder);
            }
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    componentDidMount() {
        if (this.props.item.isFolder === false) this.props.item.on("ready", this.handleItemReady);
        const item = this.props.item as IProjectItem;
        item.on("dirty", this.handleItemDirty);
        item.on("nameChanged", this.handleItemNameChanged);
        item.on("pathChanged", this.handleItemPathChanged);
        item.on("treeChanged", this.handleItemTreeChanged);
        this.props.env.on("activeEditor", this.handleEnvActiveEditor);
    }
    componentWillUnmount() {
        const item = this.props.item as IProjectItem;
        item.off("ready", this.handleItemReady);
        item.off("dirty", this.handleItemDirty);
        item.off("nameChanged", this.handleItemNameChanged);
        item.off("pathChanged", this.handleItemPathChanged);
        item.off("treeChanged", this.handleItemTreeChanged);
        this.props.env.off("activeEditor", this.handleEnvActiveEditor);
    }
    render() {
        const classNameArray = ["file-manager-item"];
        const { selected, item, noActions, folderSelectionOnly } = this.props;
        const { type } = item;
        const { fileName, collapsed, loading, dirty, renaming, active, filePath, fileDropping } = this.state;
        if (selected.indexOf(item) !== -1) classNameArray.push("selected");
        if (type !== "folder" && loading) classNameArray.push("loading");
        if (renaming) classNameArray.push("renaming");
        if (active) classNameArray.push("active");
        if (type === "folder") classNameArray.push("folder");
        if (folderSelectionOnly && type !== "folder") classNameArray.push("disabled");
        return (
            <div className={fileDropping ? "filedropping" : ""} onDragEnter={this.handleDragEnter} onDragOver={this.handleDragOver} onDragLeave={this.handleDragLeave} onDrop={this.handleDrop} onMouseMove={this.handleMouseMove} onMouseDown={this.handleMouseDown}>
                <div key={fileName} className={classNameArray.join(" ")} data-id={filePath} tabIndex={0} onClick={this.handleClickItem} onDoubleClick={this.handleDoubleClick}>
                    {type === "folder"
                        ? <span className="file-manager-item-collapse" onClick={this.handleClickCollapse}><Icon name={collapsed ? "caret right" : "caret down"} inverted size="small" /></span>
                        : <span className="file-manager-item-marker" style={{ visibility: noActions ? "hidden" : dirty ? "visible" : "hidden" }} />
                    }
                    <span className="file-manager-item-icon"><Icon name={type === "folder" ? collapsed ? "folder" : "folder open" : type === "audio" ? "music" : type === "patcher" ? "sitemap" : type === "image" ? "picture" : type === "video" ? "video" : "code"} inverted size="small" /></span>
                    <span className="file-manager-item-name-container" {...(renaming ? { tabIndex: 0 } : {})} contentEditable={renaming} suppressContentEditableWarning>
                        <span className="file-manager-item-name" style={{ fontWeight: active ? 900 : "normal" }}>{fileName}</span>
                    </span>
                    {noActions
                        ? undefined
                        : <span className="file-manager-item-actions" hidden={renaming}>
                            {type === "folder" ? <span className="file-manager-item-actions-new-folder" title={this.strings.newFolder} onClick={this.handleClickNewFolder}><Icon name="folder outline" inverted size="small" /></span> : undefined}
                            <span className="file-manager-item-actions-rename" title={this.strings.rename} onClick={this.handleClickRename}><Icon name="pencil alternate" inverted size="small" /></span>
                            <span className="file-manager-item-actions-delete" title={this.strings.delete} onClick={this.handleClickDelete}><Icon name="trash" inverted size="small" /></span>
                        </span>
                    }
                </div>
                {type === "folder" && !collapsed
                    ? <div className="file-manager-item-tree">
                        <NewFolderModal lang={this.props.lang} open={this.state.newFolderModalOpen} onClose={this.handleNewFolderModalClose} onConfirm={this.handleNewFolderModalConfirm} folder={item as IProjectFolder} />
                        {this.state.children.map(item => <ProjectItemUI {...this.props} key={item.path} item={item} />)}
                    </div>
                    : undefined
                }
            </div>
        );
    }
}
