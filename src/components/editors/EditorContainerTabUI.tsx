import * as React from "react";
import { Icon } from "semantic-ui-react";
import Env from "../../core/Env";
import { AnyFileInstance } from "../../core/file/FileInstance";
import Folder from "../../core/file/Folder";
import SaveAsModal from "../modals/SaveAsModal";
import TabCloseModal from "../modals/TabCloseModal";

interface P {
    env: Env;
    instance: AnyFileInstance;
    active: boolean;
    onActive: (instance: AnyFileInstance) => any;
    onClose: (instance: AnyFileInstance) => any;
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
        fileName: this.props.instance.file?.name || `Untitled.${this.props.instance.fileExtension}`,
        fileSubscribed: false,
        closeModalOpen: false,
        saveAsModalOpen: false,
        dirty: this.props.instance.isDirty
    };
    handleMouseDownTab = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        this.props.onActive(this.props.instance);
    };
    handleClickClose = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        if (this.props.instance.isDirty) this.setState({ closeModalOpen: true });
        else this.props.onClose(this.props.instance);
    };
    handleCloseModalClose = () => this.setState({ closeModalOpen: false });
    handleCloseModalDiscard = () => {
        this.setState({ closeModalOpen: false });
        this.props.onClose(this.props.instance);
    };
    handleCloseModalConfirm = async () => {
        if (this.props.instance.file) {
            this.setState({ closeModalOpen: false });
            await this.props.instance.save();
            this.props.onClose(this.props.instance);
        } else {
            this.setState({ closeModalOpen: false, saveAsModalOpen: true });
        }
    };
    handleSaveAsModalClose = () => this.setState({ saveAsModalOpen: false });
    handleSaveAsModalConfirm = async (folder: Folder, name: string) => {
        this.setState({ saveAsModalOpen: false });
        await this.props.instance.saveAs(folder, name);
        this.props.onClose(this.props.instance);
    };
    handleInstanceSaved = () => {
        const { file } = this.props.instance;
        if (file) {
            if (!this.state.fileSubscribed) file.on("nameChanged", this.handleInstanceSaved);
            this.setState({ fileName: file.name, fileSubscribed: true });
        }
    };
    handleInstanceDirty = (dirty: boolean) => this.setState({ dirty });
    componentDidMount() {
        this.props.instance.on("saved", this.handleInstanceSaved);
        this.props.instance.on("dirty", this.handleInstanceDirty);
        const { file } = this.props.instance;
        if (file) {
            file.on("nameChanged", this.handleInstanceSaved);
            this.setState({ fileSubscribed: true });
        }
    }
    componentWillUnmount() {
        this.props.instance.off("saved", this.handleInstanceSaved);
        this.props.instance.off("dirty", this.handleInstanceDirty);
        if (this.props.instance.file && this.state.fileSubscribed) {
            this.props.instance.file.off("nameChanged", this.handleInstanceSaved);
            this.setState({ fileSubscribed: false });
        }
    }
    render() {
        const { instance, active } = this.props;
        const name = this.state.fileName;
        const icon = instance.fileIcon;
        const classArray = ["editor-container-tab"];
        if (active) classArray.push("active");
        return (
            <div className={classArray.join(" ")} key={instance.instanceId} onMouseDown={this.handleMouseDownTab}>
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
