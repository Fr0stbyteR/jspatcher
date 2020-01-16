import * as Color from "color-js";
import { CanvasUI } from "../BaseUI";
import { SpectralAnalyserRegister, SpectralAnalyserNode, TWindowFunction } from "./AudioWorklet/SpectralAnalyserMain";
import { TMeta, TPropsMeta } from "../../types";
import { BaseDSP } from "./Base";
import { Bang } from "../Base";

export interface OscilloscopeUIState {
    continuous: boolean;
    frameRate: number;
    interleaved: boolean;
    stablize: boolean;
    $cursor: number;
    zoom: number;
    zoomOffset: number;
    range: number;
    autoRange: boolean;
    showStats: boolean;
    bgColor: string;
    phosphorColor: string;
    hueOffset: number;
    textColor: string;
    gridColor: string;
    seperatorColor: string;
    paint: {};
}
export class OscilloscopeUI extends CanvasUI<Oscilloscope, {}, OscilloscopeUIState> {
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
            stablize,
            interleaved,
            // $cursor,
            range,
            autoRange,
            showStats,
            bgColor,
            phosphorColor,
            hueOffset,
            textColor,
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

        const { estimatedFreq, buffer } = this.object.state.node.gets({ estimatedFreq: true, buffer: true });
        const { sampleRate } = this.object.audioCtx;
        if (!buffer) return;
        const { startPointer: $, data: t } = buffer;
        if (!t || !t.length || !t[0].length) return;
        const channels = t.length;
        const l = t[0].length;

        // Vertical Range
        let min = -range;
        let max = range;
        let yFactor = range;
        if (autoRange) {
            // Fastest way to get min and max to have: 1. max abs value for y scaling, 2. mean value for zero-crossing
            let i = channels;
            let s = 0;
            while (i--) {
                let j = l;
                while (j--) {
                    s = t[i][j];
                    if (s < min) min = s;
                    else if (s > max) max = s;
                }
            }
            yFactor = Math.max(1, Math.abs(min), Math.abs(max))/* * vzoom*/;
        }
        // Grids
        ctx.strokeStyle = gridColor;
        let vStep = 0.25;
        while (yFactor / 2 / vStep > 2) vStep *= 2; // Minimum horizontal grids in channel one side = 2
        ctx.beginPath();
        ctx.setLineDash([]);
        const gridChannels = interleaved ? channels : 1;
        const channelHeight = (height - bottom) / gridChannels;
        for (let i = 0; i < gridChannels; i++) {
            let y = (i + 0.5) * channelHeight;
            ctx.moveTo(left, y);
            ctx.lineTo(width, y); // 0-line
            for (let j = vStep; j < yFactor; j += vStep) {
                y = (i + 0.5 + j / yFactor / 2) * channelHeight;
                ctx.moveTo(left, y);
                ctx.lineTo(width, y); // below 0
                y = (i + 0.5 - j / yFactor / 2) * channelHeight;
                ctx.moveTo(left, y);
                ctx.lineTo(width, y); // above 0
            }
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
        for (let i = 0; i < channels; i++) {
            // Horizontal Range
            let $0 = 0; // Draw start
            let $1 = l; // Draw End
            let $zerox = 0; // First Zero-crossing
            let drawL = l; // Length to draw
            if (stablize) { // Stablization
                const thresh = (min + max) * 0.5 + 0.001; // the zero-crossing with "offset"
                const period = sampleRate / estimatedFreq[i];
                const times = Math.floor(l / period) - 1;
                while ($zerox < l && t[i][($ + $zerox++) % l] > thresh); // Find first raise
                if ($zerox >= l - 1) { // Found nothing, no stablization
                    $zerox = 0;
                } else {
                    while ($zerox < l && t[i][($ + $zerox++) % l] < thresh); // Find first drop
                    $zerox--;
                    if ($zerox >= l - 1 || $zerox < 0) {
                        $zerox = 0;
                    }
                }
                drawL = times > 0 && isFinite(period) ? ~~Math.min(period * times, l - $zerox) : l - $zerox; // length to draw
            }
            $0 = Math.round($zerox/* + drawL * zoomOffset*/);
            $1 = Math.round($zerox + drawL/* / zoom + drawL * zoomOffset*/);
            const gridX = (width - left) / ($1 - $0);
            const step = Math.max(1, Math.round(1 / gridX));

            ctx.beginPath();
            channelColor[i] = Color(phosphorColor).shiftHue(i * hueOffset).toHSL();
            ctx.strokeStyle = channelColor[i];
            let maxInStep;
            let minInStep;
            for (let j = $0; j < $1; j++) {
                const $j = (j + $) % l;
                const samp = t[i][$j];
                const $step = (j - $0) % step;
                if ($step === 0) {
                    maxInStep = samp;
                    minInStep = samp;
                }
                if ($step !== step - 1) {
                    if ($step !== 0) {
                        if (samp > maxInStep) maxInStep = samp;
                        if (samp < minInStep) minInStep = samp;
                    }
                    continue;
                }
                const x = (j - $0) * gridX + left;
                let y = channelHeight * (+interleaved * i + 0.5 - maxInStep / yFactor * 0.5);
                if (j === $0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
                if (minInStep !== maxInStep) {
                    y = channelHeight * (+interleaved * i + 0.5 - minInStep / yFactor * 0.5);
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
        // Stats
        if (showStats) {
            ctx.font = "bold 12px Consolas, monospace";
            ctx.fillStyle = textColor;
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillText(yFactor.toFixed(2), 2, 2);
            ctx.textBaseline = "bottom";
            ctx.fillText((-yFactor).toFixed(2), 2, height - 2);
            ctx.textAlign = "right";
            const freqStatY = height - 2 - (estimatedFreq.length - 1) * 14;
            for (let i = 0; i < estimatedFreq.length; i++) {
                const freq = estimatedFreq[i];
                ctx.fillStyle = channelColor[i];
                const y = interleaved ? channelHeight * (i + 1) - 2 : freqStatY + 14 * i;
                ctx.fillText(freq.toFixed(2) + "Hz", width - 2, y);
            }
        }
    }
}
export interface State {
    node: SpectralAnalyserNode;
}
export interface Props extends Omit<OscilloscopeUIState, "$cursor" | "zoom" | "zoomOffset" | "paint"> {
    windowSize: number;
    fftSize: number;
    fftOverlap: number;
    windowFunction: TWindowFunction;
}
export class Oscilloscope extends BaseDSP<{}, State, [Bang], [], [], Props, OscilloscopeUIState> {
    static description = "Oscilloscope"
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
        interleaved: {
            type: "boolean",
            default: false,
            description: "Draw channels seperately",
            isUIState: true
        },
        stablize: {
            type: "boolean",
            default: true,
            description: "Stablize",
            isUIState: true
        },
        range: {
            type: "number",
            default: 1,
            description: "Vertical range",
            isUIState: true
        },
        autoRange: {
            type: "boolean",
            default: true,
            description: "Auto adjust range if > 1",
            isUIState: true
        },
        showStats: {
            type: "boolean",
            default: true,
            description: "Show stats texts",
            isUIState: true
        },
        bgColor: {
            type: "color",
            default: "rgb(40, 40, 40)",
            description: "Background color",
            isUIState: true
        },
        phosphorColor: {
            type: "color",
            default: "hsl(0, 100%, 85%)",
            description: "Phosphor color",
            isUIState: true
        },
        hueOffset: {
            type: "number",
            default: 60,
            description: "Channel Color Hue offset",
            isUIState: true
        },
        textColor: {
            type: "color",
            default: "#DDDD99",
            description: "Info text color",
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
    uiComponent = OscilloscopeUI;
    state: State = { node: undefined };
    subscribe() {
        super.subscribe();
        this.on("preInit", async () => {
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
