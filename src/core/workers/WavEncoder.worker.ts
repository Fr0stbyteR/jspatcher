import WavEncoder, { Options } from "../../utils/WavEncoder";
import { IWavEncoderWorker } from "./WavEncoderWorker.types";
import ProxyWorker from "./ProxyWorker";

class WavEncoderWorker extends ProxyWorker<IWavEncoderWorker> implements IWavEncoderWorker {
    encode(audioBuffer: Float32Array[], options: Options) {
        return WavEncoder.encode(audioBuffer, options);
    }
}
// eslint-disable-next-line no-new
new WavEncoderWorker();
