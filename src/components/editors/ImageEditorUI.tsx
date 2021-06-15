import * as React from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import Env from "../../core/Env";
import { Errors, Tasks } from "../../core/TaskMgr";
import ImageEditor from "../../core/image/ImageEditor";

interface P {
    env: Env;
    lang: string;
    editor: ImageEditor;
}

interface S {
    tasks: Tasks;
    errors: Errors;
    editorLoaded: boolean;
    zoomed: boolean;
}

export default class ImageEditorUI extends React.PureComponent<P, S> {
    state = {
        tasks: this.props.env.taskMgr.getTasksFromEmitter(this.props.editor),
        errors: this.props.env.taskMgr.getErrorsFromEmitter(this.props.editor),
        editorLoaded: this.props.editor.isReady,
        zoomed: false
    };
    handleTasks = () => this.setState({ tasks: this.props.env.taskMgr.getTasksFromEmitter(this.props.editor) });
    handleErrors = () => this.setState({ errors: this.props.env.taskMgr.getErrorsFromEmitter(this.props.editor) });
    handleReady = () => {
        this.props.env.taskMgr.off("tasks", this.handleTasks);
        this.props.env.taskMgr.off("errors", this.handleErrors);
    };
    handleZoom = () => this.setState(({ zoomed }) => ({ zoomed: !zoomed }));
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
            <div className="ui-flex-row ui-flex-full" style={{ overflow: "auto", position: "relative" }}>
                <div className="ui-flex-column ui-flex-full" style={{ overflow: "auto", position: "relative", backgroundColor: "#222" }}>
                    <div className="image-editor-container" style={{ position: "absolute", width: "100%", height: "100%", overflow: "auto", display: this.state.zoomed ? "block" : "flex" }} data-id={this.props.editor.editorId}>
                        {
                            this.state.editorLoaded
                                ? <img style={this.state.zoomed ? { cursor: "zoom-out" } : { maxWidth: "100%", maxHeight: "100%", margin: "auto", cursor: "zoom-in" }} src={this.props.editor.instance.objectURL} onClick={this.handleZoom} />
                                : dimmer
                        }
                    </div>
                </div>
            </div>
        );
    }
}
