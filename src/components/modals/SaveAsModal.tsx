import * as React from "react";
import { Modal, Button, InputOnChangeData, Form, Input } from "semantic-ui-react";
import Env from "../../core/Env";
import Folder from "../../core/file/Folder";
import ProjectItem from "../../core/file/ProjectItem";
import I18n from "../../i18n/I18n";
import FileManagerUI from "../leftmenu/FileMgrUI";

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
    handleSelection = (selection: ProjectItem[]) => {
        if (selection[0].type === "folder") this.setState({ folder: selection[0] as Folder });
    };
    handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => {
        this.setState({ fileName: value, fileNameError: !!this.state.folder.findItem(value) });
    };
    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>) {
        if (this.props.fileName !== prevProps.fileName) this.setState({ fileName: this.props.fileName });
    }
    render() {
        return (
            <Modal className="modal-delete" basic size="mini" open={this.props.open} onClose={this.props.onClose} closeIcon>
                <Modal.Header>{this.strings.title}</Modal.Header>
                <Modal.Content>
                    <Form inverted size="mini">
                        <Form.Field inline error={this.state.fileNameError}>
                            <FileManagerUI {...this.props} oneSelectionOnly={true} folderSelectionOnly={true} onSelection={this.handleSelection} noActions />
                        </Form.Field>
                        <Form.Field inline error={this.state.fileNameError}>
                            <label>{this.strings.fileName}</label>
                            <Input value={this.state.fileName} onChange={this.handleFileNameChange} />
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
