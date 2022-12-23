import * as React from "react";
import { Dropdown, Loader } from "semantic-ui-react";
// import AudioEditor from "../../core/audio/AudioEditor";
import Env, { EnvEventMap } from "../../core/Env";
import { IFileEditor } from "../../core/file/FileEditor";
// import PatcherEditor from "../../core/patcher/PatcherEditor";
// import AudioEditMenu from "./AudioEditMenu";
// import PatcherEditMenu from "./PatcherEditMenu";
import "./FlashMenu.scss";
// import { NullLiteral } from "ts-morph";

interface P {
    env: Env;
    lang: string;
}

interface S {
    editor: IFileEditor;
    locked: boolean;
    building: boolean;
    build_error: boolean;
    error_message: string;
}

export default class FlashMenu extends React.PureComponent<P, S> {
    state: S = {
        editor: this.props.env.activeEditor,
        locked: this.props.env.activeEditor == null,
        building: false,
        build_error: false,
        error_message: ""
    };
    // refInstanceEditMenu = React.createRef<PatcherEditMenu & AudioEditMenu>();
    handleClickBuild = async () => {

        if (this.state.locked || this.state.building)
            return;

        const data = await this.props.env.activeEditor.instance.serialize();

        const webSocket = new WebSocket("wss://bell.electro-smith.com/ws/compile/");

        webSocket.onopen = (event) => {
            this.state.building = true;
            this.state.build_error = false;
            this.forceUpdate();
            webSocket.send(data);
        };

        // For now, we'll simply assume the connection ends here
        webSocket.onmessage = (event) => {

            try {
                let json = JSON.parse(event.data.toString('utf-8'));
                this.state.build_error = true;
                this.state.error_message = json.error_message.replaceAll("\\", "");
            } catch (error) {
                var saveData = (function () {
                    var a = document.createElement("a");
                    document.body.appendChild(a);

                    a.style.display = "none";
                    return function (data: BinaryData, fileName: string) {
                        var blob = new Blob([data], {type: "octet/stream"});
                        var url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = fileName;
                        a.click();
                        window.URL.revokeObjectURL(url);
                    };
                }());

                saveData(event.data, "patcher.bin");
            }

            this.state.building = false;
            this.forceUpdate();
        };

        webSocket.onerror = () => {
            this.state.build_error = true;
            this.state.error_message = "Error connecting to server. Please try again.";
            this.state.building = false;
            this.forceUpdate();
        };
    };
    onShortKey(e: KeyboardEvent) {
        // if (this.state.locked) return false;
        const ctrlKey = this.props.env.os === "MacOS" ? e.metaKey : e.ctrlKey;
        // const performed = this.refInstanceEditMenu.current?.onShortKey?.(e);
        // if (!performed) {
            if (ctrlKey && e.shiftKey && e.key === "c") this.handleClickBuild();
            else return false;
        // }
        e.stopPropagation();
        e.preventDefault();
        return true;
    }
    handleLocked = (locked: boolean) => this.setState({ locked });
    handleActiveEditor = ({ editor }: EnvEventMap["activeEditor"]) => {
        this.state.locked = editor == null;
        this.forceUpdate();
    };
    componentDidMount() {
        this.props.env.on("activeEditor", this.handleActiveEditor);
    }
    componentWillUnmount() {
        this.props.env.off("activeEditor", this.handleActiveEditor);
    }
    render() {
        const ctrlKey = this.props.env.os === "MacOS" ? "Cmd" : "Ctrl";
        const locked = this.state.locked || !this.state.editor;
        return (
            <div className="loader-container">
                <div>
                    <Dropdown item={true} icon={false} text="Daisy">
                        <Dropdown.Menu style={{ minWidth: "max-content" }}>
                            <Dropdown.Item onClick={this.handleClickBuild} text="Build" description={`${ctrlKey} + Shift + C`} disabled={this.state.locked || this.state.building} />
                            {/* {this.state.editor ? <Dropdown.Divider /> : undefined} */}
                            {/* {
                                this.state.editor instanceof PatcherEditor
                                    ? <PatcherEditMenu ref={this.refInstanceEditMenu} {...this.props} locked={this.state.locked} editor={this.state.editor} />
                                    : this.state.editor instanceof AudioEditor
                                        ? <AudioEditMenu ref={this.refInstanceEditMenu} {...this.props} locked={this.state.locked} editor={this.state.editor} />
                                        : undefined
                            } */}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                { this.state.building ? <Loader active inline size="mini" style={{ "margin-left": "1em" }}></Loader> : <div></div> }
                { this.state.building ? <div className="monitor">Building patcher...</div> : <div></div> }
                { this.state.build_error ? <div className="monitor"> {this.state.error_message} </div> : <div></div> }
            </div>
        );
    }
}
