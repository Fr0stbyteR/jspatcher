import * as Color from "color-js";
import UIObject from "./Base";
import { TMeta, TPropsMeta } from "../../types";
import { BaseUIState, CanvasUI } from "../BaseUI";

interface WaveformState {
    key: string;
    value: AudioBuffer;
}
interface WaveformUIProps {
    interleaved: boolean;
    selection: [number, number];
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
}
interface WaveformUIState extends WaveformState, BaseUIState, WaveformUIProps {}
type WaveformProps = WaveformUIProps;
export class WaveformUI extends CanvasUI<waveform, {}, WaveformUIState> {
    static defaultSize = [120, 60] as [number, number];
    componentDidMount() {
        const { bgColor } = this.state;
        const ctx = this.ctx;
        if (!ctx) return;
        const [width, height] = this.fullSize();
        // Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        super.componentDidMount();
    }
    async paint() {
        const {
            // width,
            // height,
            // zoom,
            // zoomOffset,
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
            seperatorColor,
            value
        } = this.state;
        const ctx = this.ctx;
        if (!ctx) return;

        const left = 0;
        const bottom = 0;

        // Background
        const [width, height] = this.fullSize();
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        if (!value) return;
        const t: Float32Array[] = [];
        for (let i = 0; i < value.numberOfChannels; i++) {
            t[i] = value.getChannelData(i);
        }
        if (!t || !t.length || !t[0].length) return;

        const $ = 0;
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
            const $zerox = 0; // First Zero-crossing
            const drawL = l; // Length to draw
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
        }
    }
}
export default class waveform extends UIObject<{}, WaveformState, [AudioBuffer, string | number], [], [string | number], WaveformProps, WaveformUIState> {
    static description = "Buffer waveform view";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "object",
        description: "AudioBuffer"
    }, {
        isHot: false,
        type: "anything",
        description: "Buffer name"
    }];
    static args: TMeta["args"] = [{
        type: "anything",
        optional: true,
        description: "Buffer name"
    }];
    static props: TPropsMeta<WaveformProps> = {
        interleaved: {
            type: "boolean",
            default: false,
            description: "Draw channels seperately",
            isUIState: true
        },
        selection: {
            type: "object",
            default: [0, 1],
            description: "Select a part of buffer",
            isUIState: true
        },
        zoom: {
            type: "number",
            default: 1,
            description: "Horizontal zoom factor",
            isUIState: true
        },
        zoomOffset: {
            type: "number",
            default: 0,
            description: "Horizontal zoom offset [0, 1)",
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
    static ui = WaveformUI;
    state: WaveformState = { key: undefined as string, value: undefined as AudioBuffer };
    subscribe() {
        super.subscribe();
        const sharedDataKey = "_buffer";
        const reload = (key: string) => {
            if (this.state.key) this.sharedData.unsubscribe(sharedDataKey, this.state.key, this);
            this.state.key = key;
            if (key) {
                const shared = this.sharedData.get(sharedDataKey, key);
                this.state.value = shared instanceof AudioBuffer ? shared : undefined;
                this.updateUI(this.state);
                this.sharedData.subscribe(sharedDataKey, this.state.key, this);
            }
        };
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 0;
        });
        this.on("updateArgs", (args) => {
            const key = typeof args[0] === "undefined" ? args[0] : args[0].toString();
            if (key !== this.state.key) {
                reload(key);
                this.updateUI(this.state);
            }
        });
        this.on("inlet", async ({ data, inlet }) => {
            if (inlet === 0) {
                if (data instanceof AudioBuffer) {
                    this.state.value = data;
                    this.updateUI(this.state);
                }
            } else if (inlet === 1) {
                if (typeof data === "string" || typeof data === "number") {
                    const key = data.toString() || "";
                    if (key !== this.state.key) {
                        reload(key);
                        this.updateUI(this.state);
                    }
                }
            }
        });
        this.on("sharedDataUpdated", ({ data }) => {
            if (data instanceof AudioBuffer) {
                this.state.value = data;
                this.updateUI(this.state);
            }
        });
        this.on("destroy", () => {
            if (this.state.key) this.sharedData.unsubscribe(sharedDataKey, this.state.key, this);
        });
    }
}
