import * as React from "react";
import { Icon } from "semantic-ui-react";
import Env, { EnvEventMap } from "../../core/Env";
import Folder from "../../core/file/Folder";
import ProjectItem, { ProjectItemEventMap } from "../../core/file/ProjectItem";
import I18n from "../../i18n/I18n";
import NewFolderModal from "../modals/NewFolderModal";

interface P {
    env: Env;
    lang: string;
    item: ProjectItem;
    selected: ProjectItem[];
    onClick: (item: ProjectItemUI, ctrl?: boolean, shift?: boolean) => any;
    onDoubleClick: (item: ProjectItemUI) => any;
    onDelete: (item: ProjectItemUI) => any;
    noActions?: true;
}

interface S {
    fileName: string;
    filePath: string;
    loading: boolean;
    dirty: boolean;
    renaming: boolean;
    active: boolean;
    collapsed: boolean;
    children: ProjectItem[];
    newFolderModalOpen: boolean;
}

export class ProjectItemUI extends React.PureComponent<P, S> {
    state: S = {
        fileName: this.props.item.name,
        filePath: this.props.item.path,
        loading: this.props.item.type !== "folder" && !this.props.item.data,
        dirty: this.props.item.isDirty,
        renaming: false,
        active: this.props.item === this.props.env.activeInstance?.file,
        collapsed: this.props.item.type === "folder" && !!this.props.selected.find(item => (this.props.item as Folder).isParentOf(item)),
        children: Array.from((this.props.item as Folder)?.items || []),
        newFolderModalOpen: false
    };
    dragged = false;
    get strings() {
        return I18n[this.props.lang].FileManagerUI;
    }
    handleClickCollapse = () => this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
    handleClickItem = (e: React.MouseEvent<HTMLDivElement>) => {
        if (this.state.renaming) return;
        if (this.dragged) return;
        if (this.props.item.type === "folder") this.handleClickCollapse();
        const { shiftKey: shift, metaKey, ctrlKey } = e;
        const ctrl = this.props.env.os === "MacOS" ? metaKey : ctrlKey;
        this.props.onClick(this, ctrl, shift);
    };
    handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (this.state.renaming) return;
        if (this.dragged) return;
        this.props.onDoubleClick(this);
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
        range.setEnd(span.childNodes[0], $beforeExt || oldName.length);
        selection.removeAllRanges();
        selection.addRange(range);
        container.focus();
        const handleBlur = async (e?: FocusEvent) => {
            if (e) e.stopPropagation();
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
                container.removeEventListener("blur", handleBlur);
                container.removeEventListener("keydown", handleKeyDown);
                container.blur();
            }
        };
        container.addEventListener("blur", handleBlur);
        container.addEventListener("keydown", handleKeyDown);
    };
    handleClickDelete = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        this.props.onDelete(this);
    };
    handleClickNewFolder = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        this.setState({ newFolderModalOpen: true });
    };
    handleNewFolderModalClose = () => {
        this.setState({ newFolderModalOpen: false });
    };
    handleNewFolderModalConfirm = async (parent: Folder, folderName: string) => {
        await parent.addFolder(folderName);
        this.setState({ newFolderModalOpen: false });
    };
    handleItemReady = () => this.setState({ loading: false });
    handleItemDirty = (dirty: ProjectItemEventMap["dirty"]) => this.setState({ dirty });
    handleItemNameChanged = ({ newName }: ProjectItemEventMap["nameChanged"]) => this.setState({ fileName: newName, filePath: this.props.item.path });
    handleItemPathChanged = () => this.setState({ filePath: this.props.item.path });
    handleItemTreeChanged = () => this.setState({ children: Array.from((this.props.item as Folder)?.items || []) });
    handleEnvActiveInstance = ({ instance }: EnvEventMap["activeInstance"]) => this.setState({ active: this.props.item === instance.file });
    componentDidMount() {
        if (!this.props.item.data) this.props.item.on("ready", this.handleItemReady);
        this.props.item.on("dirty", this.handleItemDirty);
        this.props.item.on("nameChanged", this.handleItemNameChanged);
        this.props.item.on("pathChanged", this.handleItemPathChanged);
        this.props.item.on("treeChanged", this.handleItemTreeChanged);
        this.props.env.on("activeInstance", this.handleEnvActiveInstance);
    }
    componentWillUnmount() {
        this.props.item.off("ready", this.handleItemReady);
        this.props.item.off("dirty", this.handleItemDirty);
        this.props.item.off("nameChanged", this.handleItemNameChanged);
        this.props.item.off("pathChanged", this.handleItemPathChanged);
        this.props.item.off("treeChanged", this.handleItemTreeChanged);
        this.props.env.off("activeInstance", this.handleEnvActiveInstance);
    }
    render() {
        const classNameArray = ["file-manager-item"];
        const { selected, item, noActions } = this.props;
        const { type } = item;
        const { fileName, collapsed, loading, dirty, renaming, active, filePath } = this.state;
        if (selected.indexOf(item) !== -1) classNameArray.push("selected");
        if (type !== "folder" && loading) classNameArray.push("loading");
        if (renaming) classNameArray.push("renaming");
        if (active) classNameArray.push("active");
        if (type === "folder") classNameArray.push("folder");
        return (
            <>
                <div key={fileName} className={classNameArray.join(" ")} data-id={filePath} tabIndex={0} onClick={this.handleClickItem} onDoubleClick={this.handleDoubleClick}>
                    {noActions
                        ? undefined
                        : type === "folder"
                            ? <span className="file-manager-item-collapse"><Icon name={collapsed ? "caret right" : "caret down"} inverted size="small" /></span>
                            : <span className="file-manager-item-marker" style={{ visibility: dirty ? "visible" : "hidden" }} />
                    }
                    <span className="file-manager-item-icon"><Icon name={type === "folder" ? collapsed ? "folder" : "folder open" : type === "audio" ? "music" : type === "patcher" ? "sitemap" : "code"} inverted size="small" /></span>
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
                        <NewFolderModal lang={this.props.lang} open={this.state.newFolderModalOpen} onClose={this.handleNewFolderModalClose} onConfirm={this.handleNewFolderModalConfirm} folder={item as Folder} />
                        {this.state.children.map(item => <ProjectItemUI {...this.props} key={item.path} item={item} />)}
                    </div>
                    : undefined
                }
            </>
        );
    }
}
