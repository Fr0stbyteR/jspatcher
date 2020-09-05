import Worker from "./WavEncoder.worker.ts"; // eslint-disable-line import/extensions
import { IWavEncoderWorker } from "./WavEncoderWorker.types";
import ProxyMain from "./ProxyMain";

export default class WavEncoderWorker extends ProxyMain<{}, IWavEncoderWorker> {
    static Worker = Worker;
    static fnNames: (keyof IWavEncoderWorker)[] = ["encode"];
}
