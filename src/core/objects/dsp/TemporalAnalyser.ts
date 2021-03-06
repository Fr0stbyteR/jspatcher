import { DefaultDSP } from "./Base";
import TemporalAnalyserNode from "../../worklets/TemporalAnalyser";
import { TemporalAnalysis } from "../../worklets/TemporalAnalyserWorklet.types";
import { TMeta, TPropsMeta } from "../../types";
import { Bang, isBang } from "../Base";

export interface Props extends Record<keyof TemporalAnalysis, boolean> {
    speedLim: number;
    windowSize: number;
    continuous: boolean;
}
export interface State {
    node: TemporalAnalyserNode;
    $requestTimer: number;
}
type Outlet0 = Partial<TemporalAnalysis>;
export class TemporalAnalyser extends DefaultDSP<{}, State, [Bang], [Outlet0], [], Props> {
    static description = "Temporal feature extractor";
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
        absMax: {
            type: "boolean",
            default: false,
            description: "Getting the absolute Maximum"
        },
        rms: {
            type: "boolean",
            default: false,
            description: "Getting the Root Mean Square"
        },
        zcr: {
            type: "boolean",
            default: false,
            description: "Getting the zero crossing count"
        }
    };
    state: State = { node: undefined, $requestTimer: -1 };
    subscribe() {
        super.subscribe();
        const startRequest = () => {
            const request = async () => {
                if (this.state.node && !this.state.node.destroyed) {
                    const extractorKeys = [
                        "buffer",
                        "rms",
                        "zcr",
                        "absMax"
                    ] as (keyof TemporalAnalysis)[];
                    const gets: (keyof TemporalAnalysis)[] = [];
                    extractorKeys.forEach((key) => {
                        if (this.getProp(key)) gets.push(key);
                    });
                    const got = await this.state.node.gets(...gets);
                    this.outlet(0, got);
                }
                if (this.getProp("continuous")) scheduleRequest();
            };
            const scheduleRequest = () => {
                this.state.$requestTimer = window.setTimeout(request, this.getProp("speedLim"));
            };
            request();
        };
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("updateProps", (props) => {
            if (this.state.node) {
                const { parameters } = this.state.node;
                if (props.continuous) startRequest();
                if (props.windowSize) this.applyBPF(parameters.get("windowSize"), [[props.windowSize]]);
            }
        });
        this.on("postInit", async () => {
            await TemporalAnalyserNode.register(this.audioCtx.audioWorklet);
            this.state.node = new TemporalAnalyserNode(this.audioCtx);
            const { parameters } = this.state.node;
            this.applyBPF(parameters.get("windowSize"), [[this.getProp("windowSize")]]);
            this.disconnectAudioInlet();
            this.inletAudioConnections[0] = { node: this.state.node, index: 0 };
            this.connectAudioInlet();
            if (this.getProp("continuous")) startRequest();
            this.on("inlet", (e) => {
                if (e.inlet === 0) {
                    if (isBang(e.data)) startRequest();
                }
            });
        });
        this.on("destroy", () => {
            window.clearTimeout(this.state.$requestTimer);
            if (this.state.node) this.state.node.destroy();
        });
    }
}
