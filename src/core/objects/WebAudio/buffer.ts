import { SemanticICONS } from "semantic-ui-react";
import { DefaultObject, Bang } from "../Base";
import { TMeta } from "../../types";

export default class Buffer extends DefaultObject<{}, { key: string; value: AudioBuffer }, [Bang | File | ArrayBuffer, File | ArrayBuffer, string | number], [AudioBuffer], [string | number, number, number, number]> {
    static package = "WebAudio";
    static icon: SemanticICONS = "volume up";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Audio File Decoder";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Bang to output stored buffer, file to decode, store the buffer then output it."
    }, {
        isHot: false,
        type: "anything",
        description: "File to decode, store the buffer."
    }, {
        isHot: false,
        type: "anything",
        description: "Set variable name."
    }];
    static outlets: TMeta["outlets"] = [{
        type: "anything",
        description: "AudioBuffer"
    }];
    static args: TMeta["args"] = [{
        type: "anything",
        optional: true,
        description: "Variable name"
    }, {
        type: "number",
        optional: true,
        description: "Initialize buffer's number of channels"
    }, {
        type: "number",
        optional: true,
        description: "Initialize buffer's length in samples"
    }, {
        type: "number",
        optional: true,
        description: "Initialize buffer's sample rate"
    }];
    state = { key: undefined as string, value: undefined as AudioBuffer };
    subscribe() {
        super.subscribe();
        const sharedDataKey = "_buffer";
        const createBuffer = () => {
            const { args } = this.box;
            const { audioCtx } = this.patcher.env;
            const channels = typeof args[1] === "number" ? ~~args[1] : 1;
            const samples = typeof args[2] === "number" ? ~~args[2] : 1;
            const sampleRate = typeof args[3] === "number" ? ~~args[3] : audioCtx.sampleRate;
            return this.patcher.env.audioCtx.createBuffer(channels, samples, sampleRate);
        };
        const assertBuffer = (buffer: AudioBuffer) => {
            if (!buffer) return false;
            const { args } = this.box;
            const { audioCtx } = this.patcher.env;
            const channels = typeof args[1] === "number" ? ~~args[1] : 1;
            const samples = typeof args[2] === "number" ? ~~args[2] : 1;
            const sampleRate = typeof args[3] === "number" ? ~~args[3] : audioCtx.sampleRate;
            return buffer.numberOfChannels === channels && buffer.length !== samples && buffer.sampleRate !== sampleRate;
        };
        const reload = (key: string) => {
            if (this.state.key) this.sharedData.unsubscribe(sharedDataKey, this.state.key, this);
            this.state.key = key;
            if (key) {
                const shared = this.sharedData.get(sharedDataKey, key);
                if (assertBuffer(shared) && shared instanceof AudioBuffer) {
                    this.state.value = shared;
                } else {
                    this.state.value = createBuffer();
                    this.sharedData.set(sharedDataKey, key, this.state.value, this);
                }
                this.sharedData.subscribe(sharedDataKey, this.state.key, this);
            } else if (!assertBuffer(this.state.value)) {
                this.state.value = createBuffer();
            }
        };
        this.on("preInit", () => {
            this.inlets = 3;
            this.outlets = 1;
        });
        this.on("updateArgs", (args) => {
            const key = typeof args[0] === "undefined" ? args[0] : args[0].toString();
            if (key !== this.state.key || !assertBuffer(this.state.value)) {
                reload(key);
            }
        });
        this.on("inlet", async ({ data, inlet }) => {
            if (inlet === 0) {
                if (!(data instanceof Bang)) {
                    let audioBuffer: AudioBuffer;
                    try {
                        const ab = data instanceof ArrayBuffer ? data : await (data as File).arrayBuffer();
                        audioBuffer = await this.patcher.env.audioCtx.decodeAudioData(ab);
                    } catch (e) {
                        this.error("Decode File failed.");
                        return;
                    }
                    this.state.value = audioBuffer;
                    if (this.state.key) this.sharedData.set(sharedDataKey, this.state.key, this.state.value, this);
                }
                this.outlet(0, this.state.value);
            } else if (inlet === 1) {
                let audioBuffer: AudioBuffer;
                try {
                    const ab = data instanceof ArrayBuffer ? data : await (data as File).arrayBuffer();
                    audioBuffer = await this.patcher.env.audioCtx.decodeAudioData(ab);
                } catch (e) {
                    this.error("Decode File failed.");
                    return;
                }
                this.state.value = audioBuffer;
                if (this.state.key) this.sharedData.set(sharedDataKey, this.state.key, this.state.value, this);
            } else if (inlet === 2) {
                if (typeof data === "string" || typeof data === "number") {
                    const key = data.toString() || "";
                    if (key !== this.state.key) {
                        reload(key);
                    }
                }
            }
        });
        this.on("sharedDataUpdated", ({ data }) => this.state.value = data);
        this.on("destroy", () => {
            if (this.state.key) this.sharedData.unsubscribe(sharedDataKey, this.state.key, this);
        });
    }
}
