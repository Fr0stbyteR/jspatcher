import Importer from "../importer/Importer";
import { TPackage } from "../../types";

const WebAudioAPI: { [key: string]: any } = {
    AudioContext: window.AudioContext || window.webkitAudioContext,
    AudioParam,
    AudioNode,
    AudioScheduledSourceNode,
    OscillatorNode
};
const outs: TPackage = {};
for (const key in WebAudioAPI) {
    outs[key] = Importer.import(key, WebAudioAPI[key]);
}
export default outs;
