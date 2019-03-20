import * as React from "react";
import { Menu, Dropdown, DropdownItemProps } from "semantic-ui-react";
import { Patcher, TPatcher, TMaxClipboard } from "../core/patcher";
import "./TopMenu.scss";

export class TopMenu extends React.Component {
    props: { patcher: Patcher };
    render() {
        return (
            <Menu inverted={true} fixed={"top"} id="top-menu">
                <FileMenu {...this.props} />
                <EditMenu {...this.props} />
            </Menu>
        );
    }
}

class FileMenu extends React.Component {
    props: { patcher: Patcher };
    refDownload = React.createRef() as React.RefObject<HTMLAnchorElement>;
    refOpen = React.createRef() as React.RefObject<HTMLInputElement>;
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
        const extMap = { json: "js", maxpat: "max", gendsp: "gen" } as { [key: string]: "js" | "max" | "gen" };
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
    handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && e.key === "n") this.handleClickNew();
        else if (e.ctrlKey && e.key === "o") this.handleClickOpen();
        else if (e.ctrlKey && e.key === "s") this.handleClickSaveAs();
        else return true;
        e.stopPropagation();
        e.preventDefault();
        return false;
    }
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }
    render() {
        return (
            <>
                <Dropdown item={true} icon={false} text="File">
                    <Dropdown.Menu style={{ minWidth: "max-content" }}>
                        <Dropdown.Item onClick={this.handleClickNew} text="New Patcher" description="Ctrl + Shift + N" />
                        <Dropdown.Item onClick={this.handleClickNewMax} text="New Max Patcher" />
                        <Dropdown.Item onClick={this.handleClickNewGen} text="New Gen Patcher" />
                        <Dropdown.Item onClick={this.handleClickOpen} text="Open..." description="Ctrl + O" />
                        <Dropdown.Item onClick={this.handleClickSaveAs} text="Save As..." description="Ctrl + S" />
                    </Dropdown.Menu>
                </Dropdown>
                <a ref={this.refDownload} target="_blank" href={this.state.pAsString} download={this.state.pName} />
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
    interface Navigator {
        clipboard: Clipboard;
    }
}
class EditMenu extends React.Component {
    props: { patcher: Patcher };
    handleClickUndo = () => {
    };
    handleClickRedo = () => {
    };
    handleClickCut = () => {
    };
    handleClickCopy = () => {
    };
    handleClickPaste = () => {
        navigator.clipboard.readText()
        .then((text) => {
            let parsed: TPatcher | TMaxClipboard;
            try {
                parsed = JSON.parse(text);
            } catch (e) {}
            this.props.patcher.paste(parsed);
        });
    };
    handleClickDelete = () => {
    };
    handleClickDuplicate = () => {
    };
    handleClickSelectAll = () => {
    };
    handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "v") this.handleClickPaste();
        else return true;
        e.stopPropagation();
        e.preventDefault();
        return false;
    }
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }
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
