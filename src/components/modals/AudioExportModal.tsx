import * as React from "react";
import { Modal, Button, Input, Form, Table, InputOnChangeData, Dropdown, DropdownItemProps, DropdownProps, Checkbox, Icon } from "semantic-ui-react";
import AudioEditor from "../../core/audio/AudioEditor";
import GainInputUI from "../editors/audio/GainInput";
import { Task, TaskError } from "../../core/TaskMgr";
import I18n from "../../i18n/I18n";
import { identityMatrix } from "../../utils/math";
import "./AudioExportModal.scss";

export type TExportType = "wav" | "aac" | "mp3";

export type TExportMp3Bitrate = 8 | 16 | 24 | 32 | 40 | 48 | 64 | 80 | 96 | 112 | 128 | 160 | 192 | 224 | 256 | 320;

export type TExportWavBitDepth = 8 | 16 | 24 | 32;

interface P {
    editor: AudioEditor;
    lang: string;
    open: boolean;
    onClose: () => any;
}
interface S {
    tasks: Task[];
    errors: TaskError[];
    type: TExportType;
    fileName: string;
    applyFx: boolean;
    mix: number[][];
    bitrate: TExportMp3Bitrate;
    bitDepth: TExportWavBitDepth;
    sampleRate: number;
    sampleRateOptions: DropdownItemProps[];
}

export default class AudioExportModal extends React.PureComponent<P, S> {
    state: S = {
        tasks: this.props.editor.env.taskMgr.getTasksFromEmitter(this.props.editor),
        errors: this.props.editor.env.taskMgr.getErrorsFromEmitter(this.props.editor),
        type: "wav",
        fileName: this.changeSuffix(this.props.editor.file?.name || "Untitled.wav", "wav"),
        applyFx: true,
        mix: identityMatrix(this.props.editor.numberOfChannels || 1),
        bitrate: 256,
        bitDepth: 32,
        sampleRate: this.props.editor.sampleRate,
        sampleRateOptions: this.sampleRateOptions
    };
    refInput = React.createRef<HTMLDivElement>();
    refDownload = React.createRef<HTMLAnchorElement>();
    get strings() {
        return I18n[this.props.lang].AudioExportModal;
    }
    get sampleRates() {
        const defaults = [6000, 8000, 11025, 16000, 22050, 32000, 44100, 48000, 64000, 88200, 96000, 176400, 192000];
        const ctx = this.props.editor.audioCtx.sampleRate;
        if (ctx && defaults.indexOf(ctx) === -1) defaults.push(ctx);
        const buffer = this.props.editor.sampleRate;
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
    handleTasks = () => this.setState({ tasks: this.props.editor.env.taskMgr.getTasksFromEmitter(this.props.editor) });
    handleErrors = () => this.setState({ errors: this.props.editor.env.taskMgr.getErrorsFromEmitter(this.props.editor) });
    handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => {
        this.setState({ fileName: value });
    };
    handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => {
        this.setState(({ fileName }) => ({ type: value as TExportType, fileName: this.changeSuffix(fileName, value as TExportType) }));
    };
    handleSampleRateAddition = (e: React.KeyboardEvent<HTMLElement>, { value: valueIn }: DropdownProps) => {
        const value = ~~Math.max(1, +valueIn) || this.props.editor.audioCtx.sampleRate;
        if (this.state.sampleRateOptions.find(option => option.value === value)) return;
        this.setState(({ sampleRateOptions }) => ({
            sampleRateOptions: [...sampleRateOptions, { key: value, text: value, value }]
        }));
    };
    handleSampleRateChange = (e: React.SyntheticEvent<HTMLElement, Event>, { value: valueIn }: DropdownProps) => {
        const value = ~~Math.max(1, +valueIn) || this.props.editor.audioCtx.sampleRate;
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
    handleConfirm = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { type, fileName, applyFx, mix, bitrate, bitDepth, sampleRate } = this.state;
        const { plugins, pluginsEnabled, preFxGain, postFxGain } = this.props.editor.state;
        const pluginsOptions = { plugins, pluginsEnabled, preFxGain, postFxGain };
        const audioBuffer = await this.props.editor.instance.render(sampleRate, mix, applyFx, pluginsOptions);
        if (!audioBuffer) return;
        let arrayBuffer: ArrayBuffer;
        if (type === "wav") arrayBuffer = await this.props.editor.instance.serialize({ bitDepth });
        else if (type === "aac") arrayBuffer = await this.props.editor.instance.encodeAac(bitrate);
        else if (type === "mp3") arrayBuffer = await this.props.editor.instance.encodeMp3(bitrate);
        if (arrayBuffer) this.download(arrayBuffer, fileName, type);
    };
    componentDidMount() {
        this.props.editor.env.taskMgr.on("tasks", this.handleTasks);
        this.props.editor.env.taskMgr.on("errors", this.handleErrors);
    }
    componentWillUnmount() {
        this.props.editor.env.taskMgr.off("tasks", this.handleTasks);
        this.props.editor.env.taskMgr.off("errors", this.handleErrors);
    }
    handleNumberOfChannelsChange = (event: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => {
        const outs = +~~value || this.state.mix.length;
        if (outs === this.state.mix.length) return;
        const ins = this.props.editor.numberOfChannels;
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
    download(arrayBuffer: ArrayBuffer, fileName: string, typeIn: TExportType) {
        if (!this.refDownload.current) return;
        const type = typeIn === "aac" ? "audio/aac" : typeIn === "wav" ? "audio/wav" : "audio/mpeg";
        const blob = new Blob([arrayBuffer], { type });
        const url = URL.createObjectURL(blob);
        const a = this.refDownload.current;
        a.href = url;
        a.download = fileName;
        a.click();
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
    get lastError() {
        return this.state.errors.sort(((a, b) => b.timestamp - a.timestamp))[0];
    }
    get lastTask() {
        return this.state.tasks.sort(((a, b) => b.timestamp - a.timestamp))[0];
    }
    render() {
        const { lastError, lastTask } = this;
        return (
            <Modal className="modal-audio-export" basic size="mini" open={this.props.open} onClose={this.props.onClose} closeIcon>
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
                    {lastTask
                        ? <div className="message">
                            <Icon loading name="asterisk" size="small" />
                            <span className="export-status">{lastTask.message}</span>
                        </div>
                        : lastError
                            ? <div className="message">
                                <span className="export-status error">{lastError.message}</span>
                            </div>
                            : <div className="message" />
                    }
                    <a ref={this.refDownload} target="_blank" rel="noopener noreferrer" download="Untitled.wav" hidden> </a>
                </Modal.Content>
                <Modal.Actions>
                    <Button inverted color="grey" size="mini" onClick={this.props.onClose}>{this.strings.cancel}</Button>
                    <Button inverted color="green" size="mini" onClick={this.handleConfirm} disabled={!!lastTask}>{this.strings.confirm}</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}
