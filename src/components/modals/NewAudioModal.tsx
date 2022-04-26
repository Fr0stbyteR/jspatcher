import * as React from "react";
import { Modal, Form, Input, Button, Dropdown, DropdownProps, DropdownItemProps, InputOnChangeData } from "semantic-ui-react";
import Env from "../../core/Env";
import TimeInputUI from "../editors/audio/TimeInput";
import I18n from "../../i18n/I18n";
import type { TAudioUnit } from "../../core/types";
import "./NewAudioModal.scss";

interface Props {
    env: Env;
    lang: string;
    open: boolean;
    onClose: () => any;
    onConfirm: (numberOfChannels: number, sampleRate: number, length: number) => any;
}

interface State {
    sampleRateOptions: DropdownItemProps[];
    sampleRateValue: number;
    numberOfChannelsValue: number;
    audioUnit: TAudioUnit;
    samples: number;
}

export default class NewAudioModal extends React.PureComponent<Props, State> {
    state: State = {
        sampleRateOptions: this.sampleRateOptions,
        sampleRateValue: this.props.env.audioCtx.sampleRate,
        numberOfChannelsValue: 1,
        audioUnit: this.props.env.options.audioUnit,
        samples: 1
    };
    get strings() {
        return {
            ...I18n[this.props.lang].NewAudioModal,
            ...I18n[this.props.lang].UnitOptions
        };
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
    get unitOptions(): DropdownItemProps[] {
        const unit = ["time", "sample", "measure"] as const;
        return unit.map(value => ({ key: value, text: this.strings[value], value }));
    }
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
    handleUnitChange = (e: React.SyntheticEvent<HTMLElement, Event>, { value }: DropdownProps) => this.setState({ audioUnit: value as TAudioUnit });
    handleTimeChange = (samples: number) => this.setState({ samples: Math.max(1, samples) });
    handleClickCreate = async () => {
        const { numberOfChannelsValue, sampleRateValue, samples } = this.state;
        this.props.onConfirm(numberOfChannelsValue, sampleRateValue, samples);
    };
    handleClick = (e: React.MouseEvent) => e.stopPropagation();
    render() {
        return (
            <Modal className="modal-new-audio" basic size="mini" open={this.props.open} onClose={this.props.onClose} closeIcon onClick={this.handleClick}>
                <Modal.Header>{this.strings.createNewAudio}</Modal.Header>
                <Modal.Content>
                    <Form inverted size="mini">
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
                        <Form.Field inline>
                            <label>{this.strings.length}</label>
                            <TimeInputUI audioUnit={this.state.audioUnit} {...this.props.env.options.audioUnitOptions} samples={this.state.samples} sampleRate={this.state.sampleRateValue} onChange={this.handleTimeChange} style={{ marginLeft: "7px", textAlign: "left" }} />
                            <Dropdown options={this.unitOptions} value={this.state.audioUnit} onChange={this.handleUnitChange} />
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
