import * as React from "react";
import * as ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import "lato-font/css/lato-font.css";
import { Loader, Dimmer } from "semantic-ui-react";
import Patcher from "./core/Patcher";
import UI from "./components/UI";
import Env from "./env";
import { faustLangRegister } from "./misc/monaco-faust/register";
import Importer from "./core/objects/importer/Importer";

const init = async () => {
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
    await faustLangRegister(monacoEditor, faust);

    const env = new Env();
    env.faust = faust;
    const patcher = new Patcher();
    patcher.packageRegister(Importer.import("faust", { FaustNode: FaustAudioWorkletNode }, true), patcher._state.libJS);
    window.patcher = patcher;
    window.jspatcherEnv = env;

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
};
init();
