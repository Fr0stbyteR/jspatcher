import * as React from "react";
import { Dropdown } from "semantic-ui-react";
import Env, { EnvEventMap } from "../../core/Env";
import { AnyFileInstance } from "../../core/file/FileInstance";
import Patcher from "../../core/Patcher";

export default class EditMenu extends React.PureComponent<{ env: Env }, { instance: AnyFileInstance; locked: boolean }> {
    state = {
        instance: this.props.env.activeInstance,
        locked: this.props.env.activeInstance instanceof Patcher ? this.props.env.activeInstance.state.locked : false
    };
    handleClickUndo = async () => {
        if (this.state.locked) return;
        this.state.instance.undo();
    };
    handleClickRedo = async () => {
        if (this.state.locked) return;
        this.state.instance.redo();
    };
    handleClickNewBox = () => {
        if (this.state.locked) return;
        const { instance: patcher } = this.state;
        if (!(patcher instanceof Patcher)) return;
        const { presentation } = patcher._state;
        const [gridX, gridY] = patcher.props.grid;
        const text = "";
        patcher.createBox({ text, inlets: 0, outlets: 0, rect: [gridX, gridY, 0, 0], presentation, _editing: true });
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
    handleClickDuplicate = async () => {
        if (this.state.locked) return;
        const { instance: patcher } = this.state;
        if (!(patcher instanceof Patcher)) return;
        await patcher.duplicate();
    };
    handleClickSelectAll = () => {
        if (this.state.locked) return;
        this.state.instance.selectAll();
    };
    handleClickInspector = async () => {
        if (this.state.locked) return;
        const { instance: patcher } = this.state;
        if (!(patcher instanceof Patcher)) return;
        await patcher.duplicate();
        patcher.inspector();
    };
    handleClickDock = async () => {
        if (this.state.locked) return;
        const { instance: patcher } = this.state;
        if (!(patcher instanceof Patcher)) return;
        await patcher.duplicate();
        patcher.dockUI();
    };
    handleLocked = (locked: boolean) => this.setState({ locked });
    handleActiveInstance = (instance: EnvEventMap["activeInstance"]) => {
        if (this.state.instance instanceof Patcher) this.state.instance.off("locked", this.handleLocked);
        this.setState({ instance });
    };
    componentDidMount() {
        this.props.env.on("activeInstance", this.handleActiveInstance);
    }
    componentWillUnmount() {
        this.props.env.off("activeInstance", this.handleActiveInstance);
    }
    render() {
        const ctrlKey = this.props.env.os === "MacOS" ? "Cmd" : "Ctrl";
        const { locked } = this.state;
        return (
            <Dropdown item={true} icon={false} text="Edit">
                <Dropdown.Menu style={{ minWidth: "max-content" }}>
                    <Dropdown.Item onClick={this.handleClickUndo} text="Undo" description={`${ctrlKey} + Z`} disabled={locked} />
                    <Dropdown.Item onClick={this.handleClickRedo} text="Redo" description={`${ctrlKey} + Y`} disabled={locked} />
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={this.handleClickNewBox} text="New Box" description={"N"} disabled={locked} />
                    <Dropdown.Item onClick={this.handleClickCut} text="Cut" description={`${ctrlKey} + X`} disabled={locked} />
                    <Dropdown.Item onClick={this.handleClickCopy} text="Copy" description={`${ctrlKey} + C`} disabled={locked} />
                    <Dropdown.Item onClick={this.handleClickPaste} text="Paste" description={`${ctrlKey} + V`} disabled={locked} />
                    <Dropdown.Item onClick={this.handleClickDelete} text="Delete" description="Del" disabled={locked} />
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={this.handleClickDuplicate} text="Duplicate" description={`${ctrlKey} + D`} disabled={locked} />
                    <Dropdown.Item onClick={this.handleClickSelectAll} text="Select All" description={`${ctrlKey} + A`} disabled={locked} />
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={this.handleClickInspector} text="Inspector" description={`${ctrlKey} + I`} disabled={locked} />
                    <Dropdown.Item onClick={this.handleClickDock} text="Dock UI" description={`${ctrlKey} + Enter`} disabled={locked} />
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
