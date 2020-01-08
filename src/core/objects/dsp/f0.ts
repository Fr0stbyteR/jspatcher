import { DefaultDSP } from "./Base";
import { TWindowFunction, SpectralAnalyserRegister } from "./AudioWorklet/SpectralAnalyser";
import { TMeta, TPropsMeta } from "../../types";
import { Bang } from "../Base";

export interface Props {
    speedLim: number;
    windowSize: number;
    fftSize: number;
    fftOverlap: number;
    windowFunction: TWindowFunction;
    continuous: boolean;
}
export interface State {
    node: InstanceType<typeof SpectralAnalyserRegister["Node"]>;
    $requestTimer: number;
}
export class f0 extends DefaultDSP<{}, State, [Bang], [number[]], [], Props> {
    static description = "F0 estimated by FFT energy"
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Signal, bang to estimate immediately"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "object",
        description: "Frequency value: number[]"
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
        }
    }
    state: State = { node: undefined, $requestTimer: -1 };
    subscribe() {
        super.subscribe();
        const startRequest = () => {
            const request = async () => {
                if (this.state.node && !this.state.node.destroyed) {
                    const { estimatedFreq } = await this.state.node.getFreq();
                    this.outlet(0, estimatedFreq);
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
