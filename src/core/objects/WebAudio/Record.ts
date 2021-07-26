import JSPAudioNode from "./AudioNode";
import TransmitterNode from "../../worklets/Transmitter";
import PatcherAudio from "../../audio/PatcherAudio";
import OperableAudioBuffer from "../../audio/OperableAudioBuffer";
import { IJSPatcherObjectMeta, IPropsMeta } from "../base/AbstractObject";

type I = [boolean | number | PatcherAudio, boolean, number, number];
interface P {
    mono: boolean;
    channelOffset: number;
    loop: boolean;
    loopStart: number;
    loopEnd: number;
    append: boolean;
}
interface S {
    dummyNode: ConstantSourceNode;
    node: TransmitterNode;
    audio: PatcherAudio;
    // overwrittenAudio: PatcherAudio;
    recording: boolean;
    $: number;
    $start: number;
    $end: number;
    inPlace: boolean;
}

export default class Record extends JSPAudioNode<TransmitterNode, S, I, [number], [], P> {
    static description = "Record audio into an audio buffer";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "signal to record, boolean/number to start/stop, AudioBuffer/PatcherAudio to set buffer"
    }, {
        isHot: false,
        type: "boolean",
        description: "loop"
    }, {
        isHot: false,
        type: "number",
        description: "loopStart (seconds)"
    }, {
        isHot: false,
        type: "number",
        description: "loopEnd (seconds)"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "number",
        description: "sample index writted"
    }];
    static props: IPropsMeta<P> = {
        mono: {
            type: "boolean",
            default: false,
            description: "Record only one channel"
        },
        channelOffset: {
            type: "number",
            default: 0,
            description: "Record into channels with offset"
        },
        loop: {
            type: "boolean",
            default: false,
            description: "Initial loop, Indicates if the region of audio data designated by loopStart and loopEnd should be played continuously in a loop"
        },
        loopStart: {
            type: "number",
            default: 0,
            description: "An optional playhead position where looping should begin if the loop attribute is true. If <=0 or > duration, loop will end at the end of the buffer."
        },
        loopEnd: {
            type: "number",
            default: 0,
            description: "An optional playhead position where looping should end if the loop attribute is true. If <=0 or > duration, loop will end at the end of the buffer."
        },
        append: {
            type: "boolean",
            default: false,
            description: "Allows buffer to growth when recording exceeds the end."
        }
    };
    state: S = {
        node: undefined,
        audio: undefined,
        dummyNode: this.audioCtx.createConstantSource(),
        // overwrittenAudio: undefined,
        recording: false,
        $: 0,
        $start: 0,
        $end: 0,
        inPlace: true
    };
    handleReceiveBuffer = async (bufferIn: Float32Array[], $total: number) => {
        if (!this.state.recording) return;
        const { $, audio } = this.state;
        const { length, numberOfChannels, sampleRate } = audio;
        const mono = this.getProp("mono");
        const channelOffset = this.getProp("channelOffset");
        const loop = this.getProp("loop");
        const append = this.getProp("append");
        const $start = loop ? this.getProp("loopStart") : 0;
        if ($start >= length) return;
        const $end = loop ? Math.max($start, this.getProp("loopEnd")) : length;
        if ($end === $start) return;
        const range = $end - $start;
        const bufferSize = bufferIn[0].length;
        if (mono) bufferIn.splice(1);
        if (channelOffset) bufferIn.unshift(...new Array(channelOffset));
        const $target = $ + bufferSize;
        if (append && !loop && $target > $end) { // extend current buffer
            const newLength = 2 ** Math.ceil(Math.log(length + sampleRate) / Math.log(2));
            const newBuffer = new OperableAudioBuffer({ numberOfChannels, length: newLength, sampleRate });
            for (let i = 0; i < numberOfChannels; i++) {
                const channel = newBuffer.getChannelData(i);
                channel.set(audio.audioBuffer.getChannelData(i));
                if (bufferIn[i]) channel.set(bufferIn[i], $);
            }
            audio.audioBuffer = newBuffer;
            audio.waveform.update($, newLength);
            this.setState({ $: $target });
        } else {
            for (let i = 0; i < numberOfChannels; i++) {
                const channel = audio.audioBuffer.getChannelData(i);
                if (bufferIn[i]) {
                    if ($target > $end) {
                        if (loop) {
                            const $copyEnd = $start + (($ - $start + bufferSize) % range);
                            const buffer = bufferSize > range ? bufferIn[i].subarray(bufferSize - range) : bufferIn[i];
                            const $sSplit = buffer.length - ($copyEnd - $start);
                            channel.set(buffer.subarray($sSplit), $start);
                            channel.set(buffer.subarray(0, $sSplit), $);
                            this.setState({ $: $copyEnd });
                            audio.waveform.update($, $end);
                            audio.waveform.update($start, $copyEnd);
                        } else {
                            channel.set(bufferIn[i].subarray(0, $end - $), $);
                            this.setState({ $: $end });
                            audio.waveform.update($, $end);
                        }
                    } else {
                        channel.set(bufferIn[i], $);
                        this.setState({ $: $target });
                        audio.waveform.update($, $target);
                    }
                }
            }
        }
        audio.emit("setAudio");
        audio.emit("changed");
        this.outlet(0, this.state.$);
        if (!append && !loop && this.state.$ === $end) {
            await this.stop();
        }
    };
    async start() {
        if (!this.node) return false;
        this.setState({ $: this.getProp("loop") ? this.getProp("loopStart") : 0 });
        this.setState({ recording: true });
        await this.node.reset();
        await this.node.start();
        return true;
    }
    async stop() {
        this.setState({ recording: false });
        if (!this.node) return;
        await this.node.stop();
        const { inPlace, $, $end } = this.state;
        if (!inPlace && $ > $end && $ < this.state.audio.length) {
            const [audio] = await this.state.audio.split($);
            this.state.audio.setAudio(audio);
        }
    }
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 4;
            this.outlets = 1;
        });
        this.on("postInit", async () => {
            await TransmitterNode.register(this.audioCtx.audioWorklet);
            const node = new TransmitterNode(this.audioCtx);
            node.handleReceiveBuffer = this.handleReceiveBuffer;
            this.node = node;
            this.state.dummyNode.offset.value = 0;
            this.state.dummyNode.connect(this.node);
            this.state.dummyNode.start();
            this.disconnectAudioInlet();
            this.inletAudioConnections = [{ node: this.node, index: 0 }];
            this.setState({ node });
            this.connectAudioInlet();
        });
        this.on("inlet", async ({ data, inlet }) => {
            if (inlet === 0) {
                if (typeof data === "boolean" || typeof data === "number") {
                    if (data) {
                        if (!this.state.recording) {
                            await this.start();
                        }
                    } else {
                        if (this.state.recording) {
                            await this.stop();
                        }
                    }
                } else if (data instanceof PatcherAudio) {
                    this.setState({ audio: data });
                }
            } else if (inlet === 1) {
                if (typeof data === "boolean" || typeof data === "number") {
                    this.setProps({ loop: !!data });
                }
            } else if (inlet === 2) {
                if (typeof data === "number") {
                    this.setProps({ loopStart: data });
                }
            } else if (inlet === 3) {
                if (typeof data === "number") {
                    this.setProps({ loopEnd: data });
                }
            }
        });
        this.on("destroy", async () => {
            this.state.dummyNode.disconnect();
            if (this.state.recording) await this.stop();
            await this.node.destroy();
        });
    }
}
