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
import version from "../../version";

interface P {
    env: Env;
    runtime?: boolean;
    editorContainer: EditorContainer;
    lang: string;
}

interface S extends EditorContainerState {
    update: string;
}

export default class EditorContainerUI extends React.PureComponent<P, S> {
    state: S = {
        editors: this.props.editorContainer.editors,
        children: this.props.editorContainer.children,
        mode: this.props.editorContainer.mode,
        activeEditor: this.props.editorContainer.activeEditor,
        update: null
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
    async checkUpdate() {
        const newVersionFetch = await fetch(`./version.json?rng=${Math.random()}`);
        const newVersion = await newVersionFetch.json() as string;
        if (newVersion !== version) this.setState({ update: newVersion });
    }
    componentDidMount() {
        this.props.editorContainer.on("state", this.handleState);
        this.checkUpdate();
    }
    componentWillUnmount() {
        this.props.editorContainer.off("state", this.handleState);
    }
    onReload = async (e: React.MouseEvent) => {
        e.preventDefault();
        if ("serviceWorker" in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) registration.unregister();
        }
        const cacheNames = await caches.keys();
        const cacheName = cacheNames.find(n => n.includes("JSPatcher"));
        if (cacheName) await caches.delete(cacheName);
        window.location.reload();
    };
    render() {
        return (
            <div className="editor-container ui-flex-column ui-flex-full">
                {!this.props.runtime || (this.props.runtime && this.state.editors.length > 1)
                    ? <div className="editor-container-tabs-container">
                        <div className="editor-container-tabs">
                            {this.state.editors.map(editor => <EditorContainerTabUI {...this.props} key={editor.editorId} editor={editor} active={this.state.activeEditor === editor} onActive={this.handleActiveTab} onClose={this.handleCloseTab} />)}
                        </div>
                    </div>
                    : undefined
                }
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
                        : <div className="empty">
                            {this.props.runtime ? undefined : <div>
                                <span>Double-click items on the left to open a file</span>
                                <span>Menu &gt; File &gt; New to create a file</span>
                                <div className="version">
                                    <span><a href="https://github.com/Fr0stbyteR/jspatcher">JSPatcher </a>version: {version}</span>
                                    {this.state.update ? <a href="about:blank" onClick={this.onReload}>Update to version: {this.state.update}</a> : null}
                                </div>
                            </div>}
                        </div>
                    }
                </div>
            </div>
        );
    }
}
