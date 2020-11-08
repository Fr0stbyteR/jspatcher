import * as React from "react";
import { Icon } from "semantic-ui-react";
import EditorContainer, { EditorContainerEventMap, EditorContainerState } from "../../core/EditorContainer";
import Env from "../../core/Env";
import { AnyFileInstance } from "../../core/file/FileInstance";
import Patcher from "../../core/Patcher";
import PatcherEditorUI from "./PatcherEditorUI";

interface P {
    env: Env;
    editorContainer: EditorContainer;
    lang: string;
}

interface S extends EditorContainerState {
}

export default class EditorContainerUI extends React.PureComponent<P, S> {
    state: S = {
        instances: this.props.editorContainer.instances,
        children: this.props.editorContainer.children,
        mode: this.props.editorContainer.mode
    };
    handleClickClose = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, instance: AnyFileInstance) => {
        await instance.destroy();
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
                <div className="editor-container-tabs">
                    {this.state.instances.map((instance, i) => {
                        const name = instance.file?.name || `Untitled${instance.fileExtention}`;
                        const icon = instance.fileIcon;
                        return (
                            <div className="editor-container-tab" key={i}>
                                <Icon className="editor-container-tab-icon" name={icon} />
                                <span className="editor-container-tab-name">{name}</span>
                                <span className="editor-container-tab-close" onClick={e => this.handleClickClose(e, instance)}>×</span>
                            </div>
                        );
                    })}
                </div>
                <div className="editor-container-body ui-flex-column ui-flex-full">
                    {this.state.instances.map((instance, i) => {
                        if (instance instanceof Patcher) {
                            return <PatcherEditorUI {...this.props} patcher={instance} key={i} />;
                        }
                        return undefined;
                    })}
                </div>
            </div>
        );
    }
}
