import * as Color from "color-js";
import UIObject from "./Base";
import PatcherAudio from "../../audio/PatcherAudio";
import { TMeta, TPropsMeta } from "../../types";
import { BaseUIState, CanvasUI, CanvasUIState } from "../BaseUI";

interface WaveformState {
    audio: PatcherAudio;
}
interface WaveformUIProps {
    interleaved: boolean;
    cursor: number;
    viewRange: [number, number];
    selRange: [number, number];
    range: number;
    autoRange: boolean;
    showStats: boolean;
    bgColor: string;
    cursorColor: string;
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
    async paint() {
        const {
            cursor,
            range,
            viewRange,
            showStats,
            bgColor,
            cursorColor,
            phosphorColor,
            hueOffset,
            textColor,
            seperatorColor,
            audio
        } = this.state;
        const { ctx } = this;
        const [width, height] = this.fullSize();

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        if (!audio) return;

        const { audioBuffer: buffer, waveform } = audio;
        const t = [];
        for (let i = 0; i < buffer.numberOfChannels; i++) {
            t[i] = buffer.getChannelData(i);
        }
        if (!t.length || !t[0].length) return;
        const channels = t.length;

        // Vertical Range
        const yFactor = range;
        // Grids
        const gridChannels = channels;
        const channelHeight = height / gridChannels;

        ctx.beginPath();
        ctx.setLineDash([4, 2]);
        ctx.strokeStyle = seperatorColor;
        for (let i = 1; i < gridChannels; i++) {
            ctx.moveTo(0, i * channelHeight);
            ctx.lineTo(width, i * channelHeight);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineWidth = 1;
        const channelColor: string[] = [];
        // Horizontal Range
        const [$0, $1] = viewRange; // Draw start-end
        const pixelsPerSamp = width / ($1 - $0);
        const sampsPerPixel = Math.max(1, Math.round(1 / pixelsPerSamp));
        const waveformKey = Object.keys(waveform).filter(v => +v).reduce((acc, cur) => (+cur < sampsPerPixel && +cur > (acc || 0) ? +cur : acc), undefined as number);
        for (let i = 0; i < channels; i++) {
            ctx.beginPath();
            channelColor[i] = Color(phosphorColor).shiftHue(i * hueOffset).toHSL();
            ctx.strokeStyle = channelColor[i];
            ctx.fillStyle = channelColor[i];
            if (waveformKey) {
                const sampsPerPixel = 1 / pixelsPerSamp;
                const { idx } = waveform[waveformKey];
                const { min, max } = waveform[waveformKey][i];
                let x = 0;
                let maxInStep;
                let minInStep;
                for (let j = 0; j < idx.length - 1; j++) {
                    const $ = idx[j];
                    if ($ > $1) break;
                    const $next = j === idx.length - 1 ? buffer.length : idx[j + 1];
                    if ($next <= $0) continue;
                    if (typeof maxInStep === "undefined") {
                        maxInStep = max[j];
                        minInStep = min[j];
                    } else {
                        if (min[j] < minInStep) minInStep = min[j];
                        if (max[j] > maxInStep) maxInStep = max[j];
                    }
                    if ($next >= $0 + sampsPerPixel * (x + 1)) {
                        let y = channelHeight * (i + 0.5 - maxInStep / yFactor * 0.5);
                        if (x === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                        if (minInStep !== maxInStep) {
                            y = channelHeight * (i + 0.5 - minInStep / yFactor * 0.5);
                            ctx.lineTo(x, y);
                        }
                        maxInStep = undefined;
                        x++;
                    }
                }
            } else {
                let maxInStep;
                let minInStep;
                const prev = t[i][$0 - 1] || 0;
                const prevX = -0.5 * pixelsPerSamp;
                const prevY = channelHeight * (i + 0.5 - prev / yFactor * 0.5);
                ctx.moveTo(prevX, prevY);
                for (let j = $0; j < $1; j++) {
                    const samp = t[i][j];
                    const $step = (j - $0) % sampsPerPixel;
                    if ($step === 0) {
                        maxInStep = samp;
                        minInStep = samp;
                    } else {
                        if (samp > maxInStep) maxInStep = samp;
                        if (samp < minInStep) minInStep = samp;
                    }
                    if ($step === sampsPerPixel - 1) {
                        const x = (j - $step - $0 + 0.5) * pixelsPerSamp;
                        let y = channelHeight * (i + 0.5 - maxInStep / yFactor * 0.5);
                        ctx.lineTo(x, y);
                        if (minInStep !== maxInStep && pixelsPerSamp < 1) {
                            y = channelHeight * (i + 0.5 - minInStep / yFactor * 0.5);
                            ctx.lineTo(x, y);
                        }
                        if (pixelsPerSamp > 10) ctx.fillRect(x - 2, y - 2, 4, 4);
                    }
                }
                const next = t[i][$1] || 0;
                const nextX = ($1 - $0 + 0.5) * pixelsPerSamp;
                const nextY = channelHeight * (i + 0.5 - next / yFactor * 0.5);
                ctx.lineTo(nextX, nextY);
            }
            ctx.stroke();
        }
        // fade paths
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 1;
        // cursor
        if (cursor < $0 || cursor > $1) return;
        ctx.strokeStyle = cursorColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const cursorX = (cursor - $0) / ($1 - $0) * width;
        ctx.moveTo(cursorX, 0);
        ctx.lineTo(cursorX, height);
        ctx.stroke();
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
    componentDidMount() {
        const { bgColor } = this.state;
        const ctx = this.ctx;
        if (!ctx) return;
        const [width, height] = this.fullSize();
        // Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        this.state.audio?.on("changed", this.schedulePaint);
        super.componentDidMount();
    }
    componentDidUpdate(prevProps: any, prevState: Readonly<WaveformUIState & CanvasUIState>) {
        if (prevState.audio !== this.state.audio) {
            prevState.audio?.off("changed", this.schedulePaint);
            this.state.audio?.on("changed", this.schedulePaint);
        }
        super.componentDidUpdate(prevProps, prevState);
    }
    componentWillUnmount() {
        this.state.audio?.off("changed", this.schedulePaint);
        super.componentWillUnmount();
    }
}
export default class waveform extends UIObject<{}, WaveformState, [PatcherAudio], [], [], WaveformProps, WaveformUIState> {
    static description = "Buffer waveform view";
    static inlets: TMeta["inlets"] = [{
        isHot: false,
        type: "object",
        description: "Patcher Audio object (from buffer~)"
    }];
    static props: TPropsMeta<WaveformProps> = {
        interleaved: {
            type: "boolean",
            default: false,
            description: "Draw channels seperately",
            isUIState: true
        },
        cursor: {
            type: "number",
            default: 0,
            description: "Display a cursor",
            isUIState: true
        },
        viewRange: {
            type: "object",
            default: [0, 1],
            description: "Display only a part of the buffer",
            isUIState: true
        },
        selRange: {
            type: "object",
            default: null,
            description: "Nullable, display selection of a part of the buffer",
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
        cursorColor: {
            type: "color",
            default: "white",
            description: "Cursor color",
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
    static UI = WaveformUI;
    state: WaveformState = { audio: undefined };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 0;
        });
        this.on("inlet", async ({ data, inlet }) => {
            if (inlet === 0) {
                if (data instanceof PatcherAudio) {
                    this.setState({ audio: data });
                    this.updateUI(this.state);
                    this.update(null, { selRange: null, viewRange: [0, data.length], cursor: 0 });
                } else {
                    this.error("Input data is not PatcherAudio instance");
                }
            }
        });
    }
}
