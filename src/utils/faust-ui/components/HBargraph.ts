import "./HBargraph.scss";
import { VBargraph } from "./VBargraph";

export class HBargraph extends VBargraph {
    className = "hbargraph";

    paintLabel() {
        return super.paintLabel("left");
    }
    setStyle = () => {
        const { height, grid, fontsize, textcolor, bgcolor, bordercolor } = this.state.style;
        this.input.style.fontSize = `${fontsize || height * grid * 0.2}px`;
        this.input.style.color = textcolor;
        this.container.style.backgroundColor = bgcolor;
        this.container.style.borderColor = bordercolor;
    };
    paint = () => {
        const { barwidth, barbgcolor, coldcolor, warmcolor, hotcolor, overloadcolor } = this.state.style;
        const { min, max, value } = this.state;
        const ctx = this.ctx;
        const canvas = this.canvas;
        let { width, height } = this.canvasDiv.getBoundingClientRect();
        width = Math.floor(width);
        height = Math.floor(height);
        canvas.width = width;
        canvas.height = height;

        const drawWidth = width * 0.9;
        const drawHeight = barwidth || Math.min(height / 3, drawWidth * 0.05);
        const left = width * 0.05;
        const top = (height - drawHeight) * 0.5;
        this.paintValue = value;
        const paintValue = this.paintValue;
        if (paintValue > this.maxValue) {
            this.maxValue = paintValue;
            if (this.maxTimer) window.clearTimeout(this.maxTimer);
            this.maxTimer = window.setTimeout(() => {
                this.maxValue = this.paintValue;
                this.maxTimer = undefined;
            }, 1000);
        }
        if (paintValue < this.maxValue && typeof this.maxTimer === "undefined") {
            this.maxTimer = window.setTimeout(() => {
                this.maxValue = this.paintValue;
                this.maxTimer = undefined;
            }, 1000);
        }
        const maxValue = this.maxValue;
        const coldStop = (-18 - min) / (max - min);
        const warmStop = (-6 - min) / (max - min);
        const hotStop = (-3 - min) / (max - min);
        const overloadStop = -min / (max - min);
        const gradient = ctx.createLinearGradient(left, 0, drawWidth, 0);
        if (coldStop <= 1 && coldStop >= 0) gradient.addColorStop(coldStop, coldcolor);
        else if (coldStop > 1) gradient.addColorStop(1, coldcolor);
        if (warmStop <= 1 && warmStop >= 0) gradient.addColorStop(warmStop, warmcolor);
        if (hotStop <= 1 && hotStop >= 0) gradient.addColorStop(hotStop, hotcolor);
        if (overloadStop <= 1 && overloadStop >= 0) gradient.addColorStop(overloadStop, overloadcolor);
        else if (overloadStop < 0) gradient.addColorStop(0, coldcolor);

        ctx.fillStyle = barbgcolor;
        if (paintValue < 0) ctx.fillRect(left, top, drawWidth * overloadStop, drawHeight);
        if (paintValue < max) ctx.fillRect(left + drawWidth * overloadStop + 1, top, drawWidth * (1 - overloadStop) - 1, drawHeight);
        ctx.fillStyle = gradient;
        if (paintValue > min) {
            const distance = (Math.min(0, paintValue) - min) / (max - min);
            ctx.fillRect(left, top, distance * drawWidth, drawHeight);
        }
        if (paintValue > 0) {
            const distance = Math.min(max, paintValue) / (max - min);
            ctx.fillRect(left + overloadStop * drawWidth + 1, top, distance * drawWidth - 1, drawHeight);
        }
        if (maxValue > paintValue) {
            if (maxValue <= 0) {
                const distance = (Math.min(0, maxValue) - min) / (max - min);
                ctx.fillRect(left + distance * drawWidth - 1, top, 1, drawHeight);
            }
            if (maxValue > 0) {
                const distance = Math.min(max, maxValue) / (max - min);
                ctx.fillRect(left + Math.min(drawWidth - 1, (overloadStop + distance) * drawWidth), top, 1, drawHeight);
            }
        }
    };
}
