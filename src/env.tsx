import * as React from "react";
import * as ReactDOM from "react-dom";
import { Dimmer, Loader } from "semantic-ui-react";
import { Faust, FaustAudioWorkletNode } from "faust2webaudio";
import { detectOS } from "./utils/utils";
import { faustLangRegister } from "./misc/monaco-faust/register";
import { TypedEventEmitter } from "./utils/TypedEventEmitter";
import { TFaustDocs } from "./misc/monaco-faust/Faust2Doc";
import { TPackage, TSharedData, TSharedDataConsumers } from "./core/types";
import { getFaustLibObjects } from "./core/objects/Faust";
import Patcher from "./core/Patcher";
import Importer from "./core/objects/importer/Importer";
import UI from "./components/UI";
import PatcherUI from "./components/PatcherUI";

const AudioContext = window.AudioContext || window.webkitAudioContext;

export class LoaderUI extends React.PureComponent<{ env: Env }, { text: string }> {
    state = { text: "Loading..." };
    handleText = (text: string): void => this.setState({ text });
    componentDidMount() {
        this.props.env.on("text", this.handleText);
    }
    componentWillUnmount() {
        this.props.env.off("text", this.handleText);
    }
    render() {
        return <Dimmer active><Loader content={this.state.text} /></Dimmer>;
    }
}
/**
 * Should have maximum 1 instance of Env per page.
 *
 * @export
 * @class Env
 */
export default class Env extends TypedEventEmitter<{ text: string }> {
    loaded = false;
    readonly audioCtx = new AudioContext({ latencyHint: 0.00001 });
    readonly os = detectOS();
    readonly supportAudioWorklet = !!window.AudioWorklet;
    readonly data: TSharedData = {};
    readonly dataConsumers: TSharedDataConsumers = {};
    readonly modules = new Map<string, { [key: string]: any }>();
    Faust: typeof Faust;
    FaustAudioWorkletNode: typeof FaustAudioWorkletNode;
    faust: Faust;
    faustDocs: TFaustDocs;
    faustAdditionalObjects: TPackage;
    faustLibObjects: TPackage;
    faustInjected = false;
    patcher: Patcher;
    active: Patcher;
    private _noUI: boolean;
    private _divRoot: HTMLDivElement;
    constructor(root?: HTMLDivElement) {
        super();
        this._divRoot = root;
    }
    get ready() {
        return this.init();
    }
    async init() {
        const urlParams = new URLSearchParams(window.location.search);
        this._noUI = !!urlParams.get("min");
        if (!this._noUI && this.divRoot) ReactDOM.render(<LoaderUI env={this} />, this.divRoot);

        this.emit("text", "Loading Faust2WebAudio...");
        const { Faust, FaustAudioWorkletNode } = await import("faust2webaudio");
        this.Faust = Faust;
        this.FaustAudioWorkletNode = FaustAudioWorkletNode;

        this.emit("text", "Loading LibFaust...");
        const faust = new Faust({ wasmLocation: "./deps/libfaust-wasm.wasm", dataLocation: "./deps/libfaust-wasm.data" });
        await faust.ready;
        this.faustAdditionalObjects = Importer.import("faust", { FaustNode: this.FaustAudioWorkletNode }, true);

        this.emit("text", "Fetching Faust Standard Library...");
        const faustPrimitiveLibFile = await fetch("./deps/primitives.lib");
        const faustPrimitiveLib = await faustPrimitiveLibFile.text();
        faust.fs.writeFile("./libraries/primitives.lib", faustPrimitiveLib);

        this.emit("text", "Fetching Gen-to-Faust Library...");
        const gen2FaustLibFile = await fetch("./deps/gen2faust.lib");
        const gen2FaustLib = await gen2FaustLibFile.text();
        faust.fs.writeFile("./libraries/gen2faust.lib", gen2FaustLib);

        this.emit("text", "Loading Monaco Editor...");
        const monacoEditor = await import("monaco-editor/esm/vs/editor/editor.api");
        const { providers } = await faustLangRegister(monacoEditor, faust);
        this.faustDocs = providers.docs;
        this.faustLibObjects = getFaustLibObjects(this.faustDocs);

        this.faust = faust;
        const patcher = new Patcher(this);
        this.patcher = patcher;
        this.active = patcher;
        window.patcher = patcher;

        this.emit("text", "Loading Patcher...");

        const fileName = urlParams.get("file");
        const mode = urlParams.get("mode");
        const runtime = !!urlParams.get("runtime");
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
        this.patcher.on("graphChanged", () => localStorage.setItem("__JSPatcher_Patcher", this.patcher.toStringEnv(null)));
        if (!this._noUI && this.divRoot) ReactDOM.render(runtime ? <PatcherUI patcher={patcher} runtime /> : <UI patcher={patcher} />, this.divRoot);
        this.loaded = true;
        return this;
    }
    get divRoot(): HTMLDivElement {
        return this._divRoot;
    }
    set divRoot(root: HTMLDivElement) {
        if (root === this._divRoot) return;
        if (!this._noUI && this._divRoot) ReactDOM.unmountComponentAtNode(this._divRoot);
        this._divRoot = root;
        if (!this._noUI && root) ReactDOM.render(this.loaded ? <UI patcher={this.patcher} /> : <LoaderUI env={this} />, root);
    }
}
