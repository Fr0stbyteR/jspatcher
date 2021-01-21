import * as React from "react";
import { Dropdown, DropdownProps } from "semantic-ui-react";
import AudioEditor from "../../../core/audio/AudioEditor";
import I18n from "../../../i18n/I18n";

interface Props {
    editor: AudioEditor;
    lang: string;
}
interface State {
    devicesInfo: MediaDeviceInfo[];
    selected: string;
}

export default class DeviceSelector extends React.PureComponent<Props, State> {
    state: State = { devicesInfo: [], selected: this.props.editor.recorder?.device || "default" };
    get strings() {
        return I18n[this.props.lang].DeviceSelector;
    }
    async componentDidMount() {
        navigator.mediaDevices.addEventListener("devicechange", this.handleDeviceChange);
        const devicesInfo = await navigator.mediaDevices.enumerateDevices();
        this.setState({ devicesInfo });
    }
    componentWillUnmount() {
        navigator.mediaDevices.removeEventListener("devicechange", this.handleDeviceChange);
    }
    get deviceOptions() {
        return this.state.devicesInfo.filter(d => d.kind === "audioinput").map((d, key) => {
            const { deviceId, label } = d;
            return { key, text: label || deviceId, value: deviceId };
        });
    }
    handleDeviceChange = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const enums = devices.filter(d => d.kind === "audioinput").map(d => d.label || d.deviceId);
        if (enums.indexOf(this.state.selected) === -1) this.setState({ selected: "default" });
    };
    handleChange = (e: React.SyntheticEvent<HTMLElement, Event>, { value }: DropdownProps & { value: string }) => {
        this.setState({ selected: value });
        this.props.editor.handleInputChanged(value);
    };
    render() {
        return (
            <Dropdown className="audio-editor-device-selector" selection compact options={this.deviceOptions} value={this.state.selected} onChange={this.handleChange} />
        );
    }
}
