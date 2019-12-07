import { FaustAudioWorkletNode, FaustScriptProcessorNode, Faust } from "faust2webaudio";
import Importer from "../importer/Importer";
import FaustNode from "./FaustNode";
import libFaust from "./LibFaust";

const lib = Importer.import("faust", { libFaust: Faust, FaustAudioWorkletNode, FaustScriptProcessorNode }, true);

export default {
    "faustnode~": FaustNode,
    libFaust,
    ...lib
};
