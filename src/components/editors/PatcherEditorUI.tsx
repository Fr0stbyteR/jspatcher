import * as React from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import Env from "../../core/Env";
import Patcher from "../../core/patcher/Patcher";
import { Errors, Tasks } from "../../core/TaskMgr";
import PatcherBottomMenu from "../PatcherBottomMenu";
import PatcherUI from "../PatcherUI";
import PatcherRightMenu from "../rightmenu/PatcherRightMenu";

interface P {
    env: Env;
    lang: string;
    patcher: Patcher;
}

interface S {
    tasks: Tasks;
    errors: Errors;
}

export default class PatcherEditorUI extends React.PureComponent<P, S> {
    state = {
        tasks: this.props.env.taskMgr.getTasksFromEmitter(this.props.patcher),
        errors: this.props.env.taskMgr.getErrorsFromEmitter(this.props.patcher)
    };
    handleTasks = () => this.setState({ tasks: this.props.env.taskMgr.getTasksFromEmitter(this.props.patcher) });
    handleErrors = () => this.setState({ errors: this.props.env.taskMgr.getErrorsFromEmitter(this.props.patcher) });
    handleReady = () => {
        this.props.env.taskMgr.off("tasks", this.handleTasks);
        this.props.env.taskMgr.off("errors", this.handleErrors);
    };
    componentDidMount() {
        this.props.patcher.on("ready", this.handleReady);
        if (this.props.patcher.isReady) return;
        this.props.env.taskMgr.on("tasks", this.handleTasks);
        this.props.env.taskMgr.on("errors", this.handleErrors);
    }
    componentWillUnmount() {
        this.props.env.taskMgr.off("tasks", this.handleTasks);
        this.props.env.taskMgr.off("errors", this.handleErrors);
    }
    render() {
        let dimmer: JSX.Element;
        if (Object.keys(this.state.tasks).length) {
            const { tasks, errors } = this.state;
            dimmer = <Dimmer active>
                <Loader>
                    <p>Loading Patcher...</p>
                    {Object.keys(tasks).map(t => <p key={t}>{tasks[+t].message}</p>)}
                    {Object.keys(errors).map(t => <p style={{ color: "red" }} key={t}>Error while: {errors[+t].message}: {errors[+t].error.message}</p>)}
                </Loader>
            </Dimmer>;
        }
        return (
            <div className="ui-flex-row ui-flex-full" style={{ overflow: "auto" }}>
                <div className="ui-flex-column ui-flex-full" style={{ overflow: "auto" }}>
                    <div className="patcher-container">
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
