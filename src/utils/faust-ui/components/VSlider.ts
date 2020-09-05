import { AbstractItem } from "./AbstractItem";
import { FaustUIItemProps, PointerDownEvent, PointerDragEvent } from "./types";
import "./VSlider.scss";
import { FaustUINentryStyle } from "./Nentry";
import { fillRoundedRect, normLog, normExp } from "./utils";

interface FaustUISliderStyle extends FaustUINentryStyle {
    sliderwidth?: number;
    sliderbgcolor?: string;
    sliderbgoncolor?: string;
    slidercolor?: string;
}
export class VSlider extends AbstractItem<FaustUISliderStyle> {
    static get defaultProps(): FaustUIItemProps<FaustUISliderStyle> {
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
                sliderwidth: undefined,
                sliderbgcolor: "rgba(18, 18, 18, 1)",
                sliderbgoncolor: "rgba(255, 165, 0, 1)",
                slidercolor: "rgba(200, 200, 200, 0.75)"
            }
        };
    }
    className = "vslider";

    canvas: HTMLCanvasElement;
    inputNumber: HTMLInputElement;
    input: HTMLInputElement;
    flexDiv: HTMLDivElement;
    canvasDiv: HTMLDivElement;
    ctx: CanvasRenderingContext2D;
    interactionRect: number[] = [0, 0, 0, 0];
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
        this.inputNumber = document.createElement("input");
        this.inputNumber.type = "number";
        this.inputNumber.value = (+this.state.value.toFixed(3)).toString();
        this.inputNumber.max = this.state.max.toString();
        this.inputNumber.min = this.state.min.toString();
        this.inputNumber.step = this.state.step.toString();
        this.input = document.createElement("input");
        this.input.value = this.inputNumber.value + (this.state.unit || "");
        this.input.spellcheck = false;
        this.setStyle();
        return this;
    }
    handleChange = (e: Event) => {
        const value = parseFloat((e.currentTarget as HTMLInputElement).value);
        if (isFinite(value)) {
            const changed = this.setValue(+value);
            if (changed) return;
        }
        this.input.value = this.inputNumber.value + (this.state.unit || "");
    };
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
        this.input.addEventListener("change", this.handleChange);
        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        this.canvas.addEventListener("touchstart", this.handleTouchStart, { passive: false });
        this.on("style", () => {
            this.schedule(this.setStyle);
            this.schedule(this.paint);
        });
        this.on("label", () => this.schedule(this.paintLabel));
        const valueChange = () => {
            this.inputNumber.value = (+this.state.value.toFixed(3)).toString();
            this.input.value = this.inputNumber.value + (this.state.unit || "");
        };
        this.on("value", () => {
            this.schedule(valueChange);
            this.schedule(this.paint);
        });
        const maxChange = () => this.inputNumber.max = this.state.max.toString();
        this.on("max", () => {
            this.schedule(maxChange);
            this.schedule(this.paint);
        });
        const minChange = () => this.inputNumber.min = this.state.min.toString();
        this.on("min", () => {
            this.schedule(minChange);
            this.schedule(this.paint);
        });
        const stepChange = () => this.inputNumber.step = this.state.step.toString();
        this.on("step", () => {
            this.schedule(stepChange);
            this.schedule(this.paint);
        });
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
    paint = () => {
        const { sliderwidth, sliderbgcolor, sliderbgoncolor, slidercolor } = this.state.style;
        const ctx = this.ctx;
        const canvas = this.canvas;
        const distance = this.distance;
        let { width, height } = this.canvasDiv.getBoundingClientRect();
        width = Math.floor(width);
        height = Math.floor(height);
        canvas.width = width;
        canvas.height = height;

        const drawHeight = height * 0.9;
        const drawWidth = sliderwidth || Math.min(width / 3, drawHeight * 0.05);
        const left = (width - drawWidth) * 0.5;
        const top = height * 0.05;
        const borderRadius = drawWidth * 0.25;
        this.interactionRect = [0, top, width, drawHeight];
        const grd = ctx.createLinearGradient(0, top, 0, top + drawHeight);
        grd.addColorStop(Math.max(0, Math.min(1, 1 - distance)), sliderbgcolor);
        grd.addColorStop(Math.max(0, Math.min(1, 1 - distance)), sliderbgoncolor);
        ctx.fillStyle = grd;
        fillRoundedRect(ctx, left, top, drawWidth, drawHeight, borderRadius);
        // draw slider
        ctx.fillStyle = slidercolor;
        fillRoundedRect(ctx, left - drawWidth, top + drawHeight * (1 - distance) - drawWidth, drawWidth * 3, drawWidth * 2, borderRadius);
    };
    get stepsCount() {
        const { type, max, min, step, enums } = this.state;
        const maxSteps = type === "enum" ? enums.length : type === "int" ? max - min : (max - min) / step;
        if (step) {
            if (type === "enum") return enums.length;
            if (type === "int") return Math.min(Math.floor((max - min) / (Math.round(step) || 0)), maxSteps);
            return Math.floor((max - min) / step);
        }
        return maxSteps;
    }
    get stepRange() {
        const full = this.interactionRect[this.className === "vslider" ? 3 : 2];
        const stepsCount = this.stepsCount;
        return full / stepsCount;
    }
    getValueFromPos(e: { x: number; y: number }) {
        const { type, min, scale } = this.state;
        const step = type === "enum" ? 1 : (this.state.step || 1);
        const stepRange = this.stepRange;
        const stepsCount = this.stepsCount;
        const distance = (this.className === "vslider" ? this.interactionRect[3] - (e.y - this.interactionRect[1]) : e.x - this.interactionRect[0]);
        const range = this.className === "vslider" ? this.interactionRect[3] : this.interactionRect[2];
        let steps = Math.round((scale === "exp" ? normExp(distance / range) : scale === "log" ? normLog(distance / range) : distance / range) * range / stepRange);
        steps = Math.min(stepsCount, Math.max(0, steps));
        if (type === "enum") return steps;
        if (type === "int") return Math.round(steps * step + min);
        return steps * step + min;
    }
    handlePointerDown = (e: PointerDownEvent) => {
        const { value } = this.state;
        if (
            e.x < this.interactionRect[0]
            || e.x > this.interactionRect[0] + this.interactionRect[2]
            || e.y < this.interactionRect[1]
            || e.y > this.interactionRect[1] + this.interactionRect[3]
        ) return;
        const newValue = this.getValueFromPos(e);
        if (newValue !== value) this.setValue(this.getValueFromPos(e));
    };
    handlePointerDrag = (e: PointerDragEvent) => {
        const newValue = this.getValueFromPos(e);
        if (newValue !== this.state.value) this.setValue(newValue);
    };
}
