import * as React from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import Env from "../../core/Env";
import PatcherEditor from "../../core/patcher/PatcherEditor";
import { TaskError, Task } from "../../core/TaskMgr";
import PatcherBottomMenu from "./patcher/PatcherBottomMenu";
import PatcherUI from "./patcher/PatcherUI";
import PatcherRightMenu from "../rightmenu/PatcherRightMenu";

interface P {
    env: Env;
    lang: string;
    editor: PatcherEditor;
}

interface S {
    tasks: Task[];
    errors: TaskError[];
    editorReady: boolean;
}

export default class PatcherEditorUI extends React.PureComponent<P, S> {
    state = {
        tasks: this.tasks,
        errors: this.errors,
        editorReady: this.props.editor.isReady
    };
    get tasks() {
        return {
            ...this.props.env.taskMgr.getTasksFromEmitter(this.props.editor.instance),
            ...this.props.env.taskMgr.getTasksFromEmitter(this.props.editor)
        };
    }
    get errors() {
        return {
            ...this.props.env.taskMgr.getErrorsFromEmitter(this.props.editor.instance),
            ...this.props.env.taskMgr.getErrorsFromEmitter(this.props.editor)
        };
    }
    handleTasks = () => this.setState({ tasks: this.tasks });
    handleErrors = () => this.setState({ errors: this.errors });
    handleReady = () => {
        this.props.env.taskMgr.off("tasks", this.handleTasks);
        this.props.env.taskMgr.off("errors", this.handleErrors);
        this.setState({ editorReady: true });
    };
    componentDidMount() {
        if (this.state.editorReady) return;
        this.props.editor.on("ready", this.handleReady);
        this.props.env.taskMgr.on("tasks", this.handleTasks);
        this.props.env.taskMgr.on("errors", this.handleErrors);
    }
    componentWillUnmount() {
        // if (this.state.editorReady) this.props.editor.destroy();
        // else this.props.editor.on("ready", this.handleUnmountReady);
        this.props.editor.off("ready", this.handleReady);
        this.props.env.taskMgr.off("tasks", this.handleTasks);
        this.props.env.taskMgr.off("errors", this.handleErrors);
    }
    render() {
        let dimmer: JSX.Element;
        if (this.state.tasks.length) {
            const { tasks, errors } = this.state;
            dimmer = <Dimmer active>
                <Loader>
                    <p>Loading Patcher...</p>
                    {tasks.map(t => <p key={t.id}>{t.message}</p>)}
                    {errors.map(t => <p style={{ color: "red" }} key={`Error${t.id}`}>Error while: {t.message}: {t.error.message}</p>)}
                </Loader>
            </Dimmer>;
        }
        return (
            <div className="ui-flex-row ui-flex-full" style={{ overflow: "auto" }}>
                <div className="ui-flex-column ui-flex-full" style={{ overflow: "auto" }}>
                    <div className="patcher-container" data-id={this.props.editor.editorId}>
                        {dimmer}
                        <PatcherUI {...this.props} />
                    </div>
                    <PatcherBottomMenu {...this.props} />
                </div>
                <div className="ui-right">
                    <PatcherRightMenu {...this.props} />
                </div>
            </div>
        );
    }
}
