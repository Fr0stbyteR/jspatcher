import TransmitterNode from "../../worklets/Transmitter";
import PatcherAudio from "../../audio/PatcherAudio";
import OperableAudioBuffer from "../../audio/OperableAudioBuffer";
import DefaultObject from "../base/DefaultObject";
import type { IInletsMeta, IOutletsMeta, IPropsMeta } from "../base/AbstractObject";

type I = [boolean | number | PatcherAudio, boolean, number, number];
interface P {
    mono: boolean;
    channelOffset: number;
    loop: boolean;
    loopStart: number;
    loopEnd: number;
    append: boolean;
}
interface IS {
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

export default class Record extends DefaultObject<{}, {}, I, [number], [], P> {
    static description = "Record audio into an audio buffer";
    static icon = "volume up" as const;
    static inlets: IInletsMeta = [{
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
    static outlets: IOutletsMeta = [{
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
    set node(nodeIn: TransmitterNode) {
        this._.node = nodeIn;
    }
    get node() {
        return this._.node;
    }
    _: IS = {
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
        if (!this._.recording) return;
        const { $, audio } = this._;
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
            this._.$ = $target;
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
                            this._.$ = $copyEnd;
                            audio.waveform.update($, $end);
                            audio.waveform.update($start, $copyEnd);
                        } else {
                            channel.set(bufferIn[i].subarray(0, $end - $), $);
                            this._.$ = $end;
                            audio.waveform.update($, $end);
                        }
                    } else {
                        channel.set(bufferIn[i], $);
                        this._.$ = $target;
                        audio.waveform.update($, $target);
                    }
                }
            }
        }
        audio.emit("setAudio");
        audio.emit("changed");
        this.outlet(0, this._.$);
        if (!append && !loop && this._.$ === $end) {
            await this.stop();
        }
    };
    async start() {
        if (!this.node) return false;
        this._.$ = this.getProp("loop") ? this.getProp("loopStart") : 0;
        this._.recording = true;
        await this.node.reset();
        await this.node.start();
        return true;
    }
    async stop() {
        this._.recording = false;
        if (!this.node) return;
        await this.node.stop();
        const { inPlace, $, $end } = this._;
        if (!inPlace && $ > $end && $ < this._.audio.length) {
            const [audio] = await this._.audio.split($);
            this._.audio.setAudio(audio);
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
            this._.dummyNode.offset.value = 0;
            this._.dummyNode.connect(this.node);
            this._.dummyNode.start();
            this.disconnectAudioInlet();
            this.inletAudioConnections = [{ node: this.node, index: 0 }];
            this._.node = node;
            this.connectAudioInlet();
        });
        this.on("inlet", async ({ data, inlet }) => {
            if (inlet === 0) {
                if (typeof data === "boolean" || typeof data === "number") {
                    if (data) {
                        if (!this._.recording) {
                            await this.start();
                        }
                    } else {
                        if (this._.recording) {
                            await this.stop();
                        }
                    }
                } else if (data instanceof PatcherAudio) {
                    this._.audio = data;
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
            this._.dummyNode.disconnect();
            if (this._.recording) await this.stop();
            await this.node.destroy();
        });
    }
}
