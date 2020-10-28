import * as React from "react";
import { Icon } from "semantic-ui-react";
import Env from "../../core/Env";
import { FileState } from "../../core/FileMgr";
import NewAudioModal from "../modals/NewAudioModal";
import DeleteModal from "../modals/DeleteModal";
import DeleteAllModal from "../modals/DeleteAllModal";
import "./FileMgr.scss";
import I18n from "../../i18n/I18n";

interface P {
    env: Env;
    lang: string;
}

interface S {
    collapsed: boolean;
    files: Record<string, FileState>;
    renaming: string;
    selected: string;
    editing: string;
    deleting: string;
    deleteAllModalOpen: boolean;
    newAudioModalOpen: boolean;
}

export default class FileManagerUI extends React.PureComponent<P, S> {
    state: S = {
        collapsed: false,
        files: this.props.env.fileMgr.state.fileStates,
        renaming: undefined,
        selected: undefined,
        editing: undefined,
        deleting: undefined,
        deleteAllModalOpen: false,
        newAudioModalOpen: false
    };
    get strings() {
        return I18n[this.props.lang].FileManagerUI;
    }
    handleFileStateChanged = (files: Record<string, FileState>) => this.setState({ files: JSON.parse(JSON.stringify(files)) });
    handleFileEditChanged = ({ fileName }: { fileName: string }) => this.setState({ editing: fileName });
    handleFileEditEnded = () => this.setState({ editing: undefined });

    componentDidMount() {
        const { fileMgr } = this.props.env;
        fileMgr.on("editFile", this.handleFileEditChanged);
        fileMgr.on("stopEditFile", this.handleFileEditEnded);
        fileMgr.on("fileStateChanged", this.handleFileStateChanged);
    }
    componentWillUnmount() {
        const { fileMgr } = this.props.env;
        fileMgr.off("editFile", this.handleFileEditChanged);
        fileMgr.off("stopEditFile", this.handleFileEditEnded);
        fileMgr.off("fileStateChanged", this.handleFileStateChanged);
    }
    handleClickCollapse = () => this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
    handleClickItem = (e: React.MouseEvent<HTMLDivElement>) => {
        const fileName = (e.currentTarget.getElementsByClassName("file-manager-item-name-container")[0].firstChild as HTMLSpanElement).innerText;
        this.setState({ selected: fileName });
    };
    handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const fileName = (e.currentTarget.getElementsByClassName("file-manager-item-name-container")[0].firstChild as HTMLSpanElement).innerText;
        this.props.env.fileMgr.editing = fileName;
    };
    handleClickRename = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        const container = e.currentTarget.parentElement.parentElement.getElementsByClassName("file-manager-item-name-container")[0] as HTMLSpanElement;
        const span = container.firstChild as HTMLSpanElement;
        const oldName = span.innerText;
        const $beforeExt = oldName.lastIndexOf(".");
        this.setState({ renaming: oldName });
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
                await this.props.env.fileMgr.renameFile(oldName, newName);
            } catch (e) {
                span.innerText = oldName;
            } finally {
                container.contentEditable = "false";
                this.setState({ renaming: undefined });
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
                this.setState({ renaming: undefined });
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
        const container = e.currentTarget.parentElement.parentElement.getElementsByClassName("file-manager-item-name-container")[0] as HTMLSpanElement;
        const span = container.firstChild as HTMLSpanElement;
        const fileName = span.innerText;
        this.setState({ deleting: fileName });
    };
    handleDeleteModalClose = () => {
        this.setState({ deleting: undefined });
    };
    handleDelete = () => {
        const fileName = this.state.deleting;
        if (fileName) this.props.env.fileMgr.removeFile(fileName);
        this.setState({ deleting: undefined });
    };
    handleClickNewFile = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        this.setState({ newAudioModalOpen: true });
    };
    handleClickDeleteAll = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        this.setState({ deleteAllModalOpen: true });
    };
    handleDeleteAll = () => {
        this.props.env.fileMgr.removeAll();
    };
    handleDeleteAllModalClose = () => {
        this.setState({ deleteAllModalOpen: false });
    };
    handleNewAudioModalClose = () => {
        this.setState({ newAudioModalOpen: false });
    };
    get fileTree() {
        const elements: JSX.Element[] = [];
        for (const fileName in this.state.files) {
            const classNameArray = ["file-manager-item"];
            const { isLoading, isDirty, isMemoryOnly } = this.state.files[fileName];
            if (isLoading) classNameArray.push("loading");
            const renaming = fileName === this.state.renaming;
            if (renaming) classNameArray.push("renaming");
            const selected = fileName === this.state.selected;
            if (selected) classNameArray.push("selected");
            const editing = fileName === this.state.editing;
            if (editing) classNameArray.push("editing");
            const deleting = fileName === this.state.deleting;
            if (deleting) classNameArray.push("deleting");
            elements.push(
                <div key={fileName} className={classNameArray.join(" ")} tabIndex={0} onClick={this.handleClickItem} onDoubleClick={this.handleDoubleClick}>
                    <span className="file-manager-item-marker" style={{ visibility: isDirty || isMemoryOnly ? "visible" : "hidden" }} />
                    <span className="file-manager-item-icon"><Icon name="music" inverted size="small" /></span>
                    <span className="file-manager-item-name-container" {...(renaming ? { tabIndex: 0 } : {})} contentEditable={fileName === this.state.renaming} suppressContentEditableWarning>
                        <span className="file-manager-item-name" style={{ fontWeight: editing ? 900 : "normal", fontStyle: isMemoryOnly ? "italic" : "normal" }}>{fileName}</span>
                    </span>
                    <span className="file-manager-item-actions" hidden={renaming}>
                        <span className="file-manager-item-actions-rename" title={this.strings.rename} onClick={this.handleClickRename}><Icon name="pencil alternate" inverted size="small" /></span>
                        <span className="file-manager-item-actions-delete" title={this.strings.delete} onClick={this.handleClickDelete}><Icon name="trash" inverted size="small" /></span>
                    </span>
                    <DeleteModal lang={this.props.lang} open={deleting} onClose={this.handleDeleteModalClose} onConfirm={this.handleDelete} fileName={fileName} />
                </div>
            );
        }
        return elements;
    }
    render() {
        return (
            <div className="left-pane-component file-manager-container">
                <div className="left-pane-component-header file-manager-header" onClick={this.handleClickCollapse}>
                    <span className="left-pane-component-collapse"><Icon name={this.state.collapsed ? "caret right" : "caret down"} inverted size="small" /></span>
                    <span className="left-pane-component-title">{this.strings.files}</span>
                    <span className="left-pane-component-icon" title={this.strings.newFile} onClick={this.handleClickNewFile}><Icon name="add" inverted size="small" /></span>
                    <span className="left-pane-component-icon" title={this.strings.deleteAll} onClick={this.handleClickDeleteAll}><Icon name="trash" inverted size="small" /></span>
                </div>
                <NewAudioModal {...this.props} open={this.state.newAudioModalOpen} onClose={this.handleNewAudioModalClose} />
                <DeleteAllModal lang={this.props.lang} open={this.state.deleteAllModalOpen} onClose={this.handleDeleteAllModalClose} onConfirm={this.handleDeleteAll} count={Object.keys(this.state.files).length} />
                {this.state.collapsed ? undefined : this.fileTree}
            </div>
        );
    }
}
