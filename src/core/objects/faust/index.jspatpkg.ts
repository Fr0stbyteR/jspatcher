import FaustNode from "./FaustNode";
import diagram from "./Diagram";
import ui from "./faustUI";
import faustCompiler from "./faustCompiler";

export default async () => ({
    "faustnode~": FaustNode,
    diagram,
    ui,
    faustCompiler
});
