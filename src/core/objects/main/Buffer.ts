import PatcherAudio from "../../audio/PatcherAudio";
import Bang, { isBang } from "../base/Bang";
import DefaultObject from "../base/DefaultObject";
import BufferUI, { BufferUIState } from "./BufferUI";
import type { ProjectFileEventMap } from "../../file/AbstractProjectFile";
import type PersistentProjectFile from "../../file/PersistentProjectFile";
import type TempAudioFile from "../../audio/TempAudioFile";
import type { IArgsMeta, IInletsMeta, IOutletsMeta } from "../base/AbstractObject";

interface IS {
    key: string;
    audio: PatcherAudio;
    file: PersistentProjectFile | TempAudioFile;
    numberOfChannels: number;
    length: number;
    sampleRate: number;
}

export default class Buffer extends DefaultObject<{}, {}, [Bang | File | ArrayBuffer | AudioBuffer | PatcherAudio, File | ArrayBuffer | AudioBuffer | PatcherAudio, string | number], [PatcherAudio, Bang], [string | number, number, number, number], {}, BufferUIState> {
    static package = "WebAudio";
    static icon = "volume up" as const;
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Audio File Decoder";
    static inlets: IInletsMeta = [{
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
    static outlets: IOutletsMeta = [{
        type: "anything",
        description: "PatcherAudio"
    }, {
        type: "bang",
        description: "Output a bang while the PatcherAudio buffer object is loaded/changed."
    }];
    static args: IArgsMeta = [{
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
    static UI = BufferUI;
    _: IS = { key: this.box.args[0]?.toString(), audio: undefined, file: undefined, numberOfChannels: 1, length: this.audioCtx.sampleRate, sampleRate: this.audioCtx.sampleRate };
    subscribe() {
        super.subscribe();
        const assertBuffer = (audio: PatcherAudio) => {
            if (!audio) return false;
            const { numberOfChannels, length, sampleRate } = this._;
            return audio.numberOfChannels === numberOfChannels && audio.length === length && audio.sampleRate === sampleRate;
        };
        const handleFilePathChanged = () => {
            this._.key = this._.file?.projectPath;
        };
        const handleSaved = async (e: ProjectFileEventMap["saved"]) => {
            if (e.instance === this._.audio) return;
            await reload();
        };
        const subsribeItem = async () => {
            const { audio, file } = this._;
            await audio.addObserver(this);
            if (file) {
                file.on("destroyed", reload);
                file.on("nameChanged", handleFilePathChanged);
                file.on("pathChanged", handleFilePathChanged);
                file.on("saved", handleSaved);
            }
        };
        const unsubscribeItem = async () => {
            const { audio, file } = this._;
            if (file) {
                file.off("destroyed", reload);
                file.off("nameChanged", handleFilePathChanged);
                file.off("pathChanged", handleFilePathChanged);
                file.off("saved", handleSaved);
            }
            await audio.removeObserver(this);
        };
        const reload = async () => {
            if (this._.audio) await unsubscribeItem();
            const { key } = this._;
            let audio: PatcherAudio;
            try {
                const { item, newItem } = await this.getSharedItem(key, "audio", async () => {
                    const { numberOfChannels, length, sampleRate } = this._;
                    audio = await PatcherAudio.fromSilence({ env: this.env, project: this.patcher.project }, numberOfChannels, length, sampleRate);
                    return audio;
                });
                if (newItem) {
                    audio.file = item;
                } else {
                    audio = await item.instantiate({ env: this.env, project: this.patcher.project }) as PatcherAudio;
                }
                this._.audio = audio;
                this._.file = item;
                this.updateUI({ audio });
            } catch (error) {
                this.error(error);
            } finally {
                await subsribeItem();
                this.outlet(1, new Bang());
            }
        };
        this.on("preInit", () => {
            this.inlets = 3;
            this.outlets = 2;
        });
        this.on("updateArgs", (args) => {
            if (!this._.audio) return;
            const oldKey = this._.key;
            const key = args[0]?.toString();
            const numberOfChannels = typeof args[1] === "number" ? ~~args[1] : 1;
            const length = typeof args[2] === "number" ? ~~args[2] : this.audioCtx.sampleRate;
            const sampleRate = typeof args[3] === "number" ? ~~args[3] : this.audioCtx.sampleRate;
            Object.assign(this._, { key, numberOfChannels, length, sampleRate });
            if (key !== oldKey || !assertBuffer(this._.audio)) {
                reload();
            }
        });
        this.on("postInit", reload);
        this.on("inlet", async ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) {
                    if (data instanceof PatcherAudio) {
                        this._.audio.setAudio(data);
                    } else if (data instanceof AudioBuffer) {
                        const audio = await PatcherAudio.fromNativeAudioBuffer({ env: this.env, project: this.patcher.project }, data);
                        this._.audio.setAudio(audio);
                    } else {
                        let audioBuffer: AudioBuffer;
                        try {
                            const ab = data instanceof ArrayBuffer ? data : await (data as File).arrayBuffer();
                            audioBuffer = await this.patcher.audioCtx.decodeAudioData(ab);
                        } catch (e) {
                            this.error("Decode File failed.");
                            return;
                        }
                        const audio = await PatcherAudio.fromNativeAudioBuffer({ env: this.env, project: this.patcher.project }, audioBuffer);
                        this._.audio.setAudio(audio);
                    }
                }
                this.outlet(0, this._.audio);
            } else if (inlet === 1) {
                if (data instanceof PatcherAudio) {
                    this._.audio.setAudio(data);
                } else if (data instanceof AudioBuffer) {
                    const audio = await PatcherAudio.fromNativeAudioBuffer({ env: this.env, project: this.patcher.project }, data);
                    this._.audio.setAudio(audio);
                } else {
                    let audioBuffer: AudioBuffer;
                    try {
                        const ab = data instanceof ArrayBuffer ? data : await (data as File).arrayBuffer();
                        audioBuffer = await this.patcher.audioCtx.decodeAudioData(ab);
                    } catch (e) {
                        this.error("Decode File failed.");
                        return;
                    }
                    const audio = await PatcherAudio.fromNativeAudioBuffer({ env: this.env, project: this.patcher.project }, audioBuffer);
                    this._.audio.setAudio(audio);
                }
            } else if (inlet === 2) {
                if (typeof data === "string" || typeof data === "number") {
                    this._.key = data?.toString();
                    reload();
                }
            }
        });
        this.on("destroy", unsubscribeItem);
    }
}
