import { WebAudioModule } from "wamsdk/src/api";
import TemporalAnalyserNode from "../worklets/TemporalAnalyser";
import { dbtoa } from "../../utils/math";
import AudioEditor from "./AudioEditor";

export default class AudioPlayer {
    readonly editor: AudioEditor;
    readonly dummyAnalyserNode: AnalyserNode;
    readonly preFxGainNode: GainNode;
    readonly postFxGainNode: GainNode;
    playing: boolean;
    currentSample: number;
    currentTime: number;
    currentChannels: boolean[];
    bufferSourceNode: AudioBufferSourceNode;
    splitterNode: ChannelSplitterNode;
    mergerNode: ChannelMergerNode;
    postAnalyserNode: TemporalAnalyserNode;
    monitoring: boolean;
    mediaStreamSourceNode: MediaStreamAudioSourceNode;
    offset: number;
    duration: number;
    get audioCtx() {
        return this.editor.audioCtx;
    }
    get destination() {
        return this.audioCtx.destination;
    }
    get loop() {
        return this.bufferSourceNode?.loop;
    }
    handleLoopChanged = (loopIn: boolean) => {
        const { bufferSourceNode, editor } = this;
        if (!bufferSourceNode) return;
        const { buffer, loop } = bufferSourceNode;
        if (loop === loopIn) return;
        const { sampleRate } = buffer;
        const selRange = editor.state.selRange;
        bufferSourceNode.loop = loopIn;
        if (loopIn) {
            if (selRange) {
                bufferSourceNode.loopStart = selRange[0] / sampleRate;
                bufferSourceNode.loopEnd = selRange[1] / sampleRate;
            } else {
                bufferSourceNode.loopStart = 0;
                bufferSourceNode.loopEnd = 0;
            }
            bufferSourceNode.stop(Number.MAX_VALUE);
        } else {
            bufferSourceNode.loopStart = 0;
            bufferSourceNode.loopEnd = 0;
            if (selRange) bufferSourceNode.stop(this.currentTime + (selRange[1] - this.currentSample) / sampleRate);
            else bufferSourceNode.stop(Number.MAX_VALUE);
        }
    };
    handleSelRangeChanged = (selRange: [number, number]): void => {
        const { bufferSourceNode } = this;
        if (!bufferSourceNode) return;
        const { buffer, loop } = bufferSourceNode;
        const { sampleRate } = buffer;
        if (loop) {
            if (selRange) {
                bufferSourceNode.loopStart = selRange[0] / sampleRate;
                bufferSourceNode.loopEnd = selRange[1] / sampleRate;
            } else {
                bufferSourceNode.loopStart = 0;
                bufferSourceNode.loopEnd = 0;
            }
        } else {
            bufferSourceNode.loopStart = 0;
            bufferSourceNode.loopEnd = 0;
            if (selRange) bufferSourceNode.stop(this.currentTime + (selRange[1] - this.currentSample) / sampleRate);
            else bufferSourceNode.stop(Number.MAX_VALUE);
        }
    };
    handleEnded = () => {
        const { bufferSourceNode } = this;
        if (!bufferSourceNode) return;
        this.editor.handlePlayerEnded(this.getCurrentSample());
        this.bufferSourceNode.removeEventListener("ended", this.handleEnded);
        this.bufferSourceNode.disconnect();
        this.splitterNode.disconnect();
        this.mergerNode.disconnect();
        delete this.bufferSourceNode;
        delete this.splitterNode;
        delete this.mergerNode;
    };
    handleEnabledChannelsChanged = (enabledChannels: boolean[]) => {
        const { bufferSourceNode } = this;
        if (!bufferSourceNode) return;
        this.currentChannels.forEach((enabled, i) => {
            if (enabledChannels[i] !== enabled) {
                if (enabledChannels[i]) this.splitterNode.connect(this.mergerNode, i, i);
                else this.splitterNode.disconnect(this.mergerNode, i, i);
            }
        });
        this.currentChannels = enabledChannels.slice();
    };

    updateCursorScheduled = false;
    $updateCursorRaf = -1;
    updateCursorCallback = () => {
        this.$updateCursorRaf = -1;
        this.updateCursorScheduled = false;
        this.updateCursor();
    };
    scheduleUpdateCursor = () => {
        if (this.updateCursorScheduled) return;
        if (this.$updateCursorRaf === -1) this.$updateCursorRaf = requestAnimationFrame(this.updateCursorCallback);
        this.updateCursorScheduled = true;
    };
    updateCursor() {
        if (!this.bufferSourceNode) return;
        this.editor.setCursor(this.getCurrentSample(), true);
        this.scheduleUpdateCursor();
    }
    constructor(editor: AudioEditor) {
        this.editor = editor;
        this.playing = false;
        this.monitoring = false;
        // this.destination.channelInterpretation = "discrete";
        this.dummyAnalyserNode = this.audioCtx.createAnalyser();
        this.preFxGainNode = this.audioCtx.createGain();
        this.postFxGainNode = this.audioCtx.createGain();
        this.postFxGainNode.connect(this.destination);
        this.editor.on("loop", this.handleLoopChanged);
        this.editor.on("selRangeToPlay", this.handleSelRangeChanged);
        this.editor.on("enabledChannels", this.handleEnabledChannelsChanged);
    }
    async init() {
        const audioWorklet = this.audioCtx.audioWorklet;
        await TemporalAnalyserNode.register(audioWorklet);
        this.postAnalyserNode = new TemporalAnalyserNode(this.audioCtx);
        this.postFxGainNode.connect(this.postAnalyserNode);
    }
    async destroy() {
        if (this.playing) this.stop();
        await this.postAnalyserNode.destroy();
    }
    getCurrentSample() {
        const { buffer } = this.bufferSourceNode;
        const delta = (this.audioCtx.currentTime - this.currentTime) * buffer.sampleRate;
        const selRange = this.editor.state?.selRange || [0, buffer.length];
        this.currentSample += delta;
        this.currentTime = this.audioCtx.currentTime;
        if (this.loop) {
            if (this.currentSample > selRange[1]) this.currentSample = (this.currentSample - selRange[0]) % (selRange[1] - selRange[0]) + selRange[0];
        } else {
            if (this.currentSample > selRange[1]) this.currentSample = selRange[1];
        }
        return ~~this.currentSample;
    }
    play() {
        this.stop();
        const audio = this.editor;
        const { cursor, selRange, enabledChannels, preFxGain, postFxGain, loop } = this.editor.state;
        const { sampleRate, numberOfChannels, audioBuffer } = audio;
        const offset = (selRange ? selRange[0] : cursor) / sampleRate;
        const duration = selRange ? (selRange[1] - selRange[0]) / sampleRate : undefined;
        const bufferSourceNode = this.audioCtx.createBufferSource();
        bufferSourceNode.channelCountMode = "explicit";
        bufferSourceNode.channelInterpretation = "discrete";
        bufferSourceNode.channelCount = numberOfChannels;
        this.currentTime = this.audioCtx.currentTime;
        this.currentSample = selRange ? selRange[0] : cursor;
        this.currentChannels = enabledChannels.slice();
        this.bufferSourceNode = bufferSourceNode;
        this.splitterNode = this.audioCtx.createChannelSplitter(numberOfChannels);
        this.mergerNode = this.audioCtx.createChannelMerger(numberOfChannels);
        this.mergerNode.channelInterpretation = "discrete";
        this.preFxGainNode.gain.value = dbtoa(preFxGain);
        this.postFxGainNode.gain.value = dbtoa(postFxGain);
        bufferSourceNode.buffer = audioBuffer;
        bufferSourceNode.connect(this.dummyAnalyserNode);
        bufferSourceNode.connect(this.splitterNode);
        enabledChannels.forEach((enabled, i) => {
            if (enabled && i < numberOfChannels) this.splitterNode.connect(this.mergerNode, i, i);
        });
        this.mergerNode.connect(this.preFxGainNode);
        if (!this.monitoring) this.connectPlugins();
        bufferSourceNode.loop = !!loop;
        bufferSourceNode.addEventListener("ended", this.handleEnded);
        if (loop) {
            if (duration) {
                bufferSourceNode.loopStart = offset;
                bufferSourceNode.loopEnd = offset + duration;
            }
            bufferSourceNode.start(this.currentTime, offset);
        } else {
            bufferSourceNode.start(this.currentTime, offset);
            if (duration) bufferSourceNode.stop(this.currentTime + duration);
            else bufferSourceNode.stop(Number.MAX_VALUE);
        }
        this.playing = true;
        this.scheduleUpdateCursor();
    }
    stop() {
        if (!this.bufferSourceNode) return;
        this.bufferSourceNode.stop();
        this.bufferSourceNode.removeEventListener("ended", this.handleEnded);
        this.bufferSourceNode.disconnect();
        this.splitterNode.disconnect();
        this.mergerNode.disconnect();
        if (!this.monitoring) this.disconnectPlugins();
        delete this.bufferSourceNode;
        delete this.splitterNode;
        delete this.mergerNode;
        this.playing = false;
    }
    startMonitoring() {
        this.stopMonitoring();
        const sourceNode = this.editor.recorder.node;
        if (!sourceNode) return;
        this.mediaStreamSourceNode = sourceNode;
        if (!this.playing) this.connectPlugins();
        this.mediaStreamSourceNode.connect(this.preFxGainNode);
        this.monitoring = true;
    }
    stopMonitoring() {
        if (!this.mediaStreamSourceNode) return;
        this.mediaStreamSourceNode.disconnect(this.preFxGainNode);
        if (!this.playing) this.disconnectPlugins();
        delete this.mediaStreamSourceNode;
        this.monitoring = false;
    }

    connectPlugins() {
        const { plugins, pluginsEnabled } = this.editor.state;
        let firstPluginNode: AudioNode;
        let lastPluginNode: AudioNode;
        plugins.forEach((p) => {
            if (!p) return;
            if (!pluginsEnabled.has(p)) return;
            if (!firstPluginNode) firstPluginNode = p.audioNode;
            lastPluginNode = p.audioNode;
        });
        if (firstPluginNode) {
            this.preFxGainNode.connect(firstPluginNode);
            lastPluginNode.connect(this.postFxGainNode);
        } else {
            this.preFxGainNode.connect(this.postFxGainNode);
        }
    }
    disconnectPlugins() {
        const { plugins, pluginsEnabled } = this.editor.state;
        this.preFxGainNode.disconnect();
        let lastPluginNode: AudioNode;
        plugins.forEach((p) => {
            if (!p) return;
            if (!pluginsEnabled.has(p)) return;
            lastPluginNode = p.audioNode;
        });
        if (lastPluginNode) lastPluginNode.disconnect(this.postFxGainNode);
    }

    async addPlugin(url: string, indexIn: number) {
        const { plugins, pluginsEnabled } = this.editor.state;
        const { default: Plugin }: { default: typeof WebAudioModule } = await import(/* webpackIgnore: true */url);
        const plugin = await Plugin.createInstance(this.audioCtx);
        const { audioNode } = plugin;
        const usingPlugins = this.playing || this.monitoring;
        let preNode: AudioNode;
        let postNode: AudioNode;
        let index = indexIn;
        while (index >= 0) {
            index--;
            if (plugins[index]) {
                preNode = plugins[index].audioNode;
                break;
            }
        }
        if (!preNode && usingPlugins) preNode = this.preFxGainNode;
        index = indexIn;
        while (index < plugins.length) {
            if (plugins[index]) {
                postNode = plugins[index].audioNode;
                break;
            }
            index++;
        }
        if (!postNode && usingPlugins) postNode = this.postFxGainNode;
        audioNode.connect(this.dummyAnalyserNode);
        if (preNode && postNode) preNode.disconnect(postNode);
        if (preNode) preNode.connect(audioNode);
        if (postNode) audioNode.connect(postNode);
        plugins.splice(indexIn, 0, plugin);
        pluginsEnabled.add(plugin);
        this.editor.emitPluginsChanged();
        return plugin;
    }
    removePlugin(indexIn: number) {
        const { plugins, pluginsEnabled } = this.editor.state;
        const plugin = plugins[indexIn];
        if (!plugin) return;
        const { audioNode } = plugin;
        const usingPlugins = this.playing || this.monitoring;
        let preNode: AudioNode;
        let postNode: AudioNode;
        let index = indexIn - 1;
        while (index >= 0) {
            if (plugins[index]) {
                preNode = plugins[index].audioNode;
                break;
            }
            index--;
        }
        if (!preNode && usingPlugins) preNode = this.preFxGainNode;
        index = indexIn + 1;
        while (index < plugins.length) {
            if (plugins[index]) {
                postNode = plugins[index].audioNode;
                break;
            }
            index++;
        }
        if (!postNode && usingPlugins) postNode = this.postFxGainNode;
        audioNode.disconnect();
        if (pluginsEnabled.has(plugin) && preNode) {
            preNode.disconnect(audioNode);
            if (postNode) preNode.connect(postNode);
        }
        if (plugin.audioNode) plugin.audioNode.destroy();
        delete plugins[indexIn];
        plugins.splice(indexIn, 1);
        if (plugins.length < 10) plugins.push(undefined);
        this.editor.emitPluginsChanged();
    }
    movePlugin(fromIndexIn: number, toIndexIn: number) {
        const { plugins, pluginsEnabled } = this.editor.state;
        if (!plugins[fromIndexIn]) return;
        const plugin = plugins[fromIndexIn];
        const { audioNode } = plugin;
        const usingPlugins = this.playing || this.monitoring;
        const enabled = pluginsEnabled.has(plugin);
        let preNode: AudioNode;
        let postNode: AudioNode;
        let index = fromIndexIn - 1;
        while (index >= 0) {
            if (plugins[index]) {
                preNode = plugins[index].audioNode;
                break;
            }
            index--;
        }
        if (!preNode && usingPlugins) preNode = this.preFxGainNode;
        index = fromIndexIn + 1;
        while (index < plugins.length) {
            if (plugins[index]) {
                postNode = plugins[index].audioNode;
                break;
            }
            index++;
        }
        if (!postNode && usingPlugins) postNode = this.postFxGainNode;
        if (enabled) {
            if (preNode) preNode.disconnect(audioNode);
            if (postNode) audioNode.disconnect(postNode);
            if (preNode && postNode) preNode.connect(postNode);
        }
        plugins.splice(fromIndexIn, 1);
        preNode = undefined;
        postNode = undefined;
        index = toIndexIn - 1;
        while (index >= 0) {
            if (plugins[index]) {
                preNode = plugins[index].audioNode;
                break;
            }
            index--;
        }
        if (!preNode && usingPlugins) preNode = this.preFxGainNode;
        index = toIndexIn + 1;
        while (index < plugins.length) {
            if (plugins[index]) {
                postNode = plugins[index].audioNode;
                break;
            }
            index++;
        }
        if (!postNode && usingPlugins) postNode = this.postFxGainNode;
        if (enabled) {
            if (preNode && postNode) preNode.disconnect(postNode);
            if (preNode) preNode.connect(audioNode);
            if (postNode) audioNode.connect(postNode);
        }
        plugins.splice(toIndexIn, 0, plugin);
        this.editor.emitPluginsChanged();
    }
    setPluginEnabled(indexIn: number, enabled: boolean) {
        const { plugins, pluginsEnabled } = this.editor.state;
        const plugin = plugins[indexIn];
        if (!plugin) return;
        if (pluginsEnabled.has(plugin) === enabled) return;
        let index = indexIn - 1;
        const { audioNode } = plugins[indexIn];
        const usingPlugins = this.playing || this.monitoring;
        let preNode: AudioNode;
        let postNode: AudioNode;
        while (index >= 0) {
            if (plugins[index]) {
                preNode = plugins[index].audioNode;
                break;
            }
            index--;
        }
        if (!preNode && usingPlugins) preNode = this.preFxGainNode;
        index = indexIn + 1;
        while (index < plugins.length) {
            if (plugins[index]) {
                postNode = plugins[index].audioNode;
                break;
            }
            index++;
        }
        if (!postNode && usingPlugins) postNode = this.postFxGainNode;
        if (enabled) {
            if (preNode && postNode) preNode.disconnect(postNode);
            if (preNode) preNode.connect(audioNode);
            if (postNode) audioNode.connect(postNode);
        } else {
            if (preNode) preNode.disconnect(audioNode);
            if (postNode) audioNode.disconnect(postNode);
            if (preNode && postNode) preNode.connect(postNode);
        }
        if (enabled) pluginsEnabled.add(plugin);
        else pluginsEnabled.delete(plugin);
        this.editor.emitPluginsChanged();
    }
}
