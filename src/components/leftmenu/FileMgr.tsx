import * as React from "react";
import { Icon } from "semantic-ui-react";
import Env from "../../core/Env";=
import NewAudioModal from "../modals/NewAudioModal";
import DeleteModal from "../modals/DeleteModal";
import DeleteAllModal from "../modals/DeleteAllModal";
import "./FileMgr.scss";
import I18n from "../../i18n/I18n";
import { ProjectItemUI } from "./FileMgrItem";

interface P {
    env: Env;
    lang: string;
}

interface S {
    collapsed: boolean;
    files: Record<string, FileState>;
    renaming: string;
    selected: string;
    editing: string;
    deleting: string;
    deleteAllModalOpen: boolean;
    newAudioModalOpen: boolean;
}

export default class FileManagerUI extends React.PureComponent<P, S> {
    state: S = {
        collapsed: false,
        files: this.props.env.fileMgr.state.fileStates,
        renaming: undefined,
        selected: undefined,
        editing: undefined,
        deleting: undefined,
        deleteAllModalOpen: false,
        newAudioModalOpen: false
    };
    get strings() {
        return I18n[this.props.lang].FileManagerUI;
    }
    handleFileStateChanged = (files: Record<string, FileState>) => this.setState({ files: JSON.parse(JSON.stringify(files)) });
    handleFileEditChanged = ({ fileName }: { fileName: string }) => this.setState({ editing: fileName });
    handleFileEditEnded = () => this.setState({ editing: undefined });

    componentDidMount() {
        const { fileMgr } = this.props.env;
        fileMgr.on("editFile", this.handleFileEditChanged);
        fileMgr.on("stopEditFile", this.handleFileEditEnded);
        fileMgr.on("fileStateChanged", this.handleFileStateChanged);
    }
    componentWillUnmount() {
        const { fileMgr } = this.props.env;
        fileMgr.off("editFile", this.handleFileEditChanged);
        fileMgr.off("stopEditFile", this.handleFileEditEnded);
        fileMgr.off("fileStateChanged", this.handleFileStateChanged);
    }
    handleClickCollapse = () => this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
    handleClickItem = (e: React.MouseEvent<HTMLDivElement>) => {
        const fileName = (e.currentTarget.getElementsByClassName("file-manager-item-name-container")[0].firstChild as HTMLSpanElement).innerText;
        this.setState({ selected: fileName });
    };
    handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const fileName = (e.currentTarget.getElementsByClassName("file-manager-item-name-container")[0].firstChild as HTMLSpanElement).innerText;
        this.props.env.fileMgr.editing = fileName;
    };
    handleClickNewFile = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        this.setState({ newAudioModalOpen: true });
    };
    handleClickDeleteAll = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        this.setState({ deleteAllModalOpen: true });
    };
    handleDeleteAll = () => {
        this.props.env.fileMgr.removeAll();
    };
    handleDeleteAllModalClose = () => {
        this.setState({ deleteAllModalOpen: false });
    };
    handleNewAudioModalClose = () => {
        this.setState({ newAudioModalOpen: false });
    };
    render() {
        return (
            <div className="left-pane-component file-manager-container">
                <div className="left-pane-component-header file-manager-header" onClick={this.handleClickCollapse}>
                    <span className="left-pane-component-collapse"><Icon name={this.state.collapsed ? "caret right" : "caret down"} inverted size="small" /></span>
                    <span className="left-pane-component-title">{this.strings.files}</span>
                    <span className="left-pane-component-icon" title={this.strings.newFile} onClick={this.handleClickNewFile}><Icon name="add" inverted size="small" /></span>
                    <span className="left-pane-component-icon" title={this.strings.deleteAll} onClick={this.handleClickDeleteAll}><Icon name="trash" inverted size="small" /></span>
                </div>
                <NewAudioModal {...this.props} open={this.state.newAudioModalOpen} onClose={this.handleNewAudioModalClose} />
                <DeleteAllModal lang={this.props.lang} open={this.state.deleteAllModalOpen} onClose={this.handleDeleteAllModalClose} onConfirm={this.handleDeleteAll} count={Object.keys(this.state.files).length} />
                {this.state.collapsed
                    ? undefined
                    : <div className="file-manager-item-tree">
                        {Array.from(this.props.env.fileMgr.projectRoot.items).map(item => <ProjectItemUI {...this.props} key={item.path} item={item} />)}
                    </div>}
            </div>
        );
    }
}
