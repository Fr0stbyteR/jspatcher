import CsoundNode from "./CsoundNode";
import DefaultImporter from "../importer/DefaultImporter";
import type Env from "../../Env";

export default async (env: Env) => ({
    "csoundnode~": CsoundNode
    // ...DefaultImporter.import("faust", { ...env.Faust })
});
