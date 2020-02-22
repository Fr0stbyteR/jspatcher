import * as React from "react";
import * as ReactDOM from "react-dom";
import { Dimmer, Loader } from "semantic-ui-react";
import { Faust, FaustAudioWorkletNode } from "faust2webaudio";
import { detectOS } from "./utils/utils";
import { faustLangRegister } from "./misc/monaco-faust/register";
import Patcher from "./core/Patcher";
import UI from "./components/UI";
import { MappedEventEmitter } from "./utils/MappedEventEmitter";
import { TFaustDocs } from "./misc/monaco-faust/Faust2Doc";
import PatcherUI from "./components/PatcherUI";
import { TPackage } from "./core/types";
import Importer from "./core/objects/importer/Importer";
import { getFaustLibObjects } from "./core/objects/Faust";

const AudioContext = window.AudioContext || window.webkitAudioContext;

export class LoaderUI extends React.Component<{ env: Env }, { text: string }> {
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
export default class Env extends MappedEventEmitter<{ text: string }> {
    loaded = false;
    audioCtx = new AudioContext({ latencyHint: 0.00001 });
    os = detectOS();
    supportAudioWorklet = !!window.AudioWorklet;
    Faust: typeof Faust;
    FaustAudioWorkletNode: typeof FaustAudioWorkletNode;
    faust: Faust;
    faustDocs: TFaustDocs;
    faustAdditionalObjects: TPackage;
    faustLibObjects: TPackage;
    faustInjected = false;
    patcher: Patcher;
    private _divRoot: HTMLDivElement;
    constructor(root?: HTMLDivElement) {
        super();
        this.divRoot = root;
    }
    async init() {
        if (this.divRoot) ReactDOM.render(<LoaderUI env={this} />, this.divRoot);

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

        this.emit("text", "Loading Monaco Editor...");
        const monacoEditor = await import("monaco-editor/esm/vs/editor/editor.api");
        const { providers } = await faustLangRegister(monacoEditor, faust);
        this.faustDocs = providers.docs;
        this.faustLibObjects = getFaustLibObjects(this.faustDocs);

        this.faust = faust;
        const patcher = new Patcher(this);
        this.patcher = patcher;
        window.patcher = patcher;

        this.emit("text", "Loading Patcher...");

        const urlParams = new URLSearchParams(window.location.search);
        const fileName = urlParams.get("file");
        if (fileName) {
            patcher.loadFromURL("../examples/" + fileName);
        } else {
            const mode = urlParams.get("mode");
            if (mode === "gen" || mode === "faust") {
                patcher.load({}, mode);
            }
        }
        const runtime = !!urlParams.get("runtime");
        if (runtime) patcher.setState({ runtime });
        if (this.divRoot) ReactDOM.render(runtime ? <PatcherUI patcher={patcher} /> : <UI patcher={patcher} />, this.divRoot);
        this.loaded = true;
    }
    get divRoot(): HTMLDivElement {
        return this._divRoot;
    }
    set divRoot(root: HTMLDivElement) {
        if (root === this._divRoot) return;
        if (this._divRoot) ReactDOM.unmountComponentAtNode(this._divRoot);
        this._divRoot = root;
        if (root) ReactDOM.render(this.loaded ? <UI patcher={this.patcher} /> : <LoaderUI env={this} />, root);
    }
}
