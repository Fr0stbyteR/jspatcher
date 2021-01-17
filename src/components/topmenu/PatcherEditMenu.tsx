import * as React from "react";
import { Dropdown } from "semantic-ui-react";
import Env from "../../core/Env";
import Patcher from "../../core/patcher/Patcher";

interface P {
    env: Env;
    lang: string;
    instance: Patcher;
    locked: boolean;
}

export default class PatcherEditMenu extends React.PureComponent<P> {
    handleClickNewBox = () => {
        const { instance: patcher } = this.props;
        const { presentation } = patcher._state;
        const [gridX, gridY] = patcher.props.grid;
        const text = "";
        patcher.createBox({ text, inlets: 0, outlets: 0, rect: [gridX, gridY, 0, 0], presentation, _editing: true });
    };
    handleClickDuplicate = async () => {
        await this.props.instance.duplicate();
    };
    handleClickInspector = () => {
        this.props.instance.inspector();
    };
    handleClickDock = async () => {
        this.props.instance.dockUI();
    };
    onShortKey(e: KeyboardEvent) {
        const ctrlKey = this.props.env.os === "MacOS" ? e.metaKey : e.ctrlKey;
        if (ctrlKey && e.key === "d") this.handleClickDuplicate();
        else if (ctrlKey && e.key === "i") this.handleClickInspector();
        else if (ctrlKey && e.key === "Enter") this.handleClickDock();
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
