import * as React from "react";
import { Menu, Ref } from "semantic-ui-react";
import "./TopMenu.scss";
import Env from "../../core/Env";
import FileMenu from "./FileMenu";
import EditMenu from "./EditMenu";

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
        if (ctrlKey && e.shiftKey && e.key === "n") fileMenu.handleClickNewJs();
        else if (ctrlKey && e.shiftKey && e.key === "o") fileMenu.handleClickImportFile();
        else if (ctrlKey && e.key === "o") fileMenu.handleClickOpenProject();
        else if (ctrlKey && e.shiftKey && e.key === "s") fileMenu.handleClickSaveAs();
        else if (ctrlKey && e.key === "s") fileMenu.handleClickSave();
        else if (ctrlKey && e.shiftKey && e.key === "e") fileMenu.handleClickExportFile();
        else if (ctrlKey && e.key === "e") fileMenu.handleClickExportProject();
        else if (ctrlKey && e.key === "r") fileMenu.handleClickReload();
        else if (editMenu.state.locked) return;
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
