import { LiveUI, LiveObject, LiveUIState } from "./Base";
import { TMeta } from "../../types";
import { Bang } from "../Base";
import { normExp } from "../../../utils/math";

interface LiveNumboxProps extends LiveUIProps {
    bgColor: string;
    activeBgColor: string;
    borderColor: string;
    focusBorderColor: string;
    textColor: string;
    fontFamily: string;
    fontSize: number;
    fontFace: "regular" | "bold" | "italic" | "bold italic";
    appearance: "slider" | "triangle" | "default";
    triColor: string;
    activeTriColor: string;
    triColor2: string;
    activeTriColor2: string;
    activeSliderColor: string;
}
interface LiveNumboxUIState extends LiveNumboxProps, LiveUIState {
    inputBuffer: string;
}
class LiveNumboxUI extends LiveUI<LiveNumbox, LiveNumboxUIState> {
    state: LiveNumboxUIState = {
        ...this.state,
        inputBuffer: ""
    }
    className = "live-numbox";
    paint() {
        const {
            width,
            height,
            active,
            focus,
            fontFamily,
            fontSize,
            fontFace,
            appearance,
            bgColor,
            activeBgColor,
            borderColor,
            focusBorderColor,
            textColor,
            triColor,
            activeTriColor,
            triColor2,
            activeTriColor2,
            activeSliderColor,
            inputBuffer
        } = this.state;
        const ctx = this.ctx;
        if (!ctx) return;
        const distance = this.distance;
        const displayValue = inputBuffer ? inputBuffer + "_" : this.displayValue;

        if (ctx.canvas.width !== width) ctx.canvas.width = width;
        if (ctx.canvas.height !== height) ctx.canvas.height = height;
        ctx.clearRect(0, 0, width, height);

        // draw background
        ctx.fillStyle = active ? activeBgColor : bgColor;
        ctx.rect(0, 0, width, height);
        ctx.fill();

        if (appearance === "slider" && active && distance) {
            ctx.fillStyle = activeSliderColor;
            ctx.fillRect(0, 0, distance * width, height);
        }

        // draw border (eventually we might need to redefine the shape)
        ctx.lineWidth = 1;
        ctx.strokeStyle = focus ? focusBorderColor : borderColor;
        ctx.stroke();

        if (appearance === "triangle") {
            const triangleHeight = 8;
            ctx.fillStyle = active ? (distance ? activeTriColor2 : activeTriColor) : (distance ? triColor2 : triColor);
            ctx.beginPath();
            ctx.moveTo(width - triangleHeight - 1, height * 0.5);
            ctx.lineTo(width - 1, 1);
            ctx.lineTo(width - 1, height - 1);
            ctx.closePath();
            ctx.fill();
        }
        // display the text
        ctx.font = `${fontFace === "regular" ? "" : fontFace} ${fontSize}px ${fontFamily}, sans-serif`;
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(displayValue, width * 0.5, height * 0.5, width);
    }
    getValueFromDelta(e: PointerDragEvent) {
        const { type, min, max, enums, exponent } = this.state;
        const step = type === "enum" ? 1 : (this.state.step || 1);
        const totalPixels = 100;
        const stepsCount = this.stepsCount;
        const stepPixels = totalPixels / stepsCount;
        const prevPixels = LiveUI.getDistance({ value: e.prevValue, type, min, max, enums, exponent }) * totalPixels;
        const pixels = prevPixels + e.fromY - e.y;
        let steps = Math.round(normExp(pixels / totalPixels, exponent) * totalPixels / stepPixels);
        steps = Math.min(stepsCount, Math.max(0, steps));
        if (type === "enum") return steps;
        if (type === "int") return Math.round(steps * step + min);
        return steps * step + min;
    }
    handlePointerDrag = (e: PointerDragEvent) => {
        const newValue = this.getValueFromDelta(e);
        if (newValue !== this.state.value) this.setValueToOutput(newValue);
    }
    handleKeyDown = (e: React.KeyboardEvent) => {
        if (!this.state.inputBuffer) {
            let addStep = 0;
            if (e.key === "ArrowUp" || e.key === "ArrowRight") addStep = 1;
            if (e.key === "ArrowDown" || e.key === "ArrowLeft") addStep = -1;
            if (addStep !== 0) {
                const newValue = this.object.toValidValue(this.state.value + this.state.step * addStep);
                if (newValue !== this.state.value) this.setValueToOutput(newValue);
            }
        }
        if (e.key.match(/[0-9.-]/)) {
            this.setState({ inputBuffer: this.state.inputBuffer + e.key });
            return;
        }
        if (e.key === "Backspace") {
            this.setState({ inputBuffer: this.state.inputBuffer.slice(0, -1) });
            return;
        }
        if (e.key === "Enter") {
            const newValue = this.object.toValidValue(+this.state.inputBuffer);
            this.setState({ inputBuffer: "" });
            if (newValue !== this.state.value) this.setValueToOutput(newValue);
        }
    }
    handleFocusOut = () => {
        if (this.state.inputBuffer) {
            const newValue = this.object.toValidValue(+this.state.inputBuffer);
            this.setState({ inputBuffer: "" });
            if (newValue !== this.state.value) this.setValueToOutput(newValue);
        }
        this.setState({ focus: false });
    }
}

export class LiveNumbox extends LiveObject<{}, {}, [number | Bang, number], [number, string], [number], LiveNumboxProps, LiveNumboxUIState> {
    static description = "Number box";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "number",
        description: "Set and output the value"
    }, {
        isHot: false,
        type: "number",
        description: "Set without output the value"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "number",
        description: "Number value"
    }, {
        type: "string",
        description: "Display value"
    }];
    static args: TMeta["args"] = [{
        type: "number",
        optional: true,
        default: 0,
        description: "Initial value"
    }];
    static props: TMeta["props"] = {
        bgColor: {
            type: "color",
            default: "rgba(195, 195, 195, 1)",
            description: "Background color (inactive)",
            isUIState: true
        },
        activeBgColor: {
            type: "color",
            default: "rgba(195, 195, 195, 1)",
            description: "Background color (active)",
            isUIState: true
        },
        borderColor: {
            type: "color",
            default: "rgba(80, 80, 80, 1)",
            description: "Border color (unfocus)",
            isUIState: true
        },
        focusBorderColor: {
            type: "color",
            default: "rgba(80, 80, 80, 1)",
            description: "Border color (focus)",
            isUIState: true
        },
        textColor: {
            type: "color",
            default: "rgba(0, 0, 0, 1)",
            description: "Text color",
            isUIState: true
        },
        fontFamily: {
            type: "enum",
            enums: ["Lato", "Georgia", "Times New Roman", "Arial", "Tahoma", "Verdana", "Courier New"],
            default: "Arial",
            description: "Font family",
            isUIState: true
        },
        fontSize: {
            type: "number",
            default: 10,
            description: "Text font size",
            isUIState: true
        },
        fontFace: {
            type: "enum",
            enums: ["regular", "bold", "italic", "bold italic"],
            default: "regular",
            description: "Text style",
            isUIState: true
        },
        appearance: {
            type: "enum",
            enums: ["default", "slider", "triangle"],
            default: "default",
            description: "Text style",
            isUIState: true
        },
        triColor: {
            type: "color",
            default: "rgba(195, 195, 195, 1)",
            description: "Triangle color (inactive)",
            isUIState: true
        },
        activeTriColor: {
            type: "color",
            default: "rgba(165, 165, 165, 1)",
            description: "Triangle color (active)",
            isUIState: true
        },
        triColor2: {
            type: "color",
            default: "rgba(165, 165, 165, 1)",
            description: "Triangle color on positive value (inactive)",
            isUIState: true
        },
        activeTriColor2: {
            type: "color",
            default: "rgba(109, 215, 255, 1)",
            description: "Triangle color on positive value (active)",
            isUIState: true
        },
        activeSliderColor: {
            type: "color",
            default: "rgba(109, 215, 255, 1)",
            description: "Slider color",
            isUIState: true
        }
    };
    static ui = LiveNumboxUI;
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 2;
        });
        this.on("updateArgs", (args) => {
            if (typeof args[0] === "number") {
                this.state.value = args[0];
                this.validateValue();
                this.updateUI({ value: this.state.value });
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!(data instanceof Bang)) {
                    const value = +data;
                    this.state.value = value;
                    this.validateValue();
                    this.updateUI({ value: this.state.value });
                }
                this.outletAll([this.state.value, this.state.displayValue]);
            } else if (inlet === 1) {
                const value = +data;
                this.state.value = value;
                this.validateValue();
                this.updateUI({ value: this.state.value });
            }
        });
        this.on("changeFromUI", ({ value, displayValue }) => {
            this.state.value = value;
            this.state.displayValue = displayValue;
            this.outletAll([this.state.value, this.state.displayValue]);
        });
    }
}
