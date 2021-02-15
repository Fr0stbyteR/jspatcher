import * as Color from "color-js";
import UIObject from "./Base";
import PatcherAudio from "../../audio/PatcherAudio";
import { TAudioUnit, TMeta, TPropsMeta } from "../../types";
import { CanvasUI, CanvasUIState } from "../BaseUI";
import { getRuler } from "../../../components/editors/audio/AudioEditorMainUI";
import { dbtoa } from "../../../utils/math";

interface WaveformState {
    audio: PatcherAudio;
}
interface WaveformUIProps {
    interleaved: boolean;
    cursor: number;
    viewRange: [number, number];
    selRange: [number, number];
    verticalRange: [number, number];
    autoVerticalRange: boolean;
    showStats: boolean;
    bgColor: string;
    cursorColor: string;
    phosphorColor: string;
    hueOffset: number;
    textColor: string;
    gridColor: string;
    seperatorColor: string;
    audioUnit: TAudioUnit;
    bpm: number;
}
interface WaveformUIState extends WaveformState, CanvasUIState, WaveformUIProps {}
type WaveformProps = WaveformUIProps;
export class WaveformUI extends CanvasUI<waveform, {}, WaveformUIState> {
    static defaultSize = [120, 60] as [number, number];
    state: WaveformUIState & WaveformState = { ...this.state, audio: this.object.state.audio };
    async paint() {
        const {
            interleaved,
            cursor,
            autoVerticalRange,
            verticalRange,
            viewRange,
            showStats,
            bgColor,
            cursorColor,
            phosphorColor,
            hueOffset,
            textColor,
            gridColor,
            seperatorColor,
            audioUnit,
            bpm,
            audio
        } = this.state;
        const { ctx } = this;
        const [width, height] = this.fullSize();

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        if (!audio) return;

        const { audioBuffer, waveform, numberOfChannels, length, sampleRate } = audio;
        const t = audioBuffer.toArray();
        if (!t.length || !t[0].length) return;

        // View Range
        let [$0, $1] = viewRange || [0, length];
        if ($1 < $0) [$0, $1] = [$1, $0];
        const pixelsPerSamp = width / ($1 - $0);
        const sampsPerPixel = Math.max(1, Math.round(1 / pixelsPerSamp));
        // Vertical Range
        let [yMin, yMax] = autoVerticalRange ? [-1, 1] : verticalRange;
        if (autoVerticalRange) {
            // Fastest way to get min and max to have: 1. max abs value for y scaling, 2. mean value for zero-crossing
            let i = numberOfChannels;
            let s = 0;
            while (i--) {
                let j = viewRange[1];
                while (j-- > viewRange[0]) {
                    s = t[i][j];
                    if (s < yMin) yMin = s;
                    else if (s > yMax) yMax = s;
                }
            }
            const yFactor = Math.max(1, Math.abs(yMin), Math.abs(yMax));
            [yMin, yMax] = [-yFactor, yFactor];
        } else {
            if (yMax < yMin) [yMin, yMax] = [yMax, yMin];
        }
        const calcY = (v: number, i: number) => channelHeight * (+interleaved * i + 1 - (v - yMin) / (yMax - yMin));
        // Grids
        const { ruler } = getRuler(viewRange, audioUnit, { bpm, sampleRate });
        const gridChannels = interleaved ? numberOfChannels : 1;
        const channelHeight = height / gridChannels;
        // Vertical
        ctx.strokeStyle = gridColor;
        ctx.beginPath();
        for (const sampleIn in ruler) {
            const sample = +sampleIn;
            const x = (sample - $0 + 0.5) * pixelsPerSamp;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        ctx.stroke();

        // Horizontal
        ctx.beginPath();
        const range = [18, 12, 6, 3, 0, -3, -6, -12, -18].filter(v => dbtoa(v) < Math.max(Math.abs(yMin), Math.abs(yMax)));
        for (let i = 0; i < gridChannels; i++) {
            let y = calcY(0, i);
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            for (let j = 0; j < range.length; j++) {
                const a = dbtoa(range[j]);
                if (a < yMax) {
                    y = calcY(a, i);
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y);
                }
                if (a > yMin) {
                    y = calcY(-a, i);
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y);
                }
            }
        }
        ctx.stroke();

        // Seperator
        ctx.beginPath();
        ctx.setLineDash([4, 2]);
        ctx.strokeStyle = seperatorColor;
        for (let i = 1; i < gridChannels; i++) {
            ctx.moveTo(0, i * channelHeight);
            ctx.lineTo(width, i * channelHeight);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        // Iteration
        ctx.lineWidth = 1;
        const channelColor: string[] = [];
        const currentWaveform = waveform.findStep(sampsPerPixel);
        for (let i = 0; i < numberOfChannels; i++) {
            if (interleaved) {
                ctx.save();
                const clip = new Path2D();
                clip.rect(0, i * channelHeight, width, channelHeight);
                ctx.clip(clip);
            }
            ctx.beginPath();
            channelColor[i] = Color(phosphorColor).shiftHue(i * hueOffset).toHSL();
            ctx.strokeStyle = channelColor[i];
            ctx.fillStyle = channelColor[i];
            if (currentWaveform) {
                const sampsPerPixel = 1 / pixelsPerSamp;
                const { idx } = currentWaveform;
                const { min, max } = currentWaveform[i];
                let x = 0;
                let maxInStep;
                let minInStep;
                for (let j = 0; j < idx.length - 1; j++) {
                    const $ = idx[j];
                    if ($ > $1) break;
                    const $next = j === idx.length - 1 ? length : idx[j + 1];
                    if ($next <= $0) continue;
                    if (typeof maxInStep === "undefined") {
                        maxInStep = max[j];
                        minInStep = min[j];
                    } else {
                        if (min[j] < minInStep) minInStep = min[j];
                        if (max[j] > maxInStep) maxInStep = max[j];
                    }
                    if ($next >= $0 + sampsPerPixel * (x + 1)) {
                        let y = calcY(maxInStep, i);
                        if (x === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                        if (minInStep !== maxInStep) {
                            y = calcY(minInStep, i);
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
                const prevY = calcY(prev, i);
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
                        let y = calcY(maxInStep, i);
                        ctx.lineTo(x, y);
                        if (minInStep !== maxInStep && pixelsPerSamp < 1) {
                            y = calcY(minInStep, i);
                            ctx.lineTo(x, y);
                        }
                        if (pixelsPerSamp > 10) ctx.fillRect(x - 2, y - 2, 4, 4);
                    }
                }
                const next = t[i][$1] || 0;
                const nextX = ($1 - $0 + 0.5) * pixelsPerSamp;
                const nextY = calcY(next, i);
                ctx.lineTo(nextX, nextY);
            }
            ctx.stroke();
            if (interleaved) ctx.restore();
        }
        // cursor
        if (cursor > $0 && cursor < $1) {
            ctx.strokeStyle = cursorColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            const cursorX = (cursor - $0) / ($1 - $0) * width;
            ctx.moveTo(cursorX, 0);
            ctx.lineTo(cursorX, height);
            ctx.stroke();
        }
        // Stats
        if (showStats) {
            ctx.font = "bold 12px Consolas, monospace";
            ctx.fillStyle = textColor;
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillText(yMax.toFixed(2), 2, 2);
            ctx.textBaseline = "bottom";
            ctx.fillText((yMax).toFixed(2), 2, height - 2);
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
        verticalRange: {
            type: "object",
            default: [-1, 1],
            description: "Vertical range",
            isUIState: true
        },
        autoVerticalRange: {
            type: "boolean",
            default: true,
            description: "Auto adjust vertical range if > 1",
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
        },
        audioUnit: {
            type: "enum",
            default: "time",
            enums: ["time", "sample", "measure"],
            description: "Vertical grid mode",
            isUIState: true
        },
        bpm: {
            type: "number",
            default: 60,
            description: "If audioUnit is measure, a BPM can be used",
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
