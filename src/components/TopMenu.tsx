import * as React from "react";
import { Menu, Dropdown, DropdownItemProps } from "semantic-ui-react";
import { Patcher } from "../core/patcher";
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
    handleClickNew = (e: React.MouseEvent, data: DropdownItemProps) => {
        this.props.patcher.clear();
    };
    handleClickOpen = () => {
        this.refOpen.current.click();
    };
    handleClickSaveAs = () => {
        const p = this.props.patcher.toString();
        this.state.pAsString = "data:application/json;charset=utf-8," + encodeURIComponent(p);
        this.state.pName = "patcher.json";
        this.refDownload.current.click();
    };
    onInput = () => {
        const file = this.refOpen.current.files[0];
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
                    console.error(e);
                }
                if (parsed) this.props.patcher.load(extMap[ext], parsed);
            };
            reader.onerror = (e) => {
                console.log(reader.error);
            };
        }
    }
    handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "o") this.handleClickOpen();
        if (e.ctrlKey && e.key === "s") this.handleClickSaveAs();
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
            <>
                <Dropdown item={true} icon={false} text="File">
                    <Dropdown.Menu style={{ minWidth: "max-content" }}>
                        <Dropdown.Item onClick={this.handleClickNew} text="New Patcher" description="Ctrl + Shift + N" />
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

class EditMenu extends React.Component {
    handleClickUndo = () => {
    };
    handleClickRedo = () => {
    };
    handleClickCut = () => {
    };
    handleClickCopy = () => {
    };
    handleClickPaste = () => {
    };
    handleClickDelete = () => {
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
