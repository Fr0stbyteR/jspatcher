import * as React from "react";
import { Menu, Dropdown } from "semantic-ui-react";
import Patcher from "../core/Patcher";
import "./TopMenu.scss";
import { TPatcher, TMaxClipboard, TPatcherMode } from "../core/types";

class FileMenu extends React.Component {
    props: { patcher: Patcher };
    refDownload: React.RefObject<HTMLAnchorElement> = React.createRef();
    refOpen: React.RefObject<HTMLInputElement> = React.createRef();
    state = { pAsString: "", pName: "patcher.json" };
    handleClickNew = () => {
        this.props.patcher.load("js", {});
    };
    handleClickNewMax = () => {
        this.props.patcher.load("max", {});
    };
    handleClickNewGen = () => {
        this.props.patcher.load("gen", {});
    };
    handleClickNewFaust = () => {
        this.props.patcher.load("faust", {});
    };
    handleClickOpen = () => {
        this.refOpen.current.click();
    };
    handleClickSaveAs = () => {
        const p = this.props.patcher.toString();
        this.setState({
            pAsString: "data:application/json;charset=utf-8," + encodeURIComponent(p),
            pName: "patcher.json"
        });
        this.refDownload.current.click();
    };
    onInput = () => {
        const file = this.refOpen.current.files[0];
        if (!file) return;
        const ext = file.name.split(".").pop();
        const extMap: { [key: string]: TPatcherMode } = { json: "js", maxpat: "max", gendsp: "gen", dsppat: "faust" };
        if (extMap[ext]) {
            const reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = () => {
                let parsed = "";
                try {
                    parsed = JSON.parse(reader.result.toString());
                } catch (e) {
                    this.props.patcher.error(e);
                }
                if (parsed) this.props.patcher.load(extMap[ext], parsed);
            };
            reader.onerror = (e) => {
                this.props.patcher.error(reader.error.message);
            };
            this.refOpen.current.value = "";
        }
    }
    render() {
        return (
            <>
                <Dropdown item={true} icon={false} text="File">
                    <Dropdown.Menu style={{ minWidth: "max-content" }}>
                        <Dropdown.Item onClick={this.handleClickNew} text="New Patcher" description="Ctrl + Shift + N" />
                        <Dropdown.Item onClick={this.handleClickNewMax} text="New Max Patcher" />
                        <Dropdown.Item onClick={this.handleClickNewGen} text="New Gen Patcher" />
                        <Dropdown.Item onClick={this.handleClickNewFaust} text="New Faust Patcher" />
                        <Dropdown.Item onClick={this.handleClickOpen} text="Open..." description="Ctrl + O" />
                        <Dropdown.Item onClick={this.handleClickSaveAs} text="Save As..." description="Ctrl + S" />
                    </Dropdown.Menu>
                </Dropdown>
                <a ref={this.refDownload} target="_blank" rel="noopener noreferrer" href={this.state.pAsString} download={this.state.pName}> </a>
                <input ref={this.refOpen} type="file" hidden={true} onInput={this.onInput} />
            </>
        );
    }
}
declare global {
    interface Clipboard extends EventTarget {
        readText(): Promise<string>;
        writeText(data: string): Promise<void>;
    }
}
class EditMenu extends React.Component {
    props: { patcher: Patcher };
    handleClickUndo = () => {
        if (this.props.patcher._state.locked) return;
        this.props.patcher.undo();
    };
    handleClickRedo = () => {
        if (this.props.patcher._state.locked) return;
        this.props.patcher.redo();
    };
    handleClickCut = () => {
        if (this.props.patcher._state.locked) return;
        navigator.clipboard.writeText(this.props.patcher.selectedToString())
            .then(() => this.props.patcher.deleteSelected());
    };
    handleClickCopy = () => {
        if (this.props.patcher._state.locked) return;
        navigator.clipboard.writeText(this.props.patcher.selectedToString());
    };
    handleClickPaste = () => {
        if (this.props.patcher._state.locked) return;
        navigator.clipboard.readText()
            .then((text) => {
                let parsed: TPatcher | TMaxClipboard;
                try {
                    parsed = JSON.parse(text);
                } catch (e) {} // eslint-disable-line no-empty
                this.props.patcher.paste(parsed);
            });
    };
    handleClickDelete = () => {
        if (this.props.patcher._state.locked) return;
        this.props.patcher.deleteSelected();
    };
    handleClickDuplicate = () => {
    };
    handleClickSelectAll = () => {
    };
    render() {
        return (
            <Dropdown item={true} icon={false} text="Edit">
                <Dropdown.Menu style={{ minWidth: "max-content" }}>
                    <Dropdown.Item onClick={this.handleClickUndo} text="Undo" description="Ctrl + Z" />
                    <Dropdown.Item onClick={this.handleClickRedo} text="Redo" description="Ctrl + Y" />
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={this.handleClickCut} text="Cut" description="Ctrl + X" />
                    <Dropdown.Item onClick={this.handleClickCopy} text="Copy" description="Ctrl + C" />
                    <Dropdown.Item onClick={this.handleClickPaste} text="Paste" description="Ctrl + V" />
                    <Dropdown.Item onClick={this.handleClickDelete} text="Delete" description="Del" />
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={this.handleClickDuplicate} text="Duplicate" description="Ctrl + D" />
                    <Dropdown.Item onClick={this.handleClickSelectAll} text="Select All" description="Ctrl + A" />
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
export default class TopMenu extends React.Component {
    props: { patcher: Patcher };
    refFileMenu: React.RefObject<FileMenu> = React.createRef();
    refEditMenu: React.RefObject<EditMenu> = React.createRef();
    handleKeyDown = (e: KeyboardEvent) => {
        const fileMenu = this.refFileMenu.current;
        const editMenu = this.refEditMenu.current;
        if (!fileMenu || !editMenu) return;

        if (e.ctrlKey && e.shiftKey && e.key === "n") fileMenu.handleClickNew();
        else if (e.ctrlKey && e.key === "o") fileMenu.handleClickOpen();
        else if (e.ctrlKey && e.key === "s") fileMenu.handleClickSaveAs();
        else if (e.ctrlKey && e.key === "z") editMenu.handleClickUndo();
        else if (e.ctrlKey && e.key === "y") editMenu.handleClickRedo();
        else if (e.ctrlKey && e.key === "x") editMenu.handleClickCut();
        else if (e.ctrlKey && e.key === "c") editMenu.handleClickCopy();
        else if (e.ctrlKey && e.key === "v") editMenu.handleClickPaste();
        else if (e.key === "Delete" || e.key === "Backspace") editMenu.handleClickDelete();
        else return;
        e.stopPropagation();
        e.preventDefault();
    }
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }
    render() {
        return (
            <Menu inverted size="mini" fixed={"top"} id="top-menu">
                <FileMenu {...this.props} ref={this.refFileMenu} />
                <EditMenu {...this.props} ref={this.refEditMenu} />
            </Menu>
        );
    }
}
