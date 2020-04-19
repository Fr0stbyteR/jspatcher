import { LiveUI, LiveObject, LiveUIState } from "./Base";
import { TMeta } from "../../types";
import { Bang } from "../Base";
import { fillRoundedRect } from "../../../utils/utils";

interface LiveTextProps extends LiveUIProps {
    bgColor: string;
    bgOnColor: string;
    activeBgColor: string;
    activeBgOnColor: string;
    borderColor: string;
    focusBorderColor: string;
    textColor: string;
    textOnColor: string;
    activeTextColor: string;
    activeTextOnColor: string;
    fontFamily: string;
    fontSize: number;
    fontFace: "regular" | "bold" | "italic" | "bold italic";
    mode: "button" | "toggle";
    text: string;
    textOn: string;
}
interface LiveTextUIState extends LiveTextProps, LiveUIState {}
class LiveTextUI extends LiveUI<LiveText, LiveTextUIState> {
    className = "live-text";
    inTouch = false;
    paint() {
        const {
            // width,
            // height,
            active,
            focus,
            fontFamily,
            fontSize,
            fontFace,
            activeBgColor,
            activeBgOnColor,
            bgColor,
            bgOnColor,
            borderColor,
            focusBorderColor,
            textColor,
            textOnColor,
            activeTextColor,
            activeTextOnColor,
            mode,
            text,
            textOn,
            value
        } = this.state;
        const ctx = this.ctx;
        if (!ctx) return;

        const borderWidth = 0.5;

        const [width, height] = this.fullSize();
        ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = borderWidth;

        const buttonBgColor = active ? (value ? activeBgOnColor : activeBgColor) : (value ? bgOnColor : bgColor);
        const buttonBorderColor = focus ? focusBorderColor : borderColor;

        ctx.fillStyle = buttonBgColor;
        if (mode === "button") {
            fillRoundedRect(ctx, 0.5, 0.5, width - 1, height - 1, height * 0.5 - 1);
        } else {
            ctx.beginPath();
            ctx.rect(0.5, 0.5, width - 1, height - 1);
            ctx.fill();
        }
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = buttonBorderColor;
        ctx.stroke();

        ctx.font = `${fontFace === "regular" ? "" : fontFace} ${fontSize}px ${fontFamily}, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = active ? (value ? activeTextOnColor : activeTextColor) : (value ? textOnColor : textColor);
        ctx.fillText(value && mode === "toggle" ? textOn : text, width * 0.5, height * 0.5);
    }
    handlePointerDown = (e: PointerDownEvent) => {
        const { value, mode } = this.state;
        this.inTouch = true;
        this.setValueToOutput(mode === "button" ? 1 : 1 - +!!value);
    };
    handlePointerUp = () => {
        const { mode } = this.state;
        this.inTouch = false;
        if (mode === "button") this.setValueToOutput(0);
    };
}

export class LiveText extends LiveObject<{}, {}, [number | Bang, number], [number, string], [number], LiveTextProps, LiveTextUIState> {
    static description = "Button or toggle with text";
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
            default: "rgba(165, 165, 165, 1)",
            description: "Background color (inactive / off)",
            isUIState: true
        },
        activeBgColor: {
            type: "color",
            default: "rgba(165, 165, 165, 1)",
            description: "Background color (active / off)",
            isUIState: true
        },
        bgOnColor: {
            type: "color",
            default: "rgba(165, 165, 165, 1)",
            description: "Background color (inactive / on)",
            isUIState: true
        },
        activeBgOnColor: {
            type: "color",
            default: "rgba(255, 181, 50, 1)",
            description: "Background color (active / on)",
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
            default: "rgba(90, 90, 90, 1)",
            description: "Text color (inactive / off)",
            isUIState: true
        },
        textOnColor: {
            type: "color",
            default: "rgba(90, 90, 90, 1)",
            description: "Text color (inactive / on)",
            isUIState: true
        },
        activeTextColor: {
            type: "color",
            default: "rgba(0, 0, 0, 1)",
            description: "Text color (active / off)",
            isUIState: true
        },
        activeTextOnColor: {
            type: "color",
            default: "rgba(0, 0, 0, 1)",
            description: "Text color (active / on)",
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
        mode: {
            type: "enum",
            enums: ["button", "toggle"],
            default: "toggle",
            description: "Trigger mode",
            isUIState: true
        },
        text: {
            type: "string",
            default: "A",
            description: "Text (off)",
            isUIState: true
        },
        textOn: {
            type: "string",
            default: "B",
            description: "Text (off)",
            isUIState: true
        }
    };
    static ui = LiveTextUI;
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
