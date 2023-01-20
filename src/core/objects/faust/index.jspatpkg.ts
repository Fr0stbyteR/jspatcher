import FaustNode from "./FaustNode";
import FaustFFT from "./FaustFFT";
import FaustDataProcessor from "./FaustDataProcessor";
import diagram from "./Diagram";
import ui from "./faustUI";
import faustCompiler from "./faustCompiler";
import DefaultImporter from "../importer/DefaultImporter";
import type Env from "../../Env";

export default async (env: Env) => ({
    "faust~": FaustNode,
    "faustnode~": FaustNode,
    "faust-data": FaustDataProcessor,
    "faust-fft~": FaustFFT,
    diagram,
    ui,
    faustCompiler,
    ...DefaultImporter.import("faust", { ...env.Faust })
});
