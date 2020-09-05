import Worker from "./Waveform.worker.ts"; // eslint-disable-line import/extensions
import { IWaveformWorker } from "./WaveformWorker.types";
import ProxyMain from "./ProxyMain";

export default class WaveformWorker extends ProxyMain<{}, IWaveformWorker> {
    static Worker = Worker;
    static fnNames: (keyof IWaveformWorker)[] = ["generate"];
}
