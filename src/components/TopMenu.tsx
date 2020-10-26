import * as React from "react";
import { Menu, Dropdown, Ref } from "semantic-ui-react";
import Patcher from "../core/Patcher";
import "./TopMenu.scss";
import { RawPatcher, TMaxClipboard } from "../core/types";
import Env from "../core/Env";

class FileMenu extends React.PureComponent<{ env: Env }, { fileURL: string, fileName: string }> {
    refDownload = React.createRef<HTMLAnchorElement>();
    refOpen = React.createRef<HTMLInputElement>();
    state = { fileURL: "", fileName: this.props.env.activeInstance.file?.name };
    handleClickNew = () => {
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
        const { patcher } = this.props;
        patcher.loadFromFile(file);
        this.setState({ pName: patcher.fileName });
        this.refOpen.current.value = "";
    };
    handleLoading = (loading?: string[]) => {
        if (loading) return;
        this.setState({ pName: this.props.patcher.fileName });
    };
    componentDidMount() {
        this.props.patcher.on("loading", this.handleLoading);
    }
    componentWillUnmount() {
        this.props.patcher.off("loading", this.handleLoading);
    }
    render() {
        const ctrl = this.props.patcher.env.os === "MacOS" ? "Cmd" : "Ctrl";
        return (
            <>
                <Dropdown item={true} icon={false} text="File">
                    <Dropdown.Menu style={{ minWidth: "max-content" }}>
                        <Dropdown.Item onClick={this.handleClickNew} text="New Js Patcher" description={`${ctrl} + Shift + N`} />
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
class EditMenu extends React.PureComponent<{ patcher: Patcher }, { locked: boolean }> {
    state = { locked: this.props.patcher._state.locked };
    handleClickUndo = () => {
        if (this.props.patcher.state.locked) return;
        this.props.patcher.undo();
    };
    handleClickRedo = () => {
        if (this.props.patcher.state.locked) return;
        this.props.patcher.redo();
    };
    handleClickNewBox = () => {
        const { patcher } = this.props;
        if (patcher.state.locked) return;
        const { presentation } = patcher._state;
        const [gridX, gridY] = patcher.props.grid;
        const text = "";
        this.props.patcher.createBox({ text, inlets: 0, outlets: 0, rect: [gridX, gridY, 0, 0], presentation, _editing: true });
    };
    handleClickCut = async () => {
        if (this.props.patcher.state.locked) return;
        const s = this.props.patcher.selectedToString();
        if (!s) return;
        await navigator.clipboard.writeText(s);
        this.props.patcher.deleteSelected();
    };
    handleClickCopy = () => {
        if (this.props.patcher.state.locked) return;
        const s = this.props.patcher.selectedToString();
        if (!s) return;
        navigator.clipboard.writeText(s);
    };
    handleClickPaste = async () => {
        if (this.props.patcher.state.locked) return;
        const s = await navigator.clipboard.readText();
        if (!s) return;
        let parsed: RawPatcher | TMaxClipboard;
        try {
            parsed = JSON.parse(s);
        } catch (e) {} // eslint-disable-line no-empty
        this.props.patcher.paste(parsed);
    };
    handleClickDelete = () => {
        if (this.props.patcher.state.locked) return;
        this.props.patcher.deleteSelected();
    };
    handleClickDuplicate = () => {
        if (this.props.patcher.state.locked) return;
        const s = this.props.patcher.selectedToString();
        if (!s) return;
        let parsed: RawPatcher;
        try {
            parsed = JSON.parse(s);
        } catch (e) {} // eslint-disable-line no-empty
        this.props.patcher.paste(parsed);
    };
    handleClickSelectAll = () => {
        if (this.props.patcher.state.locked) return;
        this.props.patcher.selectAllBoxes();
    };
    handleClickInspector = () => {
        if (this.props.patcher.state.locked) return;
        this.props.patcher.inspector();
    };
    handleClickDock = () => {
        if (this.props.patcher.state.locked) return;
        this.props.patcher.dockUI();
    };
    handleLocked = (locked: boolean) => this.setState({ locked });
    componentDidMount() {
        this.props.patcher.on("locked", this.handleLocked);
    }
    componentWillUnmount() {
        this.props.patcher.off("locked", this.handleLocked);
    }
    render() {
        const ctrlKey = this.props.patcher.env.os === "MacOS" ? "Cmd" : "Ctrl";
        const { locked } = this.state;
        return (
            <Dropdown item={true} icon={false} text="Edit">
                <Dropdown.Menu style={{ minWidth: "max-content" }}>
                    <Dropdown.Item onClick={this.handleClickUndo} text="Undo" description={`${ctrlKey} + Z`} disabled={locked} />
                    <Dropdown.Item onClick={this.handleClickRedo} text="Redo" description={`${ctrlKey} + Y`} disabled={locked} />
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={this.handleClickNewBox} text="New Box" description={"N"} disabled={locked} />
                    <Dropdown.Item onClick={this.handleClickCut} text="Cut" description={`${ctrlKey} + X`} disabled={locked} />
                    <Dropdown.Item onClick={this.handleClickCopy} text="Copy" description={`${ctrlKey} + C`} disabled={locked} />
                    <Dropdown.Item onClick={this.handleClickPaste} text="Paste" description={`${ctrlKey} + V`} disabled={locked} />
                    <Dropdown.Item onClick={this.handleClickDelete} text="Delete" description="Del" disabled={locked} />
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={this.handleClickDuplicate} text="Duplicate" description={`${ctrlKey} + D`} disabled={locked} />
                    <Dropdown.Item onClick={this.handleClickSelectAll} text="Select All" description={`${ctrlKey} + A`} disabled={locked} />
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={this.handleClickInspector} text="Inspector" description={`${ctrlKey} + I`} disabled={locked} />
                    <Dropdown.Item onClick={this.handleClickDock} text="Dock UI" description={`${ctrlKey} + Enter`} disabled={locked} />
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
export default class TopMenu extends React.PureComponent<{ env: Env }> {
    ref = React.createRef<HTMLDivElement>();
    refFileMenu = React.createRef<FileMenu>();
    refEditMenu = React.createRef<EditMenu>();
    handleKeyDown = (e: KeyboardEvent) => {
        const { activeInstance } = this.props.env;
        if (!activeInstance) return;
        const fileMenu = this.refFileMenu.current;
        const editMenu = this.refEditMenu.current;
        if (!fileMenu || !editMenu) return;

        if (e.target instanceof HTMLInputElement) return;
        if (e.target instanceof HTMLTextAreaElement) return;
        if ((e.target as HTMLElement).contentEditable === "true") return;
        const ctrlKey = this.props.env.os === "MacOS" ? e.metaKey : e.ctrlKey;
        if (ctrlKey && e.shiftKey && e.key === "n") fileMenu.handleClickNew();
        else if (ctrlKey && e.key === "o") fileMenu.handleClickOpenProject();
        else if (ctrlKey && e.key === "s") fileMenu.handleClickSaveAs();
        else if (activeInstance instanceof Patcher && activeInstance.state.locked) return;
        else if (ctrlKey && e.key === "z") editMenu.handleClickUndo();
        else if (ctrlKey && e.key === "y") editMenu.handleClickRedo();
        else if (ctrlKey && e.key === "x") editMenu.handleClickCut();
        else if (ctrlKey && e.key === "c") editMenu.handleClickCopy();
        else if (ctrlKey && e.key === "v") editMenu.handleClickPaste();
        else if (e.key === "Delete" || e.key === "Backspace") editMenu.handleClickDelete();
        else if (ctrlKey && e.key === "d") editMenu.handleClickDuplicate();
        else if (ctrlKey && e.key === "a") editMenu.handleClickSelectAll();
        else if (ctrlKey && e.key === "i") editMenu.handleClickInspector();
        else if (ctrlKey && e.key === "Enter") editMenu.handleClickDock();
        else return;
        e.stopPropagation();
        e.preventDefault();
    };
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }
    render() {
        return (
            <Ref innerRef={this.ref}>
                <Menu inverted size="mini" className="top-menu">
                    <FileMenu {...this.props} ref={this.refFileMenu} />
                    <EditMenu {...this.props} ref={this.refEditMenu} />
                </Menu>
            </Ref>
        );
    }
}
