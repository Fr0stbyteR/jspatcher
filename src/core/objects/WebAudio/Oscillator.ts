import JSPAudioNode from "./AudioNode";

export default class Oscillator extends JSPAudioNode<OscillatorNode, { frequency: number; type: OscillatorType }, [], ["signal", "object", "object", "object"]> {}
