import * as React from "react";
import { Modal, Button, Input, Form, Table, InputOnChangeData, Dropdown, DropdownItemProps, DropdownProps, Checkbox, Icon } from "semantic-ui-react";
import { identityMatrix } from "../utils/math";
import Env from "../core/Env";
import { EditorEventMap } from "../core/Editor";
import GainInputUI from "./GainInput";
import { TExportType, TExportMp3Bitrate, TExportWavBitDepth } from "../core/types";
import "./ExportModal.scss";
import I18n from "../i18n/I18n";

interface Props {
    env: Env;
    lang: string;
    open: boolean;
    onClose: () => any;
    onGenerated: (arrayBuffer: ArrayBuffer, fileName: string, type: TExportType) => any;
}
interface State {
    busy: boolean;
    status: string;
    error: boolean;
    type: TExportType;
    fileName: string;
    applyFx: boolean;
    mix: number[][];
    bitrate: TExportMp3Bitrate;
    bitDepth: TExportWavBitDepth;
    sampleRate: number;
    sampleRateOptions: DropdownItemProps[];
}

export default class ExportModal extends React.PureComponent<Props, State> {
    state: State = {
        busy: false,
        status: undefined,
        error: false,
        type: "wav",
        fileName: this.changeSuffix(this.props.env.editor.state.fileName, "wav"),
        applyFx: true,
        mix: identityMatrix(this.props.env.editor.currentFileState?.buffer.numberOfChannels || 1),
        bitrate: 256,
        bitDepth: 32,
        sampleRate: this.props.env.editor.currentFileState?.buffer.sampleRate || this.props.env.audioCtx.sampleRate,
        sampleRateOptions: this.sampleRateOptions
    };
    refInput = React.createRef<HTMLDivElement>();
    get strings() {
        return I18n[this.props.lang].ExportModal;
    }
    get sampleRates() {
        const defaults = [6000, 8000, 11025, 16000, 22050, 32000, 44100, 48000, 64000, 88200, 96000, 176400, 192000];
        const ctx = this.props.env.audioCtx.sampleRate;
        if (ctx && defaults.indexOf(ctx) === -1) defaults.push(ctx);
        const buffer = this.props.env.editor.currentFileState?.buffer.sampleRate;
        if (buffer && defaults.indexOf(buffer) === -1) defaults.push(buffer);
        return defaults;
    }
    get sampleRateOptions(): DropdownItemProps[] {
        return this.sampleRates.reverse().map(value => ({ key: value, text: value, value }));
    }
    get typeOptions(): DropdownItemProps[] {
        return ["wav", "mp3", "aac"].map(value => ({ key: value, text: value, value }));
    }
    get bitDepthOptions(): DropdownItemProps[] {
        return [16, 24, 32].map(value => ({ key: value, text: value, value }));
    }
    get bitrateOptions(): DropdownItemProps[] {
        return [8, 16, 24, 32, 40, 48, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320].map(value => ({ key: value, text: value, value }));
    }
    changeSuffix(sIn: string, suffix: TExportType) {
        return sIn ? sIn.replace(/(wav|mp3|aac)$/, suffix) || sIn : "";
    }
    handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => {
        this.setState({ fileName: value });
    };
    handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => {
        this.setState(({ fileName }) => ({ type: value as TExportType, fileName: this.changeSuffix(fileName, value as TExportType) }));
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
        this.setState({ sampleRate: value });
    };
    handleApplyFxChange = () => this.setState(({ applyFx }) => ({ applyFx: !applyFx }));
    handleBitDepthChange = (e: React.SyntheticEvent<HTMLElement, Event>, { value: valueIn }: DropdownProps) => {
        const value = [16, 24, 32].indexOf(+valueIn) !== -1 ? +valueIn as TExportWavBitDepth : 32;
        this.setState({ bitDepth: value });
    };
    handleBitrateChange = (e: React.SyntheticEvent<HTMLElement, Event>, { value: valueIn }: DropdownProps) => {
        const value = [8, 16, 24, 32, 40, 48, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320].indexOf(+valueIn) !== -1 ? +valueIn as TExportMp3Bitrate : 256;
        this.setState({ bitrate: value });
    };
    handleStatus = ({ error, message }: EditorEventMap["status"]) => {
        if (message) this.setState({ error, status: message });
    };
    handleConfirm = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { type, fileName, applyFx, mix, bitrate, bitDepth, sampleRate } = this.state;
        const currentBuffer = this.props.env.editor.currentFileState?.buffer;
        if (!currentBuffer) return;
        try {
            this.setState({ busy: true });
            this.props.env.editor.on("status", this.handleStatus);
            const audioBuffer = await this.props.env.editor.render(currentBuffer, applyFx, sampleRate, mix);
            if (!audioBuffer) return;
            let arrayBuffer: ArrayBuffer;
            if (type === "wav") arrayBuffer = await this.props.env.fileMgr.encodeAudioBufferWavWorker(audioBuffer, { bitDepth });
            else if (type === "aac") arrayBuffer = await this.props.env.fileMgr.encodeAudioBufferAacWorker(audioBuffer, bitrate);
            else if (type === "mp3") arrayBuffer = await this.props.env.fileMgr.encodeAudioBufferMp3Worker(audioBuffer, bitrate);
            if (arrayBuffer) this.props.onGenerated(arrayBuffer, fileName, type);
        } finally {
            this.props.env.editor.off("status", this.handleStatus);
            this.setState({ busy: false });
        }
    };
    handleEditFile = () => {
        const fileName = this.changeSuffix(this.props.env.editor.state.fileName, this.state.type);
        const mix = identityMatrix(this.props.env.editor.currentFileState?.buffer.numberOfChannels || 1);
        const sampleRate = this.props.env.editor.currentFileState?.buffer.sampleRate || this.props.env.audioCtx.sampleRate;
        if (this.state.sampleRateOptions.find(option => option.value === sampleRate)) {
            this.setState({ fileName, sampleRate, mix });
            return;
        }
        this.setState(({ sampleRateOptions }) => ({
            fileName,
            sampleRate,
            mix,
            sampleRateOptions: [...sampleRateOptions, { key: sampleRate, text: sampleRate, value: sampleRate }]
        }));
    };
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
        return (
            <Modal className="modal-export" basic size="mini" open={this.props.open} onClose={this.props.onClose} closeIcon>
                <Modal.Header>{this.strings.title}</Modal.Header>
                <Modal.Content>
                    <Form inverted size="mini">
                        <Form.Field inline>
                            <label>{this.strings.fileName}</label>
                            <Input value={this.state.fileName} onChange={this.handleFileNameChange} />
                        </Form.Field>
                        <Form.Field inline>
                            <label>{this.strings.type}</label>
                            <Dropdown selection options={this.typeOptions} value={this.state.type} onChange={this.handleTypeChange} />
                        </Form.Field>
                        <Form.Field inline>
                            <label>{this.strings.sampleRate}</label>
                            <Dropdown
                                options={this.state.sampleRateOptions}
                                placeholder={this.state.sampleRate.toString()}
                                search
                                selection
                                allowAdditions
                                value={this.state.sampleRate}
                                additionLabel={this.strings.addSampleRate}
                                onAddItem={this.handleSampleRateAddition}
                                onChange={this.handleSampleRateChange}
                            />
                        </Form.Field>
                        {this.state.type === "wav"
                            ? <Form.Field inline>
                                <label>{this.strings.bitDepth}</label>
                                <Dropdown selection options={this.bitDepthOptions} value={this.state.bitDepth} onChange={this.handleBitDepthChange} />
                            </Form.Field>
                            : <Form.Field inline>
                                <label>{this.strings.bitrate}</label>
                                <Dropdown selection options={this.bitrateOptions} value={this.state.bitrate} onChange={this.handleBitrateChange} />
                            </Form.Field>
                        }
                        <Form.Field inline>
                            <label>{this.strings.applyFx}</label>
                            <Checkbox checked={this.state.applyFx} onChange={this.handleApplyFxChange} />
                        </Form.Field>
                        <Form.Field inline>
                            <label>{this.strings.channels}</label>
                            <Input type="number" defaultValue={this.state.mix.length} step={1} min={1} max={128} onChange={this.handleNumberOfChannelsChange} />
                        </Form.Field>
                        <Form.Field>
                            <label>{this.strings.mix}</label>
                            {this.matrix}
                        </Form.Field>
                    </Form>
                    <div className="message">
                        {this.state.busy ? <Icon loading name="asterisk" size="small" /> : undefined}
                        <span className={`export-status${this.state.error ? " error" : ""}`}>{this.state.status}</span>
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Button inverted color="grey" size="mini" onClick={this.props.onClose}>{this.strings.cancel}</Button>
                    <Button inverted color="green" size="mini" onClick={this.handleConfirm} disabled={this.state.busy}>{this.strings.confirm}</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}
