import { WebAudioModule } from "wamsdk/src/api";
import PatcherAudio from "./PatcherAudio";
import { TAudioPlayingState } from "../types";
import { dbtoa } from "../../utils/math";
import { TypedEventEmitter } from "../../utils/TypedEventEmitter";
import AudioPlayer from "./AudioPlayer";
import AudioRecorder from "./AudioRecorder";

export interface AudioEditorEventMap {
    "viewRange": [number, number];
    "selRange": [number, number];
    "selRangeToPlay": [number, number] | null;
    "cursor": number;
    "enabledChannels": boolean[];
    "playing": TAudioPlayingState;
    "monitoring": boolean;
    "loop": boolean;
    "recording": boolean;
    "pluginsChanged": { plugins: WebAudioModule[]; pluginsEnabled: boolean[]; pluginsShowing: boolean[] };
    "pluginsApplied": { range?: [number, number]; audio: PatcherAudio; oldAudio: PatcherAudio };
    "uiResized": never;
    "ready": never;
}
export interface AudioEditorState {
    playing: TAudioPlayingState;
    monitoring: boolean;
    recording: boolean;
    loop: boolean;
    cursor: number;
    selRange: [number, number];
    viewRange: [number, number];
    enabledChannels: boolean[];
    plugins: WebAudioModule[];
    pluginsEnabled: WeakSet<WebAudioModule>;
    pluginsShowing: WeakSet<WebAudioModule>;
    preFxGain: number;
    postFxGain: number;
}

export default class AudioEditor extends TypedEventEmitter<AudioEditorEventMap> {
    readonly audio: PatcherAudio;
    readonly player: AudioPlayer;
    readonly recorder: AudioRecorder;
    readonly state: AudioEditorState = {
        playing: "stopped",
        monitoring: false,
        loop: true,
        recording: false,
        cursor: 0,
        selRange: null,
        viewRange: [0, 0],
        enabledChannels: [],
        plugins: new Array(10).fill(undefined),
        pluginsEnabled: new WeakSet(),
        pluginsShowing: new WeakSet(),
        preFxGain: 0,
        postFxGain: 0
    };

    get env() {
        return this.audio.env;
    }
    get clipboard() {
        return this.env.audioClipboard;
    }
    set clipboard(audio: PatcherAudio) {
        this.env.audioClipboard = audio;
    }

    isReady = false;
    handleSetAudio = () => {
        const { cursor, selRange, viewRange } = this.state;
        const { length, numberOfChannels } = this.audio;
        if (cursor > length) this.setCursor(length);
        if (selRange && selRange[1] > length) this.setSelRange(selRange);
        if (viewRange[1] > length) this.setViewRange(viewRange);
        if (this.state.enabledChannels.length !== numberOfChannels) {
            const enabledChannels = new Array(numberOfChannels).fill(true);
            this.state.enabledChannels.slice(numberOfChannels).forEach((v, i) => enabledChannels[i] = v);
            this.setState({ enabledChannels });
            this.emit("enabledChannels", enabledChannels);
        }
    };
    handleCursor = (cursor: number) => this.setCursor(cursor);
    handleSelRange = (range: [number, number]) => this.setSelRange(range);
    handlePlayerEnded = (cursor: number) => {
        const playing: TAudioPlayingState = "stopped";
        this.setState({ playing });
        this.emit("playing", playing);
        this.setCursor(cursor);
    };
    handleInputChanged = async (deviceId?: string) => {
        await this.recorder.newSearch(deviceId);
        if (this.state.monitoring) this.player.startMonitoring();
    };
    handleCopy = () => this.copy();
    handleCut = () => this.cut();
    handlePaste = () => this.paste();
    handleSelectAll = () => this.setSelRangeToAll();
    handleDeleteSelected = () => this.delete();
    handleDestroy = () => this.destroy();

    constructor(audioIn: PatcherAudio) {
        super();
        this.audio = audioIn;
        this.setState({
            viewRange: [0, audioIn.length],
            enabledChannels: new Array(audioIn.numberOfChannels).fill(true)
        });
        this.audio.on("setAudio", this.handleSetAudio);
        this.audio.on("cursor", this.handleCursor);
        this.audio.on("selRange", this.handleSelRange);
        this.audio.on("copy", this.handleCopy);
        this.audio.on("cut", this.handleCut);
        this.audio.on("paste", this.handlePaste);
        this.audio.on("selectAll", this.handleSelectAll);
        this.audio.on("deleteSelected", this.handleDeleteSelected);
        this.audio.on("destroy", this.handleDestroy);
        this.player = new AudioPlayer(this);
        this.recorder = new AudioRecorder(this);
    }
    async init() {
        const init = async () => {
            await this.player.init();
            await this.recorder.init();
            this.isReady = true;
            this.emit("ready");
        };
        if (this.audio.isReady) await init();
        else this.audio.on("ready", init);
    }
    emitPluginsChanged() {
        const { plugins, pluginsEnabled, pluginsShowing } = this.state;
        this.emit("pluginsChanged", { plugins: plugins.slice(), pluginsEnabled: plugins.map(p => pluginsEnabled.has(p)), pluginsShowing: plugins.map(p => pluginsShowing.has(p)) });
    }
    emitUIResized() {
        this.emit("uiResized");
    }
    emitSelRangeToPlay() {
        this.emit("selRangeToPlay", this.state.selRange);
    }
    zoomH(refIn: number, factor: number) { // factor = 1 as zoomIn, -1 as zoomOut
        const { viewRange } = this.state;
        const { length } = this.audio;
        const [viewStart, viewEnd] = viewRange;
        const viewLength = viewEnd - viewStart;
        const minRange = Math.min(length, 5);
        const ref = Math.max(0, Math.min(length, Math.round(refIn)));
        if (ref < viewStart || ref > viewEnd) {
            const start = Math.max(0, Math.min(length - viewLength, Math.round(ref - viewLength / 2)));
            const end = Math.max(viewLength, Math.min(length, Math.round(ref + viewLength / 2)));
            const range: [number, number] = [start, end];
            this.setState({ viewRange: range });
            this.emit("viewRange", range);
        } else if (factor < 0 || viewLength > minRange) {
            const multiplier = 1.5 ** -factor;
            const start = ref - (ref - viewStart) * multiplier;
            const end = ref + (viewEnd - ref) * multiplier;
            this.setViewRange([start, end]);
        }
    }
    scrollH(speed: number) { // spped = 1 as one full viewRange
        const { viewRange } = this.state;
        const { length } = this.audio;
        const [viewStart, viewEnd] = viewRange;
        const viewLength = viewEnd - viewStart;
        const deltaSamples = viewLength * speed;
        const start = Math.min(length - viewLength, viewStart + deltaSamples);
        const end = Math.max(viewLength, viewEnd + deltaSamples);
        this.setViewRange([start, end]);
    }
    setEnabledChannel(channel: number, enabled: boolean) {
        const enabledChannels = this.state.enabledChannels.slice();
        enabledChannels[channel] = enabled;
        this.setState({ enabledChannels });
        this.emit("enabledChannels", enabledChannels);
    }
    setLoop(loop: boolean) {
        this.setState({ loop });
        this.emit("loop", loop);
    }
    setRecording(recording: boolean) {
        this.setState({ recording });
        this.emit("recording", recording);
    }
    setState(state: Partial<AudioEditorState>) {
        Object.assign(this.state, state);
    }
    setCursor(cursorIn: number, fromPlayer?: boolean) {
        const shouldReplay = !fromPlayer && this.state.playing === "playing";
        if (shouldReplay) this.stop();
        const { length } = this.audio.audioBuffer;
        const cursor = Math.max(0, Math.min(length, Math.round(cursorIn)));
        this.setState({ cursor });
        this.emit("cursor", cursor);
        if (shouldReplay) this.play();
    }
    setSelRange(range: [number, number]) {
        if (!range) {
            this.setState({ selRange: null });
            this.emit("selRange", null);
            return;
        }
        const { length } = this.audio.audioBuffer;
        let [start, end] = range;
        if (end < start) [start, end] = [end, start];
        start = Math.max(0, Math.min(length - 1, Math.round(start)));
        end = Math.max(1, Math.min(length, Math.round(end)));
        if (start === end) {
            this.setState({ selRange: null });
            this.emit("selRange", null);
            return;
        }
        const selRange: [number, number] = [start, end];
        this.setState({ selRange, cursor: start });
        this.emit("selRange", selRange);
        this.emit("cursor", start);
    }
    setSelRangeToAll() {
        const { length } = this.audio.audioBuffer;
        const selRange: [number, number] = [0, length];
        this.setState({ selRange });
        this.emit("selRange", selRange);
        this.emitSelRangeToPlay();
    }
    setViewRange(range: [number, number]) {
        const { length } = this.audio;
        let [start, end] = range;
        if (end < start) [start, end] = [end, start];
        const minRange = Math.min(length, 5);
        start = Math.max(0, Math.min(length - minRange, Math.round(start)));
        end = Math.max(minRange, Math.min(length, Math.round(end)));
        const viewRange: [number, number] = [start, end];
        this.setState({ viewRange });
        this.emit("viewRange", viewRange);
    }
    setViewRangeToAll() {
        const { length } = this.audio;
        const viewRange: [number, number] = [0, length];
        this.setState({ viewRange });
        this.emit("viewRange", viewRange);
    }

    cut() {
        const { selRange } = this.state;
        if (!selRange) return;
        const [selStart, selEnd] = selRange;
        this.setSelRange(null);
        this.env.audioClipboard = this.audio.removeFromRange(selStart, selEnd);
        const oldAudio = this.env.audioClipboard;
        this.audio.emit("cutEnd", { range: [selStart, selEnd], oldAudio });
    }
    copy() {
        const { selRange } = this.state;
        if (!selRange) return;
        const [selStart, selEnd] = selRange;
        this.env.audioClipboard = this.audio.pick(selStart, selEnd, true);
    }
    paste() {
        const { audioClipboard } = this.env;
        if (!audioClipboard) return;
        const { cursor, selRange } = this.state;
        if (selRange) {
            const [selStart, selEnd] = selRange;
            const oldAudio = this.audio.pasteToRange(audioClipboard, selStart, selEnd);
            this.audio.emit("pasted", { range: [selStart, selEnd], audio: audioClipboard, oldAudio });
        } else {
            this.audio.insertToCursor(audioClipboard, cursor);
            this.audio.emit("pasted", { cursor, audio: audioClipboard });
        }
    }
    delete() {
        const { selRange } = this.state;
        if (!selRange) return;
        const [selStart, selEnd] = selRange;
        this.setSelRange(null);
        const oldAudio = this.audio.removeFromRange(selStart, selEnd);
        this.audio.emit("deleted", { range: [selStart, selEnd], oldAudio });
    }
    reverse() {
        const { selRange } = this.state;
        const [selStart, selEnd] = selRange || [0, this.audio.length];
        const audio = this.audio.pick(selStart, selEnd, true);
        audio.reverse();
        const oldAudio = this.audio.pasteToRange(audio, selStart, selEnd);
        this.audio.emit("reversed", { range: [0, this.audio.length], audio, oldAudio });
    }
    inverse() {
        const { selRange } = this.state;
        const [selStart, selEnd] = selRange || [0, this.audio.length];
        const audio = this.audio.pick(selStart, selEnd, true);
        audio.inverse();
        const oldAudio = this.audio.pasteToRange(audio, selStart, selEnd);
        this.audio.emit("inversed", { range: [selStart, selEnd], audio, oldAudio });
    }
    fade(gain: number) {
        const { selRange, enabledChannels } = this.state;
        if (!selRange) return;
        this.audio.fade(gain, ...selRange, enabledChannels);
    }
    fadeIn(length: number, exponent: number) {
        const { enabledChannels } = this.state;
        this.audio.fadeIn(length, exponent, enabledChannels);
    }
    fadeOut(length: number, exponent: number) {
        const { enabledChannels } = this.state;
        this.audio.fadeOut(length, exponent, enabledChannels);
    }
    async resample(to: number) {
        if (to <= 0) return;
        const { audio: oldAudio } = this;
        if (oldAudio.sampleRate === to) return;
        const audio = await this.env.taskMgr.newTask(this, "Resampling Audio...", () => this.audio.render(to));
        this.audio.setAudio(audio);
        this.audio.emit("resampled", { audio, oldAudio });
    }
    async remixChannels(mix: number[][]) {
        const { audio: oldAudio } = this;
        const audio = await this.env.taskMgr.newTask(this, "Remixing Audio...", () => this.audio.render(undefined, mix));
        this.audio.setAudio(audio);
        this.audio.emit("remixed", { audio, oldAudio });
    }
    async applyPlugins(selected?: boolean) {
        const { selRange, plugins, pluginsEnabled, preFxGain, postFxGain } = this.state;
        if (plugins.every(p => !p || !pluginsEnabled.has(p))) return;
        if (selected && !selRange) return;
        let { audio: oldAudio } = this;
        if (selected) oldAudio = this.audio.pick(...selRange);
        const audio = await oldAudio.render(undefined, undefined, true, { plugins, pluginsEnabled, preFxGain, postFxGain });
        if (selected) this.audio.pasteToRange(audio, ...selRange);
        else this.audio.setAudio(audio);
        plugins.forEach((p, i) => {
            if (!p) return;
            this.setPluginEnabled(i, false);
        });
        this.emit("pluginsApplied", { ...(selected ? { range: selRange } : {}), audio, oldAudio });
    }

    play() {
        const playing: TAudioPlayingState = "playing";
        this.setState({ playing });
        this.emit("playing", playing);
        this.player.play();
    }
    pause() {
        const playing: TAudioPlayingState = "paused";
        this.setState({ playing });
        this.emit("playing", playing);
        this.player.stop();
    }
    resume() {
        const playing: TAudioPlayingState = "playing";
        this.setState({ playing });
        this.emit("playing", playing);
        this.player.play();
    }
    stop() {
        const playing: TAudioPlayingState = "stopped";
        this.setState({ playing });
        this.emit("playing", playing);
        this.player.stop();
    }
    startMonitoring() {
        const monitoring = true;
        this.setState({ monitoring });
        this.emit("monitoring", monitoring);
        this.player.startMonitoring();
    }
    stopMonitoring() {
        const monitoring = false;
        this.setState({ monitoring });
        this.emit("monitoring", monitoring);
        this.player.stopMonitoring();
    }
    async startRecord() {
        this.stop();
        const started = await this.recorder.start();
        if (!started) return;
        this.setState({ recording: true });
        this.emit("recording", true);
    }
    async stopRecord() {
        await this.recorder.stop();
        this.setState({ recording: false });
        this.emit("recording", false);
    }
    async addPlugin(url: string, index: number) {
        this.env.taskMgr.newTask(this, "Adding Plugin...", () => this.player.addPlugin(url, index));
    }
    removePlugin(index: number) {
        this.player.removePlugin(index);
    }
    movePlugin(fromIndex: number, toIndex: number) {
        this.player.movePlugin(fromIndex, toIndex);
    }
    setPluginEnabled(index: number, enabled: boolean) {
        this.player.setPluginEnabled(index, enabled);
    }
    setPluginShowing(index: number, showing: boolean) {
        const { plugins, pluginsShowing } = this.state;
        const plugin = plugins[index];
        if (!plugin) return;
        if (showing) pluginsShowing.add(plugin);
        else pluginsShowing.delete(plugin);
        this.emitPluginsChanged();
    }
    setPreFxGain(gain: number) {
        this.state.preFxGain = gain;
        const { playing, monitoring } = this.state;
        if (monitoring || playing === "playing") this.player.preFxGainNode.gain.setTargetAtTime(dbtoa(gain), this.env.audioCtx.currentTime, 0.01);
    }
    setPostFxGain(gain: number) {
        this.state.postFxGain = gain;
        const { playing, monitoring } = this.state;
        if (monitoring || playing === "playing") this.player.postFxGainNode.gain.setTargetAtTime(dbtoa(gain), this.env.audioCtx.currentTime, 0.01);
    }

    async destroy() {
        this.isReady = false;
        this.audio.off("setAudio", this.handleSetAudio);
        this.audio.off("cursor", this.handleCursor);
        this.audio.off("selRange", this.handleSelRange);
        this.audio.off("copy", this.handleCopy);
        this.audio.off("cut", this.handleCut);
        this.audio.off("paste", this.handlePaste);
        this.audio.off("selectAll", this.handleSelectAll);
        this.audio.off("deleteSelected", this.handleDeleteSelected);
        this.audio.off("destroy", this.handleDestroy);
        await this.stopRecord();
        this.stop();
        for (let i = 0; i < this.state.plugins.length; i++) {
            this.removePlugin(i);
        }
        await this.recorder.destroy();
        await this.player.destroy();
    }
}
