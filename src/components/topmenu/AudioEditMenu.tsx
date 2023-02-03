import * as React from "react";
import { Dropdown } from "semantic-ui-react";
import Env from "../../core/Env";
import AudioEditor from "../../core/audio/AudioEditor";
import AudioExportModal from "../modals/AudioExportModal";
import I18n from "../../i18n/I18n";
import InsertSilenceModal from "../modals/InsertSilenceModal";
import ResampleModal from "../modals/ResampleModal";
import RemixModal from "../modals/RemixModal";

interface P {
    env: Env;
    lang: string;
    editor: AudioEditor;
    locked: boolean;
}
interface S {
    bounceModalOpen: boolean;
    insertSilenceModelOpen: boolean;
    resampleModelOpen: boolean;
    remixModelOpen: boolean;
}

export default class AudioEditMenu extends React.PureComponent<P, S> {
    state: S = {
        bounceModalOpen: false,
        insertSilenceModelOpen: false,
        resampleModelOpen: false,
        remixModelOpen: false
    };
    get strings() {
        return I18n[this.props.lang].AudioEditMenu;
    }
    handleClickPlayStop = () => {
        const { editor: instance } = this.props;
        if (instance.state.recording) {
            instance.stopRecord();
            return;
        }
        if (instance.state.playing === "playing") instance.stop();
        else instance.play();
    };
    handleClickSilence = () => {
        this.props.editor.silence();
    };
    handleClickReverse = () => {
        this.props.editor.reverse();
    };
    handleClickInverse = () => {
        this.props.editor.inverse();
    };
    handleClickBounce = () => {
        this.setState({ bounceModalOpen: true });
    };
    handleExportModalClose = () => {
        this.setState({ bounceModalOpen: false });
    };
    handleClickInsertSilence = () => {
        this.setState({ insertSilenceModelOpen: true });
    };
    handleInsertSilenceModalClose = () => {
        this.setState({ insertSilenceModelOpen: false });
    };
    handleClickResample = () => {
        this.setState({ resampleModelOpen: true });
    };
    handleResampleModalClose = () => {
        this.setState({ resampleModelOpen: false });
    };
    handleClickRemix = () => {
        this.setState({ remixModelOpen: true });
    };
    handleRemixModalClose = () => {
        this.setState({ remixModelOpen: false });
    };
    onHotKey(e: KeyboardEvent) {
        if (this.props.locked) return false;
        const ctrlKey = this.props.env.os === "MacOS" ? e.metaKey : e.ctrlKey;
        let performed = true;
        if (e.key === " ") this.handleClickPlayStop();
        else if (ctrlKey && (e.key === "Delete" || e.key === "Backspace")) this.handleClickSilence();
        else performed = false;
        return performed;
    }
    get modals() {
        return (
            <>
                <AudioExportModal {...this.props} open={this.state.bounceModalOpen} onClose={this.handleExportModalClose} />
                <InsertSilenceModal {...this.props} open={this.state.insertSilenceModelOpen} onClose={this.handleInsertSilenceModalClose} />
                <ResampleModal {...this.props} open={this.state.resampleModelOpen} onClose={this.handleResampleModalClose} />
                <RemixModal {...this.props} open={this.state.remixModelOpen} onClose={this.handleRemixModalClose} />
            </>
        );
    }
    render() {
        const ctrlKey = this.props.env.os === "MacOS" ? "Cmd" : "Ctrl";
        const locked = this.props.locked;
        const eventDisabler = (["onClick", "onMouseDown", "onKeyDown", "onFocus", "onBlur"] as const).reduce<React.DOMAttributes<HTMLDivElement>>((acc, cur) => {
            const eventHandler: React.EventHandler<React.SyntheticEvent<any, Event>> = (e) => {
                e.stopPropagation();
            };
            acc[cur] = eventHandler;
            return acc;
        }, {});
        return (
            <>
                <Dropdown.Item onClick={this.handleClickPlayStop} text={this.strings.playStop} description="Space" disabled={locked} />
                <Dropdown.Item onClick={this.handleClickSilence} text={this.strings.silence} description={`${ctrlKey} + Del`} disabled={locked} />
                <Dropdown.Item onClick={this.handleClickReverse} text={this.strings.reverse} disabled={locked} />
                <Dropdown.Item onClick={this.handleClickInverse} text={this.strings.inverse} disabled={locked} />
                <Dropdown.Divider />
                <Dropdown.Item onClick={this.handleClickInsertSilence} text={this.strings.insertSilence} disabled={locked} />
                <Dropdown.Item onClick={this.handleClickResample} text={this.strings.resample} disabled={locked} />
                <Dropdown.Item onClick={this.handleClickRemix} text={this.strings.remixChannels} disabled={locked} />
                <Dropdown.Item onClick={this.handleClickBounce} text={this.strings.bounce} disabled={locked} />
                <div {...eventDisabler}>
                    {this.modals}
                </div>
            </>
        );
    }
}
