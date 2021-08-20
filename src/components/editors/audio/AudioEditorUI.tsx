import * as React from "react";
import Env, { EnvEventMap, EnvOptions } from "../../../core/Env";
import AudioEditor, { AudioEditorEventMap, AudioEditorState } from "../../../core/audio/AudioEditor";
import AudioEditorMapUI from "./AudioEditorMapUI";
import AudioEditorMainUI from "./AudioEditorMainUI";
import AudioEditorMonitorUI from "./AudioEditorMonitorUI";
import "./AudioEditorUI.scss";

interface P {
    env: Env;
    lang: string;
    editor: AudioEditor;
}

interface S extends AudioEditorState, EnvOptions {
    $audio: number;
}

export default class AudioEditorUI extends React.PureComponent<P, S> {
    state: S = {
        ...this.props.editor.state,
        ...this.props.env.options,
        $audio: performance.now()
    };
    editorEventsListening: (keyof (AudioEditorEventMap | S))[] = ["cursor", "enabledChannels", "loop", "monitoring", "playing", "recording", "selRange", "viewRange"];
    editorEventListeners: Record<keyof (AudioEditorEventMap | S), (...args: any[]) => any>
        = this.editorEventsListening.reduce<Record<keyof(AudioEditorEventMap | S), (...args: any[]) => any>>(
            (acc, cur) => {
                acc[cur] = <K extends keyof (AudioEditorEventMap | S)>
                    (event: (AudioEditorEventMap | S)[K]) => this.setState<K>({ [cur]: event } as Pick<S, K>);
                return acc;
            },
            {} as Record<keyof (AudioEditorEventMap | S), (...args: any[]) => any>);
    handleAudio = () => this.setState({ $audio: performance.now() });
    handleEnvOptions = ({ options }: EnvEventMap["options"]) => this.setState(options);
    handleResize = () => this.props.editor.onUiResized();
    handleActiveEditor = ({ editor }: EnvEventMap["activeEditor"]) => {
        if (editor === this.props.editor) this.handleResize();
    };
    componentDidMount() {
        this.props.env.on("options", this.handleEnvOptions);
        this.props.env.on("activeEditor", this.handleActiveEditor);
        this.editorEventsListening.forEach(eventName => this.props.editor.on(eventName, this.editorEventListeners[eventName]));
        this.props.editor.on("setAudio", this.handleAudio);
        window.addEventListener("resize", this.handleResize);
    }
    async componentWillUnmount() {
        this.props.env.off("options", this.handleEnvOptions);
        this.props.env.off("activeEditor", this.handleActiveEditor);
        this.editorEventsListening.forEach(eventName => this.props.editor.off(eventName, this.editorEventListeners[eventName]));
        this.props.editor.off("setAudio", this.handleAudio);
        await this.props.editor.destroy();
        window.removeEventListener("resize", this.handleResize);
    }
    render() {
        return (
            <div className="audio-editor-container ui-flex-column ui-flex-full">
                <AudioEditorMapUI {...this.state} {...this.props} />
                <AudioEditorMainUI {...this.state} {...this.props} />
                <AudioEditorMonitorUI {...this.state} {...this.props} {...this.state.audioDisplayOptions} />
            </div>
        );
    }
}
