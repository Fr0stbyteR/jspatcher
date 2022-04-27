import * as React from "react";
import { Button, Icon } from "semantic-ui-react";
import * as Color from "color-js";
import AudioEditor, { AudioEditorState } from "../../../core/audio/AudioEditor";
import GainInputUI from "./GainInput";
import AudioEditorVerticalRulerUI from "./AudioEditorVerticalRulerUI";
import AudioEditorHorizontalRulerUI from "./AudioEditorHorizontalRulerUI";
import I18n from "../../../i18n/I18n";
import { normExp } from "../../../utils/math";
import { getRuler } from "../../../utils/utils";
import type Env from "../../../core/Env";
import type { EnvOptions } from "../../../core/EnvOptionsManager";
import type { TFreqDomainDataFrames } from "../../../core/workers/FFTWWorker.types";
import "./AudioEditorSpectrogramUI.scss";

interface P extends AudioEditorState, EnvOptions {
    env: Env;
    lang: string;
    editor: AudioEditor;
    $audio: number;
}
interface S {
    fade: number;
}

export default class AudioEditorSpectrogramUI extends React.PureComponent<P, S> {
    state: S = { fade: undefined };

    refDivMain = React.createRef<HTMLDivElement>();
    refDivSelRange = React.createRef<HTMLDivElement>();
    refCanvas = React.createRef<HTMLCanvasElement>();
    paintScheduled = false;
    $paintRaf = -1;
    vRuler: Record<number, string>;
    grid: number;
    spectrogram: { matrix: Float32Array; output: TFreqDomainDataFrames }[];
    offscreenCtxs: CanvasRenderingContext2D[] = [];
    get strings() {
        return I18n[this.props.lang].AudioEditorUI;
    }
    async getSpectrogram() {
        const { fftSize, fftOverlap, fftWindowFunction } = this.props.audioDisplayOptions;
        const spectrogram = await Promise.all(
            this.props.editor.instance.audioBuffer.toArray(true).map(async (channelData) => {
                const fftwWorker = await this.props.env.getFFTW();
                return fftwWorker.forwardsAmpMatrix(channelData, fftSize, fftOverlap, fftWindowFunction);
            })
        );
        this.spectrogram = spectrogram;
    }
    prepareSpectrogram() {
        const { fftSize, fftDrawThreshold } = this.props.audioDisplayOptions;
        this.spectrogram.forEach(({ matrix }, i) => {
            if (!this.offscreenCtxs[i]) {
                const canvas = document.createElement("canvas");
                this.offscreenCtxs[i] = canvas.getContext("2d");
            }
            const ctx = this.offscreenCtxs[i];
            const height = fftSize / 2 + 1;
            const width = matrix.length / height;
            ctx.canvas.height = height;
            ctx.canvas.width = width;
            ctx.clearRect(0, 0, width, height);
            const thresh = fftDrawThreshold;
            for (let i = 0; i < matrix.length; i++) {
                const v = matrix[i];
                if (v < thresh) continue;
                const n = (v - thresh) / -thresh;
                const hue = (n * 180 + 240) % 360;
                // const lum = 50;
                ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${n})`;
                ctx.fillRect(~~(i / height), height - 1 - (i % height), 1, 1);
            }
            return ctx;
        });
    }
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
    handleChanged = async () => {
        await this.getSpectrogram();
        this.prepareSpectrogram();
        this.schedulePaint();
    };
    async componentDidMount() {
        const ctx = this.ctx;
        if (!ctx) return;
        const [width, height] = this.fullSize();
        ctx.clearRect(0, 0, width, height);
        this.schedulePaint();
        this.props.editor.on("uiResized", this.schedulePaint);
        await this.getSpectrogram();
        this.prepareSpectrogram();
        this.schedulePaint();
        this.props.editor.on("changed", this.handleChanged);
    }
    componentDidUpdate() {
        this.schedulePaint();
    }
    componentWillUnmount() {
        this.props.editor.off("changed", this.handleChanged);
        this.props.editor.off("uiResized", this.schedulePaint);
        if (this.paintScheduled) cancelAnimationFrame(this.$paintRaf);
    }
    paint() {
        const {
            editor,
            viewRange,
            selRange,
            cursor,
            audioDisplayOptions
        } = this.props;
        const { fade } = this.state;
        const {
            seperatorColor,
            cursorColor
        } = audioDisplayOptions;
        const { audioBuffer, numberOfChannels } = editor;
        const { ctx } = this;
        const [width, height] = this.fullSize();

        ctx.clearRect(0, 0, width, height);

        if (!audioBuffer) return;

        // Grids
        const gridChannels = numberOfChannels;
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
        // Horizontal Range
        const [$0, $1] = viewRange; // Draw start-end
        // Iteration
        for (let i = 0; i < numberOfChannels; i++) {
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            if (this.offscreenCtxs[i]) {
                const { width: sw, height: sh } = this.offscreenCtxs[i].canvas;
                ctx.drawImage(
                    this.offscreenCtxs[i].canvas,
                    $0 / audioBuffer.length * sw, 0, ($1 - $0) / audioBuffer.length * sw, sh,
                    0, i * channelHeight, width, channelHeight
                );
            }
            ctx.restore();
        }
        // cursor
        if (cursor < $0 || cursor > $1) return;
        ctx.strokeStyle = cursorColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const cursorX = (cursor - $0) / ($1 - $0) * width;
        ctx.moveTo(cursorX, 0);
        ctx.lineTo(cursorX, height);
        ctx.stroke();
    }
    handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const { viewRange } = this.props;
        const [viewStart, viewEnd] = viewRange;
        const viewLength = viewEnd - viewStart;
        const origin = { x: e.clientX, y: e.clientY };
        const rect = e.currentTarget.getBoundingClientRect();
        const cursor = viewStart + (e.clientX - rect.left) / rect.width * viewLength;
        this.props.editor.setCursor(cursor);
        this.props.editor.setSelRange(null);
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            const x = e.clientX;
            if (x > rect.right) this.props.editor.scrollH((x - rect.right) / 1000);
            else if (x < rect.left) this.props.editor.scrollH((x - rect.left) / 1000);
            if (x === origin.x) {
                this.props.editor.setSelRange(null);
            } else {
                const { viewRange } = this.props;
                const [viewStart, viewEnd] = viewRange;
                const viewLength = viewEnd - viewStart;
                const to = viewStart + Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * viewLength;
                this.props.editor.setSelRange([cursor, to]);
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            this.props.editor.emitSelRangeToPlay();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            this.props.editor.scrollH(e.deltaX > 0 ? 0.01 : -0.01);
            return;
        }
        const { viewRange } = this.props;
        const [viewStart, viewEnd] = viewRange;
        const viewLength = viewEnd - viewStart;
        const origin = { x: e.clientX, y: e.clientY };
        const rect = e.currentTarget.getBoundingClientRect();
        const ref = viewStart + (origin.x - rect.left) / rect.width * viewLength;
        this.props.editor.zoomH(ref, e.deltaY < 0 ? 1 : -1);
    };
    handleCursorHandlerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const rect = this.refCanvas.current.getBoundingClientRect();
        const { currentTarget } = e;
        if (currentTarget.classList.contains("editor-main-vertical-ruler-area")) {
            const { viewRange } = this.props;
            const [viewStart, viewEnd] = viewRange;
            const viewLength = viewEnd - viewStart;
            const cursor = viewStart + (e.clientX - rect.left) / rect.width * viewLength;
            this.props.editor.setCursor(cursor);
        }
        if (currentTarget.classList.contains("editor-main-cursor-handler")) currentTarget.style.cursor = "grabbing";
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            const x = e.clientX;
            if (x > rect.right) this.props.editor.scrollH((x - rect.right) / 1000);
            else if (x < rect.left) this.props.editor.scrollH((x - rect.left) / 1000);
            const { viewRange } = this.props;
            const [viewStart, viewEnd] = viewRange;
            const viewLength = viewEnd - viewStart;
            const cursor = viewStart + (x - rect.left) / rect.width * viewLength;
            this.props.editor.setCursor(cursor);
        };
        const handleMouseUp = (e: MouseEvent) => {
            if (currentTarget.classList.contains("editor-main-cursor-handler")) currentTarget.style.cursor = "";
            e.stopPropagation();
            e.preventDefault();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    handleSelRangeMoveMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const origin = { x: e.clientX, y: e.clientY };
        const parentRect = this.refCanvas.current.getBoundingClientRect();
        const rect = this.refDivSelRange.current.getBoundingClientRect();
        const curLeft = rect.left - parentRect.left;
        const { length } = this.props.editor;
        const selLength = this.props.selRange[1] - this.props.selRange[0];
        this.refDivSelRange.current.style.cursor = "grabbing";
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.refDivSelRange.current && e.movementX) {
                const x = e.clientX;
                if (x > parentRect.right) this.props.editor.scrollH((x - parentRect.right) / 1000);
                else if (x < parentRect.left) this.props.editor.scrollH((x - parentRect.left) / 1000);
                const { viewRange } = this.props;
                const [viewStart, viewEnd] = viewRange;
                const viewLength = viewEnd - viewStart;
                const left = curLeft + (x - origin.x);
                const startSample = Math.max(0, Math.min(length - selLength, viewStart + left / parentRect.width * viewLength));
                const endSample = startSample + selLength;
                this.props.editor.setSelRange([startSample, endSample]);
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            this.refDivSelRange.current.style.cursor = "grab";
            this.props.editor.emitSelRangeToPlay();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    handleResizeStartMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const rect = this.refCanvas.current.getBoundingClientRect();
        const end = this.props.selRange[1];
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.refDivSelRange.current && e.movementX) {
                const x = e.clientX;
                if (x > rect.right) this.props.editor.scrollH((x - rect.right) / 1000);
                else if (x < rect.left) this.props.editor.scrollH((x - rect.left) / 1000);
                const { viewRange } = this.props;
                const [viewStart, viewEnd] = viewRange;
                const viewLength = viewEnd - viewStart;
                const start = viewStart + (x - rect.left) / rect.width * viewLength;
                this.props.editor.setSelRange([start, end]);
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            this.props.editor.emitSelRangeToPlay();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    handleResizeEndMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const rect = this.refCanvas.current.getBoundingClientRect();
        const start = this.props.selRange[0];
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.refDivSelRange.current && e.movementX) {
                const x = e.clientX;
                if (x > rect.right) this.props.editor.scrollH((x - rect.right) / 1000);
                else if (x < rect.left) this.props.editor.scrollH((x - rect.left) / 1000);
                const { viewRange } = this.props;
                const [viewStart, viewEnd] = viewRange;
                const viewLength = viewEnd - viewStart;
                const end = viewStart + (x - rect.left) / rect.width * viewLength;
                this.props.editor.setSelRange([start, end]);
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            this.props.editor.emitSelRangeToPlay();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    handleClickChannelEnabler = (i: number) => this.props.editor.setEnabledChannel(i, !this.props.enabledChannels[i]);
    render() {
        const { env, editor, audioUnit, viewRange, audioUnitOptions, selRange, cursor, audioDisplayOptions } = this.props;
        const { bgColor } = audioDisplayOptions;
        const sampleRate = editor.sampleRate ?? env.audioCtx.sampleRate;
        const l = editor.length || 0;
        /*
        if (!this.props.editor.audio.audioBuffer) {
            return (
                <div className="editor-main">
                    <div className="editor-main-canvases">
                        <div className="editor-main-canvas-background" style={{ backgroundColor: bgColor }} />
                        <div className="editor-main-canvas-container">
                            <canvas ref={this.refCanvas} />
                        </div>
                    </div>
                    <div className="editor-map-controls">
                        <TimeInputUI samples={this.props.cursor} sampleRate={sampleRate} unit={audioUnit} {...audioUnitOptions} />
                    </div>
                </div>
            );
        }
         */
        const [viewStart, viewEnd] = viewRange;
        const viewLength = viewEnd - viewStart;
        const [selStart, selEnd] = selRange || [0, 0];
        const $selStart = (selStart - viewStart) / viewLength;
        const $selEnd = (selEnd - viewStart) / viewLength;
        const selLeft = `${$selStart * 100}%`;
        const selWidth = `${($selEnd - $selStart) * 100}%`;
        const $cursor = (cursor - viewStart) / viewLength;
        const cursorLeft = `${$cursor * 100}%`;
        const { ruler, refined } = getRuler(viewRange, audioUnit, { ...audioUnitOptions, sampleRate });
        this.vRuler = ruler;
        this.grid = refined;
        return (
            <div className="editor-spectrogram">
                <div className="editor-spectrogram-canvases">
                    <div className="editor-spectrogram-canvas-background" style={{ backgroundColor: bgColor }} />
                    <AudioEditorVerticalRulerUI ruler={this.vRuler} {...this.props} {...audioDisplayOptions} />
                    {/*
                    <AudioEditorHorizontalRulerUI {...this.props} {...audioDisplayOptions} />
                    */}
                    <div ref={this.refDivMain} className="editor-spectrogram-canvas-container" onMouseDown={this.handleCanvasMouseDown} onWheel={this.handleWheel}>
                        <canvas ref={this.refCanvas} />
                        <div className="editor-spectrogram-selrange" style={{ left: selLeft, width: selWidth }} hidden={!selRange}>
                            <div className="resize-handler resize-handler-w" onMouseDown={this.handleResizeStartMouseDown} />
                            <div className="resize-handler resize-handler-e" onMouseDown={this.handleResizeEndMouseDown} />
                        </div>
                        {/*
                        <div className="editor-main-fades">
                            {viewStart === 0 ? <div title={this.strings.fadeIn} className="editor-main-fadein-handler" onMouseDown={this.handleFadeInMouseDown}><Icon name="adjust" inverted size="small" /></div> : undefined}
                            {viewEnd === l ? <div title={this.strings.fadeOut} className="editor-main-fadeout-handler" onMouseDown={this.handleFadeOutMouseDown}><Icon name="adjust" inverted size="small" /></div> : undefined}
                            {selRange ? <div title={this.strings.gain} className="editor-main-fade-handler" style={{ left: `${Math.max(10, Math.min(90, $selStart * 100))}%` }}><Icon name="adjust" inverted size="small" /><GainInputUI unit="dB" gain={this.state.fade || 0} onAdjust={this.handleFadeAdjust} onChange={this.handleFadeChange} /></div> : undefined}
                        </div>
                        */}
                    </div>
                    <div className="editor-spectrogram-channel-enabler">
                        {
                            this.props.enabledChannels.map((enabled, i) => (
                                <div key={i} {...(enabled ? {} : { className: "disabled" })}>
                                    <span className="enable-channel">
                                        <Button active={enabled} basic={!enabled} color="grey" size="mini" onClick={() => this.handleClickChannelEnabler(i)}>{i + 1}</Button>
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                    {/*
                    <div className="editor-spectrogram-vertical-ruler-area" onMouseDown={this.handleCursorHandlerMouseDown}>
                        <div className="editor-main-selrange-handler" ref={this.refDivSelRange} style={{ left: selLeft, width: selWidth }} hidden={!selRange} >
                            <div className="resize-handler resize-handler-w" onMouseDown={this.handleResizeStartMouseDown} />
                            <div className="editor-spectrogram-selrange-mover" onMouseDown={this.handleSelRangeMoveMouseDown} />
                            <div className="resize-handler resize-handler-e" onMouseDown={this.handleResizeEndMouseDown} />
                        </div>
                        <div className="editor-spectrogram-cursor-handler" style={{ left: cursorLeft }} onMouseDown={this.handleCursorHandlerMouseDown} />
                    </div>
                    */}
                </div>
            </div>
        );
    }
}
