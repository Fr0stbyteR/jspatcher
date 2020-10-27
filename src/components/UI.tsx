import * as React from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import Patcher from "../core/Patcher";
import TopMenu from "./topmenu/TopMenu";
import PatcherUI from "./PatcherUI";
import BottomMenu from "./BottomMenu";
import RightMenu from "./RightMenu";
import LeftMenu from "./LeftMenu";
import "./UI.scss";
import Env from "../core/Env";
import { Errors, TaskManagerEventMap, Tasks } from "../core/TaskMgr";
import StatusBar from "./StatusBar";

interface S {
    tasks: Tasks;
    errors: Errors;
}

export default class UI extends React.PureComponent<{ env: Env }, S> {
    state: S = { tasks: this.props.env.taskMgr.tasks, errors: this.props.env.taskMgr.errors };
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
            this.setState({ tasks: {}, errors: {} });
            this.props.env.taskMgr.on("tasks", this.handleTasks);
        } else {
            this.setState({ tasks });
        }
    };
    handleErrors = (errors: TaskManagerEventMap["error"]) => {
        this.setState({ errors });
    };
    componentDidMount() {
        if (!this.props.env.loaded) this.props.env.taskMgr.on("tasks", this.handleTasks);
    }
    componentWillUnmount() {
        this.props.env.taskMgr.on("tasks", this.handleTasks);
    }
    render() {
        let dimmer: JSX.Element;
        if (Object.keys(this.state.tasks)) {
            const { tasks, errors } = this.state;
            dimmer = <Dimmer active>
                <Loader>
                    <p>Initializing JSPatcher Environment...</p>
                    {Object.keys(tasks).map(t => <p key={t}>{tasks[+t].message}</p>)}
                    {Object.keys(errors).map(t => <p style={{ color: "red" }} key={t}>Error while: {errors[+t].message}: {errors[+t].error.message}</p>)}
                </Loader>
            </Dimmer>;
        }
        return (
            <div id="jspatcher-root">
                <TopMenu {...this.props} />
                <div className="ui-left" onKeyDown={this.handleKeyDown} onMouseDown={this.handleMouseDown}>
                    <LeftMenu {...this.props} />
                </div>
                <div className="ui-center" onMouseDown={this.handleMouseDown}>
                    <div className="patcher-container">
                        {dimmer}
                        <PatcherUI {...this.props} />
                    </div>
                    <BottomMenu {...this.props} />
                </div>
                <div className="ui-right" onKeyDown={this.handleKeyDown} onMouseDown={this.handleMouseDown}>
                    <RightMenu {...this.props} />
                </div>
                <StatusBar {...this.props} lang={this.props.env.language} />
            </div>
        );
    }
}
