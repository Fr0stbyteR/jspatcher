import * as React from "react";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { Dimmer, Loader } from "semantic-ui-react";
import Env from "../../../core/Env";
import { Errors, Tasks } from "../../../core/TaskMgr";
import PatcherAudio, { PatcherAudioEventMap } from "../../../core/audio/PatcherAudio";
import { TAudioUnit, AudioUnitOptions, TAudioPlayingState, AudioDisplayOptions } from "../../../core/types";

interface P {
    env: Env;
    lang: string;
    audio: PatcherAudio;
    audioDisplayOptions: AudioDisplayOptions;
}

interface S {
    tasks: Tasks;
    errors: Errors;
    cursor: number;
    selRange: [number, number];
    viewRange: [number, number];
    enabledChannels: boolean[];
    unit: TAudioUnit;
    unitOptions: AudioUnitOptions;
    playing: TAudioPlayingState;
    loop: boolean;
    recording: boolean;
    monitoring: boolean;
}

export default class AudioEditorUI extends React.PureComponent<P, S> {
    state: S = {
        tasks: this.props.env.taskMgr.getTasksFromEmitter(this.props.audio),
        errors: this.props.env.taskMgr.getErrorsFromEmitter(this.props.audio),
        cursor: 0,
        selRange: null,
        viewRange: [0, this.props.audio.length],
        enabledChannels: new Array(this.props.audio.numberOfChannels).fill(true),
        unit: "time",
        unitOptions: {
            bpm: 60,
            beatsPerMeasure: 4,
            division: 16
        },
        playing: "stopped",
        monitoring: false,
        loop: true,
        recording: false
    };
    handleViewRangeChanged = (range: S["viewRange"]) => {
        const { length } = this.props.audio;
        let [start, end] = range;
        if (end < start) [start, end] = [end, start];
        const minRange = Math.min(length, 5);
        start = Math.max(0, Math.min(length - minRange, Math.round(start)));
        end = Math.max(minRange, Math.min(length, Math.round(end)));
        const viewRange: [number, number] = [start, end];
        this.setState({ viewRange });
    };
    handleViewRangeToAll = () => {
        const { length } = this.props.audio;
        const viewRange: [number, number] = [0, length];
        this.setState({ viewRange });
    };
    handleSelRangeChanged = (range: S["selRange"]) => {
        if (!range) {
            this.setState({ selRange: null });
            return;
        }
        const { length } = this.props.audio;
        let [start, end] = range;
        if (end < start) [start, end] = [end, start];
        start = Math.max(0, Math.min(length - 1, Math.round(start)));
        end = Math.max(1, Math.min(length, Math.round(end)));
        if (start === end) {
            this.setState({ selRange: null });
            return;
        }
        const selRange: [number, number] = [start, end];
        this.setState({ selRange });
    };
    handleSelRangeToAll() {
        const { length } = this.props.audio;
        const selRange: [number, number] = [0, length];
        this.setState({ selRange });
        // this.emitSelRangeToPlay();
    }
    handleCursorChanged = (cursor: S["cursor"], fromPlayer?: boolean) => {
        const shouldReplay = !fromPlayer && this.state.playing === "playing";
        if (shouldReplay) this.stop();
        const { length } = this.currentFileState.buffer;
        const cursor = Math.max(0, Math.min(length, Math.round(cursorIn)));
        this.setCurrentFileState({ cursor });
        this.emit("cursor", cursor);
        if (shouldReplay) this.play();
        this.setState({ cursor });
    };
    handleUnitChanged = (unit: S["unit"]) => this.setState({ unit });
    handleUnitOptionsChanged = (unitOptions: S["unitOptions"]) => this.setState({ unitOptions });
    handleEnabledChannelsChanged = (enabledChannels: S["enabledChannels"]) => this.setState({ enabledChannels });
    handlePlayingStateChanged = (playing: S["playing"]) => this.setState({ playing });
    handleMonitoringStateChanged = (monitoring: S["monitoring"]) => this.setState({ monitoring });
    handleLoopChanged = (loop: S["loop"]) => this.setState({ loop });
    handleRecordingChanged = (recording: S["recording"]) => this.setState({ recording });
}
