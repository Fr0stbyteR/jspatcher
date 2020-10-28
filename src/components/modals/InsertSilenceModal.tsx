import * as React from "react";
import { Modal, Button, DropdownItemProps, Dropdown, DropdownProps, Form } from "semantic-ui-react";
import TimeInputUI from "./TimeInput";
import Env from "../core/Env";
import "./InsertSilenceModal.scss";
import { TUnit } from "../core/types";
import I18n from "../i18n/I18n";

interface Props {
    env: Env;
    lang: string;
    open: boolean;
    onClose: () => any;
}
interface State {
    unit: TUnit;
    samples: number;
}

export default class InsertSilenceModal extends React.PureComponent<Props, State> {
    state: State = { unit: this.props.env.editor.state.unit, samples: this.props.env.editor.currentFileState?.buffer.sampleRate || 48000 };
    get strings() {
        return I18n[this.props.lang].InsertSilenceModal;
    }
    get unitOptions(): DropdownItemProps[] {
        return ["time", "sample", "measure"].map(value => ({ key: value, text: value, value }));
    }
    handleUnitChange = (e: React.SyntheticEvent<HTMLElement, Event>, { value }: DropdownProps) => this.setState({ unit: value as TUnit });
    handleTimeChange = (samples: number) => this.setState({ samples: Math.max(0, samples) });
    handleConfirm = () => {
        this.props.env.editor.insertSilence(this.state.samples);
        this.props.onClose();
    };
    render() {
        if (!this.props.env.editor.currentFileState) return <></>;
        return (
            <Modal className="modal-insert-silence" basic size="mini" open={this.props.open} onClose={this.props.onClose} closeIcon>
                <Modal.Header>{this.strings.title}</Modal.Header>
                <Modal.Content>
                    <Form inverted size="mini">
                        <Form.Field inline>
                            <label>{this.strings.msg}</label>
                            <TimeInputUI unit={this.state.unit} {...this.props.env.editor.state.unitOptions} samples={this.state.samples} sampleRate={this.props.env.editor.currentFileState.buffer.sampleRate} onChange={this.handleTimeChange} />
                            <Dropdown options={this.unitOptions} value={this.state.unit} onChange={this.handleUnitChange} />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button inverted color="grey" size="mini" onClick={this.props.onClose}>{this.strings.cancel}</Button>
                    <Button inverted color="green" size="mini" onClick={this.handleConfirm}>{this.strings.insert}</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}
