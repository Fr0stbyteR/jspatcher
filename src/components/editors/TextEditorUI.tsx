import * as React from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import type { monaco } from "react-monaco-editor";
import TextEditor from "../../core/text/TextEditor";
import type Env from "../../core/Env";
import type { TaskError, Task } from "../../core/TaskMgr";

interface P {
    env: Env;
    lang: string;
    editor: TextEditor;
}

interface S {
    tasks: Task[];
    errors: TaskError[];
    editorLoaded: boolean;
    language: string;
}

export default class TextEditorUI extends React.PureComponent<P, S> {
    state = {
        tasks: this.props.env.taskMgr.getTasksFromEmitter(this.props.editor),
        errors: this.props.env.taskMgr.getErrorsFromEmitter(this.props.editor),
        editorLoaded: !!this.props.editor.editorJSX,
        language: this.props.editor.editorLanguage
    };
    handleTasks = () => this.setState({ tasks: this.props.env.taskMgr.getTasksFromEmitter(this.props.editor) });
    handleErrors = () => this.setState({ errors: this.props.env.taskMgr.getErrorsFromEmitter(this.props.editor) });
    handleReady = () => {
        this.props.env.taskMgr.off("tasks", this.handleTasks);
        this.props.env.taskMgr.off("errors", this.handleErrors);
    };
    handleCodeEditorMount = (monaco: monaco.editor.IStandaloneCodeEditor) => {
        this.props.editor.bindEditor(monaco);
    };
    handleResize = () => (this.state.editorLoaded ? this.props.editor.editor.layout() : undefined);
    handleChange = (value: string, event: monaco.editor.IModelContentChangedEvent) => {
        this.props.editor.text = value;
    };
    async componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        this.props.editor.on("ready", this.handleReady);
        if (!this.props.editor.isReady) {
            this.props.env.taskMgr.on("tasks", this.handleTasks);
            this.props.env.taskMgr.on("errors", this.handleErrors);
        }
        const reactMonacoEditor = await import("react-monaco-editor");
        this.props.editor.editorJSX = reactMonacoEditor.default;
        this.setState({ editorLoaded: true });
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
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
                    <p>Loading Text...</p>
                    {tasks.map(t => <p key={t.id}>{t.message}</p>)}
                    {errors.map(t => <p style={{ color: "red" }} key={`Error${t.id}`}>Error while: {t.message}: {t.error.message}</p>)}
                </Loader>
            </Dimmer>;
        }
        return (
            <div className="ui-flex-row ui-flex-full" style={{ overflow: "auto", position: "relative" }}>
                <div className="ui-flex-column ui-flex-full" style={{ overflow: "auto", position: "relative" }}>
                    <div className="text-editor-container" style={{ position: "absolute", width: "100%", height: "100%", overflow: "hidden" }} data-id={this.props.editor.editorId}>
                        {
                            this.state.editorLoaded
                                ? <this.props.editor.editorJSX value={this.props.editor.text} language={this.state.language} theme="vs-dark" editorDidMount={this.handleCodeEditorMount} onChange={this.handleChange} options={{ fontSize: 12 }} />
                                : dimmer
                        }
                    </div>
                </div>
            </div>
        );
    }
}
