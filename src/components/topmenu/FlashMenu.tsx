import * as React from "react";
import { Dropdown } from "semantic-ui-react";
import AudioEditor from "../../core/audio/AudioEditor";
import Env, { EnvEventMap } from "../../core/Env";
import { IFileEditor } from "../../core/file/FileEditor";
import PatcherEditor from "../../core/patcher/PatcherEditor";
import AudioEditMenu from "./AudioEditMenu";
import PatcherEditMenu from "./PatcherEditMenu";

interface P {
    env: Env;
    lang: string;
}

interface S {
    editor: IFileEditor;
    locked: boolean;
}

export default class FlashMenu extends React.PureComponent<P, S> {
    state: S = {
        editor: this.props.env.activeEditor,
        locked: !!this.props.env.activeEditor?.isLocked
    };
    refInstanceEditMenu = React.createRef<PatcherEditMenu & AudioEditMenu>();
    handleClickBuild = async () => {

        // TODO -- we should avoid this intermediate step of converting
        // to an array buffer and then back into a string
        const data = await this.props.env.activeEditor.instance.serialize();

        // var decoder = new TextDecoder('utf-8');
        // const string = decoder.decode(data);

        const webSocket = new WebSocket("ws://ws/compile/");

        webSocket.onopen = (event) => {
            webSocket.send(data);
        };

        // For now, we'll simply assume the connection ends here
        webSocket.onmessage = (event) => {
            console.log(event.data);
        };
        

        // const response = await fetch("compile/", {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({'patcher': string})
        // });
        // console.log(response);
    };
    onShortKey(e: KeyboardEvent) {
        // if (this.state.locked) return false;
        const ctrlKey = this.props.env.os === "MacOS" ? e.metaKey : e.ctrlKey;
        const performed = this.refInstanceEditMenu.current?.onShortKey?.(e);
        if (!performed) {
            if (ctrlKey && e.key === "b") this.handleClickBuild();
            else return false;
        }
        e.stopPropagation();
        e.preventDefault();
        return true;
    }
    handleLocked = (locked: boolean) => this.setState({ locked });
    handleActiveEditor = ({ editor }: EnvEventMap["activeEditor"]) => {
        this.state.editor?.off("locked", this.handleLocked);
        this.setState({ editor, locked: !!editor?.isLocked });
        editor?.on("locked", this.handleLocked);
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
            <Dropdown item={true} icon={false} text="Daisy">
                <Dropdown.Menu style={{ minWidth: "max-content" }}>
                    <Dropdown.Item onClick={this.handleClickBuild} text="Build" description={`${ctrlKey} + B`} />
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
        );
    }
}
