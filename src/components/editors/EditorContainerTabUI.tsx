import * as React from "react";
import { Icon } from "semantic-ui-react";
import { AnyFileInstance } from "../../core/file/FileInstance";

interface P {
    instance: AnyFileInstance;
    active: boolean;
    onActive: (instance: AnyFileInstance) => any;
    onClose: (instance: AnyFileInstance) => any;
    lang: string;
}

interface S {
    fileName: string;
}

export class EditorContainerTabUI extends React.PureComponent<P, S> {
    state = { fileName: this.props.instance.file?.name || `Untitled.${this.props.instance.fileExtention}` };
    handleMouseDownTab = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        this.props.onActive(this.props.instance);
    };
    handleClickClose = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        this.props.onClose(this.props.instance);
    };
    handleInstanceSaved = () => {
        if (this.props.instance.file) {
            this.setState({ fileName: this.props.instance.file.name });
            if (!this.fileSubscribed) {
                this.props.instance.file.on("nameChanged", this.handleInstanceSaved);
                this.fileSubscribed = true;
            }
        }
    };
    fileSubscribed = false;
    componentDidMount() {
        this.props.instance.on("saved", this.handleInstanceSaved);
        if (this.props.instance.file) {
            this.props.instance.file.on("nameChanged", this.handleInstanceSaved);
            this.fileSubscribed = true;
        }
    }
    componentWillUnmount() {
        this.props.instance.off("saved", this.handleInstanceSaved);
        if (this.props.instance.file && this.fileSubscribed) {
            this.props.instance.file.off("nameChanged", this.handleInstanceSaved);
            this.fileSubscribed = false;
        }
    }
    render() {
        const { instance, active } = this.props;
        const name = this.state.fileName;
        const icon = instance.fileIcon;
        const classArray = ["editor-container-tab"];
        if (active) classArray.push("active");
        return (
            <div className={classArray.join(" ")} key={instance.instancId} onMouseDown={this.handleMouseDownTab}>
                <Icon className="editor-container-tab-icon" name={icon} />
                <span className="editor-container-tab-name">{name}</span>
                <span className="editor-container-tab-close" onClick={this.handleClickClose}>×</span>
            </div>
        );
    }
}
