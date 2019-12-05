import * as React from "react";
import * as ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import "lato-font/css/lato-font.css";
import Patcher from "./core/Patcher";
import UI from "./components/UI";
import Env from "./env";

const init = async () => {
    const { Faust } = await import("faust2webaudio");
    const faust = new Faust({ wasmLocation: "./deps/libfaust-wasm.wasm", dataLocation: "./deps/libfaust-wasm.data" });
    await faust.ready;
    const faustPrimitiveLibFile = await fetch("./deps/primitives.lib");
    const faustPrimitiveLib = await faustPrimitiveLibFile.text();
    faust.fs.writeFile("./libraries/primitives.lib", faustPrimitiveLib);
    const env = new Env();
    env.faust = faust;
    const patcher = new Patcher();
    window.patcher = patcher;
    window.jspatcherEnv = env;

    const urlParams = new URLSearchParams(window.location.search);
    const fileName = urlParams.get("file");
    if (fileName) {
        const exampleFile = await fetch("../examples/" + fileName);
        const example = await exampleFile.json();
        patcher.load(example);
    }

    ReactDOM.render(
        <UI patcher={patcher} />,
        document.getElementById("root")
    );
};
init();
