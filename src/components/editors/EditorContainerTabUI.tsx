import * as React from "react";
import { Icon } from "semantic-ui-react";
import SaveAsModal from "../modals/SaveAsModal";
import TabCloseModal from "../modals/TabCloseModal";
import type Env from "../../core/Env";
import type { IProjectFolder } from "../../core/file/AbstractProjectFolder";
import type { IFileEditor } from "../../core/file/FileEditor";

interface P {
    env: Env;
    editor: IFileEditor;
    active: boolean;
    onActive: (editor: IFileEditor) => any;
    onClose: (editor: IFileEditor) => any;
    lang: string;
}

interface S {
    fileName: string;
    fileSubscribed: boolean;
    closeModalOpen: boolean;
    saveAsModalOpen: boolean;
    dirty: boolean;
}

export class EditorContainerTabUI extends React.PureComponent<P, S> {
    state: S = {
        fileName: this.props.editor.file?.name || `Untitled.${this.props.editor.fileExtension}`,
        fileSubscribed: false,
        closeModalOpen: false,
        saveAsModalOpen: false,
        dirty: this.props.editor.isDirty
    };
    handleMouseDownTab = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        this.props.onActive(this.props.editor);
    };
    handleClickClose = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        if (this.props.editor.isDirty) this.setState({ closeModalOpen: true });
        else this.props.onClose(this.props.editor);
    };
    handleCloseModalClose = () => this.setState({ closeModalOpen: false });
    handleCloseModalDiscard = () => {
        this.setState({ closeModalOpen: false });
        this.props.onClose(this.props.editor);
    };
    handleCloseModalConfirm = async () => {
        if (this.props.editor.file) {
            this.setState({ closeModalOpen: false });
            await this.props.editor.save();
            this.props.onClose(this.props.editor);
        } else {
            this.setState({ closeModalOpen: false, saveAsModalOpen: true });
        }
    };
    handleSaveAsModalClose = () => this.setState({ saveAsModalOpen: false });
    handleSaveAsModalConfirm = async (folder: IProjectFolder, name: string) => {
        this.setState({ saveAsModalOpen: false });
        await this.props.editor.saveAs(folder, name);
        this.props.onClose(this.props.editor);
    };
    handleSaved = () => {
        const { file } = this.props.editor;
        if (file) {
            if (!this.state.fileSubscribed) file.on("nameChanged", this.handleSaved);
            this.setState({ fileName: file.name, fileSubscribed: true });
        }
    };
    handleDirty = (dirty: boolean) => this.setState({ dirty });
    componentDidMount() {
        this.props.editor.on("saved", this.handleSaved);
        this.props.editor.on("dirty", this.handleDirty);
        const { file } = this.props.editor;
        if (file) {
            file.on("nameChanged", this.handleSaved);
            this.setState({ fileSubscribed: true });
        }
    }
    componentWillUnmount() {
        this.props.editor.off("saved", this.handleSaved);
        this.props.editor.off("dirty", this.handleDirty);
        if (this.props.editor.file && this.state.fileSubscribed) {
            this.props.editor.file.off("nameChanged", this.handleSaved);
            this.setState({ fileSubscribed: false });
        }
    }
    render() {
        const { editor, active } = this.props;
        const name = this.state.fileName;
        const icon = editor.fileIcon;
        const classArray = ["editor-container-tab"];
        if (active) classArray.push("active");
        return (
            <div className={classArray.join(" ")} key={editor.editorId} onMouseDown={this.handleMouseDownTab}>
                {this.state.dirty ? <span className="editor-container-tab-dirty" /> : undefined}
                <Icon className="editor-container-tab-icon" name={icon} />
                <span className="editor-container-tab-name" style={{ fontStyle: this.state.fileSubscribed ? "normal" : "italic" }}>{name}</span>
                <span className="editor-container-tab-close" onClick={this.handleClickClose}>×</span>
                <TabCloseModal lang={this.props.lang} open={this.state.closeModalOpen} fileName={this.state.fileName} onClose={this.handleCloseModalClose} onDiscard={this.handleCloseModalDiscard} onConfirm={this.handleCloseModalConfirm} />
                <SaveAsModal env={this.props.env} lang={this.props.lang} open={this.state.saveAsModalOpen} fileName={this.state.fileName} folder={this.props.env.fileMgr.projectRoot} onClose={this.handleSaveAsModalClose} onConfirm={this.handleSaveAsModalConfirm} />
            </div>
        );
    }
}
