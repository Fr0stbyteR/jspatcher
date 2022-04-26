import * as React from "react";
import { Button, Dropdown, Form, Header, Input, Modal } from "semantic-ui-react";
import I18n from "../../i18n/I18n";
import ColorPicker from "./ColorPicker";
import windowEnergyFactor from "../../utils/windowEnergy";
import type { EnvEventMap } from "../../core/Env";
import type Env from "../../core/Env";
import type { EnvOptions } from "../../core/EnvOptionsManager";
import "./EnvOptionsModal.scss";

interface P {
    env: Env;
    lang: string;
    open: boolean;
    onConfirm: (options: EnvOptions) => any;
    onClose: (oldOptions: EnvOptions) => any;
    onReset: () => any;
}
interface S {
    oldOptions: EnvOptions;
    options: EnvOptions;
}

export default class EnvOptionsModal extends React.PureComponent<P, S> {
    state: S = {
        oldOptions: this.props.env.options,
        options: this.props.env.options
    };
    get strings() {
        return {
            ...I18n[this.props.lang].EnvOptionsModal,
            ...I18n[this.props.lang].UnitOptions,
            ...I18n[this.props.lang].DisplayOptions
        };
    }
    handleOptions = ({ options }: EnvEventMap["options"]) => this.setState({ options });
    componentDidMount() {
        this.props.env.on("options", this.handleOptions);
    }
    componentWillUnmount() {
        this.props.env.off("options", this.handleOptions);
    }
    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: any): void {
        if (prevProps.open !== this.props.open) {
            this.setState({ oldOptions: this.props.env.options });
        }
    }
    render() {
        return (
            <Modal className="modal-env-options" basic size="mini" open={this.props.open} onClose={() => this.props.onClose(this.state.oldOptions)} closeIcon>
                <Modal.Header>{this.strings.title}</Modal.Header>
                <Modal.Content>
                    <Form inverted size="mini">
                        <Form.Field inline>
                            <label>{this.strings.language}</label>
                            <Dropdown
                                options={Object.keys(I18n).map(l => ({ text: l, value: l }))}
                                value={this.state.options.language}
                                onChange={(e, { value }) => this.props.env.options = { language: value as EnvOptions["language"] }}
                            />
                        </Form.Field>
                        <Form.Field inline>
                            <label>{this.strings.audioUnit}</label>
                            <Dropdown
                                options={(["time", "sample", "measure"] as const).map(l => ({ text: this.strings[l], value: l }))}
                                value={this.state.options.audioUnit}
                                onChange={(e, { value }) => this.props.env.options = { audioUnit: value as EnvOptions["audioUnit"] }}
                            />
                        </Form.Field>
                        <Header size="small" inverted>{this.strings.unitOptions}</Header>
                        <Form.Field inline>
                            <label>{this.strings.bpm}</label>
                            <Input
                                type="number"
                                value={this.state.options.audioUnitOptions.bpm}
                                step={0.01}
                                min={1}
                                max={480}
                                onChange={(e, { value }) => this.props.env.options = { audioUnitOptions: { bpm: +value } }}
                            />
                        </Form.Field>
                        <Form.Field inline>
                            <label>{this.strings.beatsPerMeasure}</label>
                            <Input
                                type="number"
                                value={this.state.options.audioUnitOptions.beatsPerMeasure}
                                step={1}
                                min={1}
                                max={32}
                                onChange={(e, { value }) => this.props.env.options = { audioUnitOptions: { beatsPerMeasure: +value } }}
                            />
                        </Form.Field>
                        <Form.Field inline>
                            <label>{this.strings.division}</label>
                            <Input
                                type="number"
                                value={this.state.options.audioUnitOptions.division}
                                step={1}
                                min={1}
                                max={100}
                                onChange={(e, { value }) => this.props.env.options = { audioUnitOptions: { division: +value } }}
                            />
                        </Form.Field>
                        <Header size="small" inverted>{this.strings.displayOptions}</Header>
                        <Form.Field inline>
                            <label>{this.strings.frameRate}</label>
                            <Input
                                type="number"
                                value={this.state.options.audioDisplayOptions.frameRate}
                                step={1}
                                min={1}
                                max={240}
                                onChange={(e, { value }) => this.props.env.options = { audioDisplayOptions: { frameRate: +value } }}
                            />
                        </Form.Field>
                        {...(["bgColor", "gridColor", "phosphorColor", "seperatorColor", "cursorColor"] as const).map(s => (
                            <Form.Field inline key={s}>
                                <label>{this.strings[s]}</label>
                                <ColorPicker color={this.state.options.audioDisplayOptions[s]} disableAlpha={false} onChangeComplete={color => this.props.env.options = { audioDisplayOptions: { [s]: color } }} />
                            </Form.Field>
                        ))}
                        <Form.Field inline>
                            <label>{this.strings.hueOffset}</label>
                            <Input
                                type="number"
                                value={this.state.options.audioDisplayOptions.hueOffset}
                                step={1}
                                min={0}
                                max={255}
                                onChange={(e, { value }) => this.props.env.options = { audioDisplayOptions: { hueOffset: +value } }}
                            />
                        </Form.Field>
                        <Form.Field inline>
                            <label>{this.strings.fftSize}</label>
                            <Dropdown
                                options={new Array(12).fill(null).map((e, i) => ({ text: 2 ** (i + 5), value: 2 ** (i + 5) }))}
                                value={this.state.options.audioDisplayOptions.fftSize}
                                onChange={(e, { value }) => this.props.env.options = { audioDisplayOptions: { fftSize: +value } }}
                            />
                        </Form.Field>
                        <Form.Field inline>
                            <label>{this.strings.fftOverlap}</label>
                            <Dropdown
                                options={new Array(8).fill(null).map((e, i) => ({ text: i + 1, value: i + 1 }))}
                                value={this.state.options.audioDisplayOptions.fftOverlap}
                                onChange={(e, { value }) => this.props.env.options = { audioDisplayOptions: { fftOverlap: +value } }}
                            />
                        </Form.Field>
                        <Form.Field inline>
                            <label>{this.strings.fftWindowFunction}</label>
                            <Dropdown
                                options={Object.keys(windowEnergyFactor).map(l => ({ text: l, value: l }))}
                                value={this.state.options.audioDisplayOptions.fftWindowFunction}
                                onChange={(e, { value }) => this.props.env.options = { audioDisplayOptions: { fftWindowFunction: value as keyof typeof windowEnergyFactor } }}
                            />
                        </Form.Field>
                        <Form.Field inline>
                            <label>{this.strings.fftDrawThreshold}</label>
                            <Input
                                type="number"
                                value={this.state.options.audioDisplayOptions.fftDrawThreshold}
                                step={1}
                                min={-200}
                                max={-3}
                                onChange={(e, { value }) => this.props.env.options = { audioDisplayOptions: { fftDrawThreshold: +value } }}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button inverted color="grey" size="mini" onClick={() => this.props.onReset()}>{this.strings.reset}</Button>
                    <Button inverted color="grey" size="mini" onClick={() => this.props.onClose(this.state.oldOptions)}>{this.strings.cancel}</Button>
                    <Button inverted color="green" size="mini" onClick={() => this.props.onConfirm(this.state.options)} disabled={JSON.stringify(this.state.oldOptions) === JSON.stringify(this.state.options)}>{this.strings.confirm}</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}
