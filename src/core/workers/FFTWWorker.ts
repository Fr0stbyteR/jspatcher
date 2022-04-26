import Worker from "./FFTW.worker.ts"; // eslint-disable-line import/extensions
import { IFFTWWorker } from "./FFTWWorker.types";
import ProxyMain from "./ProxyMain";

export default class FFTWWorker extends ProxyMain<{}, IFFTWWorker> {
    static Worker = Worker;
    static fnNames: (keyof IFFTWWorker)[] = ["init", "forward", "forwards", "forwardsAmpMatrix", "inverse", "inverses"];
}
