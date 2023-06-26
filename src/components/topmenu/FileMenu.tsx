import * as React from "react";
import { Dropdown } from "semantic-ui-react";
import Patcher from "../../core/patcher/Patcher";
import PatcherText from "../../core/text/PatcherText";
import SaveAsModal from "../modals/SaveAsModal";
import NewAudioModal from "../modals/NewAudioModal";
import PatcherAudio from "../../core/audio/PatcherAudio";
import type Env from "../../core/Env";
import type { EnvEventMap } from "../../core/Env";
import type { IFileEditor } from "../../core/file/FileEditor";
import type { IProjectFolder } from "../../core/file/AbstractProjectFolder";
import DeleteAllModal from "../modals/DeleteAllModal";

interface P {
    env: Env;
    lang: string;
}

interface S {
    editor: IFileEditor;
    fileURL: string;
    fileName: string;
    projectRoot: IProjectFolder;
    showSaveAsModal: boolean;
    showNewAudioModal: boolean;
    showDeleteAllModal: boolean;
}

export default class FileMenu extends React.PureComponent<P, S> {
    refDownload = React.createRef<HTMLAnchorElement>();
    refOpenProject = React.createRef<HTMLInputElement>();
    refOpenFile = React.createRef<HTMLInputElement>();
    refOpenFolder = React.createRef<HTMLInputElement>();
    state = {
        editor: this.props.env.activeEditor,
        fileURL: "",
        fileName: this.props.env.activeEditor?.file?.name,
        projectRoot: this.props.env.fileMgr.projectRoot,
        showSaveAsModal: false,
        showNewAudioModal: false,
        showDeleteAllModal: false
    };
    handleClickNewJs = async () => {
        const patcher = new Patcher({ env: this.props.env, project: this.props.env.currentProject });
        await patcher.load({}, "bell");
        const editor = await patcher.getEditor();
        this.props.env.openEditor(editor);
    };
    handleClickNewJsAW = async () => {
        const patcher = new Patcher({ env: this.props.env, project: this.props.env.currentProject });
        await patcher.load({}, "jsaw");
        const editor = await patcher.getEditor();
        this.props.env.openEditor(editor);
    };
    handleClickNewMax = async () => {
        const patcher = new Patcher({ env: this.props.env, project: this.props.env.currentProject });
        await patcher.load({}, "max");
        const editor = await patcher.getEditor();
        this.props.env.openEditor(editor);
    };
    handleClickNewGen = async () => {
        const patcher = new Patcher({ env: this.props.env, project: this.props.env.currentProject });
        await patcher.load({}, "gen");
        const editor = await patcher.getEditor();
        this.props.env.openEditor(editor);
    };
    handleClickNewFaust = async () => {
        const patcher = new Patcher({ env: this.props.env, project: this.props.env.currentProject });
        await patcher.load({}, "faust");
        const editor = await patcher.getEditor();
        this.props.env.openEditor(editor);
    };
    handleClickNewText = async () => {
        const text = new PatcherText({ env: this.props.env, project: this.props.env.currentProject });
        await text.init();
        const editor = await text.getEditor();
        this.props.env.openEditor(editor);
    };
    handleClickNewProject = () => {
        this.setState({ showDeleteAllModal: true });
    };
    handleClickReload = async () => {
        await this.props.env.reload();
    };
    handleClickOpenProject = () => {
        this.refOpenProject.current.click();
    };
    handleClickImportFile = async () => {
        this.refOpenFile.current.click();
    };
    handleClickImportFolder = async () => {
        this.refOpenFolder.current.click();
    };
    handleClickSave = async () => {
        if (this.props.env.activeEditor?.isInMemory) this.setState({ showSaveAsModal: true });
        else await this.props.env.activeEditor?.save();
    };
    handleClickSaveAll = async () => {
        await this.props.env.currentProject?.save();
    };
    handleClickNewAudio = () => this.setState({ showNewAudioModal: true });
    handleNewAudioModalClose = () => this.setState({ showNewAudioModal: false });
    handleNewAudioModalConfirm = async (numberOfChannels: number, sampleRate: number, length: number) => {
        this.setState({ showNewAudioModal: false });
        const audio = new PatcherAudio({ env: this.props.env, project: this.props.env.currentProject });
        await audio.initWithOptions({ numberOfChannels, sampleRate, length });
        const editor = await audio.getEditor();
        this.props.env.openEditor(editor);
    };
    handleClickSaveAs = async () => {
        this.setState({ showSaveAsModal: true });
    };
    handleSaveAsModalClose = () => this.setState({ showSaveAsModal: false });
    handleSaveAsModalConfirm = async (folder: IProjectFolder, name: string) => {
        this.setState({ showSaveAsModal: false });
        await this.props.env.activeEditor?.saveAs(folder, name);
    };
    handleDeleteAllModalClose = () => this.setState({ showDeleteAllModal: false });
    handleDeleteAllModalConfirm = async () => {
        this.setState({ showDeleteAllModal: false });
        await this.props.env.newProject();
    };
    handleClickExportProject = async () => {
        if (!this.props.env.currentProject) return;
        const { name } = this.props.env.currentProject.props;
        const data = await this.props.env.fileMgr.exportProjectZip();
        this.setState({
            fileURL: URL.createObjectURL(new Blob([data])),
            fileName: `${name}.zip`
        }, () => this.refDownload.current.click());
    };
    handleClickExportFile = () => {
        if (!this.props.env.activeEditor) return;
        const { name, data } = this.props.env.activeEditor.file;
        this.setState({
            fileURL: URL.createObjectURL(new Blob([data])),
            fileName: name
        }, () => this.refDownload.current.click());
    };
    onChangeProject = async () => {
        const file = this.refOpenProject.current.files[0];
        if (!file) return;
        const data = await file.arrayBuffer();
        await this.props.env.loadFromZip(data);
        this.refOpenProject.current.value = "";
    };
    onChangeFile = async () => {
        const files = Array.from(this.refOpenFile.current.files);
        for (const file of files) {
            if (!file) return;
            await this.props.env.fileMgr.importFile(file);
        }
        this.refOpenProject.current.value = "";
    };
    onChangeFolder = async () => {
        const files = Array.from(this.refOpenFolder.current.files);
        for (const file of files) {
            if (!file) return;
            const data = await file.arrayBuffer();
            const name = file.name;
            await this.props.env.fileMgr.importFileZip(data, name);
        }
        this.refOpenProject.current.value = "";
    };
    handleActiveEditor = ({ editor }: EnvEventMap["activeEditor"]) => this.setState({ editor, fileName: editor?.file?.name || `Untitled.${editor?.fileExtension}`, projectRoot: this.props.env.fileMgr.projectRoot });
    componentDidMount() {
        this.props.env.on("activeEditor", this.handleActiveEditor);
    }
    componentWillUnmount() {
        this.props.env.off("activeEditor", this.handleActiveEditor);
    }
    render() {
        const ctrl = this.props.env.os === "MacOS" ? "Cmd" : "Ctrl";
        return (
            <>
                <Dropdown item={true} icon={false} text="File">
                    <Dropdown.Menu style={{ minWidth: "max-content" }}>
                        <Dropdown.Item onClick={this.handleClickNewJs} text="New Patcher" description={`${ctrl} + Shift + N`} />
                        {/* <Dropdown.Item onClick={this.handleClickNewJsAW} text="New Js AudioWorklet Patcher" /> */}
                        {/* <Dropdown.Item onClick={this.handleClickNewMax} text="New Max Patcher" /> */}
                        {/* <Dropdown.Item onClick={this.handleClickNewGen} text="New Gen Patcher" /> */}
                        {/* <Dropdown.Item onClick={this.handleClickNewFaust} text="New Faust Patcher" /> */}
                        <Dropdown.Item onClick={this.handleClickNewAudio} text="New Audio..." />
                        <Dropdown.Item onClick={this.handleClickNewText} text="New Text" />
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={this.handleClickNewProject} text="New Project" />
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={this.handleClickOpenProject} text="Open Project Zip..." description={`${ctrl} + O`} />
                        <Dropdown.Item onClick={this.handleClickImportFile} text="Import File..." description={`${ctrl} + Shift + O`} />
                        <Dropdown.Item onClick={this.handleClickImportFolder} text="Import Folder Zip..." />
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={this.handleClickSave} text="Save" description={`${ctrl} + S`} disabled={!this.state.editor} />
                        <Dropdown.Item onClick={this.handleClickSaveAll} text="Save All" />
                        <Dropdown.Item onClick={this.handleClickSaveAs} text="Save As..." description={`${ctrl} + Shift + S`} disabled={!this.state.editor} />
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={this.handleClickExportProject} text="Export Project Zip..." description={`${ctrl} + Alt + E`} />
                        <Dropdown.Item onClick={this.handleClickExportFile} text="Export File..." description={`${ctrl} + Shift + E`} disabled={!this.state.editor} />
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={this.handleClickReload} text="Reload Project" description={`${ctrl} + R`} />
                    </Dropdown.Menu>
                </Dropdown>
                <a ref={this.refDownload} target="_blank" rel="noopener noreferrer" href={this.state.fileURL} download={this.state.fileName}> </a>
                <input ref={this.refOpenProject} type="file" hidden={true} onChange={this.onChangeProject} accept=".zip, application/zip" />
                <input ref={this.refOpenFile} type="file" hidden={true} onChange={this.onChangeFile} />
                <input ref={this.refOpenFolder} type="file" hidden={true} onChange={this.onChangeFolder} accept=".zip, application/zip" />
                <SaveAsModal {...this.props} open={this.state.showSaveAsModal} fileName={this.state.fileName || `Untitled.${this.props.env.activeEditor?.fileExtension}`} folder={this.props.env.activeEditor?.file?.parent || this.props.env.fileMgr.projectRoot} onClose={this.handleSaveAsModalClose} onConfirm={this.handleSaveAsModalConfirm} />
                <NewAudioModal {...this.props} open={this.state.showNewAudioModal} onClose={this.handleNewAudioModalClose} onConfirm={this.handleNewAudioModalConfirm} />
                <DeleteAllModal {...this.props} open={this.state.showDeleteAllModal} onClose={this.handleDeleteAllModalClose} onConfirm={this.handleDeleteAllModalConfirm} />
            </>
        );
    }
}
