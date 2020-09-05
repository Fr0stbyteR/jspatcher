/* eslint-disable no-new */
import WavEncoder, { Options } from "../../utils/WavEncoder";
import { IWavEncoderWorker } from "./WavEncoderWorker.types";
import ProxyWorker from "./ProxyWorker";

class WavEncoderWorker extends ProxyWorker<IWavEncoderWorker> {
    encode(audioBuffer: Float32Array[], options: Options) {
        return WavEncoder.encode(audioBuffer, options);
    }
}
new WavEncoderWorker();
