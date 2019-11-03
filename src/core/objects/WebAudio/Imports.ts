import Importer from "../importer/Importer";
import Oscillator from "./Oscillator";
import Destination from "./Destination";
import Splitter from "./Splitter";
import Merger from "./Merger";
import { TPackage } from "../../types";

const WebAudioAPI: { [key: string]: any } = {
    AudioContext: window.AudioContext || window.webkitAudioContext,
    AudioParam,
    AudioNode,
    AudioScheduledSourceNode,
    OscillatorNode,
    AudioDestinationNode,
    ChannelSplitterNode
};
const outs: TPackage = {};
for (const key in WebAudioAPI) {
    outs[key] = Importer.import(key, WebAudioAPI[key]);
}
export default {
    ...outs,
    Oscillator,
    Destination,
    Splitter,
    Merger
};
