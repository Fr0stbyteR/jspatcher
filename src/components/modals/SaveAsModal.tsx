import * as React from "react";
import { Modal, Button, InputOnChangeData, Form, Input } from "semantic-ui-react";
import Env from "../../core/Env";
import Folder from "../../core/file/Folder";
import AbstractProjectItem from "../../core/file/AbstractProjectItem";
import I18n from "../../i18n/I18n";
import FileManagerUI from "../leftmenu/FileMgrUI";
import "./SaveAsModal.scss";

interface P {
    env: Env;
    lang: string;
    open: boolean;
    fileName: string;
    folder: Folder;
    onClose: () => any;
    onConfirm: (folder: Folder, fileName: string) => any;
}

interface S {
    folder: Folder;
    fileName: string;
    fileNameError: boolean;
}

export default class SaveAsModal extends React.PureComponent<P, S> {
    state = {
        fileName: this.props.fileName,
        fileNameError: false,
        folder: this.props.folder
    };
    get strings() {
        return I18n[this.props.lang].SaveAsModal;
    }
    handleSelection = (selection: AbstractProjectItem[]) => {
        if (selection[0].type === "folder") this.setState({ folder: selection[0] as Folder });
    };
    handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => {
        this.setState({ fileName: value, fileNameError: !!this.state.folder.findItem(value) });
    };
    handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
        e.stopPropagation();
        if (e.key === "Enter") this.props.onConfirm(this.state.folder, this.state.fileName);
    };
    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>) {
        if (this.props.fileName !== prevProps.fileName) this.setState({ fileName: this.props.fileName });
    }
    render() {
        return (
            <Modal className="modal-saveas" basic size="mini" open={this.props.open} onClose={this.props.onClose} closeIcon>
                <Modal.Header>{this.strings.title}</Modal.Header>
                <Modal.Content>
                    <Form inverted size="mini">
                        <Form.Field inline style={{ height: "300px", overflow: "auto" }}>
                            <FileManagerUI {...this.props} oneSelectionOnly={true} folderSelectionOnly={true} onSelection={this.handleSelection} noActions />
                        </Form.Field>
                        <Form.Field inline>
                            <label>{this.strings.path}</label>
                            <span>{this.state.folder.path}/</span>
                        </Form.Field>
                        <Form.Field inline error={this.state.fileNameError}>
                            <label>{this.strings.fileName}</label>
                            <Input value={this.state.fileName} onChange={this.handleFileNameChange} onKeyDown={this.handleKeyDown} />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button inverted color="grey" size="mini" onClick={this.props.onClose}>{this.strings.cancel}</Button>
                    <Button inverted color="green" size="mini" onClick={() => this.props.onConfirm(this.state.folder, this.state.fileName)}>{this.strings.confirm}</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}
