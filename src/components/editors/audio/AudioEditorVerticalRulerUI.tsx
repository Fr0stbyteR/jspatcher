import * as React from "react";
import AudioEditor from "../../../core/audio/AudioEditor";
import { TAudioUnit, AudioUnitOptions } from "../../../core/types";

interface P {
    editor: AudioEditor;
    ruler: Record<number, string>;
    audioUnit: TAudioUnit;
    audioUnitOptions: AudioUnitOptions;
    viewRange: [number, number];
    frameRate: number;
    gridColor: string;
    phosphorColor: string;
    drawAbove?: boolean;
}

export default class AudioEditorVerticalRulerUI extends React.PureComponent<P> {
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
        this.$paintRaf = (-1 * Math.round(Math.abs(60 / this.props.frameRate))) || -1;
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
        const {
            ruler,
            audioUnit,
            audioUnitOptions,
            viewRange,
            gridColor,
            phosphorColor
        } = this.props;
        const { ctx } = this;
        const [width, height] = this.fullSize();

        ctx.clearRect(0, 0, width, height);
        const top = this.props.drawAbove ? 40 : 0;
        const [viewStart, viewEnd] = viewRange;
        const viewLength = viewEnd - viewStart;
        ctx.strokeStyle = gridColor;
        ctx.beginPath();
        for (const sampleIn in ruler) {
            const sample = +sampleIn;
            const x = (sample - viewStart) / viewLength * width;
            ctx.moveTo(x, top);
            ctx.lineTo(x, height);
        }
        ctx.stroke();
        if (!this.props.drawAbove) return;
        ctx.strokeStyle = "white";
        ctx.fillStyle = phosphorColor;
        ctx.font = "12px Consolas, monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        ctx.fillText(audioUnit === "time" ? "hms" : audioUnit === "measure" ? `${audioUnitOptions.bpm} bpm` : "samps", 2, top - 14);
        ctx.textAlign = "center";
        ctx.beginPath();
        for (const sampleIn in ruler) {
            const text = ruler[sampleIn];
            const sample = +sampleIn;
            const x = (sample - viewStart) / viewLength * width;
            const y = text ? top - 10 : top - 5;
            ctx.moveTo(x, y);
            ctx.lineTo(x, top);
            if (text) ctx.fillText(text, x, y - 4);
        }
        ctx.stroke();
    }
    render() {
        return (
            <div className="editor-main-vertical-ruler-container">
                <canvas ref={this.refCanvas} />
            </div>
        );
    }
}
