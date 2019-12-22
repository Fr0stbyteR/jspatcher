import * as React from "react";
import { Menu, Dropdown, Ref } from "semantic-ui-react";
import Patcher from "../core/Patcher";
import "./TopMenu.scss";
import { TPatcher, TMaxClipboard, TPatcherMode } from "../core/types";

class FileMenu extends React.PureComponent {
    props: { patcher: Patcher };
    refDownload = React.createRef<HTMLAnchorElement>();
    refOpen = React.createRef<HTMLInputElement>();
    state = { pAsString: "", pName: "patcher.json" };
    handleClickNew = () => {
        this.props.patcher.load({}, "js");
        this.setState({ pName: "patcher.json" });
    };
    handleClickNewMax = () => {
        this.props.patcher.load({}, "max");
        this.setState({ pName: "patcher.maxpat" });
    };
    handleClickNewGen = () => {
        this.props.patcher.load({}, "gen");
        this.setState({ pName: "patcher.gendsp" });
    };
    handleClickNewFaust = () => {
        this.props.patcher.load({}, "faust");
        this.setState({ pName: "patcher.dsppat" });
    };
    handleClickOpen = () => {
        this.refOpen.current.click();
    };
    handleClickSaveAs = () => {
        const p = this.props.patcher.toString();
        this.setState({
            pAsString: "data:application/json;charset=utf-8," + encodeURIComponent(p)
        }, () => this.refDownload.current.click());
    };
    onChange = () => {
        const file = this.refOpen.current.files[0];
        if (!file) return;
        const ext = file.name.split(".").pop();
        const extMap: { [key: string]: TPatcherMode } = { json: "js", maxpat: "max", gendsp: "gen", dsppat: "faust" };
        if (!extMap[ext]) return;
        const reader = new FileReader();
        reader.onload = () => {
            let parsed: TPatcher;
            try {
                parsed = JSON.parse(reader.result.toString());
            } catch (e) {
                this.props.patcher.error((e as Error).message);
            }
            if (parsed) {
                this.props.patcher.load(parsed, extMap[ext]);
                this.setState({ pName: file.name });
            }
        };
        reader.onerror = () => this.props.patcher.error(reader.error.message);
        reader.readAsText(file, "UTF-8");
        this.refOpen.current.value = "";
    }
    render() {
        const ctrl = this.props.patcher.env.os === "MacOS" ? "Cmd" : "Ctrl";
        return (
            <>
                <Dropdown item={true} icon={false} text="File">
                    <Dropdown.Menu style={{ minWidth: "max-content" }}>
                        <Dropdown.Item onClick={this.handleClickNew} text="New Patcher" description={`${ctrl} + Shift + N`} />
                        <Dropdown.Item onClick={this.handleClickNewMax} text="New Max Patcher" />
                        <Dropdown.Item onClick={this.handleClickNewGen} text="New Gen Patcher" />
                        <Dropdown.Item onClick={this.handleClickNewFaust} text="New Faust Patcher" />
                        <Dropdown.Item onClick={this.handleClickOpen} text="Open..." description={`${ctrl} + O`} />
                        <Dropdown.Item onClick={this.handleClickSaveAs} text="Save As..." description={`${ctrl} + S`} />
                    </Dropdown.Menu>
                </Dropdown>
                <a ref={this.refDownload} target="_blank" rel="noopener noreferrer" href={this.state.pAsString} download={this.state.pName}> </a>
                <input ref={this.refOpen} type="file" hidden={true} onChange={this.onChange} />
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
class EditMenu extends React.PureComponent {
    props: { patcher: Patcher };
    handleClickUndo = () => {
        if (this.props.patcher.state.locked) return;
        this.props.patcher.undo();
    };
    handleClickRedo = () => {
        if (this.props.patcher.state.locked) return;
        this.props.patcher.redo();
    };
    handleClickCut = () => {
        if (this.props.patcher.state.locked) return;
        navigator.clipboard.writeText(this.props.patcher.selectedToString())
            .then(() => this.props.patcher.deleteSelected());
    };
    handleClickCopy = () => {
        if (this.props.patcher.state.locked) return;
        navigator.clipboard.writeText(this.props.patcher.selectedToString());
    };
    handleClickPaste = () => {
        if (this.props.patcher.state.locked) return;
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
        if (this.props.patcher.state.locked) return;
        this.props.patcher.deleteSelected();
    };
    handleClickDuplicate = () => {
        if (this.props.patcher.state.locked) return;
        const text = this.props.patcher.selectedToString();
        let parsed: TPatcher;
        try {
            parsed = JSON.parse(text);
        } catch (e) {} // eslint-disable-line no-empty
        this.props.patcher.paste(parsed);
    };
    handleClickSelectAll = () => {
        if (this.props.patcher.state.locked) return;
        this.props.patcher.selectAllBoxes();
    };
    render() {
        const ctrl = this.props.patcher.env.os === "MacOS" ? "Cmd" : "Ctrl";
        return (
            <Dropdown item={true} icon={false} text="Edit">
                <Dropdown.Menu style={{ minWidth: "max-content" }}>
                    <Dropdown.Item onClick={this.handleClickUndo} text="Undo" description={`${ctrl} + Z`} />
                    <Dropdown.Item onClick={this.handleClickRedo} text="Redo" description={`${ctrl} + Y`} />
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={this.handleClickCut} text="Cut" description={`${ctrl} + X`} />
                    <Dropdown.Item onClick={this.handleClickCopy} text="Copy" description={`${ctrl} + C`} />
                    <Dropdown.Item onClick={this.handleClickPaste} text="Paste" description={`${ctrl} + V`} />
                    <Dropdown.Item onClick={this.handleClickDelete} text="Delete" description="Del" />
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={this.handleClickDuplicate} text="Duplicate" description={`${ctrl} + D`} />
                    <Dropdown.Item onClick={this.handleClickSelectAll} text="Select All" description={`${ctrl} + A`} />
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
export default class TopMenu extends React.PureComponent {
    props: { patcher: Patcher };
    ref = React.createRef<HTMLDivElement>();
    refFileMenu = React.createRef<FileMenu>();
    refEditMenu = React.createRef<EditMenu>();
    handleKeyDown = (e: KeyboardEvent) => {
        const fileMenu = this.refFileMenu.current;
        const editMenu = this.refEditMenu.current;
        if (!fileMenu || !editMenu) return;

        const ctrlKey = this.props.patcher.env.os === "MacOS" ? e.metaKey : e.ctrlKey;
        if (ctrlKey && e.shiftKey && e.key === "n") fileMenu.handleClickNew();
        else if (ctrlKey && e.key === "o") fileMenu.handleClickOpen();
        else if (ctrlKey && e.key === "s") fileMenu.handleClickSaveAs();
        else if (ctrlKey && e.key === "z") editMenu.handleClickUndo();
        else if (ctrlKey && e.key === "y") editMenu.handleClickRedo();
        else if (ctrlKey && e.key === "x") editMenu.handleClickCut();
        else if (ctrlKey && e.key === "c") editMenu.handleClickCopy();
        else if (ctrlKey && e.key === "v") editMenu.handleClickPaste();
        else if (e.key === "Delete" || e.key === "Backspace") editMenu.handleClickDelete();
        else if (ctrlKey && e.key === "d") editMenu.handleClickDuplicate();
        else if (ctrlKey && e.key === "a") editMenu.handleClickSelectAll();
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
            <Ref innerRef={this.ref}>
                <Menu inverted size="mini" className="top-menu">
                    <FileMenu {...this.props} ref={this.refFileMenu} />
                    <EditMenu {...this.props} ref={this.refEditMenu} />
                </Menu>
            </Ref>
        );
    }
}
