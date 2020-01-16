import { SpectralAnalyser } from "./SpectralAnalyser";
import { TemporalAnalyser } from "./TemporalAnalyser";
import { Oscilloscope } from "./Oscilloscopes";
import { Spectroscope } from "./Spectroscope";
import { Spectrogram } from "./Spectrogram";

export default {
    "temporalAnalyser~": TemporalAnalyser,
    "spectralAnalyser~": SpectralAnalyser,
    "scope~": Oscilloscope,
    "spectroscope~": Spectroscope,
    "spectrogram~": Spectrogram
};
