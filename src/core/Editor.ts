import Env from "./Env";
import { TypedEventEmitter } from "../utils/TypedEventEmitter";
import Patcher from "./Patcher";
import { EditorEventMap, EditorState, FileManagerEventMap } from "./types";

export default class Editor extends TypedEventEmitter<EditorEventMap> {
    readonly state: EditorState = {
        env: undefined,
        fileName: undefined,
        clipboard: undefined,
        editing: [],
        fileState: {}
    };
    constructor(env: Env) {
        super();
        this.state.env = env;
    }
    async init() {
        this.state.env.fileMgr.on("editFile", this.handleEditFile);
        this.state.env.fileMgr.on("stopEditFile", this.handleStopEditFile);
        this.state.env.fileMgr.on("fileNameChanged", this.handleFileNameChanged);
        return this;
    }
    get env() {
        return this.state.env;
    }
    get currentPatcher() {
        return typeof this.state.fileName === "string" ? this.state.fileState[this.state.fileName] : undefined;
    }
    setState(state: Partial<EditorState>) {
        Object.assign(this.state, state);
    }
    handleFileNameChanged = (e: FileManagerEventMap["fileNameChanged"]) => {
        const { oldFileName, newFileName } = e;
        if (!this.state.fileState[oldFileName]) return;
        this.state.fileState[newFileName] = this.state.fileState[oldFileName];
        delete this.state.fileState[oldFileName];
    };
    handleEditFile = (e: FileManagerEventMap["editFile"]) => {
        const { fileName, data } = e;
        this.setState({ fileName });
        let patcher: Patcher;
        if (!this.state.fileState[fileName]) {
            patcher = new Patcher(this.env);
            patcher.load(data);
            this.state.fileState[fileName] = patcher;
        } else {
            patcher = this.state.fileState[fileName];
        }
        const { buffer, waveformData, cursor, selRange, viewRange, enabledChannels } = this.state.fileState[fileName];
        const event = { fileName, patcher };
        this.emit("editFile", event);
    };
    handleStopEditFile = async (e: FileManagerEventMap["stopEditFile"]) => {
        if (this.state.playing !== "stopped") this.stop();
        if (this.state.monitoring) this.stopMonitoring();
        if (this.state.recording) await this.stopRecord();
        this.setState({ fileName: undefined });
        this.emit("stopEditFile", e);
    };
}
