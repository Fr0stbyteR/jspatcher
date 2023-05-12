import * as React from "react";
import { StrictModalProps, Modal } from "semantic-ui-react";
import HardwareEditorUI from "../../../components/editors/HardwareEditorUI";
import DefaultPopupUI, { DefaultPopupUIProps, DefaultPopupUIState } from "../base/DefaultPopupUI";
import LeftMenu from "../../../components/leftmenu/LeftMenu";
import Hardware from "./Hardware";
import type HardwarePatcher from "../../hardware/Patcher";
import HardwareEditor from "../../hardware/HardwareEditor";
import "./HardwareUI.scss";

export interface HardwarePatcherUIState {
    patcher: HardwarePatcher;
    timestamp: number;
    editor: HardwareEditor;
}

export default class SubPatcherUI extends DefaultPopupUI<Hardware, {}, HardwarePatcherUIState> {
    state: HardwarePatcherUIState & DefaultPopupUIState = {
        ...this.state,
        patcher: this.object._.patcher,
        timestamp: performance.now(),
        editor: undefined
    };
    static dockable = true;
    handleChanged = () => {
        if (this.state.editor.isTemporary) this.state.editor.save();
    };
    handleDoubleClick = () => {
        if (this.editor.state.locked) this.setState({ modalOpen: true }, () => this.state.editor.setActive());
    };
    handleClose = () => this.setState({ modalOpen: false }, () => this.props.editor.setActive());
    handleMouseDownModal = (e: React.MouseEvent) => e.stopPropagation();
    componentDidMount() {
        super.componentDidMount();
        if (this.state.patcher) {
            const Editor = this.editor.constructor as typeof HardwareEditor;
            const editor = new HardwareEditor(this.object._.patcher);
            this.setState({ editor });
            editor.init();
            editor.on("changed", this.handleChanged);
        }
    }
    componentDidUpdate(prevProps: Readonly<DefaultPopupUIProps>, prevState: Readonly<HardwarePatcherUIState & DefaultPopupUIState>) {
        if (prevState.patcher !== this.state.patcher) {
            if (this.state.editor) {
                this.state.editor.off("changed", this.handleChanged);
                this.state.editor.destroy();
            }
            if (this.state.patcher) {
                const Editor = this.editor.constructor as typeof HardwareEditor;
                const editor = new HardwareEditor(this.object._.patcher);
                this.setState({ timestamp: performance.now(), editor });
                editor.init();
                editor.on("changed", this.handleChanged);
            } else {
                this.setState({ timestamp: performance.now(), editor: undefined });
            }
        }
        super.componentDidUpdate(prevProps, prevState);
    }
    componentWillUnmount() {
        this.state.editor?.off("changed", this.handleChanged);
        this.state.editor?.destroy();
        super.componentWillUnmount();
    }
    render() {
        const content = <div style={{ height: "100%", width: "100%", display: "flex", position: "relative" }}>
            <div className="ui-flex-row" style={{ flex: "1 1 auto", overflow: "auto" }}>
                <div className="ui-left">
                    <LeftMenu env={this.env} lang={this.env.options.language} noFileMgr />
                </div>
                <div className="ui-center">
                    {
                        this.state.editor
                            ? <HardwareEditorUI key={this.state.timestamp} editor={this.state.editor} env={this.env} lang={this.env.options.language} />
                            : undefined
                    }
                </div>
            </div>
        </div>;
        const children = (
            <Modal.Content style={{ height: "100%", width: "100%", position: "relative" }} onMouseDown={this.handleMouseDownModal}>
                {content}
            </Modal.Content>
        );
        if (this.props.inDock) return children;
        const containerProps = { ...this.props.containerProps };
        if (!containerProps.onDoubleClick) containerProps.onDoubleClick = this.handleDoubleClick;
        const modalProps: StrictModalProps & { onKeyDown: any } = { ...this.props.modalProps, children, className: "subpatcher", open: this.state.modalOpen, onClose: this.handleClose, onKeyDown: undefined, basic: true, size: "fullscreen", closeIcon: true };
        return <DefaultPopupUI {...this.props} modalProps={modalProps} containerProps={containerProps} />;
    }
}
