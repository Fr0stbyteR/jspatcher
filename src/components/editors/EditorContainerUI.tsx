import * as React from "react";
import { Icon } from "semantic-ui-react";
import EditorContainer, { EditorContainerEventMap, EditorContainerState } from "../../core/EditorContainer";
import Env from "../../core/Env";
import { AnyFileInstance } from "../../core/file/FileInstance";
import Patcher from "../../core/Patcher";
import PatcherEditorUI from "./PatcherEditorUI";
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
        instances: this.props.editorContainer.instances,
        children: this.props.editorContainer.children,
        mode: this.props.editorContainer.mode,
        activeInstance: this.props.editorContainer.activeInstance
    };
    handleClickClose = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, instance: AnyFileInstance) => {
        await instance.destroy();
    };
    handleMouseDownTab = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, instance: AnyFileInstance) => {
        this.setState({ activeInstance: instance });
        this.props.env.activeInstance = instance;
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
                        {this.state.instances.map((instance) => {
                            const name = instance.file?.name || `Untitled.${instance.fileExtention}`;
                            const icon = instance.fileIcon;
                            const active = this.state.activeInstance === instance;
                            const classArray = ["editor-container-tab"];
                            if (active) classArray.push("active");
                            return (
                                <div className={classArray.join(" ")} key={instance.instancId} onMouseDown={e => this.handleMouseDownTab(e, instance)}>
                                    <Icon className="editor-container-tab-icon" name={icon} />
                                    <span className="editor-container-tab-name">{name}</span>
                                    <span className="editor-container-tab-close" onClick={e => this.handleClickClose(e, instance)}>×</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="editor-container-body ui-flex-column ui-flex-full">
                    {this.state.instances.length
                        ? this.state.instances.map((instance) => {
                            if (instance instanceof Patcher) {
                                return <div className="editor-container-instance-body ui-flex-column ui-flex-full" hidden={instance !== this.state.activeInstance} key={instance.instancId}>
                                    <PatcherEditorUI {...this.props} patcher={instance} />
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
