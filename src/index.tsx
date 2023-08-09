import "lato-font/css/lato-font.css";
import "semantic-ui-css/semantic.min.css";
import "./google-fonts.css";
import Env from "./core/Env";
import "github-markdown-css";

new Env(document.getElementById("root") as HTMLDivElement).init();
