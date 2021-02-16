import * as React from "react";
import * as ReactDOM from "react-dom";
import { Faust, FaustAudioWorkletNode } from "faust2webaudio";
import { detectOS, detectBrowserCore } from "../utils/utils";
import { faustLangRegister } from "../misc/monaco-faust/register";
import { TypedEventEmitter } from "../utils/TypedEventEmitter";
import { TFaustDocs } from "../misc/monaco-faust/Faust2Doc";
import { EnvOptions, TErrorLevel, TPackage, TPatcherLog } from "./types";
import { getFaustLibObjects } from "./objects/Faust";
import Importer from "./objects/importer/Importer";
import { GlobalPackageManager } from "./PkgMgr";
import FileManager from "./FileMgr";
import TempManager from "./TempMgr";
import FileMgrWorker from "./workers/FileMgrWorker";
import WaveformWorker from "./workers/WaveformWorker";
import WavEncoderWorker from "./workers/WavEncoderWorker";
import FfmpegWorker from "./workers/FfmpegWorker";
import TaskManager from "./TaskMgr";
import Project from "./Project";
import FileInstance, { AnyFileInstance } from "./file/FileInstance";
import { AnyFileEditor } from "./file/FileEditor";
import UI from "../components/UI";
import PatcherAudio from "./audio/PatcherAudio";
import EditorContainer from "./EditorContainer";
import AudioWorkletRegister from "./worklets/AudioWorkletRegister";

const AudioContext = window.AudioContext || window.webkitAudioContext;

export interface EnvEventMap {
    "ready": never;
    "projectChanged": { project: Project; oldProject: Project };
    "activeInstance": { instance: AnyFileInstance; oldInstance: AnyFileInstance };
    "activeEditor": { editor: AnyFileEditor; oldEditor: AnyFileEditor };
    "openInstance": AnyFileInstance;
    "openEditor": AnyFileEditor;
    "activeEditorContainer": { editorContainer: EditorContainer; oldEditorContainer: EditorContainer ;}
    "instances": AnyFileInstance[];
    "newLog": TPatcherLog;
    "options": { options: EnvOptions; oldOptions: EnvOptions };
}

/**
 * Should have maximum 1 instance of Env per page.
 *
 * @export
 * @class Env
 */
export default class Env extends TypedEventEmitter<EnvEventMap> {
    readonly fileMgrWorker = new FileMgrWorker();
    readonly waveformWorker = new WaveformWorker();
    readonly wavEncoderWorker = new WavEncoderWorker();
    readonly ffmpegWorker = new FfmpegWorker();
    readonly audioCtx = new AudioContext({ latencyHint: 0.00001 });
    readonly os = detectOS();
    readonly browser = detectBrowserCore();
    readonly language = /* navigator.language === "zh-CN" ? "zh-CN" : */"en";
    readonly supportAudioWorklet = !!window.AudioWorklet;
    readonly taskMgr = new TaskManager();
    readonly fileMgr = new FileManager(this);
    readonly tempMgr = new TempManager(this);
    readonly editorContainer = new EditorContainer(this);
    readonly log: TPatcherLog[] = [];
    readonly AudioWorkletRegister = AudioWorkletRegister;
    Faust: typeof Faust;
    FaustAudioWorkletNode: typeof FaustAudioWorkletNode;
    faust: Faust;
    faustDocs: TFaustDocs;
    faustAdditionalObjects: TPackage;
    faustLibObjects: TPackage;
    pkgMgr: GlobalPackageManager;
    audioClipboard: PatcherAudio;
    loaded = false;
    private _activeInstance: AnyFileInstance;
    get activeInstance(): AnyFileInstance {
        return this._activeInstance;
    }
    set activeInstance(instance: AnyFileInstance) {
        if (this._activeInstance === instance) return;
        const oldInstance = this._activeInstance;
        this._activeInstance = instance;
        this.emit("activeInstance", { instance, oldInstance });
    }
    private _activeEditor: AnyFileEditor;
    get activeEditor(): AnyFileEditor {
        return this._activeEditor;
    }
    set activeEditor(editor: AnyFileEditor) {
        if (this._activeEditor === editor) return;
        const oldEditor = this._activeEditor;
        this._activeEditor = editor;
        if (editor) this.activeInstance = editor.instance;
        this.emit("activeEditor", { editor, oldEditor });
    }
    private _activeEditorContainer = this.editorContainer;
    get activeEditorContainer(): EditorContainer {
        return this._activeEditorContainer;
    }
    set activeEditorContainer(editorContainer: EditorContainer) {
        if (this._activeEditorContainer === editorContainer) {
            this.activeEditor = editorContainer.activeEditor;
            return;
        }
        const oldEditorContainer = this._activeEditorContainer;
        this._activeEditorContainer = editorContainer;
        this.activeEditor = editorContainer.activeEditor;
        this.emit("activeEditorContainer", { editorContainer, oldEditorContainer });
    }
    instances = new Set<FileInstance>();
    currentProject: Project;
    private _noUI: boolean;
    private _divRoot: HTMLDivElement;
    private _options: EnvOptions = {
        language: "en",
        audioUnit: "time",
        audioUnitOptions: {
            bpm: 60,
            beatsPerMeasure: 4,
            division: 16
        },
        audioDisplayOptions: {
            frameRate: 60,
            bgColor: "black",
            gridColor: "rgb(0, 53, 0)",
            phosphorColor: "rgb(67, 217, 150)",
            hueOffset: 0,
            seperatorColor: "grey",
            cursorColor: "rgba(191, 0, 0)"
        }
    };
    set options(options: EnvOptions) {
        const oldOptions = this._options;
        this._options = options;
        this.emit("options", { oldOptions, options });
    }
    get options() {
        return this._options;
    }
    constructor(root?: HTMLDivElement) {
        super();
        this._divRoot = root;
    }
    get ready() {
        return this.init();
    }
    async init() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlParamsOptions = {
            noUI: !!urlParams.get("min"),
            runtime: !!urlParams.get("runtime"),
            init: !!urlParams.get("init"),
            projectZip: urlParams.get("projectZip"),
            file: urlParams.get("file")
        };
        this._noUI = urlParamsOptions.noUI;
        if (!this._noUI && this.divRoot) ReactDOM.render(<UI env={this} lang={this.language} />, this.divRoot);

        await this.taskMgr.newTask(this, "Initializing JSPatcher Environment...", async () => {
            await this.taskMgr.newTask("Env", "Loading Faust2WebAudio...", async () => {
                const { Faust, FaustAudioWorkletNode } = await import("faust2webaudio");
                this.Faust = Faust;
                this.FaustAudioWorkletNode = FaustAudioWorkletNode;
            });
            await this.taskMgr.newTask(this, "Loading LibFaust...", async () => {
                const faust = new Faust({ wasmLocation: "./deps/libfaust-wasm.wasm", dataLocation: "./deps/libfaust-wasm.data" });
                await faust.ready;
                this.faustAdditionalObjects = Importer.import("faust", { FaustNode: this.FaustAudioWorkletNode }, true);
                this.faust = faust;
            });
            await this.taskMgr.newTask(this, "Fetching Faust Standard Library...", async () => {
                const faustPrimitiveLibFile = await fetch("./deps/primitives.lib");
                const faustPrimitiveLib = await faustPrimitiveLibFile.text();
                this.faust.fs.writeFile("./libraries/primitives.lib", faustPrimitiveLib);
            });
            await this.taskMgr.newTask(this, "Fetching Gen-to-Faust Library...", async () => {
                const gen2FaustLibFile = await fetch("./deps/gen2faust.lib");
                const gen2FaustLib = await gen2FaustLibFile.text();
                this.faust.fs.writeFile("./libraries/gen2faust.lib", gen2FaustLib);
            });
            await this.taskMgr.newTask(this, "Loading Monaco Editor...", async () => {
                const monacoEditor = await import("monaco-editor/esm/vs/editor/editor.api");
                const { providers } = await faustLangRegister(monacoEditor, this.faust);
                this.faustDocs = providers.docs;
                this.faustLibObjects = getFaustLibObjects(this.faustDocs);
            });
            await this.taskMgr.newTask(this, "Loading ffmpeg...", async () => {
                await this.ffmpegWorker.init();
            });
            await this.taskMgr.newTask(this, "Loading Files...", async (onUpdate) => {
                this.pkgMgr = new GlobalPackageManager(this);
                await this.pkgMgr.init();
                const project = new Project(this);
                this.currentProject = project;
                const { projectZip } = urlParamsOptions;
                if (projectZip) {
                    await this.fileMgr.init(project, true);
                    onUpdate(projectZip);
                    try {
                        const response = await fetch(projectZip);
                        const data = await response.arrayBuffer();
                        await this.loadFromZip(data);
                    } catch (error) {
                        await this.fileMgr.init(project, urlParamsOptions.init);
                    }
                } else {
                    await this.fileMgr.init(project, urlParamsOptions.init);
                }
                await this.tempMgr.init(project);
            });
            window.jspatcherEnv = this;
        });
        this.loaded = true;
        await this.emit("ready");
        const { file } = urlParamsOptions;
        if (file) {
            try {
                const item = this.fileMgr.getProjectItemFromPath(file);
                if (item.type !== "folder") {
                    const instance = await item.instantiate();
                    this.openInstance(instance);
                }
            } catch {}
        }
        /*
        const patcher = new Patcher(this.currentProject);
        this.activePatcher = patcher;
        window.patcher = patcher;

        this.emit("text", "Loading Patcher...");

        const fileName = urlParams.get("file");
        const mode = urlParams.get("mode");
        const runtime = urlparamsOptions.runtime;
        if (!fileName && !mode) {
            const localStoragePatcher = localStorage.getItem("__JSPatcher_Patcher");
            if (localStoragePatcher) await patcher.loadFromString(localStoragePatcher);
        } else if (fileName) {
            await patcher.loadFromURL("../examples/" + fileName);
        } else {
            if (mode === "gen" || mode === "faust") {
                await patcher.load({}, mode);
            }
        }
        patcher.on("changed", () => localStorage.setItem("__JSPatcher_Patcher", patcher.toStringEnv(null)));
        if (!this._noUI && this.divRoot) ReactDOM.render(urlparamsOptions.runtime ? <PatcherUI patcher={patcher} runtime /> : <UI patcher={patcher} />, this.divRoot);
        */
        return this;
    }
    openInstance(i: AnyFileInstance) {
        this.emit("openInstance", i);
        i.setActive();
    }
    openEditor(e: AnyFileEditor) {
        this.emit("openEditor", e);
        e.setActive();
    }
    registerInstance(i: AnyFileInstance) {
        this.instances.add(i);
        i.on("destroy", () => {
            this.instances.delete(i);
            this.emit("instances", Array.from(this.instances));
        });
        this.emit("instances", Array.from(this.instances));
    }
    async newProject() {
        const oldProject = this.currentProject;
        await oldProject?.unload();
        const project = new Project(this);
        this.currentProject = project;
        await project.load(true);
        this.emit("projectChanged", { project, oldProject });
        return project;
    }
    async reload() {
        await this.currentProject?.unload();
        await this.currentProject?.load();
    }
    async loadFromZip(data: ArrayBuffer) {
        const oldProject = this.currentProject;
        await oldProject?.unload();
        await this.fileMgr.emptyProject();
        const project = new Project(this);
        this.currentProject = project;
        await this.fileMgr.importFileZip(data);
        await project.load();
        this.emit("projectChanged", { project, oldProject });
        return project;
    }
    newLog(errorLevel: TErrorLevel, title: string, message: string, emitter?: any) {
        const log = { errorLevel, title, message, emitter };
        this.log.push(log);
        this.emit("newLog", log);
    }
    get divRoot(): HTMLDivElement {
        return this._divRoot;
    }
    set divRoot(root: HTMLDivElement) {
        if (root === this._divRoot) return;
        if (!this._noUI && this._divRoot) ReactDOM.unmountComponentAtNode(this._divRoot);
        this._divRoot = root;
        // if (!this._noUI && root) ReactDOM.render(this.loaded ? <UI patcher={this.activeInstance} /> : <LoaderUI env={this} />, root);
    }
}
