import * as React from "react";
import { Dropdown } from "semantic-ui-react";
import Env from "../../core/Env";
import Patcher from "../../core/Patcher";

export default class FileMenu extends React.PureComponent<{ env: Env }, { fileURL: string, fileName: string }> {
    refDownload = React.createRef<HTMLAnchorElement>();
    refOpen = React.createRef<HTMLInputElement>();
    state = { fileURL: "", fileName: this.props.env.activeInstance.file?.name };
    handleClickNewJs = () => {
        const patcher = new Patcher(this.props.env.currentProject);
        this.props.env.openInstance(patcher);
    };
    handleClickNewMax = () => {
    };
    handleClickNewGen = () => {
    };
    handleClickNewFaust = () => {
    };
    handleClickNewAudio = () => {
    };
    handleClickNewText = () => {
    };
    handleClickNewProject = () => {
    };
    handleClickReload = () => {
    };
    handleClickOpenProject = () => {
        this.refOpen.current.click();
    };
    handleClickImportFile: () => void;
    handleClickImportFolder: () => void;
    handleClickSave: () => void;
    handleClickSaveAs = () => {
    };
    handleClickExportProject: () => void;
    handleClickExportFile = () => {
        const data = this.props.env.activeInstance.file?.data;
        this.setState({
            fileURL: URL.createObjectURL(new Blob([data], { type: "application/json" }))
        }, () => this.refDownload.current.click());
    };
    onChange = () => {
        const file = this.refOpen.current.files[0];
        if (!file) return;
        const { activeInstance } = this.props.env;
        this.refOpen.current.value = "";
    };
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    render() {
        const ctrl = this.props.env.os === "MacOS" ? "Cmd" : "Ctrl";
        return (
            <>
                <Dropdown item={true} icon={false} text="File">
                    <Dropdown.Menu style={{ minWidth: "max-content" }}>
                        <Dropdown.Item onClick={this.handleClickNewJs} text="New Js Patcher" description={`${ctrl} + Shift + N`} />
                        <Dropdown.Item onClick={this.handleClickNewMax} text="New Max Patcher" />
                        <Dropdown.Item onClick={this.handleClickNewGen} text="New Gen Patcher" />
                        <Dropdown.Item onClick={this.handleClickNewFaust} text="New Faust Patcher" />
                        <Dropdown.Item onClick={this.handleClickNewAudio} text="New Audio" />
                        <Dropdown.Item onClick={this.handleClickNewText} text="New Text" />
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={this.handleClickNewProject} text="New Project" />
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={this.handleClickOpenProject} text="Open Project Zip..." description={`${ctrl} + O`} />
                        <Dropdown.Item onClick={this.handleClickImportFile} text="Import File..." description={`${ctrl} + Shift + O`} />
                        <Dropdown.Item onClick={this.handleClickImportFolder} text="Import Folder Zip..." />
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={this.handleClickSave} text="Save" description={`${ctrl} + S`} />
                        <Dropdown.Item onClick={this.handleClickSaveAs} text="Save As..." description={`${ctrl} + Shift + S`} />
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={this.handleClickExportProject} text="Export Project Zip..." description={`${ctrl} + E`} />
                        <Dropdown.Item onClick={this.handleClickExportFile} text="Export File..." description={`${ctrl} + Shift + E`} />
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={this.handleClickReload} text="Reload Project" description={`${ctrl} + R`} />
                    </Dropdown.Menu>
                </Dropdown>
                <a ref={this.refDownload} target="_blank" rel="noopener noreferrer" href={this.state.fileURL} download={this.state.fileName}> </a>
                <input ref={this.refOpen} type="file" hidden={true} onChange={this.onChange} accept=".json, .maxpat, .gendsp, .dsppat, application/json" />
            </>
        );
    }
}
