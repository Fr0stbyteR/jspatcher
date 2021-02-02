import * as React from "react";
import { DropdownItemProps, Modal, Form, Dropdown, Button, DropdownProps } from "semantic-ui-react";
import AudioEditor from "../../core/audio/AudioEditor";
import I18n from "../../i18n/I18n";
import "./ResampleModal.scss";

interface Props {
    editor: AudioEditor;
    lang: string;
    open: boolean;
    onClose: () => any;
}

interface State {
    sampleRateOptions: DropdownItemProps[];
    sampleRateValue: number;
}

export default class ResampleModal extends React.PureComponent<Props, State> {
    state: State = {
        sampleRateOptions: this.sampleRateOptions,
        sampleRateValue: this.props.editor.sampleRate || this.props.editor.audioCtx.sampleRate
    };
    get strings() {
        return I18n[this.props.lang].ResampleModal;
    }
    get sampleRates() {
        const defaults = [6000, 8000, 11025, 16000, 22050, 32000, 44100, 48000, 64000, 88200, 96000, 176400, 192000];
        const ctx = this.props.editor.sampleRate;
        if (ctx && defaults.indexOf(ctx) === -1) defaults.push(ctx);
        const buffer = this.props.editor.sampleRate;
        if (buffer && defaults.indexOf(buffer) === -1) defaults.push(buffer);
        return defaults;
    }
    get sampleRateOptions(): DropdownItemProps[] {
        return this.sampleRates.reverse().map(value => ({ key: value, text: value, value }));
    }
    handleSampleRateAddition = (e: React.KeyboardEvent<HTMLElement>, { value: valueIn }: DropdownProps) => {
        const value = ~~Math.max(1, +valueIn) || this.props.editor.audioCtx.sampleRate;
        if (this.state.sampleRateOptions.find(option => option.value === value)) return;
        this.setState(({ sampleRateOptions }) => ({
            sampleRateOptions: [...sampleRateOptions, { key: value, text: value, value }]
        }));
    };
    handleSampleRateChange = (e: React.SyntheticEvent<HTMLElement, Event>, { value: valueIn }: DropdownProps) => {
        const value = ~~Math.max(1, +valueIn) || this.props.editor.audioCtx.sampleRate;
        this.setState({ sampleRateValue: value });
    };
    handleSetAudio = () => {
        const sampleRate = this.props.editor.sampleRate || this.props.editor.audioCtx.sampleRate;
        if (this.state.sampleRateOptions.find(option => option.value === sampleRate)) {
            this.setState({ sampleRateValue: sampleRate });
            return;
        }
        this.setState(({ sampleRateOptions }) => ({
            sampleRateValue: sampleRate,
            sampleRateOptions: [...sampleRateOptions, { key: sampleRate, text: sampleRate, value: sampleRate }]
        }));
    };
    handleClickConfirm = async () => {
        await this.props.editor.resample(this.state.sampleRateValue);
        this.props.onClose();
    };
    componentDidMount() {
        this.props.editor.on("setAudio", this.handleSetAudio);
    }
    componentWillUnmount() {
        this.props.editor.off("setAudio", this.handleSetAudio);
    }
    render() {
        return (
            <Modal className="modal-resample" basic size="mini" open={this.props.open} onClose={this.props.onClose} closeIcon>
                <Modal.Header>{this.strings.resampleAudio}</Modal.Header>
                <Modal.Content>
                    <Form inverted size="mini">
                        <Form.Field inline>
                            <label>{this.strings.from}</label>
                            <span>{this.props.editor.sampleRate}</span>
                        </Form.Field>
                        <Form.Field inline>
                            <label>{this.strings.to}</label>
                            <Dropdown
                                options={this.state.sampleRateOptions}
                                placeholder={this.state.sampleRateValue.toString()}
                                search
                                selection
                                allowAdditions
                                value={this.state.sampleRateValue}
                                additionLabel={this.strings.addSampleRate}
                                onAddItem={this.handleSampleRateAddition}
                                onChange={this.handleSampleRateChange}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button inverted color="green" size="mini" onClick={this.handleClickConfirm}>{this.strings.confirm}</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}
