import * as React from "react";
import { Modal, SemanticICONS, StrictModalProps } from "semantic-ui-react";
import AudioFile from "../../audio/AudioFile";
import TempAudioFile from "../../audio/TempAudioFile";
import PatcherAudio from "../../audio/PatcherAudio";
import AudioEditor from "../../audio/AudioEditor";
import AudioEditorUI from "../../../components/editors/audio/AudioEditorUI";
import { DefaultObject, Bang, isBang } from "../Base";
import { TMeta } from "../../types";
import { ProjectItemEventMap } from "../../file/ProjectItem";
import { BaseUIState, DefaultPopupUI, DefaultPopupUIState } from "../BaseUI";

interface BufferUIState {
    audio: PatcherAudio;
    timestamp: number;
    editor: AudioEditor;
}

export class BufferUI extends DefaultPopupUI<Buffer, {}, BufferUIState> {
    state: BufferUIState & DefaultPopupUIState = {
        ...this.state,
        audio: this.object.state.audio,
        timestamp: performance.now(),
        editor: undefined
    };
    static dockable = true;
    handleChanged = () => {
        if (this.state.editor.isTemporary) this.state.editor.save();
    };
    handleDoubleClick = async () => {
        if (!this.editor.state.locked) return;
        if (!this.state.audio) return;
        if (this.state.editor) {
            this.state.editor.off("changed", this.handleChanged);
            await this.state.editor.destroy();
        }
        const editor = new AudioEditor(this.object.state.audio);
        await editor.init();
        editor.on("changed", this.handleChanged);
        this.setState({ modalOpen: true, timestamp: performance.now(), editor }, () => this.state.editor.setActive());
    };
    handleClose = () => {
        if (this.state.editor) {
            this.state.editor.off("changed", this.handleChanged);
            this.state.editor.destroy();
        }
        this.setState({ modalOpen: false, timestamp: performance.now(), editor: undefined }, () => this.props.editor.setActive());
    };
    handleMouseDownModal = (e: React.MouseEvent) => e.stopPropagation();
    componentDidMount() {
        super.componentDidMount();
    }
    componentDidUpdate(prevProps: any, prevState: Readonly<BufferUIState & BaseUIState>) {
        if (prevState.audio !== this.state.audio) {
            if (this.state.editor) {
                this.state.editor.off("changed", this.handleChanged);
                this.state.editor.destroy();
                this.setState({ modalOpen: false, timestamp: performance.now(), editor: undefined });
            }
        }
    }
    componentWillUnmount() {
        this.state.editor?.off("changed", this.handleChanged);
        super.componentWillUnmount();
    }
    render() {
        const content = <div className="editor-container" style={{ height: "100%", width: "100%", display: "flex", position: "relative" }}>
            {
                this.state.editor
                    ? <AudioEditorUI key={this.state.timestamp} editor={this.state.editor} env={this.props.object.patcher.env} lang={this.props.object.patcher.env.language} />
                    : undefined
            }
        </div>;
        const children = (
            <Modal.Content style={{ height: "100%", width: "100%", position: "relative" }} onMouseDown={this.handleMouseDownModal}>
                {content}
            </Modal.Content>
        );
        if (this.props.inDock) return children;
        const containerProps = { ...this.props.containerProps };
        if (!containerProps.onDoubleClick) containerProps.onDoubleClick = this.handleDoubleClick;
        const modalProps: StrictModalProps & { onKeyDown: any } = { ...this.props.modalProps, children, className: "audio-editor", open: this.state.modalOpen, onClose: this.handleClose, onKeyDown: undefined, basic: true, size: "fullscreen", closeIcon: true };
        return <DefaultPopupUI {...this.props} modalProps={modalProps} containerProps={containerProps} />;
    }
}

interface BufferState {
    key: string;
    audio: PatcherAudio;
    file: AudioFile | TempAudioFile;
    numberOfChannels: number;
    length: number;
    sampleRate: number;
}

export default class Buffer extends DefaultObject<{}, BufferState, [Bang | File | ArrayBuffer | AudioBuffer | PatcherAudio, File | ArrayBuffer | AudioBuffer | PatcherAudio, string | number], [PatcherAudio, Bang], [string | number, number, number, number], {}, BufferUIState> {
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
    }, {
        type: "bang",
        description: "Output a bang while the PatcherAudio buffer object is loaded/changed."
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
    static UI = BufferUI;
    state: BufferState = { key: this.box.args[0]?.toString(), audio: undefined, file: undefined, numberOfChannels: 1, length: this.audioCtx.sampleRate, sampleRate: this.audioCtx.sampleRate };
    subscribe() {
        super.subscribe();
        const assertBuffer = (audio: PatcherAudio) => {
            if (!audio) return false;
            const { numberOfChannels, length, sampleRate } = this.state;
            return audio.numberOfChannels === numberOfChannels && audio.length === length && audio.sampleRate === sampleRate;
        };
        const handleFilePathChanged = () => {
            this.setState({ key: this.state.file?.projectPath });
        };
        const handleSaved = async (e: ProjectItemEventMap["saved"]) => {
            if (e.instance === this.state.audio) return;
            await reload();
        };
        const subsribeItem = async () => {
            const { audio, file } = this.state;
            await audio.addObserver(this);
            if (file) {
                file.on("destroyed", reload);
                file.on("nameChanged", handleFilePathChanged);
                file.on("pathChanged", handleFilePathChanged);
                file.on("saved", handleSaved);
            }
        };
        const unsubscribeItem = async () => {
            const { audio, file } = this.state;
            if (file) {
                file.off("destroyed", reload);
                file.off("nameChanged", handleFilePathChanged);
                file.off("pathChanged", handleFilePathChanged);
                file.off("saved", handleSaved);
            }
            await audio.removeObserver(this);
        };
        const reload = async () => {
            if (this.state.audio) await unsubscribeItem();
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
                this.setState({ audio, file: item });
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
            if (!this.state.audio) return;
            const oldKey = this.state.key;
            const key = args[0]?.toString();
            const numberOfChannels = typeof args[1] === "number" ? ~~args[1] : 1;
            const length = typeof args[2] === "number" ? ~~args[2] : this.audioCtx.sampleRate;
            const sampleRate = typeof args[3] === "number" ? ~~args[3] : this.audioCtx.sampleRate;
            this.setState({ key, numberOfChannels, length, sampleRate });
            if (key !== oldKey || !assertBuffer(this.state.audio)) {
                reload();
            }
        });
        this.on("postInit", reload);
        this.on("inlet", async ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) {
                    if (data instanceof PatcherAudio) {
                        this.state.audio.setAudio(data);
                    } else if (data instanceof AudioBuffer) {
                        const audio = await PatcherAudio.fromNativeAudioBuffer(this.patcher.project, data);
                        this.state.audio.setAudio(audio);
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
                        this.state.audio.setAudio(audio);
                    }
                }
                this.outlet(0, this.state.audio);
            } else if (inlet === 1) {
                if (data instanceof PatcherAudio) {
                    this.state.audio.setAudio(data);
                } else if (data instanceof AudioBuffer) {
                    const audio = await PatcherAudio.fromNativeAudioBuffer(this.patcher.project, data);
                    this.state.audio.setAudio(audio);
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
                    this.state.audio.setAudio(audio);
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
