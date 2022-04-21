import FaustNode from "./FaustNode";
import diagram from "./Diagram";
import ui from "./faustUI";
import faustCompiler from "./faustCompiler";
import DefaultImporter from "../importer/DefaultImporter";
import type Env from "../../Env";

export default async (env: Env) => ({
    "faustnode~": FaustNode,
    diagram,
    ui,
    faustCompiler,
    ...DefaultImporter.import("faust", { ...env.Faust })
});
