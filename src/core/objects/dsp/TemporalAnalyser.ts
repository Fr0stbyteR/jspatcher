import { DefaultDSP } from "./Base";
import { TemporalAnalyserRegister, DataToProcessor, DataFromProcessor } from "./AudioWorklet/TemporalAnalyser";
import { TMeta, TPropsMeta } from "../../types";
import { Bang } from "../Base";

export interface Props extends Omit<DataToProcessor, "id"> {
    speedLim: number;
    windowSize: number;
    continuous: boolean;
}
export interface State {
    node: InstanceType<typeof TemporalAnalyserRegister["Node"]>;
    $requestTimer: number;
}
type Outlet0 = Omit<DataFromProcessor, "id">;
export class TemporalAnalyser extends DefaultDSP<{}, State, [Bang], [Outlet0], [], Props> {
    static description = "Temporal feature extractor"
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
    }
    state: State = { node: undefined, $requestTimer: -1 };
    subscribe() {
        super.subscribe();
        const startRequest = () => {
            const request = async () => {
                if (this.state.node && !this.state.node.destroyed) {
                    const extractorKeys = [
                        "buffer",
                        "rms",
                        "zcr"
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
                if (props.windowSize) this.applyBPF(this.state.node.parameters.get("windowSize"), [[props.windowSize]]);
            }
        });
        this.on("postInit", async () => {
            await TemporalAnalyserRegister.register(this.audioCtx.audioWorklet);
            this.state.node = new TemporalAnalyserRegister.Node(this.audioCtx);
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
