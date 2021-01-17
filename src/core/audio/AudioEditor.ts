import { WebAudioModule } from "wamsdk/src/api";
import PatcherAudio from "./PatcherAudio";
import { TAudioPlayingState } from "../types";
import { dbtoa } from "../../utils/math";
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

export default class AudioEditor extends PatcherAudio<AudioEditorEventMap> {
    readonly player = new AudioPlayer(this);
    readonly recorder = new AudioRecorder(this);
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

    get clipboard() {
        return this.env.audioClipboard;
    }
    set clipboard(audio: PatcherAudio) {
        this.env.audioClipboard = audio;
    }

    handleSetAudio = () => {
        const { cursor, selRange, viewRange } = this.state;
        const { length, numberOfChannels } = this;
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
    onUiResized() {
        this.emit("uiResized");
    }
    handlePostInit = async () => {
        this.setState({
            viewRange: [0, this.length],
            enabledChannels: new Array(this.numberOfChannels).fill(true)
        });
        this.on("setAudio", this.handleSetAudio);
        await this.player.init();
        await this.recorder.init();
        this._isReady = true;
    };
    constructor(...args: ConstructorParameters<typeof PatcherAudio>) {
        super(...args);
        this.on("postInit", this.handlePostInit);
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
        const { length } = this;
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
        const { length } = this;
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
        const { length } = this.audioBuffer;
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
        const { length } = this.audioBuffer;
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
        const { length } = this.audioBuffer;
        const selRange: [number, number] = [0, length];
        this.setState({ selRange });
        this.emit("selRange", selRange);
        this.emitSelRangeToPlay();
    }
    async selectAll() {
        this.setSelRangeToAll();
    }
    async deleteSelected() {
        this.delete();
    }
    setViewRange(range: [number, number]) {
        const { length } = this;
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
        const { length } = this;
        const viewRange: [number, number] = [0, length];
        this.setState({ viewRange });
        this.emit("viewRange", viewRange);
    }

    async cut() {
        const { selRange } = this.state;
        if (!selRange) return;
        const [selStart, selEnd] = selRange;
        this.setSelRange(null);
        this.env.audioClipboard = await this.removeFromRange(selStart, selEnd);
        const oldAudio = this.env.audioClipboard;
        this.emit("cutEnd", { range: [selStart, selEnd], oldAudio });
    }
    async copy() {
        const { selRange } = this.state;
        if (!selRange) return;
        const [selStart, selEnd] = selRange;
        this.env.audioClipboard = await this.pick(selStart, selEnd, true);
    }
    async paste() {
        const { audioClipboard } = this.env;
        if (!audioClipboard) return;
        const { cursor, selRange } = this.state;
        if (selRange) {
            const [selStart, selEnd] = selRange;
            const oldAudio = await this.pasteToRange(audioClipboard, selStart, selEnd);
            this.emit("pasted", { range: [selStart, selEnd], audio: audioClipboard, oldAudio });
        } else {
            this.insertToCursor(audioClipboard, cursor);
            this.emit("pasted", { cursor, audio: audioClipboard });
        }
    }
    async delete() {
        const { selRange } = this.state;
        if (!selRange) return;
        const [selStart, selEnd] = selRange;
        this.setSelRange(null);
        const oldAudio = await this.removeFromRange(selStart, selEnd);
        this.emit("deleted", { range: [selStart, selEnd], oldAudio });
    }
    async silence() {
        const { selRange } = this.state;
        if (!selRange) return;
        await super.silence(selRange);
    }
    async insertSilence(length: number) {
        if (!length) return;
        const { cursor } = this.state;
        await super.insertSilence(length, cursor);
    }
    async reverse() {
        const { selRange } = this.state;
        const [selStart, selEnd] = selRange || [0, this.length];
        const audio = await this.pick(selStart, selEnd, true);
        audio.reverse();
        const oldAudio = await this.pasteToRange(audio, selStart, selEnd);
        this.emit("reversed", { range: [0, this.length], audio, oldAudio });
    }
    async inverse() {
        const { selRange } = this.state;
        const [selStart, selEnd] = selRange || [0, this.length];
        const audio = await this.pick(selStart, selEnd, true);
        audio.inverse();
        const oldAudio = await this.pasteToRange(audio, selStart, selEnd);
        this.emit("inversed", { range: [selStart, selEnd], audio, oldAudio });
    }
    async fade(gain: number) {
        const { selRange, enabledChannels } = this.state;
        if (!selRange) return;
        await super.fade(gain, ...selRange, enabledChannels);
    }
    async fadeIn(length: number, exponent: number) {
        const { enabledChannels } = this.state;
        await super.fadeIn(length, exponent, enabledChannels);
    }
    async fadeOut(length: number, exponent: number) {
        const { enabledChannels } = this.state;
        await super.fadeOut(length, exponent, enabledChannels);
    }
    async resample(to: number) {
        if (to <= 0) return;
        const oldAudio = await super.clone();
        if (oldAudio.sampleRate === to) return;
        const audio = await this.render(to);
        this.setAudio(audio);
        this.emit("resampled", { audio, oldAudio });
    }
    async remixChannels(mix: number[][]) {
        const oldAudio = await super.clone();
        const audio = await this.render(undefined, mix);
        this.setAudio(audio);
        this.emit("remixed", { audio, oldAudio });
    }
    async applyPlugins(selected?: boolean) {
        const { selRange, plugins, pluginsEnabled, preFxGain, postFxGain } = this.state;
        if (plugins.every(p => !p || !pluginsEnabled.has(p))) return;
        if (selected && !selRange) return;
        const oldAudio = selected ? await this.pick(...selRange) : await super.clone();
        const audio = await oldAudio.render(undefined, undefined, true, { plugins, pluginsEnabled, preFxGain, postFxGain });
        if (selected) await this.pasteToRange(audio, ...selRange);
        else this.setAudio(audio);
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
        this._isReady = false;
        this.off("setAudio", this.handleSetAudio);
        if (this.state.recording) await this.stopRecord();
        if (this.state.playing !== "stopped") this.stop();
        for (let i = 0; i < this.state.plugins.length; i++) {
            this.removePlugin(i);
        }
        await this.recorder.destroy();
        await this.player.destroy();
        await super.destroy();
    }
}
