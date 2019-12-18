import * as React from "react";
import * as ReactDOM from "react-dom";
import { Dimmer, Loader } from "semantic-ui-react";
import { Faust } from "faust2webaudio";
import { detectOS } from "./utils";
import { faustLangRegister } from "./misc/monaco-faust/register";
import Patcher from "./core/Patcher";
import Importer from "./core/objects/importer/Importer";
import UI from "./components/UI";

const AudioContext = window.AudioContext || window.webkitAudioContext;
/**
 * Should have maximum 1 instance of Env per page.
 *
 * @export
 * @class Env
 */
export default class Env {
    audioCtx = new AudioContext({ latencyHint: 0.00001 });
    os = detectOS();
    supportAudioWorklet = !!window.AudioWorklet;
    faust: Faust;
    async init() {
        ReactDOM.render(
            <Dimmer active><Loader content="Loading" /></Dimmer>,
            document.getElementById("root")
        );
        const { Faust, FaustAudioWorkletNode } = await import("faust2webaudio");
        const faust = new Faust({ wasmLocation: "./deps/libfaust-wasm.wasm", dataLocation: "./deps/libfaust-wasm.data" });
        await faust.ready;
        const faustPrimitiveLibFile = await fetch("./deps/primitives.lib");
        const faustPrimitiveLib = await faustPrimitiveLibFile.text();
        faust.fs.writeFile("./libraries/primitives.lib", faustPrimitiveLib);
        const monacoEditor = await import("monaco-editor/esm/vs/editor/editor.api");
        faustLangRegister(monacoEditor, faust);

        this.faust = faust;
        const patcher = new Patcher(this);
        patcher.packageRegister(Importer.import("faust", { FaustNode: FaustAudioWorkletNode }, true), patcher._state.libJS);
        window.patcher = patcher;

        ReactDOM.render(
            <UI patcher={patcher} />,
            document.getElementById("root")
        );

        const urlParams = new URLSearchParams(window.location.search);
        const fileName = urlParams.get("file");
        if (fileName) {
            const exampleFile = await fetch("../examples/" + fileName);
            const example = await exampleFile.json();
            patcher.load(example);
        }
    }
}
