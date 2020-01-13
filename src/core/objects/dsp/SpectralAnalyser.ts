import { DefaultDSP } from "./Base";
import { TWindowFunction, SpectralAnalyserRegister, DataToProcessor, DataFromProcessor, SpectralAnalyserNode } from "./AudioWorklet/SpectralAnalyser";
import { TMeta, TPropsMeta } from "../../types";
import { Bang } from "../Base";

export interface Props extends Omit<DataToProcessor, "id"> {
    speedLim: number;
    windowSize: number;
    fftSize: number;
    fftOverlap: number;
    windowFunction: TWindowFunction;
    continuous: boolean;
}
export interface State {
    node: SpectralAnalyserNode;
    $requestTimer: number;
}
type Outlet0 = Omit<DataFromProcessor, "id">;
export class SpectralAnalyser extends DefaultDSP<{}, State, [Bang], [Outlet0], [], Props> {
    static description = "Spectral feature extractor"
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Signal, bang to extract features"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "object",
        description: "Features chosen as object"
    }];
    static props: TPropsMeta<Props> = {
        speedLim: {
            type: "number",
            default: 16,
            description: "If continuous, value output speed limit in ms"
        },
        windowSize: {
            type: "number",
            default: 1024,
            description: "Buffer window size"
        },
        fftSize: {
            type: "number",
            default: 1024,
            description: "FFT Size for analysis"
        },
        fftOverlap: {
            type: "number",
            default: 2,
            description: "FFT overlap count (integer)"
        },
        windowFunction: {
            type: "enum",
            enums: ["blackman", "hamming", "hann", "triangular"],
            default: "blackman",
            description: "Window Function aoolied for FFT analysis window"
        },
        continuous: {
            type: "boolean",
            default: false,
            description: "Whether output is continuous"
        },
        buffer: {
            type: "boolean",
            default: false,
            description: "Getting the signal buffer"
        },
        lastAmplitudes: {
            type: "boolean",
            default: false,
            description: "Getting the last amplitudes frame"
        },
        allAmplitudes: {
            type: "boolean",
            default: false,
            description: "Getting all the amplitudes frame"
        },
        estimatedFreq: {
            type: "boolean",
            default: false,
            description: "Getting the estimated frequency"
        },
        centroid: {
            type: "boolean",
            default: false,
            description: "Getting the spectral centroid"
        },
        flatness: {
            type: "boolean",
            default: false,
            description: "Getting the spectral flatness"
        },
        flux: {
            type: "boolean",
            default: false,
            description: "Getting the spectral flux"
        },
        kurtosis: {
            type: "boolean",
            default: false,
            description: "Getting the spectral kurtosis"
        },
        skewness: {
            type: "boolean",
            default: false,
            description: "Getting the spectral skewness"
        },
        rolloff: {
            type: "boolean",
            default: false,
            description: "Getting the spectral rolloff"
        },
        slope: {
            type: "boolean",
            default: false,
            description: "Getting the spectral slope"
        },
        spread: {
            type: "boolean",
            default: false,
            description: "Getting the spectral spread"
        }
    }
    state: State = { node: undefined, $requestTimer: -1 };
    subscribe() {
        super.subscribe();
        const startRequest = () => {
            const request = async () => {
                if (this.state.node && !this.state.node.destroyed) {
                    const extractorKeys = [
                        "buffer",
                        "lastAmplitudes",
                        "allAmplitudes",
                        "estimatedFreq",
                        "centroid",
                        "flatness",
                        "flux",
                        "kurtosis",
                        "skewness",
                        "rolloff",
                        "slope",
                        "spread"
                    ] as (keyof Omit<DataToProcessor, "id">)[];
                    const gets: Omit<DataToProcessor, "id"> = {};
                    extractorKeys.forEach(key => gets[key] = this.getProp(key));
                    const got = await this.state.node.gets(gets);
                    delete got.id;
                    this.outlet(0, got);
                }
                if (this.getProp("continuous")) scheduleRequest();
            };
            const scheduleRequest = () => {
                this.state.$requestTimer = window.setTimeout(request, this.getProp("speedLim"));
            };
            request();
        };
        this.on("preInit", async () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("updateProps", (props) => {
            if (this.state.node) {
                if (props.continuous) startRequest();
                if (props.windowFunction) this.applyBPF(this.state.node.parameters.get("windowFunction"), [[["blackman", "hamming", "hann", "triangular"].indexOf(props.windowFunction)]]);
                if (props.fftSize) this.applyBPF(this.state.node.parameters.get("fftSize"), [[props.fftSize]]);
                if (props.fftOverlap) this.applyBPF(this.state.node.parameters.get("fftOverlap"), [[props.fftOverlap]]);
                if (props.windowSize) this.applyBPF(this.state.node.parameters.get("windowSize"), [[props.windowSize]]);
            }
        });
        this.on("postInit", async () => {
            await SpectralAnalyserRegister.register(this.audioCtx.audioWorklet);
            this.state.node = new SpectralAnalyserRegister.Node(this.audioCtx);
            this.applyBPF(this.state.node.parameters.get("windowFunction"), [[["blackman", "hamming", "hann", "triangular"].indexOf(this.getProp("windowFunction"))]]);
            this.applyBPF(this.state.node.parameters.get("fftSize"), [[this.getProp("fftSize")]]);
            this.applyBPF(this.state.node.parameters.get("fftOverlap"), [[this.getProp("fftOverlap")]]);
            this.applyBPF(this.state.node.parameters.get("windowSize"), [[this.getProp("windowSize")]]);
            this.disconnectAudioInlet();
            this.inletConnections[0] = { node: this.state.node, index: 0 };
            this.connectAudioInlet();
            if (this.getProp("continuous")) startRequest();
            this.on("inlet", (e) => {
                if (e.inlet === 0) {
                    if (e.data instanceof Bang) startRequest();
                }
            });
        });
        this.on("destroy", () => {
            window.clearTimeout(this.state.$requestTimer);
            if (this.state.node) this.state.node.destroy();
        });
    }
}
