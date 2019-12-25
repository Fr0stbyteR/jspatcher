import JSPAudioNode from "./AudioNode";
import { Bang } from "../Base";
import { TMeta } from "../../types";

type TOptions = {
    fftSize: 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768;
    minDecibels: number;
    maxDecibels: number;
    smoothingTimeConstant: number;
};
type I = [Bang, Float32Array, Uint8Array, Float32Array, Uint8Array, Partial<TOptions>];
type O = [null, Float32Array, Uint8Array, Float32Array, Uint8Array, AnalyserNode];
export default class Analyser extends JSPAudioNode<AnalyserNode, {}, I, O, [], TOptions> {
    static description = "WebAudio AnalyserNode";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Node connection, bang to output AnalyserNode instance"
    }, {
        isHot: true,
        type: "object",
        description: "getFloatTimeDomainData(): Float32Array"
    }, {
        isHot: true,
        type: "object",
        description: "getByteTimeDomainData(): Uint8Array"
    }, {
        isHot: true,
        type: "object",
        description: "getFloatFrequencyData(): Float32Array"
    }, {
        isHot: true,
        type: "object",
        description: "getByteFrequencyData(): Uint8Array"
    }, {
        isHot: false,
        type: "object",
        description: "Options: { fftSize, minDecibels, maxDecibels, smoothingTimeConstant }"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "signal",
        description: "Node connection"
    }, {
        type: "object",
        description: "getFloatTimeDomainData result"
    }, {
        type: "object",
        description: "getByteTimeDomainData result"
    }, {
        type: "object",
        description: "getFloatFrequencyData result"
    }, {
        type: "object",
        description: "getByteFrequencyData result"
    }, {
        type: "object",
        description: "Instance: AnalyserNode"
    }];
    static props: TMeta["props"] = {
        fftSize: {
            type: "number",
            default: 2048,
            description: "The size of the FFT to be used: power of 2"
        },
        minDecibels: {
            type: "number",
            default: -100,
            description: "The minimum power value in the scaling range for the FFT analysis data"
        },
        maxDecibels: {
            type: "number",
            default: -10,
            description: "The maximum power value in the scaling range for the FFT analysis data"
        },
        smoothingTimeConstant: {
            type: "number",
            default: 0.8,
            description: "The averaging constant with the last analysis frame"
        }
    };
    state = { node: this.audioCtx.createAnalyser() };
    inletConnections = [{ node: this.node, index: 0 }];
    outletConnections = [{ node: this.node, index: 0 }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 6;
            this.outlets = 6;
            this.node.channelInterpretation = "discrete";
        });
        this.on("updateProps", (props) => {
            try {
                if (typeof props.fftSize === "number") this.node.fftSize = props.fftSize;
                if (typeof props.minDecibels === "number") this.node.minDecibels = props.minDecibels;
                if (typeof props.maxDecibels === "number") this.node.maxDecibels = props.maxDecibels;
                if (typeof props.smoothingTimeConstant === "number") this.node.smoothingTimeConstant = props.smoothingTimeConstant;
            } catch (e) {
                this.error((e as Error).message);
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (data instanceof Bang) this.outlet(5, this.node);
            } else if (inlet === 5) {
                if (typeof data === "object") {
                    const props = data as I[5];
                    try {
                        if (typeof props.fftSize === "number") this.node.fftSize = props.fftSize;
                        if (typeof props.minDecibels === "number") this.node.minDecibels = props.minDecibels;
                        if (typeof props.maxDecibels === "number") this.node.maxDecibels = props.maxDecibels;
                        if (typeof props.smoothingTimeConstant === "number") this.node.smoothingTimeConstant = props.smoothingTimeConstant;
                    } catch (e) {
                        this.error((e as Error).message);
                    }
                } else {
                    this.error("Invalid options");
                }
            } else {
                try {
                    if (inlet === 1) {
                        this.node.getFloatTimeDomainData(data as I[1]);
                        this.outlet(1, data as I[1]);
                    } else if (inlet === 2) {
                        this.node.getByteTimeDomainData(data as I[2]);
                        this.outlet(2, data as I[2]);
                    } else if (inlet === 3) {
                        this.node.getFloatFrequencyData(data as I[3]);
                        this.outlet(3, data as I[3]);
                    } else if (inlet === 4) {
                        this.node.getByteFrequencyData(data as I[4]);
                        this.outlet(4, data as I[4]);
                    }
                } catch (e) {
                    this.error((e as Error).message);
                }
            }
        });
    }
}
