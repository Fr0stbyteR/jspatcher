import * as React from "react";
import * as ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import "lato-font/css/lato-font.css";
import Patcher from "./core/Patcher";
import UI from "./components/UI";
import Env from "./env";

const patcher = new Patcher();
const env = new Env();
window.patcher = patcher;
window.jspatcherEnv = env;

ReactDOM.render(
    <UI patcher={patcher} />,
    document.getElementById("root")
);
