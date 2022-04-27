import * as React from "react";
import { Table } from "semantic-ui-react";
import AudioEditor from "../../../core/audio/AudioEditor";
import { atodb } from "../../../utils/math";
import TimeInputUI from "./TimeInput";
import { AudioUnitOptions, TAudioPlayingState, TAudioUnit } from "../../../core/types";
import I18n from "../../../i18n/I18n";
import "./AudioEditorMonitorUI.scss";

interface P {
    editor: AudioEditor;
    lang: string;
    cursor: number;
    selRange: [number, number];
    viewRange: [number, number];
    audioUnit: TAudioUnit;
    audioUnitOptions: AudioUnitOptions;
    phosphorColor: string;
    playing: TAudioPlayingState;
    monitoring: boolean;
    frameRate: number;
}

export default class AudioEditorMonitorUI extends React.PureComponent<P> {
    get strings() {
        return I18n[this.props.lang].AudioEditorMonitorUI;
    }
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
    values: number[] = [];
    maxValues: number[] = [];
    maxTimer: number;
    async paint() {
        const min = -70;
        const max = 6;
        const bgColor = "rgb(40, 40, 40)";
        const coldColor = "rgb(12, 248, 100)";
        const warmColor = "rgb(195, 248, 100)";
        const hotColor = "rgb(255, 193, 10)";
        const overloadColor = "rgb(255, 10, 10)";
        const { editor, phosphorColor, playing, monitoring } = this.props;
        const { ctx } = this;
        const absMax = await editor.player.postAnalyserNode.getAbsMax();
        const value = absMax.map(atodb);
        this.values = value.slice();

        const [width, height] = this.fullSize();
        ctx.clearRect(0, 0, width, height);
        if (this.values.length === 0) this.values = [min];
        if (this.values.find((v, i) => typeof this.maxValues[i] === "undefined" || v > this.maxValues[i])) {
            this.maxValues = [...this.values];
            if (this.maxTimer) window.clearTimeout(this.maxTimer);
            this.maxTimer = window.setTimeout(() => {
                this.maxValues = [...this.values];
                this.maxTimer = undefined;
                this.schedulePaint();
            }, 1000);
        } else if (this.values.find((v, i) => v < this.maxValues[i]) && typeof this.maxTimer === "undefined") {
            this.maxTimer = window.setTimeout(() => {
                this.maxValues = [...this.values];
                this.maxTimer = undefined;
                this.schedulePaint();
            }, 1000);
        }
        if (width <= 0 || height <= 0) return;
        const channels = this.values.length;
        const clipValue = 0;
        const bottom = 20;
        const $height = (height - bottom - channels - 1) / channels;
        ctx.fillStyle = bgColor;
        if (min >= clipValue || clipValue >= max) {
            const fgColor = min >= clipValue ? overloadColor : coldColor;
            let $top = 0;
            this.values.forEach((v) => {
                if (v < max) ctx.fillRect(0, $top, width, $height);
                $top += $height + 1;
            });
            $top = 0;
            ctx.fillStyle = fgColor;
            this.values.forEach((v, i) => {
                const distance = Math.max(0, Math.min(1, (v - min) / (max - min)));
                if (distance > 0) ctx.fillRect(0, $top, distance * width, $height);
                const histMax = this.maxValues[i];
                if (typeof histMax === "number" && histMax > v) {
                    const histDistance = Math.max(0, Math.min(1, (histMax - min) / (max - min)));
                    ctx.fillRect(Math.min(width - 1, histDistance * width), $top, 1, $height);
                }
                $top += $height + 1;
            });
        } else {
            const clipDistance = Math.max(0, Math.min(1, (clipValue - min) / (max - min)));
            const clip = width - clipDistance * width;
            const hotStop = width - clip;
            const warmStop = hotStop - 1;
            const gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, coldColor);
            gradient.addColorStop(warmStop / width, warmColor);
            gradient.addColorStop(hotStop / width, hotColor);
            gradient.addColorStop(1, overloadColor);
            let $top = 0;
            this.values.forEach((v) => {
                if (v < clipValue) ctx.fillRect(0, $top, warmStop, $height);
                if (v < max) ctx.fillRect(hotStop, $top, clip, $height);
                $top += $height + 1;
            });
            $top = 0;
            ctx.fillStyle = gradient;
            this.values.forEach((v, i) => {
                const distance = Math.max(0, Math.min(1, (v - min) / (max - min)));
                if (distance > 0) ctx.fillRect(0, $top, Math.min(warmStop, distance * width), $height);
                if (distance > clipDistance) ctx.fillRect(hotStop, $top, Math.min(clip, (distance - clipDistance) * width), $height);
                const histMax = this.maxValues[i];
                if (typeof histMax === "number" && histMax > v) {
                    const histDistance = Math.max(0, Math.min(1, (histMax - min) / (max - min)));
                    if (histDistance <= clipDistance) ctx.fillRect(histDistance * width, $top, 1, $height);
                    else ctx.fillRect(Math.min(width - 1, histDistance * width), $top, 1, $height);
                }
                $top += $height + 1;
            });
            ctx.strokeStyle = "white";
            ctx.fillStyle = phosphorColor;
            ctx.font = "12px Consolas, monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillText("dB", 10, height - bottom + 6);
            ctx.beginPath();
            for (let db = -60; db <= 5; db += (width > 250 ? 1 : width > 100 ? 3 : 12)) {
                const x = (db - min) / (max - min) * width;
                ctx.moveTo(x, height - bottom - 2);
                ctx.lineTo(x, height - bottom + (db % 6 === 0 ? 4 : 2));
                if (db % (width > 250 ? 6 : width > 100 ? 12 : 36) === 0) ctx.fillText(db.toString(), x, height - bottom + 6);
            }
            ctx.stroke();
        }
        if (playing || monitoring) this.schedulePaint();
    }
    handleChangeSelRangeStart = (samples: number) => {
        if (this.props.selRange) this.props.editor.setSelRange([samples, this.props.selRange[1]]);
        else this.props.editor.setCursor(samples);
    };
    handleChangeSelRangeEnd = (samples: number) => {
        if (this.props.selRange) this.props.editor.setSelRange([this.props.selRange[0], samples]);
        else this.props.editor.setSelRange([this.props.cursor, samples]);
    };
    handleChangeSelRangeDuration = (samples: number) => {
        if (this.props.selRange) this.props.editor.setSelRange([this.props.selRange[0], this.props.selRange[0] + samples]);
        else this.props.editor.setSelRange([this.props.cursor, this.props.cursor + samples]);
    };
    handleChangeViewRangeStart = (samples: number) => {
        this.props.editor.setViewRange([samples, this.props.viewRange[1]]);
    };
    handleChangeViewRangeEnd = (samples: number) => {
        this.props.editor.setViewRange([this.props.viewRange[0], samples]);
    };
    handleChangeViewRangeDuration = (samples: number) => {
        this.props.editor.setViewRange([this.props.viewRange[0], this.props.viewRange[0] + samples]);
    };
    render() {
        const sampleRate = this.props.editor.sampleRate;
        return (
            <div className="editor-monitor">
                <div className="editor-monitor-meter-container">
                    <canvas ref={this.refCanvas} />
                </div>
                <div className="editor-monitor-ranges">
                    <Table size="small" compact="very" inverted definition unstackable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width={4} />
                                <Table.HeaderCell width={4}>{this.strings.start}</Table.HeaderCell>
                                <Table.HeaderCell width={4}>{this.strings.end}</Table.HeaderCell>
                                <Table.HeaderCell width={4}>{this.strings.duration}</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>{this.strings.selection}</Table.Cell>
                                <Table.Cell>
                                    <TimeInputUI samples={this.props.selRange ? this.props.selRange[0] : this.props.cursor} {...this.props} {...this.props.audioUnitOptions} sampleRate={sampleRate} onChange={this.handleChangeSelRangeStart} />
                                </Table.Cell>
                                <Table.Cell>
                                    <TimeInputUI samples={this.props.selRange ? this.props.selRange[1] : this.props.cursor} {...this.props} {...this.props.audioUnitOptions} sampleRate={sampleRate} onChange={this.handleChangeSelRangeEnd} />
                                </Table.Cell>
                                <Table.Cell>
                                    <TimeInputUI samples={this.props.selRange ? this.props.selRange[1] - this.props.selRange[0] : 0} {...this.props} {...this.props.audioUnitOptions} sampleRate={sampleRate} onChange={this.handleChangeSelRangeDuration} />
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>{this.strings.view}</Table.Cell>
                                <Table.Cell>
                                    <TimeInputUI samples={this.props.viewRange[0]} {...this.props} {...this.props.audioUnitOptions} sampleRate={sampleRate} onChange={this.handleChangeViewRangeStart} />
                                </Table.Cell>
                                <Table.Cell>
                                    <TimeInputUI samples={this.props.viewRange[1]} {...this.props} {...this.props.audioUnitOptions} sampleRate={sampleRate} onChange={this.handleChangeViewRangeEnd} />
                                </Table.Cell>
                                <Table.Cell>
                                    <TimeInputUI samples={this.props.viewRange[1] - this.props.viewRange[0]} {...this.props} {...this.props.audioUnitOptions} sampleRate={sampleRate} onChange={this.handleChangeViewRangeDuration} />
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </div>
            </div>
        );
    }
}
