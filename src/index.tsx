import "semantic-ui-css/semantic.min.css";
import "lato-font/css/lato-font.css";
import Env from "./env";

window.jspatcherEnv = new Env(document.getElementById("root") as HTMLDivElement);
window.jspatcherEnv.init();
