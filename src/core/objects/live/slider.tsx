import { LiveUI, LiveObject, LiveUIState } from "./Base";
import { TMeta } from "../../types";
import { Bang } from "../Base";
import { normExp } from "../../../utils";

interface LiveSliderProps extends LiveUIProps {
    relative: boolean;
    sliderColor: string;
    triBorderColor: string;
    triColor: string;
    triOnColor: string;
    textColor: string;
    fontFamily: string;
    fontSize: number;
    fontFace: "regular" | "bold" | "italic" | "bold italic";
    orientation: "vertical" | "horizontal";
    showName: boolean;
    showNumber: boolean;
}
type LiveSliderAdditionalState = { inputBuffer: string };
class LiveSliderUI extends LiveUI<LiveSlider, LiveSliderProps & LiveSliderAdditionalState> {
    static defaultSize: [number, number] = [30, 90];
    state: LiveSliderProps & LiveUIState & LiveSliderAdditionalState = {
        ...this.state,
        shortName: this.box.props.shortName || this.object.meta.props.shortName.default,
        relative: this.box.props.relative || this.object.meta.props.relative.default,
        sliderColor: this.box.props.sliderColor || this.object.meta.props.sliderColor.default,
        triBorderColor: this.box.props.triBorderColor || this.object.meta.props.triBorderColor.default,
        triColor: this.box.props.triColor || this.object.meta.props.triColor.default,
        triOnColor: this.box.props.triOnColor || this.object.meta.props.triOnColor.default,
        textColor: this.box.props.textColor || this.object.meta.props.textColor.default,
        fontFamily: this.box.props.fontFamily || this.object.meta.props.fontFamily.default,
        fontSize: this.box.props.fontSize || this.object.meta.props.fontSize.default,
        fontFace: this.box.props.fontFace || this.object.meta.props.fontFace.default,
        orientation: this.box.props.orientation || this.object.meta.props.orientation.default,
        showName: this.box.props.showName !== false,
        showNumber: this.box.props.showNumber !== false,
        min: this.box.props.min || this.object.meta.props.min.default,
        max: typeof this.box.props.max === "number" ? this.box.props.max : this.object.meta.props.max.default,
        type: this.box.props.type || this.object.meta.props.type.default,
        unitStyle: this.box.props.unitStyle || this.object.meta.props.unitStyle.default,
        inputBuffer: ""
    }
    className = "live-slider";
    interactionRect: number[] = [0, 0, 0, 0];
    inTouch = false;
    paint() {
        const {
            fontFamily,
            fontSize,
            fontFace,
            orientation,
            showName,
            showNumber,
            sliderColor,
            textColor,
            triBorderColor,
            triOnColor,
            triColor,
            shortName,
            inputBuffer
        } = this.state;
        const { width, height } = this.box;
        const ctx = this.ctx;
        const lineWidth = 0.5;
        const padding = 8;
        const distance = this.distance;
        const displayValue = inputBuffer ? inputBuffer + "_" : this.displayValue;

        ctx.canvas.width = width;
        ctx.canvas.height = height;

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = sliderColor;

        ctx.clearRect(0, 0, width, height);

        if (orientation === "vertical") {
            ctx.beginPath();
            ctx.moveTo(width * 0.5, fontSize + padding);
            ctx.lineTo(width * 0.5, height - (fontSize + padding));
            ctx.stroke();

            const interactionWidth = width * 0.5;
            this.interactionRect = [
                width * 0.5 - interactionWidth * 0.5,
                fontSize + padding,
                interactionWidth,
                height - 2 * (fontSize + padding)
            ];

            ctx.lineWidth = 1;
            ctx.strokeStyle = triBorderColor;
            const triOrigin: [number, number] = [
                width * 0.5 + lineWidth * 0.5 + 0.5,
                this.interactionRect[1] - 4 + this.interactionRect[3] * (1 - distance)
            ];
            ctx.beginPath();
            ctx.moveTo(triOrigin[0], triOrigin[1] + 4);
            ctx.lineTo(triOrigin[0] + 8, triOrigin[1]);
            ctx.lineTo(triOrigin[0] + 8, triOrigin[1] + 8);
            ctx.lineTo(triOrigin[0], triOrigin[1] + 4);
            ctx.stroke();

            ctx.fillStyle = this.inTouch ? triOnColor : triColor;
            ctx.fill();

            ctx.font = `${fontFace === "regular" ? "" : fontFace} ${fontSize}px ${fontFamily}, sans-serif`;
            ctx.textAlign = "center";
            ctx.fillStyle = textColor;
            if (showName) ctx.fillText(shortName, width * 0.5, fontSize, width);
            if (showNumber) ctx.fillText(displayValue, width * 0.5, height - 2, width);
        } else {
            ctx.beginPath();
            ctx.moveTo(padding, height * 0.5);
            ctx.lineTo(width - padding, height * 0.5);
            ctx.stroke();

            const interactionWidth = height * 0.5;
            this.interactionRect = [
                padding,
                height * 0.5 - interactionWidth * 0.5,
                width - 2 * padding,
                interactionWidth
            ];

            ctx.lineWidth = 1;
            ctx.strokeStyle = triBorderColor;
            const triOrigin: [number, number] = [
                this.interactionRect[0] + this.interactionRect[2] * distance - 4,
                height * 0.5 + lineWidth * 0.5 + 2
            ];
            ctx.beginPath();
            ctx.moveTo(triOrigin[0], triOrigin[1] + 8);
            ctx.lineTo(triOrigin[0] + 4, triOrigin[1]);
            ctx.lineTo(triOrigin[0] + 8, triOrigin[1] + 8);
            ctx.lineTo(triOrigin[0], triOrigin[1] + 8);
            ctx.stroke();

            ctx.fillStyle = this.inTouch ? triOnColor : triColor;
            ctx.fill();

            ctx.font = `${fontFace === "regular" ? "" : fontFace} ${fontSize}px ${fontFamily}, sans-serif`;
            ctx.textAlign = "center";
            ctx.fillStyle = textColor;
            if (showName) ctx.fillText(shortName, width * 0.5, fontSize, width);
            ctx.textAlign = "left";
            if (showNumber) ctx.fillText(displayValue, 4, height - 2, width);
        }
    }
    getValueFromPos(e: PointerDownEvent) {
        const { orientation, type, min, exponent } = this.state;
        const step = type === "enum" ? 1 : (this.state.step || 1);
        const totalPixels = orientation === "vertical" ? this.interactionRect[3] : this.interactionRect[2];
        const stepsCount = this.stepsCount;
        const stepPixels = totalPixels / stepsCount;
        const pixels = orientation === "vertical" ? this.interactionRect[3] - (e.y - this.interactionRect[1]) : e.x - this.interactionRect[0];
        let steps = Math.round(normExp(pixels / totalPixels, exponent) * totalPixels / stepPixels);
        steps = Math.min(stepsCount, Math.max(0, steps));
        if (type === "enum") return steps;
        if (type === "int") return Math.round(steps * step + min);
        return steps * step + min;
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
    handlePointerDown = (e: PointerDownEvent) => {
        if (
            e.x < this.interactionRect[0]
            || e.x > this.interactionRect[0] + this.interactionRect[2]
            || e.y < this.interactionRect[1]
            || e.y > this.interactionRect[1] + this.interactionRect[3]
        ) return;
        const newValue = this.getValueFromPos(e);
        if (newValue !== this.state.value) this.setValueToOutput(newValue);
        this.inTouch = true;
    }
    handlePointerDrag = (e: PointerDragEvent) => {
        if (!this.inTouch) return;
        const newValue = this.getValueFromPos(e);
        if (newValue !== this.state.value) this.setValueToOutput(newValue);
    }
    handlePointerUp = () => {
        this.inTouch = false;
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

export class LiveSlider extends LiveObject<{}, {}, [number | Bang, number], [number, string], [number], LiveSliderProps> {
    static description = "Slider";
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
        shortName: {
            type: "string",
            default: "live.slider",
            description: "Short name to display",
            isUIState: true
        },
        longName: {
            type: "string",
            default: "live.slider",
            description: "Long name to display",
            isUIState: true
        },
        relative: {
            type: "boolean",
            default: false,
            description: "Modify value use relative mouse move",
            isUIState: true
        },
        sliderColor: {
            type: "color",
            default: "rgba(195, 195, 195, 1)",
            description: "Slider color",
            isUIState: true
        },
        triBorderColor: {
            type: "color",
            default: "rgba(80, 80, 80, 1)",
            description: "Triangle border color",
            isUIState: true
        },
        triColor: {
            type: "color",
            default: "rgba(165, 165, 165, 1)",
            description: "Triangle color",
            isUIState: true
        },
        triOnColor: {
            type: "color",
            default: "rgba(195, 195, 195, 1)",
            description: "Triangle color while on",
            isUIState: true
        },
        textColor: {
            type: "color",
            default: "rgba(255, 255, 255, 1)",
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
        orientation: {
            type: "enum",
            enums: ["vertical", "horizontal"],
            default: "vertical",
            description: "Slider orientation",
            isUIState: true
        },
        showName: {
            type: "boolean",
            default: true,
            description: "Display name",
            isUIState: true
        },
        showNumber: {
            type: "boolean",
            default: true,
            description: "Display number as text",
            isUIState: true
        }
    };
    uiComponent = LiveSliderUI;
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
            }
        });
        this.on("changeFromUI", ({ value, displayValue }) => {
            this.state.value = value;
            this.state.displayValue = displayValue;
            this.outletAll([this.state.value, this.state.displayValue]);
        });
    }
}
