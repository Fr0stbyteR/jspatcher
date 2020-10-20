import "lato-font/css/lato-font.css";
import "semantic-ui-css/semantic.min.css";
import Env from "./core/Env";

window.jspatcherEnv = new Env(document.getElementById("root") as HTMLDivElement);
window.jspatcherEnv.init();
