// import * as Color from "color-js";
import { CanvasUI } from "../base/DOMUI";
import SpectralAnalyserNode from "../../worklets/SpectralAnalyser";
import { TWindowFunction } from "../../worklets/SpectralAnalyserWorklet.types";
import { IJSPatcherObjectMeta, IPropsMeta } from "../../types";
import { BaseDSP } from "./Base";
import { Bang, isBang } from "../base/index.jspatpkg";
import { atodb } from "../../../utils/math";

export interface SpectrogramUIState {
    continuous: boolean;
    frameRate: number;
    cursorX: number;
    cursorY: number;
    zoom: number;
    zoomOffset: number;
    bgColor: string;
    // textColor: string;
    gridColor: string;
    seperatorColor: string;
    paint: {};
}
export class SpectrogramUI extends CanvasUI<Spectrogram, {}, SpectrogramUIState> {
    static defaultSize = [120, 60] as [number, number];
    $lastFrame = -1;
    dataFrames = 1;
    offscreenCtx = document.createElement("canvas").getContext("2d");
    offscreenVRes = 1024;
    componentDidMount() {
        const { bgColor } = this.state;
        const { ctx, offscreenCtx, dataFrames } = this;
        if (!ctx) return;
        const [width, height] = this.fullSize();
        offscreenCtx.canvas.width = dataFrames;
        offscreenCtx.canvas.height = this.offscreenVRes;
        // Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        super.componentDidMount();
    }
    async paint() {
        if (this.state.continuous) this.schedulePaint();
        if (!this.object.state.node) return;
        if (this.object.state.node.destroyed) return;
        const {
            // width,
            // height,
            // zoom,
            // zoomOffset,
            // $cursor,
            bgColor,
            gridColor,
            seperatorColor
        } = this.state;
        const { ctx, offscreenCtx, offscreenVRes } = this;
        if (!ctx || !offscreenCtx) return;

        const left = 0;
        const bottom = 0;

        const allAmplitudes = await this.object.state.node.getAllAmplitudes();

        // Background

        const [width, height] = this.fullSize();
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        if (!allAmplitudes) return;
        const { data: f, $totalFrames, fftBins: bins, frames, dataFrames, $writeFrame: $writeFrameUi32 } = allAmplitudes;
        if (!f || !f.length || !f[0].length) return;
        const l = f[0].length;
        const channels = f.length;

        // Draw to offscreen canvas
        const $lastFrame = Atomics.load($totalFrames, 0) - 1;
        const $writeFrame = Atomics.load($writeFrameUi32, 0);
        let $frame0 = $writeFrame;
        let $frame1 = $frame0 + dataFrames;
        if (this.dataFrames !== dataFrames) {
            offscreenCtx.canvas.width = dataFrames;
            this.dataFrames = dataFrames;
        } else if ($lastFrame >= this.$lastFrame) {
            $frame0 = Math.max($frame0, $frame1 - ($lastFrame - this.$lastFrame));
        }
        this.$lastFrame = $lastFrame;
        const osChannelHeight = offscreenVRes / channels;
        const step = Math.max(1, Math.round(bins / osChannelHeight));
        const vGrid = osChannelHeight / bins;
        for (let i = 0; i < f.length; i++) {
            for (let j = $frame0; j < $frame1; j++) {
                let maxInStep;
                offscreenCtx.fillStyle = "black";
                offscreenCtx.fillRect(j % dataFrames, i * osChannelHeight, 1, osChannelHeight);
                for (let k = 0; k < bins; k++) {
                    const samp = atodb(f[i][(k + j * bins) % l]);
                    const $step = k % step;
                    if ($step === 0) maxInStep = samp;
                    if ($step !== step - 1) {
                        if ($step !== 0 && samp > maxInStep) maxInStep = samp;
                        continue;
                    }
                    const normalized = Math.min(1, Math.max(0, (maxInStep + 10) / 100 + 1));
                    if (normalized === 0) continue;
                    const hue = (normalized * 180 + 240) % 360;
                    const lum = normalized * 50;
                    offscreenCtx.fillStyle = `hsl(${hue}, 100%, ${lum}%)`;
                    offscreenCtx.fillRect(j % dataFrames, (bins - k - 1) * vGrid + i * osChannelHeight, 1, Math.max(1, vGrid));
                }
            }
        }
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
        // Horizontal Range
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.imageSmoothingEnabled = false;
        $frame0 = ($frame1 - frames) % dataFrames;
        $frame1 = $frame0 + frames;
        if ($frame1 <= dataFrames) {
            ctx.drawImage(offscreenCtx.canvas, $frame0, 0, frames, offscreenVRes, left, 0, width - left, height - bottom);
        } else {
            const sSplit = dataFrames - $frame0;
            const dSplit = sSplit / frames * (width - left);
            ctx.drawImage(offscreenCtx.canvas, $frame0, 0, sSplit, offscreenVRes, left, 0, dSplit, height - bottom);
            ctx.drawImage(offscreenCtx.canvas, 0, 0, $frame1 - dataFrames - 0.01, offscreenVRes, dSplit + left, 0, width - left - dSplit, height - bottom);
        }
        ctx.restore();
    }
}
export interface State {
    node: SpectralAnalyserNode;
}
export interface Props extends Omit<SpectrogramUIState, "cursorX" | "cursorY" | "zoom" | "zoomOffset" | "paint"> {
    windowSize: number;
    fftSize: number;
    fftOverlap: number;
    windowFunction: TWindowFunction;
}
export class Spectrogram extends BaseDSP<{}, State, [Bang], [], [], Props, SpectrogramUIState> {
    static description = "Spectroscope";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Signal"
    }];
    static props: IPropsMeta<Props> = {
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
    static UI = SpectrogramUI;
    state: State = { node: undefined };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 0;
        });
        this.on("updateProps", (props) => {
            if (this.state.node) {
                const { parameters } = this.state.node;
                if (props.windowFunction) this.applyBPF(parameters.get("windowFunction"), [[["blackman", "hamming", "hann", "triangular"].indexOf(props.windowFunction)]]);
                if (props.fftSize) this.applyBPF(parameters.get("fftSize"), [[props.fftSize]]);
                if (props.fftOverlap) this.applyBPF(parameters.get("fftOverlap"), [[props.fftOverlap]]);
                if (props.windowSize) this.applyBPF(parameters.get("windowSize"), [[props.windowSize]]);
            }
        });
        this.on("postInit", async () => {
            await SpectralAnalyserNode.register(this.audioCtx.audioWorklet);
            this.state.node = new SpectralAnalyserNode(this.audioCtx);
            const { parameters } = this.state.node;
            this.applyBPF(parameters.get("windowFunction"), [[["blackman", "hamming", "hann", "triangular"].indexOf(this.getProp("windowFunction"))]]);
            this.applyBPF(parameters.get("fftSize"), [[this.getProp("fftSize")]]);
            this.applyBPF(parameters.get("fftOverlap"), [[this.getProp("fftOverlap")]]);
            this.applyBPF(parameters.get("windowSize"), [[this.getProp("windowSize")]]);
            this.disconnectAudioInlet();
            this.inletAudioConnections[0] = { node: this.state.node, index: 0 };
            this.connectAudioInlet();
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (isBang(data)) this.updateUI({ paint: {} });
            }
        });
        this.on("destroy", () => {
            if (this.state.node) this.state.node.destroy();
        });
    }
}
