import * as React from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import Env from "../../core/Env";
import { TaskError, Task } from "../../core/TaskMgr";
import VideoEditor from "../../core/video/VideoEditor";

interface P {
    env: Env;
    lang: string;
    editor: VideoEditor;
}

interface S {
    tasks: Task[];
    errors: TaskError[];
    editorLoaded: boolean;
}

export default class VideoEditorUI extends React.PureComponent<P, S> {
    state = {
        tasks: this.props.env.taskMgr.getTasksFromEmitter(this.props.editor),
        errors: this.props.env.taskMgr.getErrorsFromEmitter(this.props.editor),
        editorLoaded: this.props.editor.isReady
    };
    handleTasks = () => this.setState({ tasks: this.props.env.taskMgr.getTasksFromEmitter(this.props.editor) });
    handleErrors = () => this.setState({ errors: this.props.env.taskMgr.getErrorsFromEmitter(this.props.editor) });
    handleReady = () => {
        this.props.env.taskMgr.off("tasks", this.handleTasks);
        this.props.env.taskMgr.off("errors", this.handleErrors);
    };
    async componentDidMount() {
        this.setState({ editorLoaded: this.props.editor.isReady });
        if (!this.props.editor.isReady) {
            this.props.editor.on("ready", this.handleReady);
            this.props.env.taskMgr.on("tasks", this.handleTasks);
            this.props.env.taskMgr.on("errors", this.handleErrors);
        }
    }
    componentWillUnmount() {
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
                    <p>Loading Video...</p>
                    {tasks.map(t => <p key={t.id}>{t.message}</p>)}
                    {errors.map(t => <p style={{ color: "red" }} key={`Error${t.id}`}>Error while: {t.message}: {t.error.message}</p>)}
                </Loader>
            </Dimmer>;
        }
        return (
            <div className="ui-flex-row ui-flex-full" style={{ overflow: "auto", position: "relative" }}>
                <div className="ui-flex-column ui-flex-full" style={{ overflow: "auto", position: "relative", backgroundColor: "#222" }}>
                    <div className="image-editor-container" style={{ position: "absolute", width: "100%", height: "100%", overflow: "auto", display: "flex" }} data-id={this.props.editor.editorId}>
                        {
                            this.state.editorLoaded
                                ? <video style={{ maxWidth: "100%", maxHeight: "100%", margin: "auto" }} src={this.props.editor.instance.objectURL} controls />
                                : dimmer
                        }
                    </div>
                </div>
            </div>
        );
    }
}
