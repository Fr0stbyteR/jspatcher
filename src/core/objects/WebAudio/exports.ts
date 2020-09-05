import audioContext from "./audioContext";
import audioWorklet from "./audioWorklet";
import AnyNode from "./AnyNode";
import Constant from "./Constant";
import Oscillator from "./Oscillator";
import Destination from "./Destination";
import Splitter from "./Splitter";
import Merger from "./Merger";
import Gain from "./Gain";
import Analyser from "./Analyser";
import Biquad from "./Biquad";
import Convolver from "./Convolver";
import Delay from "./Delay";
import Compressor from "./Compressor";
import IIRFilter from "./IIRFilter";
import Media from "./Media";
import StreamDest from "./StreamDestination";
import StreamSrc from "./StreamSource";
import Panner from "./Panner";
import StereoPanner from "./StereoPanner";
import WaveShaper from "./WaveShaper";
import { AudioIn, AudioOut } from "./AudioIO";
import Plugin from "./WebAudioPlugin";
import Buffer from "./buffer";
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
const WebAudioAPI: Record<string, any> = {
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
    audioWorklet,
    "node~": AnyNode,
    "constant~": Constant,
    "oscillator~": Oscillator,
    "gain~": Gain,
    "destination~": Destination,
    "splitter~": Splitter,
    "merger~": Merger,
    "analyser~": Analyser,
    "biquad~": Biquad,
    "convolver~": Convolver,
    "delay~": Delay,
    "compressor~": Compressor,
    "iir~": IIRFilter,
    "media~": Media,
    "streamdest~": StreamDest,
    "streamsrc~": StreamSrc,
    "panner~": Panner,
    "pan~": StereoPanner,
    "waveshaper~": WaveShaper,
    "audioIn~": AudioIn,
    "audioOut~": AudioOut,
    "plugin~": Plugin,
    "buffer~": Buffer
};
