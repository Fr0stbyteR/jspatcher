import * as React from "react";
import { Menu, Ref } from "semantic-ui-react";
import type Env from "../../core/Env";
import FileMenu from "./FileMenu";
import EditMenu from "./EditMenu";
import "./TopMenu.scss";
import ShareMenu from "./ShareMenu";

interface P {
    env: Env;
    lang: string;
}

export default class TopMenu extends React.PureComponent<P> {
    ref = React.createRef<HTMLDivElement>();
    refFileMenu = React.createRef<FileMenu>();
    refEditMenu = React.createRef<EditMenu>();
    handleKeyDown = (e: KeyboardEvent) => {
        const { activeEditor } = this.props.env;
        if (!activeEditor) return;
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
        else if (!editMenu.onShortKey(e)) return;
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
                    <div style={{ flex: "1 1 auto" }}></div>
                    <ShareMenu {...this.props} />
                </Menu>
            </Ref>
        );
    }
}
