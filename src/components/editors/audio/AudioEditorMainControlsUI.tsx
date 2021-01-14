import * as React from "react";
import { Button } from "semantic-ui-react";
import AudioEditor from "../../../core/audio/AudioEditor";
import TimeInputUI from "./TimeInput";
import { TAudioUnit, AudioUnitOptions, TAudioPlayingState } from "../../../core/types";
import I18n from "../../../i18n/I18n";

interface P {
    editor: AudioEditor;
    lang: string;
    cursor: number;
    audioUnit: TAudioUnit;
    audioUnitOptions: AudioUnitOptions;
    playing: TAudioPlayingState;
    loop: boolean;
    recording: boolean;
    monitoring: boolean;
    $audio: number;
}

export default class AudioEditorMainControlsUI extends React.PureComponent<P> {
    get strings() {
        return I18n[this.props.lang].AudioEditorMainControlsUI;
    }
    handleCursorChanged = (cursor: number) => this.props.editor.setCursor(cursor);
    cursorBeforePlay: number;
    resumeAudioContext = () => this.props.editor.audio.audioCtx.resume();
    handleClickPlay = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.blur();
        this.resumeAudioContext();
        const { editor, cursor, playing } = this.props;
        if (playing === "playing") {
            editor.setCursor(this.cursorBeforePlay);
            editor.play();
        } else {
            this.cursorBeforePlay = cursor;
            if (playing === "paused") editor.resume();
            else editor.play();
        }
    };
    handleClickStop = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.blur();
        const { editor, recording } = this.props;
        if (recording) editor.stopRecord();
        else editor.stop();
    };
    handleClickPause = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.blur();
        const { editor, playing } = this.props;
        if (playing === "paused") editor.resume();
        else editor.pause();
    };
    handleClickLoop = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.blur();
        const { editor, loop } = this.props;
        editor.setLoop(!loop);
    };
    handleClickRecord = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.blur();
        this.resumeAudioContext();
        const { editor, recording } = this.props;
        if (recording) editor.stopRecord();
        else editor.startRecord();
    };
    handleClickMonitor = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.blur();
        this.resumeAudioContext();
        const { editor, monitoring } = this.props;
        if (monitoring) editor.stopMonitoring();
        else editor.startMonitoring();
    };
    render() {
        const { editor, audioUnit, audioUnitOptions, cursor, playing, loop, recording, monitoring } = this.props;
        const sampleRate = editor.audio.sampleRate;
        return (
            <div className="editor-main-controls">
                <span className="editor-main-player-controls-container">
                    <span className="editor-main-player-controls">
                        <Button.Group icon size="mini">
                            <Button title={this.strings.stop} disabled={!recording && playing === "stopped"} icon="stop" color="grey" basic onClick={this.handleClickStop} />
                            <Button title={this.strings.play} disabled={recording} icon="play" color="green" basic={playing === "stopped"} onClick={this.handleClickPlay} />
                            <Button title={this.strings.pause} disabled={recording || playing === "stopped"} icon="pause" color="brown" basic={playing !== "paused"} onClick={this.handleClickPause} />
                            <Button title={this.strings.loop} disabled={recording} icon="sync" color="yellow" basic={!loop} onClick={this.handleClickLoop} />
                            <Button title={this.strings.record} icon="circle" color="red" basic={!recording} onClick={this.handleClickRecord} />
                            <Button title={this.strings.monitor} icon="microphone" color="teal" basic={!monitoring} onClick={this.handleClickMonitor} />
                        </Button.Group>
                    </span>
                </span>
                <TimeInputUI samples={cursor} sampleRate={sampleRate} audioUnit={audioUnit} {...audioUnitOptions} onChange={this.handleCursorChanged} />
            </div>
        );
    }
}
