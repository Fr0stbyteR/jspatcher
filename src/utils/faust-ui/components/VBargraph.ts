import { AbstractItem } from "./AbstractItem";
import { FaustUIItemProps } from "./types";
import "./VBargraph.scss";
import { FaustUINentryStyle } from "./Nentry";

interface FaustUIBargraphStyle extends FaustUINentryStyle {
    barwidth?: number;
    barbgcolor?: string;
    coldcolor?: string;
    warmcolor?: string;
    hotcolor?: string;
    overloadcolor?: string;
}
export class VBargraph extends AbstractItem<FaustUIBargraphStyle> {
    static get defaultProps(): FaustUIItemProps<FaustUIBargraphStyle> {
        const inherited = super.defaultProps;
        return {
            ...inherited,
            style: {
                ...inherited.style,
                fontname: "Arial",
                fontsize: undefined,
                fontface: "regular",
                bgcolor: "rgba(18, 18, 18, 0)",
                bordercolor: "rgba(80, 80, 80, 0)",
                labelcolor: "rgba(226, 222, 255, 0.5)",
                textcolor: "rgba(18, 18, 18, 1)",
                barwidth: undefined,
                barbgcolor: "rgba(18, 18, 18, 1)",
                coldcolor: "rgba(12, 248, 100, 1)",
                warmcolor: "rgba(195, 248, 100, 1)",
                hotcolor: "rgba(255, 193, 10, 1)",
                overloadcolor: "rgba(255, 10, 10, 1)"
            }
        };
    }
    className = "vbargraph";

    canvas: HTMLCanvasElement;
    input: HTMLInputElement;
    flexDiv: HTMLDivElement;
    canvasDiv: HTMLDivElement;
    ctx: CanvasRenderingContext2D;
    componentWillMount() {
        super.componentWillMount();
        this.flexDiv = document.createElement("div");
        this.flexDiv.className = `faust-ui-component-${this.className}-flexdiv`;
        this.canvasDiv = document.createElement("div");
        this.canvasDiv.className = `faust-ui-component-${this.className}-canvasdiv`;
        this.canvas = document.createElement("canvas");
        this.canvas.width = 10;
        this.canvas.height = 10;
        this.ctx = this.canvas.getContext("2d");
        this.input = document.createElement("input");
        this.input.disabled = true;
        this.input.value = (+this.state.value.toFixed(3)).toString() + (this.state.unit || "");
        this.setStyle();
        return this;
    }
    setStyle = () => {
        const { height, width, grid, fontsize, textcolor, bgcolor, bordercolor } = this.state.style;
        const fontSize = Math.min(height * grid * 0.05, width * grid * 0.2);
        this.input.style.fontSize = `${fontsize || fontSize}px`;
        this.input.style.color = textcolor;
        this.container.style.backgroundColor = bgcolor;
        this.container.style.borderColor = bordercolor;
    };
    componentDidMount() {
        super.componentDidMount();
        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        this.canvas.addEventListener("touchstart", this.handleTouchStart, { passive: false });
        this.on("style", () => {
            this.schedule(this.setStyle);
            this.schedule(this.paint);
        });
        this.on("label", () => this.schedule(this.paintLabel));
        const valueChange = () => this.input.value = (+this.state.value.toFixed(3)).toString() + (this.state.unit || "");
        this.on("value", () => {
            this.schedule(valueChange);
            this.schedule(this.paint);
        });
        this.on("max", () => this.schedule(this.paint));
        this.on("min", () => this.schedule(this.paint));
        this.on("step", () => this.schedule(this.paint));
        this.schedule(this.paint);
        return this;
    }
    mount() {
        this.canvasDiv.appendChild(this.canvas);
        this.flexDiv.appendChild(this.canvasDiv);
        this.flexDiv.appendChild(this.input);
        this.container.appendChild(this.label);
        this.container.appendChild(this.flexDiv);
        return super.mount();
    }
    paintValue = 0;
    maxValue = -Infinity;
    maxTimer: number;
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

        const drawHeight = height * 0.9;
        const drawWidth = barwidth || Math.min(width / 3, drawHeight * 0.05);
        const left = (width - drawWidth) * 0.5;
        const top = height * 0.05;
        this.paintValue = value;
        const paintValue = this.paintValue;
        if (paintValue > this.maxValue) {
            this.maxValue = paintValue;
            if (this.maxTimer) window.clearTimeout(this.maxTimer);
            this.maxTimer = window.setTimeout(() => {
                this.maxValue = this.paintValue;
                this.maxTimer = undefined;
                this.schedule(this.paint);
            }, 1000);
        }
        if (paintValue < this.maxValue && typeof this.maxTimer === "undefined") {
            this.maxTimer = window.setTimeout(() => {
                this.maxValue = this.paintValue;
                this.maxTimer = undefined;
                this.schedule(this.paint);
            }, 1000);
        }
        const maxValue = this.maxValue;
        const coldStop = (-18 - min) / (max - min);
        const warmStop = (-6 - min) / (max - min);
        const hotStop = (-3 - min) / (max - min);
        const overloadStop = -min / (max - min);
        const gradient = ctx.createLinearGradient(0, drawHeight, 0, top);
        if (coldStop <= 1 && coldStop >= 0) gradient.addColorStop(coldStop, coldcolor);
        else if (coldStop > 1) gradient.addColorStop(1, coldcolor);
        if (warmStop <= 1 && warmStop >= 0) gradient.addColorStop(warmStop, warmcolor);
        if (hotStop <= 1 && hotStop >= 0) gradient.addColorStop(hotStop, hotcolor);
        if (overloadStop <= 1 && overloadStop >= 0) gradient.addColorStop(overloadStop, overloadcolor);
        else if (overloadStop < 0) gradient.addColorStop(0, coldcolor);

        ctx.fillStyle = barbgcolor;
        if (paintValue < 0) ctx.fillRect(left, top + (1 - overloadStop) * drawHeight, drawWidth, drawHeight * overloadStop);
        if (paintValue < max) ctx.fillRect(left, top, drawWidth, (1 - overloadStop) * drawHeight - 1);
        ctx.fillStyle = gradient;
        if (paintValue > min) {
            const distance = (Math.min(0, paintValue) - min) / (max - min);
            ctx.fillRect(left, top + (1 - distance) * drawHeight, drawWidth, drawHeight * distance);
        }
        if (paintValue > 0) {
            const distance = Math.min(max, paintValue) / (max - min);
            ctx.fillRect(left, top + (1 - overloadStop - distance) * drawHeight, drawWidth, drawHeight * distance - 1);
        }
        if (maxValue > paintValue) {
            if (maxValue <= 0) {
                const distance = (Math.min(0, maxValue) - min) / (max - min);
                ctx.fillRect(left, top + (1 - distance) * drawHeight, drawWidth, 1);
            }
            if (maxValue > 0) {
                const distance = Math.min(max, maxValue) / (max - min);
                ctx.fillRect(left, Math.max(top, top + (1 - overloadStop - distance) * drawHeight - 1), drawWidth, 1);
            }
        }
    };
}
