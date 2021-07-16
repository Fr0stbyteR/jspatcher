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

export default class EditMenu extends React.PureComponent<P, S> {
    state: S = {
        editor: this.props.env.activeEditor,
        locked: !!this.props.env.activeEditor?.isLocked
    };
    refInstanceEditMenu = React.createRef<PatcherEditMenu & AudioEditMenu>();
    handleClickUndo = async () => {
        if (this.state.locked) return;
        this.state.editor.undo();
    };
    handleClickRedo = async () => {
        if (this.state.locked) return;
        this.state.editor.redo();
    };
    handleClickCut = async () => {
        if (this.state.locked) return;
        await this.state.editor.cut();
    };
    handleClickCopy = async () => {
        if (this.state.locked) return;
        await this.state.editor.copy();
    };
    handleClickPaste = async () => {
        if (this.state.locked) return;
        await this.state.editor.paste();
    };
    handleClickDelete = () => {
        if (this.state.locked) return;
        this.state.editor.deleteSelected();
    };
    handleClickSelectAll = () => {
        if (this.state.locked) return;
        this.state.editor.selectAll();
    };
    onShortKey(e: KeyboardEvent) {
        if (this.state.locked) return;
        const ctrlKey = this.props.env.os === "MacOS" ? e.metaKey : e.ctrlKey;
        const performed = this.refInstanceEditMenu.current?.onShortKey?.(e);
        if (performed) return;
        if (ctrlKey && e.key === "z") this.handleClickUndo();
        else if (ctrlKey && e.key === "y") this.handleClickRedo();
        else if (ctrlKey && e.key === "x") this.handleClickCut();
        else if (ctrlKey && e.key === "c") this.handleClickCopy();
        else if (ctrlKey && e.key === "v") this.handleClickPaste();
        else if (e.key === "Delete" || e.key === "Backspace") this.handleClickDelete();
        else if (ctrlKey && e.key === "a") this.handleClickSelectAll();
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
            <Dropdown item={true} icon={false} text="Edit">
                <Dropdown.Menu style={{ minWidth: "max-content" }}>
                    <Dropdown.Item onClick={this.handleClickUndo} text="Undo" description={`${ctrlKey} + Z`} disabled={locked} />
                    <Dropdown.Item onClick={this.handleClickRedo} text="Redo" description={`${ctrlKey} + Y`} disabled={locked} />
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={this.handleClickCut} text="Cut" description={`${ctrlKey} + X`} disabled={locked} />
                    <Dropdown.Item onClick={this.handleClickCopy} text="Copy" description={`${ctrlKey} + C`} disabled={locked} />
                    <Dropdown.Item onClick={this.handleClickPaste} text="Paste" description={`${ctrlKey} + V`} disabled={locked} />
                    <Dropdown.Item onClick={this.handleClickDelete} text="Delete" description="Del" disabled={locked} />
                    <Dropdown.Item onClick={this.handleClickSelectAll} text="Select All" description={`${ctrlKey} + A`} disabled={locked} />
                    {this.state.editor ? <Dropdown.Divider /> : undefined}
                    {
                        this.state.editor instanceof PatcherEditor
                            ? <PatcherEditMenu ref={this.refInstanceEditMenu} {...this.props} locked={this.state.locked} editor={this.state.editor} />
                            : this.state.editor instanceof AudioEditor
                                ? <AudioEditMenu ref={this.refInstanceEditMenu} {...this.props} locked={this.state.locked} editor={this.state.editor} />
                                : undefined
                    }
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
