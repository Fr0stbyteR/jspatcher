import * as React from "react";
import { Button } from "semantic-ui-react";
import * as Color from "color-js";
import AudioEditor from "./AudioEditor";
import { AudioDisplayOptions } from "../../../core/types";
import "./EditorMap.scss";

interface P {
    editor: AudioEditor;
    cursor: number;
    selRange: [number, number];
    viewRange: [number, number];
    audioDisplayOptions: AudioDisplayOptions;
    enabledChannels: boolean[];
    $audio: number;
}

export default class EditorMapUI extends React.PureComponent<P> {
    refDivViewRange = React.createRef<HTMLDivElement>();
    refCanvas = React.createRef<HTMLCanvasElement>();
    paintScheduled = false;
    $paintRaf = -1;
    get canvas() {
        return this.refCanvas.current;
    }
    get ctx() {
        return this.refCanvas.current ? this.refCanvas.current.getContext("2d") : undefined;
    }
    fullSize(): [number, number] {
        const { canvas, ctx } = this;
        if (!ctx) return [0, 0];
        const rect = canvas.getBoundingClientRect();
        const w = ~~rect.width;
        const h = ~~rect.height;
        if (ctx.canvas.width !== w) ctx.canvas.width = w;
        if (ctx.canvas.height !== h) ctx.canvas.height = h;
        return [w, h];
    }
    paintCallback = () => {
        this.$paintRaf = (-1 * Math.round(Math.abs(60 / this.props.audioDisplayOptions.frameRate))) || -1;
        this.paintScheduled = false;
        this.paint();
    };
    noPaintCallback = () => {
        this.$paintRaf++;
        this.paintScheduled = false;
        this.schedulePaint();
    };
    schedulePaint = () => {
        if (this.paintScheduled) return;
        if (this.$paintRaf === -1) this.$paintRaf = requestAnimationFrame(this.paintCallback);
        else if (this.$paintRaf < -1) requestAnimationFrame(this.noPaintCallback);
        this.paintScheduled = true;
    };
    componentDidMount() {
        const ctx = this.ctx;
        if (!ctx) return;
        const [width, height] = this.fullSize();
        ctx.clearRect(0, 0, width, height);
        this.schedulePaint();
        this.props.editor.on("uiResized", this.schedulePaint);
    }
    componentDidUpdate() {
        this.schedulePaint();
    }
    componentWillUnmount() {
        this.props.editor.off("uiResized", this.schedulePaint);
        if (this.paintScheduled) cancelAnimationFrame(this.$paintRaf);
    }
    paint() {
        const { editor, cursor, audioDisplayOptions } = this.props;
        const {
            phosphorColor,
            hueOffset,
            seperatorColor,
            cursorColor
        } = audioDisplayOptions;
        const { audioBuffer: buffer, waveform, numberOfChannels } = editor.audio;
        const { ctx } = this;
        const [width, height] = this.fullSize();

        ctx.clearRect(0, 0, width, height);

        if (!buffer) return;

        const t = [];
        for (let i = 0; i < numberOfChannels; i++) {
            t[i] = buffer.getChannelData(i);
        }
        if (!t.length || !t[0].length) return;
        const channels = t.length;
        const l = t[0].length;
        const range = 1.1;

        // Vertical Range
        const yFactor = range;
        // Grids
        const gridChannels = channels;
        const channelHeight = (height) / gridChannels;

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
        const pixelsPerSamp = width / l;
        const sampsPerPixel = Math.max(1, Math.round(1 / pixelsPerSamp));
        const waveformKey = Object.keys(waveform).filter(v => +v).reduce((acc, cur) => (+cur < sampsPerPixel && +cur > (acc || 0) ? +cur : acc), undefined as number);
        for (let i = 0; i < channels; i++) {
            ctx.beginPath();
            channelColor[i] = Color(phosphorColor).shiftHue(i * hueOffset).toHSL();
            ctx.strokeStyle = channelColor[i];
            if (waveformKey) {
                const sampsPerPixel = 1 / pixelsPerSamp;
                const { idx } = waveform[waveformKey];
                const { min, max } = waveform[waveformKey][i];
                let x = 0;
                let maxInStep;
                let minInStep;
                for (let j = 0; j < idx.length - 1; j++) {
                    const $next = j === idx.length - 1 ? buffer.length : idx[j + 1];
                    if (typeof maxInStep === "undefined") {
                        maxInStep = max[j];
                        minInStep = min[j];
                    } else {
                        if (min[j] < minInStep) minInStep = min[j];
                        if (max[j] > maxInStep) maxInStep = max[j];
                    }
                    if ($next >= sampsPerPixel * (x + 1)) {
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
                const prev = 0;
                const prevX = -0.5 * pixelsPerSamp;
                const prevY = channelHeight * (i + 0.5 - prev / yFactor * 0.5);
                ctx.moveTo(prevX, prevY);
                for (let j = 0; j < l; j++) {
                    const samp = t[i][j];
                    const $step = j % sampsPerPixel;
                    if ($step === 0) {
                        maxInStep = samp;
                        minInStep = samp;
                    } else {
                        if (samp > maxInStep) maxInStep = samp;
                        if (samp < minInStep) minInStep = samp;
                    }
                    if ($step === sampsPerPixel - 1) {
                        const x = (j - $step + 0.5) * pixelsPerSamp;
                        let y = channelHeight * (i + 0.5 - maxInStep / yFactor * 0.5);
                        ctx.lineTo(x, y);
                        if (minInStep !== maxInStep && pixelsPerSamp < 1) {
                            y = channelHeight * (i + 0.5 - minInStep / yFactor * 0.5);
                            ctx.lineTo(x, y);
                        }
                    }
                }
                const next = 0;
                const nextX = (l + 0.5) * pixelsPerSamp;
                const nextY = channelHeight * (i + 0.5 - next / yFactor * 0.5);
                ctx.lineTo(nextX, nextY);
            }
            ctx.stroke();
        }
        ctx.strokeStyle = cursorColor;
        ctx.beginPath();
        const cursorX = cursor / l * width;
        ctx.moveTo(cursorX, 0);
        ctx.lineTo(cursorX, height);
        ctx.stroke();
    }
    handleMoveMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const origin = { x: e.clientX, y: e.clientY };
        const parentRect = this.refCanvas.current.getBoundingClientRect();
        const rect = this.refDivViewRange.current.getBoundingClientRect();
        const curLeft = rect.left - parentRect.left;
        const { length } = this.props.editor.audio;
        const viewLength = this.props.viewRange[1] - this.props.viewRange[0];
        this.refDivViewRange.current.style.cursor = "grabbing";
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.refDivViewRange.current && e.movementX) {
                const x = e.clientX;
                const left = curLeft + (x - origin.x);
                const startSample = Math.max(0, Math.min(length - viewLength, left / parentRect.width * length));
                const endSample = startSample + viewLength;
                this.props.editor.setViewRange([startSample, endSample]);
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            this.refDivViewRange.current.style.cursor = "grab";
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    handleResizeStartMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const origin = { x: e.clientX, y: e.clientY };
        const parent = this.refDivViewRange.current.parentElement;
        const parentRect = parent.getBoundingClientRect();
        const rect = this.refDivViewRange.current.getBoundingClientRect();
        const curLeft = rect.left - parentRect.left;
        const curRight = parentRect.right - rect.right;
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.refDivViewRange.current && e.movementX) {
                const left = Math.max(0, Math.min(parentRect.width - curRight - 10, curLeft + (e.clientX - origin.x)));
                const startSample = left / parentRect.width * this.props.editor.audio.length;
                this.props.editor.setViewRange([startSample, this.props.viewRange[1]]);
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    handleResizeEndMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const origin = { x: e.clientX, y: e.clientY };
        const parent = this.refDivViewRange.current.parentElement;
        const parentRect = parent.getBoundingClientRect();
        const rect = this.refDivViewRange.current.getBoundingClientRect();
        const curWidth = rect.width;
        const curLeft = rect.left - parentRect.left;
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.refDivViewRange.current && e.movementX) {
                const width = Math.max(10, Math.min(parentRect.width - curLeft, curWidth - (origin.x - e.clientX)));
                const length = width / parentRect.width * this.props.editor.audio.length;
                this.props.editor.setViewRange([this.props.viewRange[0], this.props.viewRange[0] + length]);
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            this.props.editor.scrollH(e.deltaX > 0 ? 0.01 : -0.01);
            return;
        }
        const origin = { x: e.clientX, y: e.clientY };
        const rect = e.currentTarget.getBoundingClientRect();
        const ref = (origin.x - rect.left) / rect.width * this.props.editor.audio.length;
        this.props.editor.zoomH(ref, e.deltaY < 0 ? 1 : -1);
    };
    handleClickSelectAll = () => this.props.editor.setViewRangeToAll();
    render() {
        /* 
        if (!this.props.buffer) {
            return (
                <div className="editor-map">
                    <div className="editor-map-canvas-container">
                        <canvas ref={this.refCanvas} />
                    </div>
                    <div className="editor-map-controls">
                        <span className="editor-map-select-all" ><Button color="black" size="mini" icon="expand" /></span>
                    </div>
                </div>
            );
        }
         */
        const { editor, viewRange, selRange } = this.props;
        const { length } = editor.audio;
        const [viewStart, viewEnd] = viewRange;
        const viewLeft = `${viewStart / length * 100}%`;
        const viewWidth = `${(viewEnd - viewStart) / length * 100}%`;
        const [selStart, selEnd] = selRange || [0, 0];
        const selLeft = `${selStart / length * 100}%`;
        const selWidth = `${(selEnd - selStart) / length * 100}%`;
        return (
            <div className="editor-map">
                <div className="editor-map-canvas-container" style={{ backgroundColor: this.props.audioDisplayOptions.bgColor }} onWheel={this.handleWheel}>
                    <canvas ref={this.refCanvas} />
                    <div className="editor-map-selrange" style={{ left: selLeft, width: selWidth }} />
                    <div className="editor-map-viewrange" ref={this.refDivViewRange} style={{ left: viewLeft, width: viewWidth }} onMouseDown={this.handleMoveMouseDown}>
                        <div className="resize-handler resize-handler-w" onMouseDown={this.handleResizeStartMouseDown} />
                        <div className="resize-handler resize-handler-e" onMouseDown={this.handleResizeEndMouseDown} />
                    </div>
                </div>
                <div className="editor-map-controls">
                    <span className="editor-map-select-all" ><Button color="black" size="mini" icon="expand" onClick={this.handleClickSelectAll} /></span>
                </div>
            </div>
        );
    }
}
