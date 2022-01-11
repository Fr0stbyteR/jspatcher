import * as React from "react";
import { Modal, Button, Input, Ref } from "semantic-ui-react";
import I18n from "../../i18n/I18n";
import "./AddPluginModal.scss";

interface Props {
    lang: string;
    error: string;
    open: boolean;
    index: number;
    onClose: () => any;
    onConfirm: (url: string, index: number) => any;
}

export default class AddPluginModal extends React.PureComponent<Props> {
    get strings() {
        return I18n[this.props.lang].AddPluginModal;
    }
    refInput = React.createRef<HTMLDivElement>();
    handleConfirm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const url = (e.currentTarget.parentElement.previousSibling.firstChild.firstChild as HTMLInputElement).value;
        this.props.onConfirm(url, this.props.index);
    };
    componentDidUpdate(prevProps: Readonly<Props>) {
        if (this.props.open && !prevProps.open) {
            if (this.refInput.current) {
                const input = this.refInput.current.firstChild as HTMLInputElement;
                input.focus();
                input.select();
            }
        }
    }
    render() {
        return (
            <Modal className="modal-add-plugin" basic size="small" open={this.props.open} onClose={this.props.onClose} closeIcon>
                <Modal.Header>{this.strings.title}</Modal.Header>
                <Modal.Content>
                    <Ref innerRef={this.refInput}>
                        <Input fluid placeholder={this.strings.msg} size="mini" error={!!this.props.error} />
                    </Ref>
                    <div className="message">
                        <span title={this.props.error} className={`add-plugin-status${this.props.error ? " error" : ""}`}>{this.props.error}</span>
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Button inverted color="grey" size="mini" onClick={this.props.onClose}>{this.strings.cancel}</Button>
                    <Button inverted color="green" size="mini" onClick={this.handleConfirm}>{this.strings.confirm}</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}
