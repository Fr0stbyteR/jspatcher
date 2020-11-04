import * as React from "react";
import TopMenu from "./topmenu/TopMenu";
import RightMenu from "./rightmenu/RightMenu";
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
}

export default class UI extends React.PureComponent<P, S> {
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
    handleErrors = (errors: TaskManagerEventMap["errors"]) => {
        this.setState({ errors });
    };
    componentDidMount() {
        if (!this.props.env.loaded) this.props.env.taskMgr.on("tasks", this.handleTasks);
    }
    componentWillUnmount() {
        this.props.env.taskMgr.on("tasks", this.handleTasks);
    }
    render() {
        return (
            <div id="jspatcher-root">
                <TopMenu {...this.props} />
                <div className="ui-flex-row">
                    <div className="ui-left">
                        <LeftMenu {...this.props} />
                    </div>
                    <div className="ui-center">
                        <EditorContainerUI {...this.props} editorContainer={this.props.env.editorContainer} />
                    </div>
                    <div className="ui-right" onKeyDown={this.handleKeyDown}>
                        <RightMenu {...this.props} />
                    </div>
                </div>
                <StatusBar {...this.props} lang={this.props.env.language} />
            </div>
        );
    }
}
