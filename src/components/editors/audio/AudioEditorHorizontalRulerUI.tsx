import * as React from "react";
import AudioEditor from "./AudioEditor";
import { dbtoa } from "../../../utils/math";

interface P {
    editor: AudioEditor;
    frameRate: number;
    gridColor: string;
    phosphorColor: string;
    $audio: number;
}

export default class EditorHorizontalRulerUI extends React.PureComponent<P> {
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
            gridColor,
            phosphorColor,
            editor
        } = this.props;
        const { ctx } = this;
        const [width, height] = this.fullSize();
        const channels = editor.audio.numberOfChannels;
        const channelHeight = height / channels;

        ctx.clearRect(0, 0, width, height);
        const right = 80;
        const range = [-3, -6, -12, -18];
        ctx.strokeStyle = gridColor;
        ctx.beginPath();
        for (let i = 0; i < channels; i++) {
            const center = (i + 0.5) * channelHeight;
            ctx.moveTo(0, center);
            ctx.lineTo(width - right, center);
            let y: number;
            for (let j = 0; j < range.length; j++) {
                const a = dbtoa(range[j]);
                y = center - a * channelHeight * 0.5;
                ctx.moveTo(0, y);
                ctx.lineTo(width - right, y);
                y = center + a * channelHeight * 0.5;
                ctx.moveTo(0, y);
                ctx.lineTo(width - right, y);
            }
        }
        ctx.stroke();
        ctx.strokeStyle = "white";
        ctx.fillStyle = phosphorColor;
        ctx.font = "12px Consolas, monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("dB", width - right + 14, 10);
        ctx.beginPath();
        for (let i = 0; i < channels; i++) {
            if (i !== 0) {
                ctx.moveTo(width - right, i * channelHeight);
                ctx.lineTo(width, i * channelHeight);
            }
            const center = (i + 0.5) * channelHeight;
            ctx.moveTo(width - right, center);
            ctx.lineTo(width - right + 10, center);
            ctx.fillText("-∞", width - right + 14, center);
            let y: number;
            for (let db = -1; db >= -18; db--) {
                const a = dbtoa(db);
                y = center - a * channelHeight * 0.5;
                ctx.moveTo(width - right, y);
                ctx.lineTo(width - right + (range.indexOf(db) === -1 ? 5 : 10), y);
                if (range.indexOf(db) !== -1) ctx.fillText(db.toString(), width - right + 14, y);
                y = center + a * channelHeight * 0.5;
                ctx.moveTo(width - right, y);
                ctx.lineTo(width - right + (range.indexOf(db) === -1 ? 5 : 10), y);
                if (range.indexOf(db) !== -1) ctx.fillText(db.toString(), width - right + 14, y);
            }
        }
        ctx.stroke();
    }
    render() {
        return (
            <div className="editor-main-horizontal-ruler-container">
                <canvas ref={this.refCanvas} />
            </div>
        );
    }
}
