import * as Color from "color-js";
import { CanvasUI } from "../BaseUI";
import { SpectralAnalyserRegister, SpectralAnalyserNode, TWindowFunction } from "./AudioWorklet/SpectralAnalyserMain";
import { TMeta, TPropsMeta } from "../../types";
import { BaseDSP } from "./Base";
import { Bang } from "../Base";
import { atodb } from "../../../utils/math";

export interface SpectroscopeUIState {
    continuous: boolean;
    frameRate: number;
    $cursor: number;
    zoom: number;
    zoomOffset: number;
    bgColor: string;
    fgColor: string;
    hueOffset: number;
    gridColor: string;
    seperatorColor: string;
    paint: {};
}
export class SpectroscopeUI extends CanvasUI<Spectroscope, {}, SpectroscopeUIState> {
    static defaultSize = [120, 60] as [number, number];
    componentDidMount() {
        const { width, height, bgColor } = this.state;
        const ctx = this.ctx;
        if (!ctx) return;
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        // Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        super.componentDidMount();
    }
    paint() {
        if (this.state.continuous) this.schedulePaint();
        if (!this.object.state.node) return;
        if (this.object.state.node.destroyed) return;
        const {
            width,
            height,
            // zoom,
            // zoomOffset,
            // $cursor,
            bgColor,
            fgColor,
            hueOffset,
            gridColor,
            seperatorColor
        } = this.state;
        const ctx = this.ctx;
        if (!ctx) return;

        ctx.canvas.width = width;
        ctx.canvas.height = height;

        // Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        const left = 0;
        const bottom = 0;

        const { lastAmplitudes } = this.object.state.node.gets({ lastAmplitudes: true });
        if (!lastAmplitudes) return;
        const { data: f } = lastAmplitudes;
        if (!f || !f.length || !f[0].length) return;
        const l = f[0].length;
        const channels = f.length;

        // Grids
        ctx.strokeStyle = gridColor;
        const vStep = 0.25;
        const hStep = 0.25;
        ctx.beginPath();
        ctx.setLineDash([]);
        const gridChannels = channels;
        const channelHeight = (height - bottom) / gridChannels;
        for (let i = 0; i < gridChannels; i++) {
            for (let j = vStep; j < 1; j += vStep) { // Horizontal lines
                const y = (i + j) * channelHeight;
                ctx.moveTo(left, y);
                ctx.lineTo(width, y);
            }
        }
        for (let i = hStep; i < 1; i += hStep) {
            const x = left + (width - left) * i;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, bottom);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.setLineDash([4, 2]);
        ctx.strokeStyle = seperatorColor;
        for (let i = 1; i < gridChannels; i++) {
            ctx.moveTo(left, i * channelHeight);
            ctx.lineTo(width, i * channelHeight);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineWidth = 2;
        const channelColor: string[] = [];
        // Horizontal Range
        const $0 = 0; // Draw start
        const $1 = l; // Draw End
        const gridX = (width - left) / ($1 - $0);
        const step = Math.max(1, Math.round(1 / gridX));
        for (let i = 0; i < f.length; i++) {
            ctx.beginPath();
            channelColor[i] = Color(fgColor).shiftHue(i * hueOffset).toHSL();
            ctx.fillStyle = channelColor[i];
            let maxInStep;
            for (let j = $0; j < $1; j++) {
                const samp = atodb(f[i][j]);
                const $step = (j - $0) % step;
                if ($step === 0) maxInStep = samp;
                if ($step !== step - 1) {
                    if ($step !== 0 && samp > maxInStep) maxInStep = samp;
                    continue;
                }
                const x = (j - $0) * gridX + left;
                const y = channelHeight * (i + 1 - Math.min(1, Math.max(0, maxInStep / 100 + 1)));
                if (j === $0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.lineTo(width, channelHeight * (i + 1));
            ctx.lineTo(left, channelHeight * (i + 1));
            ctx.closePath();
            ctx.fill();
        }
    }
}
export interface State {
    node: SpectralAnalyserNode;
}
export interface Props extends Omit<SpectroscopeUIState, "$cursor" | "zoom" | "zoomOffset" | "paint"> {
    windowSize: number;
    fftSize: number;
    fftOverlap: number;
    windowFunction: TWindowFunction;
}
export class Spectroscope extends BaseDSP<{}, State, [Bang], [], [], Props, SpectroscopeUIState> {
    static description = "Spectroscope"
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Signal"
    }];
    static props: TPropsMeta<Props> = {
        windowSize: {
            type: "number",
            default: 1024,
            description: "Signal window size"
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
            default: true,
            description: "Continuous drawing",
            isUIState: true
        },
        frameRate: {
            type: "number",
            default: 60,
            description: "UI refresh rate",
            isUIState: true
        },
        bgColor: {
            type: "color",
            default: "rgb(40, 40, 40)",
            description: "Background color",
            isUIState: true
        },
        fgColor: {
            type: "color",
            default: "hsl(0, 100%, 85%)",
            description: "Foreground color",
            isUIState: true
        },
        hueOffset: {
            type: "number",
            default: 60,
            description: "Channel Color Hue offset",
            isUIState: true
        },
        gridColor: {
            type: "color",
            default: "#404040",
            description: "Grid color",
            isUIState: true
        },
        seperatorColor: {
            type: "color",
            default: "white",
            description: "Channel seperator color",
            isUIState: true
        }
    };
    uiComponent = SpectroscopeUI;
    state: State = { node: undefined };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 0;
        });
        this.on("updateProps", (props) => {
            if (this.state.node) {
                if (props.windowFunction) this.state.node.windowFunction = props.windowFunction;
                if (props.fftSize) this.state.node.fftSize = props.fftSize;
                if (props.fftOverlap) this.state.node.fftOverlap = props.fftOverlap;
                if (props.windowSize) this.state.node.windowSize = props.windowSize;
            }
        });
        this.on("postInit", async () => {
            await SpectralAnalyserRegister.register(this.audioCtx.audioWorklet);
            this.state.node = new SpectralAnalyserRegister.Node(this.audioCtx);
            this.state.node.windowFunction = this.getProp("windowFunction");
            this.state.node.fftSize = this.getProp("fftSize");
            this.state.node.fftOverlap = this.getProp("fftOverlap");
            this.state.node.windowSize = this.getProp("windowSize");
            this.disconnectAudioInlet();
            this.inletConnections[0] = { node: this.state.node, index: 0 };
            this.connectAudioInlet();
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (data instanceof Bang) this.updateUI({ paint: {} });
            }
        });
        this.on("destroy", () => {
            if (this.state.node) this.state.node.destroy();
        });
    }
}
