import type { SemanticICONS } from "semantic-ui-react";
import type { WebAudioModule } from "@webaudiomodules/api";
import { dbtoa } from "../../utils/math";
import AudioPlayer from "./AudioPlayer";
import AudioRecorder from "./AudioRecorder";
import FileEditor from "../file/FileEditor";
import TempAudioFile from "./TempAudioFile";
import type PatcherAudio from "./PatcherAudio";
import type { TAudioPlayingState } from "../types";
import type PersistentProjectFile from "../file/PersistentProjectFile";
import type Env from "../Env";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";

export interface AudioEditorEventMap {
    "pasted": { range?: [number, number]; cursor?: number; audio: PatcherAudio; oldAudio?: PatcherAudio };
    "cutEnd": { range: [number, number]; oldAudio: PatcherAudio };
    "deleted": { range: [number, number]; oldAudio: PatcherAudio };
    "silenced": { range: [number, number]; audio: PatcherAudio; oldAudio: PatcherAudio };
    "insertedSilence": { range: [number, number]; audio: PatcherAudio };
    "inversed": { range: [number, number]; audio: PatcherAudio; oldAudio: PatcherAudio };
    "reversed": { range: [number, number]; audio: PatcherAudio; oldAudio: PatcherAudio };
    "faded": { gain: number; range: [number, number]; audio: PatcherAudio; oldAudio: PatcherAudio };
    "fadedIn": { length: number; exponent: number; audio: PatcherAudio; oldAudio: PatcherAudio };
    "fadedOut": { length: number; exponent: number; audio: PatcherAudio; oldAudio: PatcherAudio };
    "recorded": { range?: [number, number]; cursor?: number; audio: PatcherAudio; oldAudio: PatcherAudio };
    "resampled": { audio: PatcherAudio; oldAudio: PatcherAudio };
    "remixed": { audio: PatcherAudio; oldAudio: PatcherAudio };
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
    "setAudio": never;
    "ready": never;
}

export interface AudioHistoryEventMap extends Pick<AudioEditorEventMap, "faded" | "fadedIn" | "fadedOut" | "cutEnd" | "pasted" | "deleted" | "silenced" | "insertedSilence" | "reversed" | "inversed" | "resampled" | "remixed" | "recorded" | "pluginsApplied"> {}

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

export default class AudioEditor extends FileEditor<PatcherAudio, AudioEditorEventMap> {
    static async fromProjectItem({ file, env, project, instanceId }: { file: PersistentProjectFile | TempAudioFile; env: IJSPatcherEnv; project?: IProject; instanceId?: string }) {
        const audio = file instanceof TempAudioFile ? file.data : await file.instantiate({ env, project, instanceId }) as PatcherAudio;
        const editor = new this(audio);
        return editor.init();
    }
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
    get fileExtension() {
        return "wav";
    }
    get fileIcon(): SemanticICONS {
        return "music";
    }
    get clipboard() {
        return (this.env as Env).audioClipboard;
    }
    set clipboard(audio: PatcherAudio) {
        (this.env as Env).audioClipboard = audio;
    }
    get ctx() {
        return this.instance.ctx;
    }
    get audioCtx() {
        return this.instance.audioCtx;
    }
    get length() {
        return this.instance.length;
    }
    get numberOfChannels() {
        return this.instance.numberOfChannels;
    }
    get sampleRate() {
        return this.instance.sampleRate;
    }
    get audioBuffer() {
        return this.instance.audioBuffer;
    }
    get waveform() {
        return this.instance.waveform;
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
        this.emit("setAudio");
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
    async init() {
        if (!this.instance.isReady) {
            await new Promise<void>((resolve, reject) => {
                const handleReady = () => {
                    resolve();
                    this.instance.off("ready", handleReady);
                };
                this.instance.on("ready", handleReady);
            });
        }
        this.setState({
            viewRange: [0, this.length],
            enabledChannels: new Array(this.numberOfChannels).fill(true)
        });
        this.instance.on("setAudio", this.handleSetAudio);
        this.on("changed", () => this.instance.emit("changed"));
        await this.env.taskMgr.newTask(this, "Initializing Audio Editor...", async () => {
            await this.player.init();
            await this.recorder.init();
        });
        this._isReady = true;
        this.emit("ready");
        return this;
    }
    setState(state: Partial<AudioEditorState>) {
        Object.assign(this.state, state);
    }
    onUiResized() {
        this.emit("uiResized");
    }
    get pluginsState() {
        const { plugins, pluginsEnabled, pluginsShowing, preFxGain, postFxGain } = this.state;
        return {
            plugins: plugins.slice(),
            pluginsEnabled: plugins.map(p => pluginsEnabled.has(p)),
            pluginsShowing: plugins.map(p => pluginsShowing.has(p)),
            preFxGain,
            postFxGain
        };
    }
    emitPluginsChanged() {
        this.emit("pluginsChanged", this.pluginsState);
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
    setCursor(cursorIn: number, fromPlayer?: boolean) {
        const shouldReplay = !fromPlayer && this.state.playing === "playing";
        if (shouldReplay) this.stop();
        const { length } = this;
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
        const { length } = this;
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
        const { length } = this;
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
        this.clipboard = await this.instance.removeFromRange(selStart, selEnd);
        const oldAudio = this.clipboard;
        this.emit("cutEnd", { range: [selStart, selEnd], oldAudio });
    }
    async copy() {
        const { selRange } = this.state;
        if (!selRange) return;
        const [selStart, selEnd] = selRange;
        this.clipboard = await this.instance.pick(selStart, selEnd, true);
    }
    async paste() {
        const { clipboard } = this;
        if (!clipboard) return;
        const { cursor, selRange } = this.state;
        if (selRange) {
            const [selStart, selEnd] = selRange;
            const oldAudio = await this.instance.pasteToRange(clipboard, selStart, selEnd);
            this.emit("pasted", { range: [selStart, selEnd], audio: clipboard, oldAudio });
        } else {
            this.instance.insertToCursor(clipboard, cursor);
            this.emit("pasted", { cursor, audio: clipboard });
        }
    }
    async delete() {
        const { selRange } = this.state;
        if (!selRange) return;
        const [selStart, selEnd] = selRange;
        this.setSelRange(null);
        const oldAudio = await this.instance.removeFromRange(selStart, selEnd);
        this.emit("deleted", { range: [selStart, selEnd], oldAudio });
    }
    async silence() {
        const { selRange } = this.state;
        if (!selRange) return;
        const silenced = await this.instance.silence(...selRange);
        if (silenced) this.emit("silenced", silenced);
    }
    async insertSilence(length: number) {
        if (!length) return;
        const { cursor } = this.state;
        const inserted = await this.instance.insertSilence(length, cursor);
        if (inserted) this.emit("insertedSilence", inserted);
    }
    async reverse() {
        const { selRange } = this.state;
        const [selStart, selEnd] = selRange || [0, this.length];
        const audio = await this.instance.pick(selStart, selEnd, true);
        audio.reverse();
        const oldAudio = await this.instance.pasteToRange(audio, selStart, selEnd);
        this.emit("reversed", { range: [0, this.length], audio, oldAudio });
    }
    async inverse() {
        const { selRange } = this.state;
        const [selStart, selEnd] = selRange || [0, this.length];
        const audio = await this.instance.pick(selStart, selEnd, true);
        audio.inverse();
        const oldAudio = await this.instance.pasteToRange(audio, selStart, selEnd);
        this.emit("inversed", { range: [selStart, selEnd], audio, oldAudio });
    }
    async fade(gain: number) {
        const { selRange, enabledChannels } = this.state;
        if (!selRange) return;
        const faded = await this.instance.fade(gain, ...selRange, enabledChannels);
        if (faded) this.emit("faded", faded);
    }
    async fadeIn(length: number, exponent: number) {
        const { enabledChannels } = this.state;
        const faded = await this.instance.fadeIn(length, exponent, enabledChannels);
        if (faded) this.emit("fadedIn", faded);
    }
    async fadeOut(length: number, exponent: number) {
        const { enabledChannels } = this.state;
        const faded = await this.instance.fadeOut(length, exponent, enabledChannels);
        if (faded) this.emit("fadedOut", faded);
    }
    async resample(to: number) {
        if (to <= 0) return;
        const oldAudio = await this.instance.clone();
        if (oldAudio.sampleRate === to) return;
        const audio = await this.instance.render(to);
        this.instance.setAudio(audio);
        this.emit("resampled", { audio, oldAudio });
    }
    async remixChannels(mix: number[][]) {
        const oldAudio = await this.instance.clone();
        const audio = await this.instance.render(undefined, mix);
        this.instance.setAudio(audio);
        this.emit("remixed", { audio, oldAudio });
    }
    async applyPlugins(selected?: boolean) {
        const { selRange, plugins, pluginsEnabled, preFxGain, postFxGain } = this.state;
        if (plugins.every(p => !p || !pluginsEnabled.has(p))) return;
        if (selected && !selRange) return;
        const oldAudio = selected ? await this.instance.pick(...selRange) : await this.instance.clone();
        const audio = await oldAudio.render(undefined, undefined, true, { plugins, pluginsEnabled, preFxGain, postFxGain });
        if (selected) await this.instance.pasteToRange(audio, ...selRange);
        else this.instance.setAudio(audio);
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
        return this.env.taskMgr.newTask(this, "Adding Plugin...", () => this.player.addPlugin(url, index));
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
        if (monitoring || playing === "playing") this.player.preFxGainNode.gain.setTargetAtTime(dbtoa(gain), (this.env as Env).audioCtx.currentTime, 0.01);
    }
    setPostFxGain(gain: number) {
        this.state.postFxGain = gain;
        const { playing, monitoring } = this.state;
        if (monitoring || playing === "playing") this.player.postFxGainNode.gain.setTargetAtTime(dbtoa(gain), (this.env as Env).audioCtx.currentTime, 0.01);
    }

    async destroy() {
        this._isReady = false;
        this.instance.off("setAudio", this.handleSetAudio);
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
