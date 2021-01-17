import * as React from "react";
import { Dropdown } from "semantic-ui-react";
import Env from "../../core/Env";
import PatcherAudio from "../../core/audio/PatcherAudio";

interface P {
    env: Env;
    lang: string;
    instance: PatcherAudio;
    locked: boolean;
}

export default class AudioEditMenu extends React.PureComponent<P> {
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
