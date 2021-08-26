import FaustNode from "./FaustNode";
import diagram from "./Diagram";
import ui from "./faustUI";
import libFaust from "./LibFaust";

export default async () => ({
    "faustnode~": FaustNode,
    diagram,
    ui,
    libFaust
});
