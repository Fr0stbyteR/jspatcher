import * as React from "react";
import * as ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import "lato-font/css/lato-font.css";
import { Patcher } from "./core/Patcher";
import { UI } from "./components/UI";

declare global {
    interface Window {
        patcher: Patcher;
    }
}
const patcher = new Patcher();
window.patcher = patcher;

ReactDOM.render(
    <UI patcher={patcher} />,
    document.getElementById("root")
);
