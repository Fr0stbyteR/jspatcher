import * as React from "react";
import EditorContainer, { EditorContainerEventMap, EditorContainerState } from "../../core/EditorContainer";
import Env from "../../core/Env";
import PatcherEditorUI from "./PatcherEditorUI";
import { EditorContainerTabUI } from "./EditorContainerTabUI";
import TextEditorUI from "./TextEditorUI";
import AudioEditor from "../../core/audio/AudioEditor";
import AudioEditorUI from "./audio/AudioEditorUI";
import ImageEditorUI from "./ImageEditorUI";
import VideoEditorUI from "./VideoEditorUI";
import { IFileEditor } from "../../core/file/FileEditor";
import PatcherEditor from "../../core/patcher/PatcherEditor";
import TextEditor from "../../core/text/TextEditor";
import ImageEditor from "../../core/image/ImageEditor";
import VideoEditor from "../../core/video/VideoEditor";
import "./EditorContainerUI.scss";

interface P {
    env: Env;
    editorContainer: EditorContainer;
    lang: string;
}

interface S extends EditorContainerState {
}

export default class EditorContainerUI extends React.PureComponent<P, S> {
    state: S = {
        editors: this.props.editorContainer.editors,
        children: this.props.editorContainer.children,
        mode: this.props.editorContainer.mode,
        activeEditor: this.props.editorContainer.activeEditor
    };
    handleCloseTab = async (editor: IFileEditor) => {
        if (editor.isReady) await editor.destroy();
        else editor.once("ready", () => editor.destroy());
    };
    handleActiveTab = async (editor: IFileEditor) => {
        this.setState({ activeEditor: editor });
        editor.setActive();
    };
    handleState = (state: EditorContainerEventMap["state"]) => {
        this.setState(state);
    };
    componentDidMount() {
        this.props.editorContainer.on("state", this.handleState);
    }
    componentWillUnmount() {
        this.props.editorContainer.off("state", this.handleState);
    }
    render() {
        return (
            <div className="editor-container ui-flex-column ui-flex-full">
                <div className="editor-container-tabs-container">
                    <div className="editor-container-tabs">
                        {this.state.editors.map(editor => <EditorContainerTabUI {...this.props} key={editor.editorId} editor={editor} active={this.state.activeEditor === editor} onActive={this.handleActiveTab} onClose={this.handleCloseTab} />)}
                    </div>
                </div>
                <div className="editor-container-body ui-flex-column ui-flex-full">
                    {this.state.editors.length
                        ? this.state.editors.map((editor) => {
                            if (editor instanceof PatcherEditor) {
                                return <div className="editor-container-instance-body ui-flex-column ui-flex-full" hidden={editor !== this.state.activeEditor} key={editor.editorId}>
                                    <PatcherEditorUI {...this.props} editor={editor} />
                                </div>;
                            }
                            if (editor instanceof TextEditor) {
                                return <div className="editor-container-instance-body ui-flex-column ui-flex-full" hidden={editor !== this.state.activeEditor} key={editor.editorId}>
                                    <TextEditorUI {...this.props} editor={editor} />
                                </div>;
                            }
                            if (editor instanceof AudioEditor) {
                                return <div className="editor-container-instance-body ui-flex-column ui-flex-full" hidden={editor !== this.state.activeEditor} key={editor.editorId}>
                                    <AudioEditorUI {...this.props} editor={editor} />
                                </div>;
                            }
                            if (editor instanceof ImageEditor) {
                                return <div className="editor-container-instance-body ui-flex-column ui-flex-full" hidden={editor !== this.state.activeEditor} key={editor.editorId}>
                                    <ImageEditorUI {...this.props} editor={editor} />
                                </div>;
                            }
                            if (editor instanceof VideoEditor) {
                                return <div className="editor-container-instance-body ui-flex-column ui-flex-full" hidden={editor !== this.state.activeEditor} key={editor.editorId}>
                                    <VideoEditorUI {...this.props} editor={editor} />
                                </div>;
                            }
                            return undefined;
                        })
                        : <div className="empty"><span>Double-click to open a file or use File &gt; New to create a File</span></div>
                    }
                </div>
            </div>
        );
    }
}
