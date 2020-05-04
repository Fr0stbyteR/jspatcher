import { SemanticICONS } from "semantic-ui-react";
import { DefaultObject, Bang } from "../Base";
import { TMeta } from "../../types";
import { SharedDataNoValue } from "../../../utils/symbols";

export default class Buffer extends DefaultObject<{}, { key: string; value: AudioBuffer }, [Bang | File | ArrayBuffer, File | ArrayBuffer, string | number], [AudioBuffer], [string, number]> {
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
    }];
    state = { key: undefined as string, value: SharedDataNoValue as any };
    subscribe() {
        super.subscribe();
        const sharedDataKey = "_buffer";
        const reload = () => {
            if (this.state.key) this.sharedData.unsubscribe(sharedDataKey, this.state.key, this);
            const { args } = this.box;
            if (typeof args[0] === "string" || typeof args[0] === "undefined") this.state.key = args[0];
            if (typeof args[1] !== "undefined") this.state.value = args[1];
            const { key } = this.state;
            if (key) {
                const shared = this.sharedData.get(sharedDataKey, key);
                if (shared !== SharedDataNoValue && shared instanceof AudioBuffer) this.state.value = shared;
                else this.sharedData.set(sharedDataKey, key, this.state.value, this);
                this.sharedData.subscribe(sharedDataKey, this.state.key, this);
            }
        };
        this.on("preInit", () => {
            this.inlets = 3;
            this.outlets = 1;
        });
        this.on("updateArgs", (args) => {
            if (typeof args[0] === "string" || typeof args[0] === "undefined") {
                const key = args[0];
                if (key !== this.state.key) {
                    reload();
                } else {
                    if (typeof args[1] !== "undefined") {
                        this.state.value = args[1];
                        if (this.state.key) this.sharedData.set(sharedDataKey, this.state.key, this.state.value, this);
                    }
                }
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
                    const key = data || "";
                    if (key !== this.state.key) {
                        reload();
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
