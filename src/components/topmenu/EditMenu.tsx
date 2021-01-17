import * as React from "react";
import { Dropdown } from "semantic-ui-react";
import PatcherAudio from "../../core/audio/PatcherAudio";
import Env, { EnvEventMap } from "../../core/Env";
import { AnyFileInstance } from "../../core/file/FileInstance";
import Patcher from "../../core/patcher/Patcher";
import AudioEditMenu from "./AudioEditMenu";
import PatcherEditMenu from "./PatcherEditMenu";

interface P {
    env: Env;
    lang: string;
}

interface S {
    instance: AnyFileInstance;
    locked: boolean;
}

export default class EditMenu extends React.PureComponent<P, S> {
    state = {
        instance: this.props.env.activeInstance,
        locked: !!this.props.env.activeInstance?.isLocked
    };
    refInstanceEditMenu = React.createRef<PatcherEditMenu>();
    handleClickUndo = async () => {
        if (this.state.locked) return;
        this.state.instance.undo();
    };
    handleClickRedo = async () => {
        if (this.state.locked) return;
        this.state.instance.redo();
    };
    handleClickCut = async () => {
        if (this.state.locked) return;
        await this.state.instance.cut();
    };
    handleClickCopy = async () => {
        if (this.state.locked) return;
        await this.state.instance.copy();
    };
    handleClickPaste = async () => {
        if (this.state.locked) return;
        await this.state.instance.paste();
    };
    handleClickDelete = () => {
        if (this.state.locked) return;
        this.state.instance.deleteSelected();
    };
    handleClickSelectAll = () => {
        if (this.state.locked) return;
        this.state.instance.selectAll();
    };
    onShortKey(e: KeyboardEvent) {
        if (this.state.locked) return;
        const ctrlKey = this.props.env.os === "MacOS" ? e.metaKey : e.ctrlKey;
        if (ctrlKey && e.key === "z") this.handleClickUndo();
        else if (ctrlKey && e.key === "y") this.handleClickRedo();
        else if (ctrlKey && e.key === "x") this.handleClickCut();
        else if (ctrlKey && e.key === "c") this.handleClickCopy();
        else if (ctrlKey && e.key === "v") this.handleClickPaste();
        else if (e.key === "Delete" || e.key === "Backspace") this.handleClickDelete();
        else if (ctrlKey && e.key === "a") this.handleClickSelectAll();
        else this.refInstanceEditMenu.current?.onShortKey?.(e);
    }
    handleLocked = (locked: boolean) => this.setState({ locked });
    handleActiveInstance = ({ instance }: EnvEventMap["activeInstance"]) => {
        this.state.instance?.off?.("locked", this.handleLocked);
        this.setState({ instance, locked: !!instance?.isLocked });
        instance?.on?.("locked", this.handleLocked);
    };
    componentDidMount() {
        this.props.env.on("activeInstance", this.handleActiveInstance);
    }
    componentWillUnmount() {
        this.props.env.off("activeInstance", this.handleActiveInstance);
    }
    render() {
        const ctrlKey = this.props.env.os === "MacOS" ? "Cmd" : "Ctrl";
        const locked = this.state.locked || !this.state.instance;
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
                    {this.state.instance ? <Dropdown.Divider /> : undefined}
                    {
                        this.state.instance instanceof Patcher
                            ? <PatcherEditMenu ref={this.refInstanceEditMenu} {...this.props} locked={this.state.locked} instance={this.state.instance} />
                            /* : this.state.instance instanceof PatcherAudio
                                ? <AudioEditMenu ref={this.refInstanceEditMenu} {...this.props} locked={this.state.locked} instance={this.state.instance} />
                            */: undefined
                    }
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
