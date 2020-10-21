import { getAudioChannelData } from "../../utils/utils";
import Waveform from "../../utils/Waveform";
import { Options } from "../../utils/WavEncoder";
import Env from "../Env";
import FileInstance from "../file/FileInstance";
import AudioHistory from "./AudioHistory";
import OperableAudioBuffer from "./OperableAudioBuffer";

export interface PatcherAudioEventMap {
    "recorded": { range?: [number, number]; cursor?: number; audio: PatcherAudio; oldAudio: PatcherAudio };
    "buffer": { audio: PatcherAudio };
    "copy": { range: [number, number] };
    "copied": { range: [number, number]; buffer: AudioBuffer };
    "pasted": { range?: [number, number]; cursor?: number; audio: PatcherAudio; oldAudio: PatcherAudio };
    "cutEnd": { range: [number, number]; oldAudio: PatcherAudio };
    "deleted": { range: [number, number]; oldAudio: PatcherAudio };
    "silenced": { range: [number, number]; audio: PatcherAudio; oldAudio: PatcherAudio };
    "insertedSilence": { range: [number, number]; audio: PatcherAudio };
    "inversed": { range: [number, number]; audio: PatcherAudio; oldAudio: PatcherAudio };
    "reversed": { range: [number, number]; audio: PatcherAudio; oldAudio: PatcherAudio };
    "faded": { gain: number; range: [number, number]; audio: PatcherAudio; oldAudio: PatcherAudio };
    "fadedIn": { length: number; exponent: number; audio: PatcherAudio; oldAudio: PatcherAudio };
    "fadedOut": { length: number; exponent: number; audio: PatcherAudio; oldAudio: PatcherAudio };
    "resampled": { audio: PatcherAudio; oldAudio: PatcherAudio };
    "remixed": { audio: PatcherAudio; oldAudio: PatcherAudio };
}

export default class PatcherAudio extends FileInstance<PatcherAudioEventMap> {
    readonly env: Env;
    _history: AudioHistory = new AudioHistory(this);
    get history() {
        return this._history;
    }
    audioBuffer: OperableAudioBuffer;
    waveform: Waveform;

    constructor(envIn: Env) {
        super();
        this.env = envIn;
    }
    get length() {
        return this.audioBuffer.length;
    }
    get numberOfChannels() {
        return this.audioBuffer.numberOfChannels;
    }
    get sampleRate() {
        return this.audioBuffer.sampleRate;
    }
    initSilence(numberOfChannels: number, length: number, sampleRate: number) {
        this.audioBuffer = new OperableAudioBuffer({ length, numberOfChannels, sampleRate });
        this.waveform = new Waveform(this);
        this.waveform.generateEmpty(numberOfChannels, length);
    }
    async init(data: ArrayBuffer) {
        const { audioCtx } = this.env;
        if (data.byteLength) {
            const audioBuffer = await audioCtx.decodeAudioData(data);
            this.audioBuffer = Object.setPrototypeOf(audioBuffer, OperableAudioBuffer.prototype);
        } else {
            this.audioBuffer = new OperableAudioBuffer({ length: 1, numberOfChannels: 1, sampleRate: audioCtx.sampleRate });
        }
        this.waveform = new Waveform(this);
        await this.waveform.generate();
    }
    async initWith(options: Partial<AudioBufferOptions>) {
        const { length = 1, numberOfChannels = 1, sampleRate = this.env.audioCtx.sampleRate } = options;
        this.audioBuffer = new OperableAudioBuffer({ length, numberOfChannels, sampleRate });
        this.waveform = new Waveform(this);
        await this.waveform.generate();
    }
    async serialize(options: Omit<Partial<Options>, "sampleRate"> = { bitDepth: 32, float: true }) {
        return this.env.wavEncoderWorker.encode(getAudioChannelData(this.audioBuffer, true), { sampleRate: this.audioBuffer.sampleRate, bitDepth: 32, float: true, ...options });
    }
    clone() {
        const audio = new PatcherAudio(this.env);
        audio.audioBuffer = this.audioBuffer.clone();
        audio.waveform = this.waveform.clone();
        return audio;
    }
    setAudio(that: { audioBuffer: OperableAudioBuffer, waveform: Waveform }) {
        this.audioBuffer = that.audioBuffer;
        this.waveform = that.waveform;
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
        const audio = new PatcherAudio(this.env);
        audio.audioBuffer = this.audioBuffer.concat(that.audioBuffer, numberOfChannels);
        audio.waveform = this.waveform.concat(that.waveform, audio, numberOfChannels);
        return audio;
    }
    split(from: number): [PatcherAudio, PatcherAudio] {
        const audio1 = new PatcherAudio(this.env);
        const audio2 = new PatcherAudio(this.env);
        const [ab1, ab2] = this.audioBuffer.split(from);
        const [wf1, wf2] = this.waveform.split(from, audio1, audio2);
        audio1.setAudio({ audioBuffer: ab1, waveform: wf1 });
        audio2.setAudio({ audioBuffer: ab2, waveform: wf2 });
        return [audio1, audio2];
    }
    pick(from: number, to: number, clone = false) {
        let picked: PatcherAudio;
        if (from <= 0 && to >= this.length) {
            picked = new PatcherAudio(this.env);
            if (clone) picked.audioBuffer = this.audioBuffer.clone();
            else picked.audioBuffer = this.audioBuffer;
        } else if (from <= 0) {
            picked = this.split(to)[0];
        } else if (to >= this.length) {
            picked = this.split(from)[1];
        } else {
            picked = this.split(to)[0].split(from)[1];
        }
        if (clone) picked.waveform = this.waveform.clone();
        else picked.waveform = this.waveform;
        return picked;
    }
    removeFromRange(from: number, to: number) {
        if (from === 0 && to === this.length) {
            const old = this.clone();
            const { numberOfChannels, sampleRate } = this.audioBuffer;
            this.audioBuffer = new OperableAudioBuffer({ length: 1, numberOfChannels, sampleRate });
            this.waveform = new Waveform(this);
            // this.setCursor(from);
            return old;
        // eslint-disable-next-line no-else-return
        } else if (from === 0) {
            const [p1, p2] = this.split(to);
            this.setAudio(p2);
            return p1;
        } else if (to === this.audioBuffer.length) {
            const [p1, p2] = this.split(from);
            this.setAudio(p1);
            return p2;
        } else {
            const [p0, p3] = this.split(to);
            const [p1, p2] = p0.split(from);
            const concat = p1.concat(p3);
            this.setAudio(concat);
            return p2;
        }
    }
    pasteToRange(that: PatcherAudio, from: number, to: number) {
        if (from <= 0 && to >= this.length) {
            const old = this.clone();
            this.setAudio(that);
            // this.setSelRangeToAll();
            return old;
        // eslint-disable-next-line no-else-return
        } else if (from <= 0) {
            const [p1, p2] = this.split(to);
            const concat = that.concat(p2, p2.numberOfChannels);
            this.setAudio(concat);
            // this.setSelRange([0, newBuffer.length]);
            return p1;
        } else if (to >= this.length) {
            const [p1, p2] = this.split(from);
            const concat = p1.concat(that);
            this.setAudio(concat);
            // this.setSelRange([from, concat.buffer.length]);
            return p2;
        } else {
            const [p, p2] = this.split(to);
            const [p0, old] = p.split(from);
            const p1 = p0.concat(that);
            const concat = p1.concat(p2);
            this.setAudio(concat);
            // this.setSelRange([from, from + newBuffer.length]);
            return old;
        }
    }
    insertToCursor(that: PatcherAudio, cursor: number) {
        if (cursor <= 0) {
            const concat = that.concat(this, this.numberOfChannels);
            this.setAudio(concat);
            // this.setSelRange([0, newBuffer.length]);
        } else if (cursor >= this.length) {
            const concat = this.concat(that);
            this.setAudio(concat);
            // this.setSelRange([cursor, cursor + concat.buffer.length]);
        } else {
            const [p0, p2] = this.split(cursor);
            const p1 = p0.concat(that);
            const concat = p1.concat(p2);
            this.setAudio(concat);
            // this.setSelRange([cursor, cursor + newBuffer.length]);
        }
    }
    write(channel: number, index: number, value: number) {
        this.audioBuffer.write(channel, index, value);
        this.waveform.update(index, index + 1);
    }
}
