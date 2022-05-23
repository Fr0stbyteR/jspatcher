import * as React from "react";
import { Modal, StrictModalProps } from "semantic-ui-react";
import AudioEditorUI from "../../../components/editors/audio/AudioEditorUI";
import AudioEditor from "../../audio/AudioEditor";
import DefaultPopupUI, { DefaultPopupUIState, DefaultPopupUIProps } from "../base/DefaultPopupUI";
import type PatcherAudio from "../../audio/PatcherAudio";
import type Buffer from "./Buffer";

export interface BufferUIState {
    audio: PatcherAudio;
    timestamp: number;
    editor: AudioEditor;
    dockEditor: AudioEditor;
}

export default class BufferUI extends DefaultPopupUI<Buffer, {}, BufferUIState> {
    state: BufferUIState & DefaultPopupUIState = {
        ...this.state,
        audio: this.object._.audio,
        timestamp: performance.now(),
        editor: undefined,
        dockEditor: undefined
    };
    static dockable = true;
    async loadEditor() {
        const key = this.props.inDock ? "dockEditor" : "editor";
        const editor = new AudioEditor(this.object._.audio);
        await editor.init();
        editor.on("changed", this.handleChanged);
        this.setState({ timestamp: performance.now(), [key as "editor"]: editor }, () => editor.setActive());
    }
    unloadEditor() {
        const key = this.props.inDock ? "dockEditor" : "editor";
        const editor = this.state[key];
        if (!editor) return;
        editor.off("changed", this.handleChanged);
        editor.destroy();
        this.setState({ timestamp: performance.now(), [key as "editor"]: undefined }, () => this.props.editor.setActive());
    }
    handleChanged = () => {
        const editor = this.props.inDock ? this.state.dockEditor : this.state.editor;
        if (editor.isTemporary) editor.save();
    };
    handleDoubleClick = async () => {
        if (!this.editor.state.locked) return;
        if (!this.state.audio) return;
        this.unloadEditor();
        await this.loadEditor();
        this.setState({ modalOpen: true });
    };
    handleClose = () => {
        this.unloadEditor();
        this.setState({ modalOpen: false });
    };
    handleMouseDownModal = (e: React.MouseEvent) => e.stopPropagation();
    componentDidMount() {
        super.componentDidMount();
        if (this.props.inDock) this.loadEditor();
    }
    componentDidUpdate(prevProps: Readonly<DefaultPopupUIProps>, prevState: Readonly<BufferUIState & DefaultPopupUIState>) {
        const key = this.props.inDock ? "dockEditor" : "editor";
        const editor = this.state[key];
        if (prevState.audio !== this.state.audio) {
            if (editor) {
                this.unloadEditor();
                this.loadEditor();
            }
        }
        if (prevProps.inDock !== this.props.inDock) {
            if (this.props.inDock) {
                this.loadEditor();
            } else {
                if (editor) {
                    this.unloadEditor();
                }
            }
        }
        if (editor) {
            if (prevState.width !== this.state.width || prevState.height !== this.state.height) {
                editor.onUiResized();
            }
        }
        super.componentDidUpdate(prevProps, prevState);
    }
    componentWillUnmount() {
        this.unloadEditor();
        super.componentWillUnmount();
    }
    render() {
        const editor = this.props.inDock ? this.state.dockEditor : this.state.editor;
        const content = <div className="editor-container" style={{ height: "100%", width: "100%", display: "flex", position: "relative" }}>
            {
                editor
                    ? <AudioEditorUI key={this.state.timestamp} editor={editor} env={this.env} lang={this.env.options.language} />
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
