import * as React from "react";
import * as ReactDOM from "react-dom";
import { Dimmer, Loader } from "semantic-ui-react";
import { Faust } from "faust2webaudio";
import { detectOS } from "./utils/utils";
import { faustLangRegister } from "./misc/monaco-faust/register";
import Patcher from "./core/Patcher";
import Importer from "./core/objects/importer/Importer";
import UI from "./components/UI";
import { MappedEventEmitter } from "./utils/MappedEventEmitter";
import { TFaustDocs } from "./misc/monaco-faust/Faust2Doc";
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
    audioCtx = new AudioContext({ latencyHint: 0.00001 });
    os = detectOS();
    supportAudioWorklet = !!window.AudioWorklet;
    faust: Faust;
    faustDocs: TFaustDocs;
    async init() {
        ReactDOM.render(
            <LoaderUI env={this} />,
            document.getElementById("root")
        );

        this.emit("text", "Loading Faust2WebAudio...");
        const { Faust, FaustAudioWorkletNode } = await import("faust2webaudio");

        this.emit("text", "Loading LibFaust...");
        const faust = new Faust({ wasmLocation: "./deps/libfaust-wasm.wasm", dataLocation: "./deps/libfaust-wasm.data" });
        await faust.ready;

        this.emit("text", "Fetching Faust Standard Library...");
        const faustPrimitiveLibFile = await fetch("./deps/primitives.lib");
        const faustPrimitiveLib = await faustPrimitiveLibFile.text();
        faust.fs.writeFile("./libraries/primitives.lib", faustPrimitiveLib);

        this.emit("text", "Loading Monaco Editor...");
        const monacoEditor = await import("monaco-editor/esm/vs/editor/editor.api");
        const { providers } = await faustLangRegister(monacoEditor, faust);
        this.faustDocs = providers.docs;

        this.faust = faust;
        const patcher = new Patcher(this);
        patcher.packageRegister(Importer.import("faust", { FaustNode: FaustAudioWorkletNode }, true), patcher._state.libJS);
        patcher.packageRegister(getFaustLibObjects(this.faustDocs), patcher._state.libFaust);
        window.patcher = patcher;

        this.emit("text", "Loading Patcher...");

        const urlParams = new URLSearchParams(window.location.search);
        const fileName = urlParams.get("file");
        if (fileName) {
            try {
                const exampleFile = await fetch("../examples/" + fileName);
                const example = await exampleFile.json();
                patcher.load(example);
            } catch (e) {
                patcher.error(`Fetch file ${fileName} failed.`);
            }
        } else {
            const mode = urlParams.get("mode");
            if (mode === "gen" || mode === "faust") {
                patcher.load({}, mode);
            }
        }
        ReactDOM.render(
            <UI patcher={patcher} />,
            document.getElementById("root")
        );
    }
}
