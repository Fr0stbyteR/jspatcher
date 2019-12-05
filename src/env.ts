import { Faust } from "faust2webaudio";
import { detectOS } from "./utils";

const AudioContext = window.AudioContext || window.webkitAudioContext;
export default class Env {
    audioCtx = new AudioContext({ latencyHint: 0.00001 });
    os = detectOS();
    supportAudioWorklet = !!window.AudioWorklet;
    faust: Faust;
}
