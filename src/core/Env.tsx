import * as React from "react";
import * as ReactDOM from "react-dom";
import type * as Faust from "@shren/faustwasm";
import { VERSION as wamApiVersion } from "@webaudiomodules/api";
import { addFunctionModule, initializeWamEnv, initializeWamGroup } from "@webaudiomodules/sdk";
import TypedEventEmitter, { ITypedEventEmitter } from "../utils/TypedEventEmitter";
import GlobalPackageManager from "./GlobalPackageManager";
import PersistentProjectItemManager, { IPersistentProjectItemManager } from "./file/PersistentProjectItemManager";
import TemporaryProjectItemManager from "./file/TemporaryProjectItemManager";
import FFTWWorker from "./workers/FFTWWorker";
import FileMgrWorker from "./workers/FileMgrWorker";
import LibMusicXMLWorker from "./workers/LibMusicXMLWorker";
import GuidoWorker from "./workers/GuidoWorker";
import WaveformWorker from "./workers/WaveformWorker";
import WavEncoderWorker from "./workers/WavEncoderWorker";
import FFmpegWorker from "./workers/FFmpegWorker";
import TaskManager from "./TaskMgr";
import Project, { ProjectProps } from "./Project";
import UI from "../components/UI";
import EditorContainer from "./EditorContainer";
import AudioWorkletRegister from "./worklets/AudioWorkletRegister";
import JSPatcherSDK, { IJSPatcherSDK } from "./SDK";
import WorkletEnvNode from "./worklets/WorkletEnv";
import LiveShare from "./LiveShare";
import GlobalTransportNode from "./worklets/GlobalTransportNode";
import EnvOptionsManager from "./EnvOptionsManager";
import Logger from "./Logger";
import { getFaustLibObjects } from "./objects/Faust";
import { faustLangRegister } from "../misc/monaco-faust/register";
import { detectOS, detectBrowserCore, getTimestamp } from "../utils/utils";
import type PatcherAudio from "./audio/PatcherAudio";
import type { IFileEditor } from "./file/FileEditor";
import type { IFileInstance } from "./file/FileInstance";
import type { TFaustDocs } from "../misc/monaco-faust/Faust2Doc";
import type { TErrorLevel, TPackage, ILogInfo } from "./types";
import type { EnvOptions, PartialEnvOptions } from "./EnvOptionsManager";
/*
import LibMusicXMLWorker from "./workers/LibMusicXMLWorker";
import GuidoWorker from "./workers/GuidoWorker";
*/

const AudioContext = window.AudioContext || window.webkitAudioContext;
const SharedArrayBuffer = window.SharedArrayBuffer || window.ArrayBuffer;

export interface EnvEventMap {
    "ready": never;
    "projectChanged": { project: Project; oldProject: Project };
    "activeInstance": { instance: IFileInstance; oldInstance: IFileInstance };
    "activeEditor": { editor: IFileEditor; oldEditor: IFileEditor };
    "openInstance": IFileInstance;
    "openEditor": IFileEditor;
    "activeEditorContainer": { editorContainer: EditorContainer; oldEditorContainer: EditorContainer };
    "instances": IFileInstance[];
    "newLog": ILogInfo;
    "options": { options: EnvOptions; oldOptions: EnvOptions };
}
export interface IJSPatcherEnv extends ITypedEventEmitter<EnvEventMap> {
    readonly thread: "main" | "AudioWorklet";
    readonly os: "Windows" | "MacOS" | "UNIX" | "Linux" | "Unknown";
    readonly browser: "Unknown" | "Chromium" | "Gecko" | "WebKit";
    readonly sdk: IJSPatcherSDK;
    readonly pkgMgr: Partial<GlobalPackageManager>;
    /** Show as status what task is proceeding */
    readonly taskMgr: TaskManager;
    readonly fileMgr: IPersistentProjectItemManager;
    readonly tempMgr: TemporaryProjectItemManager;
    readonly currentProject: Project;
    readonly username: string;
    readonly autoSave: boolean;
    activeInstance: IFileInstance;
    activeEditor: IFileEditor;
    instances: Set<IFileInstance>;
    /** Generate a global unique ID */
    generateId(objectIn: object): string;
    getInstanceById(id: string): IFileInstance;
    /** @returns A new unique ID for the instance */
    registerInstance(instanceIn: IFileInstance, id?: string): string;
    newLog(errorLevel: TErrorLevel, title: string, message: string, emitter?: any): void;
}

/**
 * Should have maximum 1 instance of Env per page.
 */
export default class Env extends TypedEventEmitter<EnvEventMap> implements IJSPatcherEnv {
    readonly thread = "main";
    readonly generatedId = new Uint32Array(new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT));
    readonly fftwWorker = new FFTWWorker();
    readonly fileMgrWorker = new FileMgrWorker();
    readonly waveformWorker = new WaveformWorker();
    readonly wavEncoderWorker = new WavEncoderWorker();
    readonly ffmpegWorker = new FFmpegWorker();
    readonly libMusicXMLWorker = new LibMusicXMLWorker();
    readonly guidoWorker = new GuidoWorker();
    readonly audioCtx = new AudioContext({ latencyHint: 0.00001 });
    readonly os = detectOS();
    readonly browser = detectBrowserCore();
    readonly taskMgr = new TaskManager();
    readonly fileMgr: PersistentProjectItemManager = new PersistentProjectItemManager(this, this.fileMgrWorker);
    readonly tempMgr: TemporaryProjectItemManager = new TemporaryProjectItemManager(this);
    readonly editorContainer = new EditorContainer(this);
    readonly logger = new Logger();
    readonly AudioWorkletRegister = AudioWorkletRegister;
    readonly sdk = new JSPatcherSDK();
    readonly liveShare = new LiveShare(this);
    readonly wamGroupId = this.generateId(this);
    readonly wamGroupKey = this.generateId(this);
    envNode: WorkletEnvNode;
    globalTransportNode: GlobalTransportNode;
    Faust: typeof Faust;
    faustCompiler: Faust.FaustCompiler;
    faustDocs: TFaustDocs;
    // faustAdditionalObjects: TPackage;
    faustLibObjects: TPackage;
    pkgMgr: GlobalPackageManager;
    audioClipboard: PatcherAudio;
    loaded = false;
    get username() {
        return this.options.liveShare.nickname;
    }
    private _activeInstance: IFileInstance;
    get activeInstance(): IFileInstance {
        return this._activeInstance;
    }
    set activeInstance(instance: IFileInstance) {
        if (this._activeInstance === instance) return;
        const oldInstance = this._activeInstance;
        this._activeInstance = instance;
        this.emit("activeInstance", { instance, oldInstance });
    }
    private _activeEditor: IFileEditor;
    get activeEditor(): IFileEditor {
        return this._activeEditor;
    }
    set activeEditor(editor: IFileEditor) {
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
    instances = new Set<IFileInstance>();
    currentProject: Project;
    private _divRoot: HTMLDivElement;
    private _options = new EnvOptionsManager(this);
    set options(options: PartialEnvOptions) {
        this._options.setOptions(options);
    }
    get options(): EnvOptions {
        return this._options.currentOptions;
    }
    get autoSave() {
        return this._options.currentOptions.autoSave;
    }
    constructor(root?: HTMLDivElement) {
        super();
        window.jspatcherEnv = this;
        this._divRoot = root;
    }
    get ready() {
        return this.init();
    }
    async getFaustCompiler() {
        return this.faustCompiler;
    }
    async getFFmpeg() {
        return this.taskMgr.newTask(this, "Loading ffmpeg...", async () => {
            await this.ffmpegWorker.init();
            return this.ffmpegWorker;
        });
    }
    async getGuido() {
        return this.taskMgr.newTask(this, "Loading Guido...", async () => {
            await this.guidoWorker.init();
            return this.guidoWorker;
        });
    }
    async getLibMusicXML() {
        return this.taskMgr.newTask(this, "Loading LibMusicXML...", async () => {
            await this.libMusicXMLWorker.init();
            return this.libMusicXMLWorker;
        });
    }
    async getFFTW() {
        return this.taskMgr.newTask(this, "Loading FFTW...", async () => {
            await this.fftwWorker.init();
            return this.fftwWorker;
        });
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
        this.options.noUI = urlParamsOptions.noUI;
        this.options.runtime = urlParamsOptions.runtime;
        if (!this.options.noUI && this.divRoot) ReactDOM.render(<UI env={this} />, this.divRoot);

        await this.taskMgr.newTask(this, "Initializing JSPatcher Environment...", async () => {
            await this.taskMgr.newTask("Env", "Loading FaustWasm...", async () => {
                const Faust = await import("@shren/faustwasm");
                this.Faust = Faust;
            });
            await this.taskMgr.newTask(this, "Loading LibFaust...", async () => {
                const { instantiateFaustModuleFromFile, LibFaust, FaustCompiler } = this.Faust;
                const faustModule = await instantiateFaustModuleFromFile("./deps/libfaust-wasm.js");
                const libFaust = new LibFaust(faustModule);
                const faustCompiler = new FaustCompiler(libFaust);
                this.faustCompiler = faustCompiler;
            });
            await this.taskMgr.newTask(this, "Fetching Faust Standard Library...", async () => {
                const faustPrimitiveLibFile = await fetch("./deps/primitives.lib");
                const faustPrimitiveLib = await faustPrimitiveLibFile.text();
                this.faustCompiler.fs().writeFile("/usr/share/faust/primitives.lib", faustPrimitiveLib);
            });
            await this.taskMgr.newTask(this, "Fetching Gen-to-Faust Library...", async () => {
                const gen2FaustLibFile = await fetch("./deps/gen2faust.lib");
                const gen2FaustLib = await gen2FaustLibFile.text();
                this.faustCompiler.fs().writeFile("/usr/share/faust/gen2faust.lib", gen2FaustLib);
            });
            await this.taskMgr.newTask(this, "Loading Monaco Editor...", async () => {
                const { monaco } = await import("react-monaco-editor");
                const { providers } = await faustLangRegister(monaco, this.faustCompiler);
                this.faustDocs = providers.docs;
                this.faustLibObjects = getFaustLibObjects(this.faustDocs);
            });
            await this.taskMgr.newTask(this, "Loading Files...", async (onUpdate) => {
                this.pkgMgr = new GlobalPackageManager(this);
                await this.pkgMgr.init();
                const { projectZip } = urlParamsOptions;
                if (projectZip) {
                    await this.fileMgr.init(true);
                    onUpdate(projectZip);
                    try {
                        const response = await fetch(projectZip);
                        const data = await response.arrayBuffer();
                        await this.loadFromZip(data);
                    } catch (error) {
                        await this.fileMgr.init(urlParamsOptions.init);
                    }
                } else {
                    await this.fileMgr.init(urlParamsOptions.init);
                }
                await this.tempMgr.init();
            });
            await this.taskMgr.newTask(this, "Loading Worklet...", async () => {
                const { audioWorklet } = this.audioCtx;
                await WorkletEnvNode.register(audioWorklet);
                this.envNode = new WorkletEnvNode(this.audioCtx, this);
                await this.envNode.init();
                /* SharedArrayBuffer
                await GlobalTransportNode.register(audioWorklet);
                this.globalTransportNode = new GlobalTransportNode(this.audioCtx);
                */
            });
            await this.taskMgr.newTask(this, "Initializing WamEnv...", async () => {
                const { audioWorklet } = this.audioCtx;
                await addFunctionModule(audioWorklet, initializeWamEnv, wamApiVersion);
                await addFunctionModule(audioWorklet, initializeWamGroup, this.wamGroupId, this.wamGroupKey);
            });
            await this.taskMgr.newTask(this, "Fetching packages...", async (onUpdate) => {
                const packagesRes = await fetch("./packages/internal-packages.json");
                const packages = await packagesRes.json();
                for (const p of packages) {
                    onUpdate(p);
                    await this.pkgMgr.importFromURL(`./packages/${p}/index.js`, undefined, true);
                    // await this.pkgMgr.importFromURL(`../../@jspatcher/package-${p}/dist/index.js`, undefined, true);
                }
                // this.pkgMgr.add(this.faustAdditionalObjects, "js", ["faust"]);
                // await this.pkgMgr.importFromURL("../../@jspatcher/package-cac/dist/index.js", undefined, true);
                onUpdate("internal");
                await this.pkgMgr.postInit();
            });
            await this.taskMgr.newTask(this, "Creating Project", async () => {
                const project = new Project(this);
                this.currentProject = project;
                await project.init();
            });
        });
        this.audioCtx.destination.channelCount = this.audioCtx.destination.maxChannelCount;
        this.loaded = true;
        await this.emit("ready");
        const { file } = urlParamsOptions;
        if (file) {
            try {
                const item = this.fileMgr.getProjectItemFromPath(file);
                if (item.type !== "folder") {
                    const editor = await item.instantiateEditor({ env: this, project: this.currentProject });
                    this.openEditor(editor);
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
    }
    generateId(objectIn: object) {
        return this.thread + objectIn.constructor.name + (globalThis.Atomics?.add(this.generatedId, 0, 1) ?? ++this.generatedId[0]);
    }
    openInstance(i: IFileInstance, background = false) {
        this.emit("openInstance", i);
        if (!background) i.setActive();
    }
    openEditor(e: IFileEditor, background = false) {
        this.emit("openEditor", e);
        if (!background) e.setActive();
    }
    registerInstance(i: IFileInstance, id?: string) {
        this.instances.add(i);
        i.once("destroy", () => {
            this.instances.delete(i);
            this.emit("instances", Array.from(this.instances));
        });
        this.emit("instances", Array.from(this.instances));
        if (!id) return this.generateId(i);
        return id;
    }
    getInstanceById(id: string) {
        for (const instance of this.instances) {
            if (instance.id === id) return instance;
        }
        return null;
    }
    async newProject(props?: ProjectProps) {
        const oldProject = this.currentProject;
        await oldProject?.unload();
        const project = new Project(this, props);
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
        await this.fileMgr.importFileZip(data, undefined, undefined, this);
        await project.init();
        this.emit("projectChanged", { project, oldProject });
        return project;
    }
    newLog(errorLevel: TErrorLevel, title: string, message: string, emitter?: any) {
        const log = { errorLevel, title, message, emitter, timestamp: getTimestamp() };
        this.logger.push(log);
        this.emit("newLog", log);
    }
    get divRoot(): HTMLDivElement {
        return this._divRoot;
    }
    set divRoot(root: HTMLDivElement) {
        if (root === this._divRoot) return;
        if (!this.options.noUI && this._divRoot) ReactDOM.unmountComponentAtNode(this._divRoot);
        this._divRoot = root;
        // if (!this._noUI && root) ReactDOM.render(this.loaded ? <UI patcher={this.activeInstance} /> : <LoaderUI env={this} />, root);
    }
}
