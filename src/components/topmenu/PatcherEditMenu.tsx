import * as React from "react";
import { Dropdown } from "semantic-ui-react";
import Env from "../../core/Env";
import PatcherEditor from "../../core/patcher/PatcherEditor";

interface P {
    env: Env;
    lang: string;
    editor: PatcherEditor;
    locked: boolean;
}

export default class PatcherEditMenu extends React.PureComponent<P> {
    handleClickNewBox = () => {
        const { editor } = this.props;
        const { presentation } = editor.state;
        const [gridX, gridY] = editor.props.grid;
        const text = "";
        editor.createBox({ text, inlets: 0, outlets: 0, rect: [gridX, gridY, 0, 0], presentation, _editing: true });
    };
    handleClickDuplicate = async () => {
        await this.props.editor.duplicate();
    };
    handleClickInspector = () => {
        this.props.editor.inspector();
    };
    handleClickDock = async () => {
        this.props.editor.dockUI();
    };
    onShortKey(e: KeyboardEvent) {
        const ctrlKey = this.props.env.os === "MacOS" ? e.metaKey : e.ctrlKey;
        let performed = true;
        if (ctrlKey && e.key === "d") this.handleClickDuplicate();
        else if (ctrlKey && e.key === "i") this.handleClickInspector();
        else if (ctrlKey && e.key === "Enter") this.handleClickDock();
        else performed = false;
        return performed;
    }
    render() {
        const ctrlKey = this.props.env.os === "MacOS" ? "Cmd" : "Ctrl";
        const locked = this.props.locked;
        return (
            <>
                <Dropdown.Item onClick={this.handleClickNewBox} text="New Box" description={"N"} disabled={locked} />
                <Dropdown.Item onClick={this.handleClickDuplicate} text="Duplicate" description={`${ctrlKey} + D`} disabled={locked} />
                <Dropdown.Item onClick={this.handleClickInspector} text="Inspector" description={`${ctrlKey} + I`} disabled={locked} />
                <Dropdown.Item onClick={this.handleClickDock} text="Dock UI" description={`${ctrlKey} + Enter`} disabled={locked} />
            </>
        );
    }
}
