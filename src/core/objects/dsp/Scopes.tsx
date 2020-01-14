import * as Color from "color-js";
import { CanvasUI } from "../BaseUI";
import { SpectralAnalyserRegister, SpectralAnalyserNode } from "./AudioWorklet/SpectralAnalyser";
import { maxIndex } from "../../../utils/buffer";
import { TMeta, TPropsMeta } from "../../types";
import { BaseDSP } from "./Base";

export interface OscilloscopeUIState {
    frameRate: number;
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
}
export class OscilloscopeUI extends CanvasUI<Oscilloscope, {}, OscilloscopeUIState> {
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
    async paint() {
        this.schedulePaint();
        if (!this.object.state.node) return;
        if (this.object.state.node.destroyed) return;
        const { estimatedFreq, buffer } = await this.object.state.node.gets({ estimatedFreq: true, buffer: true });
        const { sampleRate } = this.object.audioCtx;
        if (!buffer) return;
        const { startPointer: $, data: t } = buffer;
        if (!t || !t.length || !t[0].length) return;
        const l = t[0].length;
        const {
            width,
            height,
            // zoom,
            // zoomOffset,
            stablize,
            // $cursor,
            range,
            autoRange,
            bgColor,
            phosphorColor,
            hueOffset: channelColorHueOffset,
            textColor,
            gridColor
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

        // Vertical Range
        let min = -range;
        let max = range;
        let yFactor = range;
        if (autoRange) {
            // Fastest way to get min and max to have: 1. max abs value for y scaling, 2. mean value for zero-crossing
            let i = t.length;
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
        while (yFactor / 2 / vStep > 2) vStep *= 2; // Maximum horizontal grids in channel one side = 2
        ctx.beginPath();
        const gridChannels = 1;
        const channelHeight = (height - bottom) / gridChannels;
        for (let i = 0; i < gridChannels; i++) {
            let y = (i + 0.5) * channelHeight;
            ctx.moveTo(left, y);
            ctx.lineTo(width, y);
            for (let j = vStep; j < yFactor; j += vStep) {
                y = (i + 0.5 + j / yFactor / 2) * channelHeight;
                ctx.moveTo(left, y);
                ctx.lineTo(width, y);
                y = (i + 0.5 - j / yFactor / 2) * channelHeight;
                ctx.moveTo(left, y);
                ctx.lineTo(width, y);
            }
        }
        ctx.stroke();

        // Horizontal Range
        let $0 = 0; // Draw start
        let $1 = l - 1; // Draw End
        let $zerox = 0; // First Zero-crossing
        let drawL = l; // Length to draw
        if (stablize) { // Stablization
            const thresh = (min + max) * 0.5 + 0.001; // the zero-crossing with "offset"
            const i = maxIndex(estimatedFreq);
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
        const gridX = (width - left) / ($1 - $0 - 1);
        const step = Math.max(1, Math.round(1 / gridX));
        ctx.lineWidth = 2;
        const channelColor: string[] = [];
        for (let i = 0; i < t.length; i++) {
            ctx.beginPath();
            channelColor[i] = Color(phosphorColor).shiftHue(i * channelColorHueOffset).toHSL();
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
                let y = (height - bottom) * (0.5 - maxInStep / yFactor * 0.5);
                if (j === $0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
                if (minInStep !== maxInStep) {
                    y = (height - bottom) * (0.5 - minInStep / yFactor * 0.5);
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
        // Stats
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
            ctx.fillText(freq.toFixed(2) + "Hz", width - 2, freqStatY + 14 * i);
        }
    }
}
export interface State {
    node: SpectralAnalyserNode;
}
export interface Props extends Omit<OscilloscopeUIState, "$cursor" | "zoom" | "zoomOffset"> {
    windowSize: number;
}
export class Oscilloscope extends BaseDSP<{}, State, [], [], [], Props, OscilloscopeUIState> {
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
        frameRate: {
            type: "number",
            default: 60,
            description: "UI refresh rate",
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
            if (props.windowSize && this.state.node) this.applyBPF(this.state.node.parameters.get("windowSize"), [[props.windowSize]]);
        });
        this.on("postInit", async () => {
            await SpectralAnalyserRegister.register(this.audioCtx.audioWorklet);
            this.state.node = new SpectralAnalyserRegister.Node(this.audioCtx);
            this.applyBPF(this.state.node.parameters.get("windowSize"), [[this.getProp("windowSize")]]);
            this.disconnectAudioInlet();
            this.inletConnections[0] = { node: this.state.node, index: 0 };
            this.connectAudioInlet();
        });
        this.on("destroy", () => {
            if (this.state.node) this.state.node.destroy();
        });
    }
}
