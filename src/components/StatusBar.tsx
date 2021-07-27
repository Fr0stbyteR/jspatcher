import * as React from "react";
import { Icon } from "semantic-ui-react";
import { Task, TaskError, TaskManagerEventMap } from "../core/TaskMgr";
import type Env from "../core/Env";
import "./StatusBar.scss";

interface S {
    tasks: Task[];
    errors: TaskError[];
}

export default class StatusBar extends React.PureComponent<{ env: Env; lang: string }, S> {
    state: S = {
        tasks: this.props.env.taskMgr.tasks,
        errors: this.props.env.taskMgr.errors
    };
    handleTasks = (tasks: TaskManagerEventMap["tasks"]) => {
        this.setState({ tasks });
    };
    handleErrors = (errors: TaskManagerEventMap["errors"]) => {
        this.setState({ errors });
    };
    handleClickDismiss = () => {
        this.props.env.taskMgr.dismissLastError();
    };
    componentDidMount() {
        this.props.env.taskMgr.on("tasks", this.handleTasks);
        this.props.env.taskMgr.on("errors", this.handleErrors);
    }
    componentWillUnmount() {
        this.props.env.taskMgr.off("tasks", this.handleTasks);
        this.props.env.taskMgr.off("errors", this.handleErrors);
    }
    render() {
        const { lastError, lastTask } = this.props.env.taskMgr;
        if (lastTask) {
            return (
                <div className="status-bar">
                    <Icon loading name="asterisk" size="small" />
                    <span className="status-bar-emitter">{typeof lastTask.emitter === "string" ? lastTask.emitter : lastTask.emitter.constructor?.name || ""}</span>
                    <span className="status-bar-task">{lastTask.message}</span>
                </div>
            );
        }
        if (lastError) {
            return (
                <div className="status-bar">
                    <span className="status-bar-emitter">{typeof lastError.emitter === "string" ? lastError.emitter : lastError.emitter.constructor?.name || ""}</span>
                    <span className="status-bar-task error">{lastError.message}: {lastError.error.message}</span>
                    <span className="status-bar-dismiss" onClick={this.handleClickDismiss}>Dismiss</span>
                </div>
            );
        }
        return (
            <div className="status-bar">
                <span>Ready</span>
            </div>
        );
    }
}
