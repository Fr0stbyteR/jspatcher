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
    "postInit": never;
}

export default class PatcherAudio<M extends Partial<PatcherAudioEventMap> & Record<string, any> = Record<string, any>> extends FileInstance<PatcherAudioEventMap & M> {
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
        await audio.emit("postInit");
        audio._isReady = true;
        await audio.emit("ready");
        return audio;
    }
    static async fromSilence(ctxIn: ConstructorParameters<typeof PatcherAudio>[0], numberOfChannels: number, length: number, sampleRate: number) {
        const audio = new PatcherAudio(ctxIn);
        audio.audioBuffer = new OperableAudioBuffer({ length, numberOfChannels, sampleRate });
        audio.waveform = new Waveform(audio);
        audio.waveform.generateEmpty(numberOfChannels, length);
        await audio.emit("postInit");
        audio._isReady = true;
        await audio.emit("ready");
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
        await this.env.taskMgr.newTask(this, "Initializing Audio", async (onUpdate) => {
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
        await this.emit("postInit");
        this._isReady = true;
        await this.emit("ready");
    }
    async initWithOptions(options: Partial<AudioBufferOptions>) {
        const { length = 1, numberOfChannels = 1, sampleRate = this.audioCtx.sampleRate } = options;
        this.audioBuffer = new OperableAudioBuffer({ length, numberOfChannels, sampleRate });
        this.waveform = new Waveform(this);
        await this.waveform.generate();
        await this.emit("postInit");
        this._isReady = true;
        await this.emit("ready");
    }
    async initWith(audio: { audioBuffer: OperableAudioBuffer, waveform: Waveform }) {
        this.setAudio(audio);
        await this.emit("postInit");
        this._isReady = true;
        await this.emit("ready");
    }
    async serialize(optionsIn: Omit<Partial<Options>, "sampleRate"> = { bitDepth: 32, float: true }) {
        return this.env.taskMgr.newTask(this, "Encoding audio WAVE...", () => {
            const audioData = this.audioBuffer.toArray(true);
            const options = { sampleRate: this.audioBuffer.sampleRate, bitDepth: 32, float: true, ...optionsIn };
            return this.env.wavEncoderWorker.encode(audioData, options);
        });
    }
    private encodeFfmpegWorker(wav: Uint8Array, inputFileName: string, outputFileName: string, ...args: string[]) {
        return this.env.taskMgr.newTask(this, `Encoding audio ${outputFileName}...`, async (onUpdate) => {
            const { ffmpegWorker } = this.env;
            const onExit = (code: number) => onUpdate(`ffmpeg process exited with code ${code}`);
            ffmpegWorker.on("stdout", onUpdate);
            ffmpegWorker.on("stderr", onUpdate);
            ffmpegWorker.on("exit", onExit);
            try {
                const result = await ffmpegWorker.run({
                    MEMFS: [{ data: wav, name: inputFileName }],
                    arguments: ["-i", inputFileName, ...args, outputFileName]
                });
                return result.MEMFS[0].data.buffer;
            } finally {
                ffmpegWorker.off("stdout", onUpdate);
                ffmpegWorker.off("stderr", onUpdate);
                ffmpegWorker.off("exit", onExit);
            }
        });
    }
    async encodeMp3(bitrate: number) {
        const wav = new Uint8Array(await this.serialize());
        const inputFileName = "in.wav";
        const outputFileName = "out.mp3";
        return this.encodeFfmpegWorker(wav, inputFileName, outputFileName, "-codec:a", "libmp3lame", "-b:a", `${bitrate}k`);
    }
    async encodeAac(bitrate: number) {
        const wav = new Uint8Array(await this.serialize());
        const inputFileName = "in.wav";
        const outputFileName = "out.m4a";
        return this.encodeFfmpegWorker(wav, inputFileName, outputFileName, "-codec:a", "aac", "-b:a", `${bitrate}k`);
    }
    async clone() {
        const audio = new PatcherAudio(this.ctx);
        await audio.initWith({
            audioBuffer: this.audioBuffer.clone(),
            waveform: this.waveform.clone()
        });
        return audio;
    }
    setAudio(that: { audioBuffer: OperableAudioBuffer; waveform: Waveform }) {
        this.audioBuffer = that.audioBuffer;
        this.waveform = that.waveform;
        this.waveform.patcherAudio = this;
        this.emit("setAudio");
    }
    async silence(range: [number, number]) {
        const [selStart, selEnd] = range;
        const length = selEnd - selStart;
        const audio = await PatcherAudio.fromSilence(this.ctx, this.numberOfChannels, length, this.sampleRate);
        const oldAudio = await this.pasteToRange(audio, selStart, selEnd);
        this.emit("silenced", { range: [selStart, selEnd], audio, oldAudio });
    }
    async insertSilence(length: number, from: number) {
        if (!length) return;
        const audio = await PatcherAudio.fromSilence(this.ctx, this.numberOfChannels, length, this.sampleRate);
        this.insertToCursor(audio, from);
        this.emit("insertedSilence", { range: [from, from + length], audio });
    }
    reverse() {
        this.audioBuffer.reverse();
        this.waveform.reverse();
    }
    inverse() {
        this.audioBuffer.inverse();
        this.waveform.inverse();
    }
    async concat(that: PatcherAudio, numberOfChannels = this.audioBuffer.numberOfChannels) {
        const audio = new PatcherAudio(this.ctx);
        const audioBuffer = this.audioBuffer.concat(that.audioBuffer, numberOfChannels);
        audio.audioBuffer = audioBuffer;
        const waveform = this.waveform.concat(that.waveform, audio, numberOfChannels);
        await audio.initWith({ audioBuffer, waveform });
        return audio;
    }
    async split(from: number) {
        const audio1 = new PatcherAudio(this.ctx);
        const audio2 = new PatcherAudio(this.ctx);
        const [ab1, ab2] = this.audioBuffer.split(from);
        audio1.audioBuffer = ab1;
        audio2.audioBuffer = ab2;
        const [wf1, wf2] = this.waveform.split(from, audio1, audio2);
        await audio1.initWith({ audioBuffer: ab1, waveform: wf1 });
        await audio2.initWith({ audioBuffer: ab2, waveform: wf2 });
        return [audio1, audio2] as [PatcherAudio, PatcherAudio];
    }
    async pick(from: number, to: number, clone = false) {
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
            await picked.initWith({ audioBuffer, waveform });
            return picked;
            // eslint-disable-next-line no-else-return
        } else if (from <= 0) {
            picked = (await this.split(to))[0];
        } else if (to >= this.length) {
            picked = (await this.split(from))[1];
        } else {
            const p0 = (await this.split(to))[0];
            picked = (await p0.split(from))[1];
        }
        if (clone) picked.waveform = picked.waveform.clone();
        return picked;
    }
    async removeFromRange(from: number, to: number) {
        if (from === 0 && to === this.length) {
            const old = await this.clone();
            const { numberOfChannels, sampleRate } = this.audioBuffer;
            const audioBuffer = new OperableAudioBuffer({ length: 1, numberOfChannels, sampleRate });
            const waveform = new Waveform(this);
            this.setAudio({ audioBuffer, waveform });
            this.setCursor(from);
            return old;
        // eslint-disable-next-line no-else-return
        } else if (from === 0) {
            const [p1, p2] = await this.split(to);
            this.setAudio(p2);
            this.setCursor(from);
            return p1;
        } else if (to === this.audioBuffer.length) {
            const [p1, p2] = await this.split(from);
            this.setAudio(p1);
            this.setCursor(from);
            return p2;
        } else {
            const [p0, p3] = await this.split(to);
            const [p1, p2] = await p0.split(from);
            const concat = await p1.concat(p3);
            this.setAudio(concat);
            this.setCursor(from);
            return p2;
        }
    }
    async pasteToRange(that: PatcherAudio, from: number, to: number) {
        if (from <= 0 && to >= this.length) {
            const old = await this.clone();
            this.setAudio(that);
            this.setSelRangeToAll();
            return old;
        // eslint-disable-next-line no-else-return
        } else if (from <= 0) {
            const [p1, p2] = await this.split(to);
            const concat = await that.concat(p2, p2.numberOfChannels);
            this.setAudio(concat);
            this.setSelRange([0, that.length]);
            return p1;
        } else if (to >= this.length) {
            const [p1, p2] = await this.split(from);
            const concat = await p1.concat(that);
            this.setAudio(concat);
            this.setSelRange([from, this.length]);
            return p2;
        } else {
            const [p, p2] = await this.split(to);
            const [p0, old] = await p.split(from);
            const p1 = await p0.concat(that);
            const concat = await p1.concat(p2);
            this.setAudio(concat);
            this.setSelRange([from, from + that.length]);
            return old;
        }
    }
    async insertToCursor(that: PatcherAudio, cursor: number) {
        if (cursor <= 0) {
            const concat = await that.concat(this, this.numberOfChannels);
            this.setAudio(concat);
            this.setSelRange([0, that.length]);
        } else if (cursor >= this.length) {
            const concat = await this.concat(that);
            this.setAudio(concat);
            this.setSelRange([cursor, this.length]);
        } else {
            const [p0, p2] = await this.split(cursor);
            const p1 = await p0.concat(that);
            const concat = await p1.concat(p2);
            this.setAudio(concat);
            this.setSelRange([cursor, cursor + that.length]);
        }
    }
    async fade(gain: number, from: number, to: number, enabledChannels: boolean[]) {
        const oldAudio = await this.pick(from, to, true);
        const factor = dbtoa(gain);
        for (let c = 0; c < this.numberOfChannels; c++) {
            if (!enabledChannels[c]) return;
            const channel = this.audioBuffer.getChannelData(c);
            for (let i = from; i < to; i++) {
                channel[i] *= factor;
            }
        }
        this.waveform.update(from, to);
        const audio = await this.pick(from, to, true);
        this.emit("faded", { gain, range: [from, to], audio, oldAudio });
    }
    async fadeIn(lengthIn: number, exponent: number, enabledChannels: boolean[]) {
        const length = Math.max(0, Math.min(this.length, ~~lengthIn));
        if (!length) return;
        const oldAudio = await this.pick(0, length, true);
        for (let c = 0; c < this.numberOfChannels; c++) {
            if (!enabledChannels[c]) return;
            const channel = this.audioBuffer.getChannelData(c);
            for (let i = 0; i < length; i++) {
                channel[i] *= normExp(i / length, exponent);
            }
        }
        this.waveform.update(0, length);
        const audio = await this.pick(0, length, true);
        this.emit("fadedIn", { length, exponent, audio, oldAudio });
    }
    async fadeOut(lengthIn: number, exponent: number, enabledChannels: boolean[]) {
        const l = this.length;
        const length = Math.max(0, Math.min(l, ~~lengthIn));
        if (!length) return;
        const oldAudio = await this.pick(l - length, l, true);
        for (let c = 0; c < this.numberOfChannels; c++) {
            if (!enabledChannels[c]) return;
            const channel = this.audioBuffer.getChannelData(c);
            for (let i = 0; i < length; i++) {
                channel[l - i] *= normExp(i / length, exponent);
            }
        }
        this.waveform.update(l - length, l);
        const audio = await this.pick(l - length, l, true);
        this.emit("fadedOut", { length, exponent, audio, oldAudio });
    }
    write(channel: number, index: number, value: number) {
        this.audioBuffer.write(channel, index, value);
        this.waveform.update(index, index + 1);
    }
    async render(sampleRateIn?: number, mix?: number[][], applyPlugins?: boolean, pluginsOptions?: { plugins: WebAudioModule[]; pluginsEnabled: WeakSet<WebAudioModule>; preFxGain: number; postFxGain: number }): Promise<PatcherAudio> {
        return this.env.taskMgr.newTask(this, "Rendering audio...", async () => {
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
                await this.env.taskMgr.newTask(this, "Remixing audio...", () => {
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
                });
            }
            if (!applyPlugins && !needResample) return PatcherAudio.fromNativeAudioBuffer(this.ctx, mixBuffer);
            const offlineAudioCtx = new OfflineAudioContext(numberOfChannels, length, sampleRate);
            const source = offlineAudioCtx.createBufferSource();
            source.buffer = mixBuffer;
            if (applyPlugins) {
                await this.env.taskMgr.newTask(this, "Applying plugins...", async (onUpdate) => {
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
                        onUpdate(plugin.name);
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
                });
            } else {
                source.connect(offlineAudioCtx.destination);
            }
            source.start(0);
            return this.env.taskMgr.newTask(this, "Applying plugins...", async () => {
                const bufferOut = await offlineAudioCtx.startRendering();
                return PatcherAudio.fromNativeAudioBuffer(this.ctx, bufferOut);
            });
        });
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
