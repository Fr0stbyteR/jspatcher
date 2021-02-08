import { SemanticICONS } from "semantic-ui-react";
import { DefaultObject, Bang, isBang } from "../Base";
import AudioFile from "../../audio/AudioFile";
import TempAudioFile from "../../audio/TempAudioFile";
import PatcherAudio from "../../audio/PatcherAudio";
import { TMeta } from "../../types";
import { ProjectItemEventMap } from "../../file/ProjectItem";

interface BufferState {
    key: string;
    value: PatcherAudio;
    sharedItem: AudioFile | TempAudioFile;
    numberOfChannels: number;
    length: number;
    sampleRate: number;
}

export default class Buffer extends DefaultObject<{}, BufferState, [Bang | File | ArrayBuffer | AudioBuffer | PatcherAudio, File | ArrayBuffer | AudioBuffer | PatcherAudio, string | number], [PatcherAudio], [string | number, number, number, number]> {
    static package = "WebAudio";
    static icon: SemanticICONS = "volume up";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Audio File Decoder";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Bang to output stored buffer, file to decode, AudioBuffer or PatcherAudio to store then output it as PatcherAudio."
    }, {
        isHot: false,
        type: "anything",
        description: "File to decode, AudioBuffer or PatcherAudio to store the buffer."
    }, {
        isHot: false,
        type: "anything",
        description: "Set variable name."
    }];
    static outlets: TMeta["outlets"] = [{
        type: "anything",
        description: "PatcherAudio"
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
    state: BufferState = { key: this.box.args[0]?.toString(), value: undefined, sharedItem: undefined, numberOfChannels: 1, length: this.audioCtx.sampleRate, sampleRate: this.audioCtx.sampleRate };
    subscribe() {
        super.subscribe();
        const assertBuffer = (audio: PatcherAudio) => {
            if (!audio) return false;
            const { numberOfChannels, length, sampleRate } = this.state;
            return audio.numberOfChannels === numberOfChannels && audio.length === length && audio.sampleRate === sampleRate;
        };
        const handleFilePathChanged = () => {
            this.setState({ key: this.state.sharedItem?.projectPath });
        };
        const handleSaved = async (e: ProjectItemEventMap["saved"]) => {
            if (e === this) return;
            await reload();
        };
        const subsribeItem = async () => {
            const file = this.state.sharedItem;
            if (!file) return;
            await file.addObserver(this);
            file.on("destroyed", reload);
            file.on("nameChanged", handleFilePathChanged);
            file.on("pathChanged", handleFilePathChanged);
            file.on("saved", handleSaved);
        };
        const unsubscribeItem = async () => {
            const file = this.state.sharedItem;
            if (!file) return;
            file.off("destroyed", reload);
            file.off("nameChanged", handleFilePathChanged);
            file.off("pathChanged", handleFilePathChanged);
            file.off("saved", handleSaved);
            await this.state.sharedItem?.removeObserver(this);
        };
        const reload = async () => {
            await unsubscribeItem();
            const { key } = this.state;
            let audio: PatcherAudio;
            try {
                const { item, newItem } = await this.getSharedItem(key, "audio", async () => {
                    const { numberOfChannels, length, sampleRate } = this.state;
                    audio = await PatcherAudio.fromSilence(this.patcher.project, numberOfChannels, length, sampleRate);
                    return audio;
                });
                if (newItem) {
                    audio.file = item;
                } else {
                    audio = await item.instantiate();
                }
                this.setState({ value: audio, sharedItem: item });
            } catch (error) {
                this.error(error);
            } finally {
                await subsribeItem();
            }
        };
        this.on("preInit", () => {
            this.inlets = 3;
            this.outlets = 1;
        });
        this.on("updateArgs", (args) => {
            const oldKey = this.state.key;
            const key = args[0]?.toString();
            const numberOfChannels = typeof args[1] === "number" ? ~~args[1] : 1;
            const length = typeof args[2] === "number" ? ~~args[2] : this.audioCtx.sampleRate;
            const sampleRate = typeof args[3] === "number" ? ~~args[3] : this.audioCtx.sampleRate;
            this.setState({ key, numberOfChannels, length, sampleRate });
            if (key !== oldKey || !assertBuffer(this.state.value)) {
                reload();
            }
        });
        this.on("postInit", reload);
        this.on("inlet", async ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) {
                    if (data instanceof PatcherAudio) {
                        this.state.value.setAudio(data);
                    } else if (data instanceof AudioBuffer) {
                        const audio = await PatcherAudio.fromNativeAudioBuffer(this.patcher.project, data);
                        this.state.value.setAudio(audio);
                    } else {
                        let audioBuffer: AudioBuffer;
                        try {
                            const ab = data instanceof ArrayBuffer ? data : await (data as File).arrayBuffer();
                            audioBuffer = await this.patcher.audioCtx.decodeAudioData(ab);
                        } catch (e) {
                            this.error("Decode File failed.");
                            return;
                        }
                        const audio = await PatcherAudio.fromNativeAudioBuffer(this.patcher.project, audioBuffer);
                        this.state.value.setAudio(audio);
                    }
                }
                this.outlet(0, this.state.value);
            } else if (inlet === 1) {
                if (data instanceof PatcherAudio) {
                    this.state.value.setAudio(data);
                } else if (data instanceof AudioBuffer) {
                    const audio = await PatcherAudio.fromNativeAudioBuffer(this.patcher.project, data);
                    this.state.value.setAudio(audio);
                } else {
                    let audioBuffer: AudioBuffer;
                    try {
                        const ab = data instanceof ArrayBuffer ? data : await (data as File).arrayBuffer();
                        audioBuffer = await this.patcher.audioCtx.decodeAudioData(ab);
                    } catch (e) {
                        this.error("Decode File failed.");
                        return;
                    }
                    const audio = await PatcherAudio.fromNativeAudioBuffer(this.patcher.project, audioBuffer);
                    this.state.value.setAudio(audio);
                }
            } else if (inlet === 2) {
                if (typeof data === "string" || typeof data === "number") {
                    this.setState({ key: data?.toString() });
                    reload();
                }
            }
        });
        this.on("destroy", unsubscribeItem);
    }
}
