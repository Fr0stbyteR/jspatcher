import * as React from "react";
import { Modal, Button } from "semantic-ui-react";
import I18n from "../../i18n/I18n";

interface P {
    lang: string;
    open: boolean;
    fileName: string;
    onClose: () => any;
    onConfirm: () => any;
    onDiscard: () => any;
}

export default class TabCloseModal extends React.PureComponent<P> {
    get strings() {
        return I18n[this.props.lang].TabCloseModal;
    }
    render() {
        return (
            <Modal className="modal-tab-close" basic size="mini" open={this.props.open} onClose={this.props.onClose} closeIcon>
                <Modal.Header>{this.strings.title}</Modal.Header>
                <Modal.Content>{this.strings.msg.replace("{}", this.props.fileName)}</Modal.Content>
                <Modal.Actions>
                    <Button inverted color="green" size="mini" onClick={this.props.onConfirm}>{this.strings.confirm}</Button>
                    <Button inverted color="red" size="mini" onClick={this.props.onDiscard}>{this.strings.discard}</Button>
                    <Button inverted color="grey" size="mini" onClick={this.props.onClose}>{this.strings.cancel}</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}
