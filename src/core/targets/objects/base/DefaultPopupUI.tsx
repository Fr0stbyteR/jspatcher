import * as React from "react";
import { StrictModalProps, Modal } from "semantic-ui-react";
import DefaultUI, { DefaultUIProps, DefaultUIState } from "./DefaultUI";
import type DefaultObject from "./DefaultObject";

export interface DefaultPopupUIProps extends DefaultUIProps {
    modalProps: StrictModalProps;
}
export interface DefaultPopupUIState extends DefaultUIState {
    modalOpen: boolean;
}
export default class DefaultPopupUI<T extends DefaultObject = DefaultObject, P extends Partial<DefaultPopupUIProps> & Record<string, any> = {}, S extends Partial<DefaultPopupUIState> & Record<string, any> = {}> extends DefaultUI<T, P & DefaultPopupUIProps, S & DefaultPopupUIState> {
    state: S & DefaultPopupUIState = {
        ...this.state,
        modalOpen: false
    };
    handleDoubleClick = () => {
        if (this.editor.state.locked) this.setState({ modalOpen: true });
    };
    handleClose = () => this.setState({ modalOpen: false });
    handleKeyDown = (e: React.KeyboardEvent) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };
    render() {
        const containerProps = { ...this.props.containerProps };
        if (!containerProps.onDoubleClick) containerProps.onDoubleClick = this.handleDoubleClick;
        const modalProps = { ...this.props.modalProps };
        if (typeof modalProps.open === "undefined") modalProps.open = this.state.modalOpen;
        if (!modalProps.onClose) modalProps.onClose = this.handleClose;
        return (
            <>
                <DefaultUI {...this.props} containerProps={containerProps} />
                <Modal onKeyDown={this.handleKeyDown} {...modalProps} />
            </>
        );
    }
}
