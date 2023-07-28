import * as React from "react";
import { Icon, Image, Menu, Ref, Popup } from "semantic-ui-react";
import type Env from "../../core/Env";
import FileMenu from "./FileMenu";
import EditMenu from "./EditMenu";
import FlashMenu from "./FlashMenu";
import "./TopMenu.scss";
import ShareMenu from "./ShareMenu";
import BellIcon from "./Bell_logo_text.png";

interface P {
    env: Env;
    lang: string;
}

interface S {
    connected: boolean;
}

export default class TopMenu extends React.PureComponent<P, S> {
    ref = React.createRef<HTMLDivElement>();
    refFileMenu = React.createRef<FileMenu>();
    refEditMenu = React.createRef<EditMenu>();
    refFlashMenu = React.createRef<FlashMenu>();
    state = {
        connected: false,
    }
    handleKeyDown = (e: KeyboardEvent) => {
        const { activeEditor } = this.props.env;

        const fileMenu = this.refFileMenu.current;
        const editMenu = this.refEditMenu.current;
        const flashMenu = this.refFlashMenu.current;
        if (!fileMenu || !editMenu || !flashMenu) return;

        if (e.target instanceof HTMLInputElement) return;
        if (e.target instanceof HTMLTextAreaElement) return;
        if ((e.target as HTMLElement).contentEditable === "true") return;
        const ctrlKey = this.props.env.os === "MacOS" ? e.metaKey : e.ctrlKey;

        if (ctrlKey && e.shiftKey && e.key === "C") {
            fileMenu.handleClickNewJs();
            e.stopPropagation();
            e.preventDefault();
            return;
        }

        if (ctrlKey && e.shiftKey && e.key === "O") {
            fileMenu.handleClickImportFile();
            e.stopPropagation();
            e.preventDefault();
            return;
        }

        if (!activeEditor)
            return;

        if (ctrlKey && e.key === "o") fileMenu.handleClickOpenProject();
        else if (ctrlKey && e.shiftKey && e.key === "S") fileMenu.handleClickSaveAs();
        else if (ctrlKey && e.key === "s") fileMenu.handleClickSave();
        else if (ctrlKey && e.shiftKey && e.key === "E") fileMenu.handleClickExportFile();
        else if (ctrlKey && e.altKey && e.key === "e") fileMenu.handleClickExportProject();
        else if (ctrlKey && e.key === "r") fileMenu.handleClickReload();
        else if (!editMenu.onShortKey(e) && !flashMenu.onShortKey(e)) return;
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
                    <img src={BellIcon} height='max-content' width='80px' style={{ alignSelf: 'center', marginRight: '0.4em', marginLeft: '0.4em' }} />
                    <FileMenu {...this.props} ref={this.refFileMenu} />
                    <EditMenu {...this.props} ref={this.refEditMenu} />
                    <FlashMenu {...this.props} ref={this.refFlashMenu} onConnect={() => this.setState({ connected: true })} onDisconnect={() => this.setState({ connected: false })} />
                    <div style={{ flex: "1 1 auto" }}></div>
                    {/* <ShareMenu {...this.props} /> */}
                    {/* <Popup inverted
                        content={this.state.connected ? "Daisy Connected" : "Daisy not connected"}
                        trigger={
                            <div style={{ alignSelf: 'center' }}>
                                {this.state.connected ? <Icon name="linkify" color="blue" /> : <Icon name="unlink" color="red" />}
                            </div>
                        }
                    /> */}
                </Menu>
            </Ref>
        );
    }
}
