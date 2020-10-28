import * as React from "react";
import { Modal, Button, Form, Table, Input, InputOnChangeData } from "semantic-ui-react";
import GainInputUI from "./GainInput";
import Env from "../core/Env";
import { identityMatrix } from "../utils/math";
import "./RemixModal.scss";
import I18n from "../i18n/I18n";

interface Props {
    env: Env
    lang: string;
    open: boolean;
    onClose: () => any;
}
interface State {
    mix: number[][];
}

export default class RemixModal extends React.PureComponent<Props, State> {
    state: State = { mix: identityMatrix(this.props.env.editor.currentFileState?.buffer.numberOfChannels || 1) };
    get strings() {
        return I18n[this.props.lang].RemixModal;
    }
    handleNumberOfChannelsChange = (event: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => {
        if (!this.props.env.editor.currentFileState) return;
        const outs = +~~value || this.state.mix.length;
        if (outs === this.state.mix.length) return;
        const ins = this.props.env.editor.currentFileState.buffer.numberOfChannels;
        const mix = identityMatrix(Math.max(ins, outs)).slice(0, outs).map(v => v.slice(0, ins));
        mix.forEach((x, i) => {
            if (i >= this.state.mix.length) return;
            x.forEach((y, j) => {
                if (j >= this.state.mix[i].length) return;
                x[j] = this.state.mix[i][j];
            });
        });
        this.setState({ mix });
    };
    handleGain = (i: number, j: number, v: number) => {
        if (i >= this.state.mix.length) return;
        if (j >= this.state.mix[i].length) return;
        const mix = this.state.mix.slice();
        mix[i][j] = v;
        this.setState({ mix });
    };
    handleConfirm = async () => {
        if (!this.props.env.editor.currentFileState) return;
        await this.props.env.editor.remixChannels(this.state.mix);
        this.props.onClose();
    };
    handleEditFile = () => this.setState({ mix: identityMatrix(this.props.env.editor.currentFileState?.buffer.numberOfChannels || 1) });
    componentDidMount() {
        this.props.env.editor.on("editFile", this.handleEditFile);
        this.props.env.editor.on("stopEditFile", this.handleEditFile);
        this.props.env.editor.on("buffer", this.handleEditFile);
    }
    componentWillUnmount() {
        this.props.env.editor.off("editFile", this.handleEditFile);
        this.props.env.editor.off("stopEditFile", this.handleEditFile);
        this.props.env.editor.off("buffer", this.handleEditFile);
    }
    get matrix() {
        const { mix } = this.state;
        return (
            <Table size="small" compact="very" collapsing inverted definition unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell />
                        {mix[0].map((v, i) => <Table.HeaderCell key={i}>In {i + 1}</Table.HeaderCell>)}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {mix.map((x, i) => (
                        <Table.Row key={i}>
                            <Table.Cell>Out {i + 1}</Table.Cell>
                            {x.map((y, j) => <Table.Cell key={j}><GainInputUI unit="linear" gain={y} onAdjust={v => this.handleGain(i, j, v)} onChange={v => this.handleGain(i, j, v)} /></Table.Cell>)}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        );
    }
    render() {
        if (!this.props.env.editor.currentFileState) return <></>;
        return (
            <Modal className="modal-remix" basic size="mini" open={this.props.open} onClose={this.props.onClose} closeIcon>
                <Modal.Header>{this.strings.title}</Modal.Header>
                <Modal.Content>
                    <Form inverted size="mini">
                        <Form.Field inline>
                            <label>{this.strings.channels}</label>
                            <Input type="number" defaultValue={this.state.mix.length} step={1} min={1} max={128} onChange={this.handleNumberOfChannelsChange} />
                        </Form.Field>
                        <Form.Field>
                            <label>{this.strings.matrix}</label>
                            {this.matrix}
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button inverted color="grey" size="mini" onClick={this.props.onClose}>{this.strings.cancel}</Button>
                    <Button inverted color="green" size="mini" onClick={this.handleConfirm}>{this.strings.confirm}</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}
