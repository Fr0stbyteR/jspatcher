import * as React from "react";
import { Modal, Form, Input, Button, Dropdown, DropdownProps, DropdownItemProps, InputOnChangeData } from "semantic-ui-react";
import Env from "../../core/Env";
import "./NewAudioModal.scss";
import I18n from "../../i18n/I18n";

interface Props {
    env: Env;
    lang: string;
    open: boolean;
    onClose: () => any;
}

interface State {
    fileNameValue: string;
    fileNameError: boolean;
    sampleRateOptions: DropdownItemProps[];
    sampleRateValue: number;
    numberOfChannelsValue: number;
}

export default class NewAudioModal extends React.PureComponent<Props, State> {
    state: State = {
        fileNameValue: "untitled.wav",
        fileNameError: false,
        sampleRateOptions: this.sampleRateOptions,
        sampleRateValue: this.props.env.audioCtx.sampleRate,
        numberOfChannelsValue: 1
    };
    get strings() {
        return I18n[this.props.lang].NewAudioModal;
    }
    get sampleRates() {
        const defaults = [6000, 8000, 11025, 16000, 22050, 32000, 44100, 48000, 64000, 88200, 96000, 176400, 192000];
        const ctx = this.props.env.audioCtx.sampleRate;
        if (defaults.indexOf(ctx) === -1) defaults.push(ctx);
        return defaults;
    }
    get sampleRateOptions(): DropdownItemProps[] {
        return this.sampleRates.reverse().map(value => ({ key: value, text: value, value }));
    }
    handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => {
        this.setState({ fileNameValue: value, fileNameError: false });
    };
    handleSampleRateAddition = (e: React.KeyboardEvent<HTMLElement>, { value: valueIn }: DropdownProps) => {
        const value = ~~Math.max(1, +valueIn) || this.props.env.audioCtx.sampleRate;
        if (this.state.sampleRateOptions.find(option => option.value === value)) return;
        this.setState(({ sampleRateOptions }) => ({
            sampleRateOptions: [...sampleRateOptions, { key: value, text: value, value }]
        }));
    };
    handleSampleRateChange = (e: React.SyntheticEvent<HTMLElement, Event>, { value: valueIn }: DropdownProps) => {
        const value = ~~Math.max(1, +valueIn) || this.props.env.audioCtx.sampleRate;
        this.setState({ sampleRateValue: value });
    };
    handleNumberOfChannelsChange = (e: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => {
        this.setState({ numberOfChannelsValue: ~~Math.max(1, +value) });
    };
    handleClickCreate = async () => {
        const { fileMgr } = this.props.env;
        const { fileNameValue, numberOfChannelsValue, sampleRateValue } = this.state;
        const exist = await fileMgr.state.worker.exists(`/${fileNameValue}`);
        if (exist) {
            this.setState({ fileNameError: true });
            return;
        }
        this.props.onClose();
        try {
            await fileMgr.newFile(fileNameValue, numberOfChannelsValue, 1, sampleRateValue);
        } catch {}
    };
    render() {
        return (
            <Modal className="modal-new-audio" basic size="mini" open={this.props.open} onClose={this.props.onClose} closeIcon>
                <Modal.Header>{this.strings.createNewAudio}</Modal.Header>
                <Modal.Content>
                    <Form inverted size="mini">
                        <Form.Field inline error={this.state.fileNameError}>
                            <label>{this.strings.fileName}</label>
                            <Input defaultValue={this.state.fileNameValue} onChange={this.handleFileNameChange} />
                        </Form.Field>
                        <Form.Field inline>
                            <label>{this.strings.sampleRate}</label>
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
                        <Form.Field inline>
                            <label>{this.strings.channels}</label>
                            <Input type="number" defaultValue={this.state.numberOfChannelsValue} step={1} min={1} max={128} onChange={this.handleNumberOfChannelsChange} />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button inverted color="green" size="mini" onClick={this.handleClickCreate}>{this.strings.create}</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}
