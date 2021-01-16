import { SemanticICONS } from "semantic-ui-react";
import { WebAudioModule } from "wamsdk/src/api";
import { dbtoa, isIdentityMatrix, normExp } from "../../utils/math";
import Waveform from "../../utils/Waveform";
import { Options } from "../../utils/WavEncoder";
import FileInstance from "../file/FileInstance";
import AudioHistory from "./AudioHistory";
import OperableAudioBuffer from "./OperableAudioBuffer";

export interface PatcherAudioEventMap {
    "setAudio": never;
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
    "selRange": [number, number];
    "cursor": number;
    "copy": never;
    "cut": never;
    "paste": never;
    "deleteSelected": never;
    "selectAll": never;
    "uiResized": never;
}

export default class PatcherAudio extends FileInstance<PatcherAudioEventMap> {
    static async fromArrayBuffer(ctxIn: ConstructorParameters<typeof PatcherAudio>[0], data: ArrayBuffer) {
        const audio = new PatcherAudio(ctxIn);
        await audio.init(data);
        return audio;
    }
    static async fromNativeAudioBuffer(ctxIn: ConstructorParameters<typeof PatcherAudio>[0], bufferIn: AudioBuffer) {
        const audio = new PatcherAudio(ctxIn);
        const audioBuffer = Object.setPrototypeOf(bufferIn, OperableAudioBuffer.prototype);
        audio.audioBuffer = audioBuffer;
        audio.waveform = new Waveform(audio);
        await audio.waveform.generate();
        audio.emit("ready");
        return audio;
    }
    static fromSilence(ctxIn: ConstructorParameters<typeof PatcherAudio>[0], numberOfChannels: number, length: number, sampleRate: number) {
        const audio = new PatcherAudio(ctxIn);
        audio.audioBuffer = new OperableAudioBuffer({ length, numberOfChannels, sampleRate });
        audio.waveform = new Waveform(audio);
        audio.waveform.generateEmpty(numberOfChannels, length);
        return audio;
    }
    get audioCtx() {
        return this.project?.audioCtx || this.env.audioCtx;
    }
    _history: AudioHistory = new AudioHistory(this);
    get history() {
        return this._history;
    }
    get fileExtension() {
        return "wav";
    }
    get fileIcon(): SemanticICONS {
        return "music";
    }
    audioBuffer: OperableAudioBuffer;
    waveform: Waveform;

    get length() {
        return this.audioBuffer.length;
    }
    get numberOfChannels() {
        return this.audioBuffer.numberOfChannels;
    }
    get sampleRate() {
        return this.audioBuffer.sampleRate;
    }
    async init(data?: ArrayBuffer) {
        const { audioCtx } = this;
        this.env.taskMgr.newTask(this, "Initializing Audio", async (onUpdate) => {
            onUpdate("Decoding Audio...");
            if (data?.byteLength) {
                const audioBuffer = await audioCtx.decodeAudioData(data);
                this.audioBuffer = Object.setPrototypeOf(audioBuffer, OperableAudioBuffer.prototype);
            } else {
                this.audioBuffer = new OperableAudioBuffer({ length: 1, numberOfChannels: 1, sampleRate: audioCtx.sampleRate });
            }
            onUpdate("Generating Waveform...");
            this.waveform = new Waveform(this);
            await this.waveform.generate();
        });
        this.emit("ready");
    }
    async initWithOptions(options: Partial<AudioBufferOptions>) {
        const { length = 1, numberOfChannels = 1, sampleRate = this.audioCtx.sampleRate } = options;
        this.audioBuffer = new OperableAudioBuffer({ length, numberOfChannels, sampleRate });
        this.waveform = new Waveform(this);
        await this.waveform.generate();
        this.emit("ready");
    }
    initWith(audio: { audioBuffer: OperableAudioBuffer, waveform: Waveform }) {
        this.setAudio(audio);
        this.emit("ready");
    }
    async serialize(options: Omit<Partial<Options>, "sampleRate"> = { bitDepth: 32, float: true }) {
        return this.env.wavEncoderWorker.encode(this.audioBuffer.toArray(true), { sampleRate: this.audioBuffer.sampleRate, bitDepth: 32, float: true, ...options });
    }
    clone() {
        const audio = new PatcherAudio(this.ctx);
        audio.initWith({
            audioBuffer: this.audioBuffer.clone(),
            waveform: this.waveform.clone()
        });
        return audio;
    }
    setAudio(that: { audioBuffer: OperableAudioBuffer; waveform: Waveform }) {
        this.audioBuffer = that.audioBuffer;
        this.waveform = that.waveform;
        this.emit("setAudio");
    }
    reverse() {
        this.audioBuffer.reverse();
        this.waveform.reverse();
    }
    inverse() {
        this.audioBuffer.inverse();
        this.waveform.inverse();
    }
    concat(that: PatcherAudio, numberOfChannels = this.audioBuffer.numberOfChannels) {
        const audio = new PatcherAudio(this.ctx);
        const audioBuffer = this.audioBuffer.concat(that.audioBuffer, numberOfChannels);
        audio.audioBuffer = audioBuffer;
        const waveform = this.waveform.concat(that.waveform, audio, numberOfChannels);
        audio.initWith({ audioBuffer, waveform });
        return audio;
    }
    split(from: number): [PatcherAudio, PatcherAudio] {
        const audio1 = new PatcherAudio(this.ctx);
        const audio2 = new PatcherAudio(this.ctx);
        const [ab1, ab2] = this.audioBuffer.split(from);
        audio1.audioBuffer = ab1;
        audio2.audioBuffer = ab2;
        const [wf1, wf2] = this.waveform.split(from, audio1, audio2);
        audio1.initWith({ audioBuffer: ab1, waveform: wf1 });
        audio2.initWith({ audioBuffer: ab2, waveform: wf2 });
        return [audio1, audio2];
    }
    pick(from: number, to: number, clone = false) {
        let picked: PatcherAudio;
        let audioBuffer: OperableAudioBuffer;
        let waveform: Waveform;
        if (from <= 0 && to >= this.length) {
            picked = new PatcherAudio(this.ctx);
            if (clone) {
                audioBuffer = this.audioBuffer.clone();
                waveform = this.waveform.clone();
            } else {
                audioBuffer = this.audioBuffer;
                waveform = this.waveform;
            }
            picked.initWith({ audioBuffer, waveform });
            return picked;
            // eslint-disable-next-line no-else-return
        } else if (from <= 0) {
            picked = this.split(to)[0];
        } else if (to >= this.length) {
            picked = this.split(from)[1];
        } else {
            picked = this.split(to)[0].split(from)[1];
        }
        if (clone) picked.waveform = picked.waveform.clone();
        return picked;
    }
    removeFromRange(from: number, to: number) {
        if (from === 0 && to === this.length) {
            const old = this.clone();
            const { numberOfChannels, sampleRate } = this.audioBuffer;
            const audioBuffer = new OperableAudioBuffer({ length: 1, numberOfChannels, sampleRate });
            const waveform = new Waveform(this);
            this.setAudio({ audioBuffer, waveform });
            this.setCursor(from);
            return old;
        // eslint-disable-next-line no-else-return
        } else if (from === 0) {
            const [p1, p2] = this.split(to);
            this.setAudio(p2);
            this.setCursor(from);
            return p1;
        } else if (to === this.audioBuffer.length) {
            const [p1, p2] = this.split(from);
            this.setAudio(p1);
            this.setCursor(from);
            return p2;
        } else {
            const [p0, p3] = this.split(to);
            const [p1, p2] = p0.split(from);
            const concat = p1.concat(p3);
            this.setAudio(concat);
            this.setCursor(from);
            return p2;
        }
    }
    pasteToRange(that: PatcherAudio, from: number, to: number) {
        if (from <= 0 && to >= this.length) {
            const old = this.clone();
            this.setAudio(that);
            this.setSelRangeToAll();
            return old;
        // eslint-disable-next-line no-else-return
        } else if (from <= 0) {
            const [p1, p2] = this.split(to);
            const concat = that.concat(p2, p2.numberOfChannels);
            this.setAudio(concat);
            this.setSelRange([0, that.length]);
            return p1;
        } else if (to >= this.length) {
            const [p1, p2] = this.split(from);
            const concat = p1.concat(that);
            this.setAudio(concat);
            this.setSelRange([from, this.length]);
            return p2;
        } else {
            const [p, p2] = this.split(to);
            const [p0, old] = p.split(from);
            const p1 = p0.concat(that);
            const concat = p1.concat(p2);
            this.setAudio(concat);
            this.setSelRange([from, from + that.length]);
            return old;
        }
    }
    insertToCursor(that: PatcherAudio, cursor: number) {
        if (cursor <= 0) {
            const concat = that.concat(this, this.numberOfChannels);
            this.setAudio(concat);
            this.setSelRange([0, that.length]);
        } else if (cursor >= this.length) {
            const concat = this.concat(that);
            this.setAudio(concat);
            this.setSelRange([cursor, this.length]);
        } else {
            const [p0, p2] = this.split(cursor);
            const p1 = p0.concat(that);
            const concat = p1.concat(p2);
            this.setAudio(concat);
            this.setSelRange([cursor, cursor + that.length]);
        }
    }
    fade(gain: number, from: number, to: number, enabledChannels: boolean[]) {
        const oldAudio = this.pick(from, to, true);
        const factor = dbtoa(gain);
        for (let c = 0; c < this.numberOfChannels; c++) {
            if (!enabledChannels[c]) return;
            const channel = this.audioBuffer.getChannelData(c);
            for (let i = from; i < to; i++) {
                channel[i] *= factor;
            }
        }
        this.waveform.update(from, to);
        const audio = this.pick(from, to, true);
        this.emit("faded", { gain, range: [from, to], audio, oldAudio });
    }
    fadeIn(lengthIn: number, exponent: number, enabledChannels: boolean[]) {
        const length = Math.max(0, Math.min(this.length, ~~lengthIn));
        if (!length) return;
        const oldAudio = this.pick(0, length, true);
        for (let c = 0; c < this.numberOfChannels; c++) {
            if (!enabledChannels[c]) return;
            const channel = this.audioBuffer.getChannelData(c);
            for (let i = 0; i < length; i++) {
                channel[i] *= normExp(i / length, exponent);
            }
        }
        this.waveform.update(0, length);
        const audio = this.pick(0, length, true);
        this.emit("fadedIn", { length, exponent, audio, oldAudio });
    }
    fadeOut(lengthIn: number, exponent: number, enabledChannels: boolean[]) {
        const l = this.length;
        const length = Math.max(0, Math.min(l, ~~lengthIn));
        if (!length) return;
        const oldAudio = this.pick(l - length, l, true);
        for (let c = 0; c < this.numberOfChannels; c++) {
            if (!enabledChannels[c]) return;
            const channel = this.audioBuffer.getChannelData(c);
            for (let i = 0; i < length; i++) {
                channel[l - i] *= normExp(i / length, exponent);
            }
        }
        this.waveform.update(l - length, l);
        const audio = this.pick(l - length, l, true);
        this.emit("fadedOut", { length, exponent, audio, oldAudio });
    }
    write(channel: number, index: number, value: number) {
        this.audioBuffer.write(channel, index, value);
        this.waveform.update(index, index + 1);
    }
    async render(sampleRateIn?: number, mix?: number[][], applyPlugins?: boolean, pluginsOptions?: { plugins: WebAudioModule[]; pluginsEnabled: WeakSet<WebAudioModule>; preFxGain: number; postFxGain: number }) {
        let { length } = this;
        const needResample = sampleRateIn && this.sampleRate !== sampleRateIn;
        const needRemix = mix && (mix.length !== this.numberOfChannels || !isIdentityMatrix(mix));
        if (!needResample && !needRemix && !applyPlugins) return this;
        if (needResample) length = Math.ceil(length * sampleRateIn / this.sampleRate);
        const numberOfChannels = mix ? mix.length : this.numberOfChannels;
        const sampleRate = sampleRateIn || this.sampleRate;
        let mixBuffer: AudioBuffer;
        if (!needRemix) {
            mixBuffer = this.audioBuffer;
        } else {
            mixBuffer = new AudioBuffer({ numberOfChannels, length: this.length, sampleRate: this.sampleRate });
            for (let i = 0; i < mixBuffer.numberOfChannels; i++) {
                const mixChannel = mixBuffer.getChannelData(i);
                for (let j = 0; j < mix[i].length; j++) {
                    const gain = mix[i][j];
                    const channel = this.audioBuffer.getChannelData(j);
                    for (let k = 0; k < mixChannel.length; k++) {
                        mixChannel[k] += channel[k] * gain;
                    }
                }
            }
        }
        if (!applyPlugins && !needResample) return PatcherAudio.fromNativeAudioBuffer(this.ctx, mixBuffer);
        const offlineAudioCtx = new OfflineAudioContext(numberOfChannels, length, sampleRate);
        const source = offlineAudioCtx.createBufferSource();
        source.buffer = mixBuffer;
        if (applyPlugins) {
            const { plugins, pluginsEnabled, preFxGain, postFxGain } = pluginsOptions;
            const preFxGainNode = offlineAudioCtx.createGain();
            preFxGainNode.gain.value = dbtoa(preFxGain);
            const postFxGainNode = offlineAudioCtx.createGain();
            postFxGainNode.gain.value = dbtoa(postFxGain);
            source.connect(preFxGainNode);
            let lastNode: AudioNode = preFxGainNode;
            for (const plugin of plugins) {
                if (!plugin) continue;
                if (!pluginsEnabled.has(plugin)) continue;
                try {
                    const Plugin = Object.getPrototypeOf(plugin).constructor as typeof WebAudioModule;
                    const p = await Plugin.createInstance(offlineAudioCtx);
                    await p.audioNode.setParameterValues(await plugin.audioNode.getParameterValues());
                    lastNode.connect(p.audioNode);
                    lastNode = p.audioNode;
                } catch (e) {
                    continue;
                }
            }
            lastNode.connect(postFxGainNode);
            postFxGainNode.connect(offlineAudioCtx.destination);
        } else {
            source.connect(offlineAudioCtx.destination);
        }
        source.start(0);
        const bufferOut = await offlineAudioCtx.startRendering();
        return PatcherAudio.fromNativeAudioBuffer(this.ctx, bufferOut);
    }
    setCursor(cursor: number) {
        this.emit("cursor", cursor);
    }
    setSelRange(range: [number, number]) {
        this.emit("selRange", range);
    }
    setSelRangeToAll() {
        this.emit("selRange", [0, this.length]);
    }
    async copy() {
        this.emit("copy");
    }
    async cut() {
        this.emit("cut");
    }
    async paste() {
        this.emit("paste");
    }
    async selectAll() {
        this.emit("selectAll");
    }
    async deleteSelected() {
        this.emit("deleteSelected");
    }
    onUiResized() {
        this.emit("uiResized");
    }
}
