import audioContext from "./audioContext";
import Constant from "./Constant";
import Oscillator from "./Oscillator";
import Destination from "./Destination";
import Splitter from "./Splitter";
import Merger from "./Merger";
import Gain from "./Gain";
/*
const {
    BaseAudioContext,
    AudioContext,
    webkitAudioContext,
    AudioParam,
    AudioNode,
    AudioScheduledSourceNode,
    OscillatorNode,
    GainNode,
    AudioDestinationNode,
    ChannelSplitterNode
} = window;
const WebAudioAPI: { [key: string]: any } = {
    BaseAudioContext,
    AudioContext,
    webkitAudioContext,
    AudioParam,
    AudioNode,
    AudioScheduledSourceNode,
    OscillatorNode,
    GainNode,
    AudioDestinationNode,
    ChannelSplitterNode
};
const outs: TPackage = {};
for (const key in WebAudioAPI) {
    outs[key] = Importer.import(key, WebAudioAPI[key]);
}*/
export default {
    // ...outs,
    audioContext,
    Constant,
    Oscillator,
    Gain,
    Destination,
    Splitter,
    Merger
};
