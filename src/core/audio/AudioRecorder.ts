import OperableAudioBuffer from "./OperableAudioBuffer";
import PatcherAudio from "./PatcherAudio";
import TransmitterNode from "../worklets/Transmitter";
import AudioEditor from "./AudioEditor";

export default class AudioRecorder {
    readonly editor: AudioEditor;
    device: string;
    stream: MediaStream;
    constraints: MediaTrackConstraintSet = { echoCancellation: false, noiseSuppression: false, autoGainControl: false };
    node: MediaStreamAudioSourceNode;
    transmitter: TransmitterNode;
    overwrittenAudio: PatcherAudio;
    recording = false;
    $: number;
    $start: number;
    $end: number;
    inPlace: boolean;
    get audioCtx() {
        return this.editor.audioCtx;
    }
    get audio() {
        return this.editor;
    }
    constructor(editor: AudioEditor) {
        this.editor = editor;
        navigator.mediaDevices.addEventListener("devicechange", this.handleDeviceChange);
    }
    async init() {
        await TransmitterNode.register(this.audioCtx.audioWorklet);
        this.transmitter = new TransmitterNode(this.audioCtx);
        this.transmitter.handleReceiveBuffer = this.handleReceiveBuffer;
        await this.newSearch();
    }
    async destroy() {
        navigator.mediaDevices.removeEventListener("devicechange", this.handleDeviceChange);
        if (this.recording) await this.stop();
        await this.transmitter.destroy();
    }
    handleDeviceChange = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const enums = devices.filter(d => d.kind === "audioinput").map(d => d.label || d.deviceId);
        if (enums.indexOf(this.device) === -1) {
            this.device = devices.find(d => d.deviceId === "default") ? "default" : devices.length ? devices[0].deviceId : "default";
            await this.newSearch(this.device);
        }
    };
    handleReceiveBuffer = async (bufferIn: Float32Array[], $total: number) => {
        if (!this.recording) return;
        let extended = false;
        const { $, $start, $end, inPlace, audio, overwrittenAudio } = this;
        const { length, numberOfChannels, sampleRate } = audio;
        const $target = $start + $total;
        const copyLength = (inPlace ? Math.min($target, $end) : $target) - $;
        if (!inPlace && $target > length) { // extend current buffer
            const newLength = 2 ** Math.ceil(Math.log(length + sampleRate) / Math.log(2));
            const newBuffer = new OperableAudioBuffer({ numberOfChannels, length: newLength, sampleRate });
            for (let i = 0; i < numberOfChannels; i++) {
                const channel = newBuffer.getChannelData(i);
                channel.set(audio.audioBuffer.getChannelData(i));
                if (bufferIn[i]) {
                    if (overwrittenAudio && $ < $end) {
                        const overwrittenChannel = overwrittenAudio.audioBuffer.getChannelData(i);
                        overwrittenChannel.set(channel.subarray($, $end), $ - $start);
                    }
                    channel.set(bufferIn[i], $);
                }
            }
            audio.audioBuffer = newBuffer;
            audio.waveform.update($, newLength);
            extended = true;
        } else {
            for (let i = 0; i < numberOfChannels; i++) {
                const channel = audio.audioBuffer.getChannelData(i);
                if (bufferIn[i]) {
                    if (overwrittenAudio && $ < $end) {
                        const overwrittenChannel = overwrittenAudio.audioBuffer.getChannelData(i);
                        overwrittenChannel.set(channel.subarray($, Math.min($ + copyLength, $end)), $ - $start);
                    }
                    if (!inPlace || $target <= $end) channel.set(bufferIn[i], $);
                    else channel.set(bufferIn[i].subarray(0, copyLength), $);
                }
            }
            audio.waveform.update($, $ + copyLength);
        }
        this.$ += copyLength;
        audio.emit("setAudio");
        this.editor.setCursor(this.$);
        if (extended) this.editor.setViewRange([this.editor.state.viewRange[0], this.audio.length]);
        if (inPlace && this.$ === $end) {
            this.editor.setRecording(false);
            await this.stop();
        }
    };
    newSearch = async (search?: string) => {
        if (this.device && this.device === search) return;
        if (this.stream && (this.recording || this.editor.player.monitoring)) {
            this.node.disconnect();
            this.stream.getAudioTracks().forEach(t => t.stop());
            delete this.node;
            delete this.stream;
            delete this.editor.player.mediaStreamSourceNode;
        }
        const devices = await navigator.mediaDevices.enumerateDevices();
        const enums = devices.filter(d => d.kind === "audioinput");
        if (search) {
            const device = devices.find(d => d.kind === "audioinput" && (d.deviceId === search || d.label === search));
            if (device) this.device = device.deviceId;
        } else {
            this.device = enums.length ? enums[0].deviceId : undefined;
        }
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: this.getConstraints(this.device) });
        if (this.stream) {
            if (this.recording || this.editor.player.monitoring) {
                this.resetNode();
                this.node.connect(this.transmitter);
                if (this.editor.player.monitoring) this.node.connect(this.editor.player.preFxGainNode);
                else this.node.connect(this.editor.player.postAnalyserNode);
            } else {
                this.resetNode();
            }
        }
    };
    getConstraints(deviceId?: string): MediaTrackConstraintSet {
        return {
            deviceId,
            sampleRate: this.editor.sampleRate || this.audioCtx.sampleRate,
            channelCount: this.editor.numberOfChannels || undefined,
            ...this.constraints
        };
    }
    resetNode() {
        if (this.stream) {
            this.node = this.audioCtx.createMediaStreamSource(this.stream);
            this.node.channelInterpretation = "discrete";
        }
    }
    async start() {
        if (!this.node) return false;
        this.node.connect(this.transmitter);
        if (!this.editor.player.monitoring) this.node.connect(this.editor.player.postAnalyserNode);
        const { state, ctx, length, numberOfChannels, sampleRate } = this.editor;
        const { cursor, selRange } = state;
        if (selRange) {
            const [$start, $end] = selRange;
            this.inPlace = true;
            this.$start = $start;
            this.$end = $end;
            this.$ = $start;
        } else {
            this.inPlace = false;
            this.$start = cursor;
            this.$end = length;
            this.$ = cursor;
        }
        const overwrittenBufferLength = this.$end - this.$start;
        if (overwrittenBufferLength) this.overwrittenAudio = await PatcherAudio.fromSilence(ctx, numberOfChannels, overwrittenBufferLength, sampleRate);
        else this.overwrittenAudio = undefined;
        this.recording = true;
        await this.transmitter.reset();
        await this.transmitter.start();
        return true;
    }
    async stop() {
        this.recording = false;
        if (!this.node) return;
        if (!this.editor.player.monitoring) this.node.disconnect(this.editor.player.postAnalyserNode);
        await this.transmitter.stop();
        if (!this.inPlace && this.$ > this.$end && this.$ < this.audio.length) {
            const [audio] = await this.audio.split(this.$);
            this.audio.setAudio(audio);
            if (this.overwrittenAudio) this.overwrittenAudio.waveform.update();
        } else {
            if (this.overwrittenAudio) {
                if (this.$ < this.$end) {
                    const [audio] = await this.overwrittenAudio.split(this.$ - this.$start);
                    this.overwrittenAudio.setAudio(audio);
                } else {
                    this.overwrittenAudio.waveform.update();
                }
            }
        }
        const audio = await this.audio.pick(this.$start, this.$, true);
        this.editor.emit("recorded", { range: (this.inPlace || this.overwrittenAudio) ? [this.$start, this.$] : undefined, cursor: (this.inPlace || this.overwrittenAudio) ? undefined : this.$start, audio, oldAudio: this.overwrittenAudio });
        this.editor.setSelRange([this.$start, this.$]);
    }
}
