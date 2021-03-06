import * as React from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import TopMenu from "./topmenu/TopMenu";
import LeftMenu from "./leftmenu/LeftMenu";
import "./UI.scss";
import Env from "../core/Env";
import { Errors, TaskManagerEventMap, Tasks } from "../core/TaskMgr";
import StatusBar from "./StatusBar";
import EditorContainerUI from "./editors/EditorContainerUI";

interface P {
    env: Env;
    lang: string;
}

interface S {
    tasks: Tasks;
    errors: Errors;
    envTasks: Tasks;
    envErrors: Errors;
    fileDropping: boolean;
}

export default class UI extends React.PureComponent<P, S> {
    state: S = {
        tasks: this.props.env.taskMgr.tasks,
        errors: this.props.env.taskMgr.errors,
        envTasks: this.props.env.taskMgr.getTasksFromEmitter(this.props.env),
        envErrors: this.props.env.taskMgr.getErrorsFromEmitter(this.props.env),
        fileDropping: false
    };
    handleKeyDown = (e: React.KeyboardEvent) => {
        // e.stopPropagation();
        // e.nativeEvent.stopImmediatePropagation();
    };
    /*
    handleMouseDown = (e: React.MouseEvent) => {
        this.props.patcher.setActive();
        e.stopPropagation();
    };
    */
    handleTasks = (tasks: TaskManagerEventMap["tasks"]) => {
        if (this.props.env.loaded) {
            this.setState({ tasks, envTasks: {}, envErrors: {} });
        } else {
            this.setState({ tasks, envTasks: this.props.env.taskMgr.getTasksFromEmitter(this.props.env) });
        }
    };
    handleErrors = (errors: TaskManagerEventMap["errors"]) => {
        if (this.props.env.loaded) {
            this.setState({ errors, envTasks: {}, envErrors: {} });
        } else {
            this.setState({ errors, envErrors: this.props.env.taskMgr.getErrorsFromEmitter(this.props.env) });
        }
    };
    handleEnvReady = () => {
        this.setState({ envTasks: {}, envErrors: {} });
        this.props.env.off("ready", this.handleEnvReady);
    };
    handleBeforeUnload = (e: BeforeUnloadEvent) => {
        const { isDirty } = this.props.env.editorContainer;
        if (!isDirty) return;
        e.preventDefault();
        e.returnValue = "";
    };
    handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        if (!this.props.env.loaded) return;
        e.preventDefault();
        e.stopPropagation();
        if (this.state.fileDropping) return;
        const { dataTransfer } = e;
        if (dataTransfer && dataTransfer.items.length && dataTransfer.items[0].kind === "file") this.setState({ fileDropping: true });
    };
    handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        if (!this.props.env.loaded) return;
        this.handleDragEnter(e);
    };
    handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        if (!this.props.env.loaded) return;
        e.preventDefault();
        e.stopPropagation();
        this.setState({ fileDropping: false });
    };
    handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        if (!this.props.env.loaded) return;
        e.preventDefault();
        e.stopPropagation();
        this.setState({ fileDropping: false });
        const { dataTransfer } = e;
        if (dataTransfer && dataTransfer.files.length) {
            for (const file of e.dataTransfer.files) {
                await this.props.env.fileMgr.importFile(file);
            }
        }
    };
    componentDidMount() {
        this.props.env.taskMgr.on("tasks", this.handleTasks);
        this.props.env.on("ready", this.handleEnvReady);
        window.addEventListener("beforeunload", this.handleBeforeUnload);
    }
    componentWillUnmount() {
        this.props.env.taskMgr.on("tasks", this.handleTasks);
        this.props.env.off("ready", this.handleEnvReady);
    }
    render() {
        let dimmer: JSX.Element;
        if (!this.props.env.loaded || Object.keys(this.state.envTasks).length) {
            const { envTasks, envErrors } = this.state;
            dimmer = <Dimmer active>
                <Loader>
                    {Object.keys(envTasks).map(t => <p key={t}>{envTasks[+t].message}</p>)}
                    {Object.keys(envErrors).map(t => <p style={{ color: "red" }} key={t}>Error while: {envErrors[+t].message}: {envErrors[+t].error.message}</p>)}
                </Loader>
            </Dimmer>;
        }
        return (
            <div id="jspatcher-root" className={this.state.fileDropping ? "filedropping" : ""} onDragEnter={this.handleDragEnter} onDragOver={this.handleDragOver} onDragLeave={this.handleDragLeave} onDrop={this.handleDrop}>
                {
                    dimmer
                    || <>
                        <TopMenu {...this.props} />
                        <div className="ui-flex-row" style={{ flex: "1 1 auto", overflow: "auto" }}>
                            <div className="ui-left">
                                <LeftMenu {...this.props} />
                            </div>
                            <div className="ui-center">
                                <EditorContainerUI {...this.props} editorContainer={this.props.env.editorContainer} />
                            </div>
                        </div>
                        <StatusBar {...this.props} lang={this.props.env.language} />
                    </>
                }
            </div>
        );
    }
}
