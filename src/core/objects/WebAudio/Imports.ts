import audioContext from "./audioContext";
import Constant from "./Constant";
import Oscillator from "./Oscillator";
import Destination from "./Destination";
import Splitter from "./Splitter";
import Merger from "./Merger";
import Gain from "./Gain";
import Analyser from "./Analyser";
import { audioWorklet, JSPAudioWorklet } from "./AudioWorklet";
import Biquad from "./Biquad";
import Convolver from "./Convolver";
import Delay from "./Delay";
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
    "Constant~": Constant,
    "Oscillator~": Oscillator,
    "Gain~": Gain,
    "Destination~": Destination,
    "Splitter~": Splitter,
    "Merger~": Merger,
    "Analyser~": Analyser,
    audioWorklet,
    "AudioWorklet~": JSPAudioWorklet,
    "Biquad~": Biquad,
    "Convolver~": Convolver,
    "Delay~": Delay
};
