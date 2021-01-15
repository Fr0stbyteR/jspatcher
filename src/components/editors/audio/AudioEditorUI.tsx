import * as React from "react";
import PatcherAudio from "../../../core/audio/PatcherAudio";
import Env, { EnvEventMap } from "../../../core/Env";
import { EnvOptions } from "../../../core/types";
import AudioEditor, { AudioEditorEventMap, AudioEditorState } from "../../../core/audio/AudioEditor";
import AudioEditorMapUI from "./AudioEditorMapUI";
import AudioEditorMainUI from "./AudioEditorMainUI";
import AudioEditorMonitorUI from "./AudioEditorMonitorUI";
import "./AudioEditorUI.scss";

interface P {
    env: Env;
    lang: string;
    audio: PatcherAudio;
}

interface S extends AudioEditorState, EnvOptions {
    editor: AudioEditor;
    $audio: number;
    editorReady: boolean;
}

export default class AudioEditorUI extends React.PureComponent<P, S> {
    state: S = (() => {
        const editor = new AudioEditor(this.props.audio);
        return {
            editor,
            ...editor.state,
            ...this.props.env.options,
            $audio: performance.now(),
            editorReady: editor.isReady
        };
    })();
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
    handleEditorReady = () => {
        const { editor } = this.state;
        editor.off("ready", this.handleEditorReady);
        this.editorEventsListening.forEach(eventName => editor.on(eventName, this.editorEventListeners[eventName]));
        editor.audio.on("setAudio", this.handleAudio);
        this.setState({ editorReady: editor.isReady });
    };
    handleResize = () => this.props.audio.onUiResized();
    componentDidMount() {
        this.props.env.on("options", this.handleEnvOptions);
        const { editor, editorReady } = this.state;
        if (!editorReady) editor.init();
        editor.on("ready", this.handleEditorReady);
        window.addEventListener("resize", this.handleResize);
    }
    async componentWillUnmount() {
        this.props.env.off("options", this.handleEnvOptions);
        const { editor, editorReady } = this.state;
        editor.off("ready", this.handleEditorReady);
        if (editorReady) {
            this.editorEventsListening.forEach(eventName => editor.off(eventName, this.editorEventListeners[eventName]));
            editor.audio.off("setAudio", this.handleAudio);
            await editor.destroy();
        }
        window.removeEventListener("resize", this.handleResize);
    }
    render() {
        return this.state.editorReady
            ? (
                <div className="audio-editor-container ui-flex-column ui-flex-full">
                    <AudioEditorMapUI {...this.state} {...this.props} />
                    <AudioEditorMainUI {...this.state} {...this.props} />
                    <AudioEditorMonitorUI {...this.state} {...this.props} {...this.state.audioDisplayOptions} />
                </div>
            )
            : <div className="audio-editor-container ui-flex-column ui-flex-full" />;
    }
}
