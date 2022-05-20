import * as React from "react";
import { Modal, Button, InputOnChangeData, Form, Input } from "semantic-ui-react";
import { IProjectFolder } from "../../core/file/AbstractProjectFolder";
import I18n from "../../i18n/I18n";

interface P {
    lang: string;
    open: boolean;
    folderName?: string;
    folder: IProjectFolder;
    onClose: () => any;
    onConfirm: (parent: IProjectFolder, folderName: string) => any;
}

interface S {
    folder: IProjectFolder;
    folderName: string;
}

export default class NewFolderModal extends React.PureComponent<P, S> {
    state = {
        folderName: this.props.folderName,
        folder: this.props.folder
    };
    get strings() {
        return I18n[this.props.lang].NewFolderModal;
    }
    get folderNameError() {
        return !this.state.folderName || !!this.state.folder.findItem(this.state.folderName);
    }
    handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => {
        this.setState({ folderName: value });
    };
    handleConfirm = () => {
        if (this.folderNameError) return;
        this.props.onConfirm(this.state.folder, this.state.folderName);
    };
    render() {
        return (
            <Modal className="modal-delete" basic size="mini" open={this.props.open} onClose={this.props.onClose} closeIcon>
                <Modal.Header>{this.strings.title}</Modal.Header>
                <Modal.Content>
                    <Form inverted size="mini">
                        <Form.Field inline error={this.folderNameError}>
                            <label>{this.strings.folderName}</label>
                            <Input defaultValue={this.state.folderName} onChange={this.handleFolderNameChange} />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button inverted color="grey" size="mini" onClick={this.props.onClose}>{this.strings.cancel}</Button>
                    <Button inverted color="green" size="mini" disabled={this.folderNameError} onClick={this.handleConfirm}>{this.strings.confirm}</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}
