import * as React from "react";
import { Button, ButtonProps, Dropdown, DropdownProps, Form, Icon } from "semantic-ui-react";
import type { WebAudioModule } from "@webaudiomodules/api";
import AudioEditor, { AudioEditorEventMap } from "../../core/audio/AudioEditor";
import I18n from "../../i18n/I18n";
import GainInputUI from "../editors/audio/GainInput";
import AddPluginModal from "../modals/AddPluginModal";
import PluginContainer from "./PluginContainer";
import type Env from "../../core/Env";
import type { EnvEventMap } from "../../core/Env";
import "./PluginMgrUI.scss";

interface P {
    env: Env;
    lang: string;
}

interface S {
    // collapsed: boolean;
    selectedIndex: number;
    plugins: WebAudioModule[];
    pluginsEnabled: boolean[];
    pluginsShowing: boolean[];
    addPluginModalOpen: number;
    addPluginError: string;
    applySelected: boolean;
    preFxGain: number;
    postFxGain: number;
    editor: AudioEditor;
}

export default class PluginManagerUI extends React.PureComponent<P, S> {
    state: S = (() => {
        const editor = this.props.env.activeEditor instanceof AudioEditor ? this.props.env.activeEditor : null;
        const pluginsState = editor?.pluginsState;
        return {
            editor,
            // collapsed: false,
            selectedIndex: undefined,
            plugins: new Array(10).fill(undefined),
            pluginsEnabled: new Array(10).fill(undefined),
            pluginsShowing: new Array(10).fill(undefined),
            addPluginModalOpen: -1,
            addPluginError: undefined,
            applySelected: false,
            preFxGain: 0,
            postFxGain: 0,
            ...pluginsState
        } as S;
    })();
    get strings() {
        return I18n[this.props.lang].PluginManagerUI;
    }
    handlePluginsChanged = (state: AudioEditorEventMap["pluginsChanged"]) => this.setState(state);
    handleEnvActiveEditor = ({ editor }: EnvEventMap["activeEditor"]) => {
        this.state.editor?.off("pluginsChanged", this.handlePluginsChanged);
        if (editor instanceof AudioEditor) {
            editor.on("pluginsChanged", this.handlePluginsChanged);
            this.setState({ editor, ...editor.pluginsState });
        } else {
            this.setState({ editor: null, plugins: new Array(10).fill(undefined), pluginsEnabled: new Array(10).fill(undefined), preFxGain: 0, postFxGain: 0 });
        }
    };
    componentDidMount() {
        this.props.env.on("activeEditor", this.handleEnvActiveEditor);
        this.state.editor?.on("ready", this.handlePluginsChanged);
        this.state.editor?.on("pluginsChanged", this.handlePluginsChanged);
    }
    componentWillUnmount() {
        this.props.env.off("activeEditor", this.handleEnvActiveEditor);
        this.state.editor?.off("ready", this.handlePluginsChanged);
        this.state.editor?.off("pluginsChanged", this.handlePluginsChanged);
    }
    // handleClickCollapse = () => this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
    handleClickEnabled = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, { inverted }: ButtonProps) => {
        const index = +(e.currentTarget.parentElement.previousSibling as HTMLSpanElement).innerHTML - 1;
        this.state.editor.setPluginEnabled(index, inverted);
    };
    handleClickAdd = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        const index = +(e.currentTarget.parentElement.parentElement.firstChild as HTMLSpanElement).innerHTML - 1;
        this.setState({ addPluginModalOpen: index });
    };
    handleAddPlugin = async (url: string, index: number) => {
        try {
            await this.state.editor.addPlugin(url, index);
            this.state.editor.setPluginShowing(index, true);
        } catch (e) {
            this.setState({ addPluginError: (e as Error).message });
            return;
        }
        this.setState({ addPluginError: undefined, addPluginModalOpen: -1 });
    };
    handleAddPluginModalClose = () => this.setState({ addPluginModalOpen: -1 });
    handleClickDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        const index = +(e.currentTarget.parentElement.parentElement.firstChild as HTMLSpanElement).innerHTML - 1;
        this.handleClickPluginClose(index);
        this.state.editor.removePlugin(index);
    };
    handleClickPluginShow = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        const index = +(e.currentTarget.parentElement.parentElement.firstChild as HTMLSpanElement).innerHTML - 1;
        if (this.state.pluginsShowing[index]) return;
        const plugin = this.state.plugins[index];
        if (!plugin) return;
        this.state.editor.setPluginShowing(index, true);
    };
    handleClickPluginClose = (index: number) => {
        if (!this.state.pluginsShowing[index]) return;
        this.state.editor.setPluginShowing(index, false);
    };
    handleChangeApplyMode = (e: React.SyntheticEvent<HTMLElement, Event>, { value }: DropdownProps) => {
        this.setState({ applySelected: value as boolean });
    };
    handleClickApply = () => {
        this.state.editor.applyPlugins(this.state.applySelected);
    };
    handlePreGain = (gain: number) => {
        this.setState({ preFxGain: gain });
        this.state.editor.setPreFxGain(gain);
    };
    handlePostGain = (gain: number) => {
        this.setState({ postFxGain: gain });
        this.state.editor.setPostFxGain(gain);
    };
    get list() {
        const { plugins, pluginsEnabled, pluginsShowing } = this.state;
        return plugins.map((plugin, i) => {
            const hasPlugin = !!plugin;
            const enabled = hasPlugin && pluginsEnabled[i];
            return (
                <div key={i} className="plugin-manager-item" tabIndex={0}>
                    <span className="plugin-manager-item-index" >{i + 1}</span>
                    <span className="plugin-manager-item-enabled"><Button icon="power" basic={!enabled} inverted={!enabled} color={enabled ? "green" : "grey"} size="mini" active={hasPlugin} disabled={!hasPlugin} onClick={this.handleClickEnabled} /></span>
                    <span className="plugin-manager-item-name-container">
                        <span className="plugin-manager-item-name">{hasPlugin ? plugin.name : " "}</span>
                    </span>
                    <span className="plugin-manager-item-actions">
                        {hasPlugin
                            ? <>
                                <span className="plugin-manager-item-actions-show" title={this.strings.show} onClick={this.handleClickPluginShow}><Icon name="window maximize" inverted size="small" /></span>
                                <span className="plugin-manager-item-actions-delete" title={this.strings.delete} onClick={this.handleClickDelete}><Icon name="minus" inverted size="small" /></span>
                            </>
                            : <span className="plugin-manager-item-actions-add" title={this.strings.add} onClick={this.handleClickAdd}><Icon name="add" inverted size="small" /></span>
                        }
                    </span>
                    <AddPluginModal {...this.props} index={i} open={this.state.addPluginModalOpen === i} onClose={this.handleAddPluginModalClose} onConfirm={this.handleAddPlugin} error={this.state.addPluginError} />
                    {pluginsShowing[i]
                        ? <PluginContainer index={i} plugin={plugin} hidden={!this.state.pluginsShowing[i]} name={plugin.name} onClose={this.handleClickPluginClose} />
                        : undefined
                    }
                </div>
            );
        });
    }
    render() {
        return (
            <div className="left-pane-component plugin-manager-container">
                {/* this.state.collapsed */ false // eslint-disable-line no-constant-condition
                    ? undefined
                    : <>
                        <Form inverted size="mini" className="plugin-manager-prefader">
                            <Form.Field inline>
                                <label>{this.strings.preGain}</label>
                                <GainInputUI unit="dB" gain={this.state.preFxGain} onAdjust={this.handlePreGain} onChange={this.handlePreGain} />
                            </Form.Field>
                        </Form>
                        {this.list}
                        <Form inverted size="mini" className="plugin-manager-postfader">
                            <Form.Field inline>
                                <label>{this.strings.postGain}</label>
                                <GainInputUI unit="dB" gain={this.state.postFxGain} onAdjust={this.handlePostGain} onChange={this.handlePostGain} />
                            </Form.Field>
                        </Form>
                        <div className="plugin-manager-actions">
                            <Form inverted size="mini">
                                <Form.Field inline>
                                    <label></label>
                                    <Dropdown selection compact options={[{ key: this.strings.applyFull, text: this.strings.applyFull, value: false }, { key: this.strings.applySelected, text: this.strings.applySelected, value: true }]} value={this.state.applySelected} onChange={this.handleChangeApplyMode} />
                                    <Button size="mini" inverted disabled={this.state.plugins.every((p, i) => !p || !this.state.pluginsEnabled[i])} color="green" onClick={this.handleClickApply}>{this.strings.apply}</Button>
                                </Form.Field>
                            </Form>
                        </div>
                    </>
                }
            </div>
        );
    }
}
