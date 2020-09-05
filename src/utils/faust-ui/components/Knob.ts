import { AbstractItem } from "./AbstractItem";
import { FaustUIItemProps, PointerDragEvent } from "./types";
import "./Knob.scss";
import { FaustUINentryStyle } from "./Nentry";
import { toRad, normLog, normExp } from "./utils";

interface FaustUIKnobStyle extends FaustUINentryStyle {
    knobwidth?: number;
    knobcolor?: string;
    knoboncolor?: string;
    needlecolor?: string;
}
export class Knob extends AbstractItem<FaustUIKnobStyle> {
    static get defaultProps(): FaustUIItemProps<FaustUIKnobStyle> {
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
                knobwidth: undefined,
                knobcolor: "rgba(18, 18, 18, 1)",
                knoboncolor: "rgba(255, 165, 0, 1)",
                needlecolor: "rgba(200, 200, 200, 0.75)"
            }
        };
    }
    className = "knob";

    canvas: HTMLCanvasElement;
    inputNumber: HTMLInputElement;
    input: HTMLInputElement;
    ctx: CanvasRenderingContext2D;
    componentWillMount() {
        super.componentWillMount();
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
            const changed = this.setValue(+this.inputNumber.value);
            if (changed) return;
        }
        this.input.value = this.inputNumber.value + (this.state.unit || "");
    };
    setStyle = () => {
        const { fontsize, height, grid, textcolor, bgcolor, bordercolor } = this.state.style;
        this.input.style.fontSize = `${fontsize || height * grid * 0.1}px`;
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
        this.container.appendChild(this.label);
        this.container.appendChild(this.canvas);
        this.container.appendChild(this.input);
        return super.mount();
    }
    paint = () => {
        const { knobwidth, knobcolor, knoboncolor, needlecolor } = this.state.style;
        const ctx = this.ctx;
        const canvas = this.canvas;
        const distance = this.distance;
        let { width, height } = this.canvas.getBoundingClientRect();
        width = Math.floor(width);
        height = Math.floor(height);
        canvas.width = width;
        canvas.height = height;

        const start = 5 / 8 * Math.PI;
        const end = 19 / 8 * Math.PI;
        const valPos = start + toRad(distance * 315);
        const dialHeight = Math.min(width, height) * 0.75;
        const dialRadius = dialHeight * 0.5;
        const dialCenterX = width * 0.5;
        const dialCenterY = height * 0.5;
        // const arcStartX = dialCenterX + (dialHeight * 0.5 * Math.cos(start));
        // const arcStartY = dialCenterY + (dialHeight * 0.5 * Math.sin(start));
        // const arcEndX = dialCenterX + (dialHeight * 0.5 * Math.cos(end));
        // const arcEndY = dialCenterY + (dialHeight * 0.5 * Math.sin(end));
        const valuePosX = dialCenterX + (dialHeight * 0.5 * Math.cos(valPos));
        const valuePosY = dialCenterY + (dialHeight * 0.5 * Math.sin(valPos));
        const lineWidth = knobwidth || dialRadius * 0.2;

        ctx.strokeStyle = knobcolor;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        // draw background arc
        ctx.beginPath();
        ctx.arc(dialCenterX, dialCenterY, dialRadius, valPos, end);
        ctx.stroke();
        // draw value arc
        if (distance) {
            ctx.strokeStyle = knoboncolor;
            ctx.beginPath();
            ctx.arc(dialCenterX, dialCenterY, dialRadius, start, valPos);
            ctx.stroke();
        }
        // draw dial needle
        ctx.strokeStyle = needlecolor;
        ctx.beginPath();
        ctx.moveTo(dialCenterX, dialCenterY);
        ctx.lineTo(valuePosX, valuePosY);
        ctx.stroke();
    };
    getValueFromDelta(e: PointerDragEvent) {
        const { type, min, max, enums, scale } = this.state;
        const step = type === "enum" ? 1 : (this.state.step || 1);
        const stepRange = this.stepRange;
        const stepsCount = this.stepsCount;
        const range = 100;
        const prevDistance = AbstractItem.getDistance({ value: e.prevValue, type, min, max, enums, scale }) * range;
        const distance = prevDistance + e.fromY - e.y;
        let steps = Math.round((scale === "exp" ? normExp(distance / range) : scale === "log" ? normLog(distance / range) : distance / range) * range / stepRange);
        steps = Math.min(stepsCount, Math.max(0, steps));
        if (type === "enum") return steps;
        if (type === "int") return Math.round(steps * step + min);
        return steps * step + min;
    }
    handlePointerDrag = (e: PointerDragEvent) => {
        const newValue = this.getValueFromDelta(e);
        if (newValue !== this.state.value) this.setValue(newValue);
    };
}
