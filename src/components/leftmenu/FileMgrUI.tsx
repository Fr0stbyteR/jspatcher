import * as React from "react";
import { Icon } from "semantic-ui-react";
import Env, { EnvEventMap } from "../../core/Env";
import NewAudioModal from "../modals/NewAudioModal";
import DeleteModal from "../modals/DeleteModal";
import DeleteAllModal from "../modals/DeleteAllModal";
import "./FileMgrUI.scss";
import I18n from "../../i18n/I18n";
import { ProjectItemUI } from "./ProjectItemUI";
import { AnyFileInstance } from "../../core/file/FileInstance";
import ProjectItem from "../../core/file/ProjectItem";
import { ProjectEventMap } from "../../core/Project";

interface P {
    env: Env;
    lang: string;
}

interface S {
    projectName: string;
    items: ProjectItem[];
    collapsed: boolean;
    selected: ProjectItem[];
    instances: AnyFileInstance[];
    deleteModalOpen: boolean;
    deleteAllModalOpen: boolean;
    newAudioModalOpen: boolean;
}

export default class FileManagerUI extends React.PureComponent<P, S> {
    state: S = {
        projectName: this.props.env.currentProject?.props.name,
        collapsed: false,
        selected: [],
        instances: [],
        deleteModalOpen: false,
        deleteAllModalOpen: false,
        newAudioModalOpen: false,
        items: []
    };
    get strings() {
        return I18n[this.props.lang].FileManagerUI;
    }
    handleProjectPropsChanged = ({ name }: ProjectEventMap["propsChanged"]) => this.setState({ projectName: name });
    handleProjectChanged = ({ project, oldProject }: EnvEventMap["projectChanged"]) => {
        oldProject.off("propsChanged", this.handleProjectPropsChanged);
        project.on("propsChanged", this.handleProjectPropsChanged);
    };
    handleEnvInstances = (instances: EnvEventMap["instances"]) => this.setState({ instances });
    handleTreeChanged = () => this.setState({ items: Array.from(this.props.env.fileMgr.projectRoot?.items || []) });

    componentDidMount() {
        const { env } = this.props;
        const { fileMgr } = this.props.env;
        env.on("projectChanged", this.handleProjectChanged);
        env.on("instances", this.handleEnvInstances);
        fileMgr.on("treeChanged", this.handleTreeChanged);
    }
    componentWillUnmount() {
        const { env } = this.props;
        const { fileMgr } = env;
        env.off("projectChanged", this.handleProjectChanged);
        env.off("instances", this.handleEnvInstances);
        fileMgr.off("treeChanged", this.handleTreeChanged);
    }
    handleClickCollapse = () => this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
    handleClickNewFile = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        this.setState({ newAudioModalOpen: true });
    };
    handleDeleteItem = async (itemUI: ProjectItemUI) => {
        const item = itemUI.props.item;
        this.setState({ selected: [item] }, () => this.setState({ deleteModalOpen: true }));
    };
    handleClickItem = (itemUI: ProjectItemUI, ctrl = false, shift = false) => {
        const item = itemUI.props.item;
        const itemSelected = this.state.selected.indexOf(item) !== -1;
        if ((!ctrl && !shift) || this.state.selected.length === 0) {
            this.setState({ selected: [item] });
        } else if (ctrl) {
            if (itemSelected) this.setState(({ selected }) => ({ selected: selected.filter($item => $item !== item) }));
            else this.setState(({ selected }) => ({ selected: [...selected, item] }));
        } else if (shift) {
            const from = this.state.selected[this.state.selected.length - 1];
            const to = item;
            if (from === to) return;
            const parent = from.parent;
            if (to.parent === parent) {
                const items = Array.from(parent.items);
                let $from = items.indexOf(from);
                let $to = items.indexOf(to);
                if ($from > $to) [$from, $to] = [$to, $from];
                const selected = this.state.selected.slice();
                for (let i = $from; i <= $to; i++) {
                    const $item = items[i];
                    const found = selected.indexOf($item);
                    if (found === -1) selected.push($item);
                    else selected.splice(found, 1);
                }
                this.setState({ selected });
            } else {
                this.setState(({ selected }) => ({ selected: [...selected, item] }));
            }
        }
    };
    handleDoubleClickItem = async (itemUI: ProjectItemUI) => {
        const item = itemUI.props.item;
        const instance = await item.instantiate();
        this.props.env.openInstance(instance);
    };
    handleDeleteModalClose = () => this.setState({ deleteModalOpen: false });
    handleDeleteModalConfirm = async () => {
        this.setState({ deleteModalOpen: false });
        for (const item of this.state.selected) {
            for (const instance of this.state.instances) {
                if (instance.file === item) await instance.destroy();
            }
            await item.destroy();
        }
    };
    handleClickDeleteAll = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        this.setState({ deleteAllModalOpen: true });
    };
    handleDeleteAll = async () => {
        await this.props.env.newProject();
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
                <DeleteModal lang={this.props.lang} open={this.state.deleteModalOpen} onClose={this.handleDeleteModalClose} onConfirm={this.handleDeleteModalConfirm} fileNames={this.state.selected.map(item => item.name)} />
                <DeleteAllModal lang={this.props.lang} open={this.state.deleteAllModalOpen} onClose={this.handleDeleteAllModalClose} onConfirm={this.handleDeleteAll} count={this.props.env.fileMgr.projectRoot?.getDescendantFiles?.length || 0} />
                {this.state.collapsed
                    ? undefined
                    : <div className="file-manager-item-tree">
                        {this.state.items.map(item => <ProjectItemUI {...this.props} key={item.path} item={item} selected={this.state.selected} onDelete={this.handleDeleteItem} onClick={this.handleClickItem} onDoubleClick={this.handleDoubleClickItem} />)}
                    </div>}
            </div>
        );
    }
}
