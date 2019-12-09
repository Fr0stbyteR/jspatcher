import { LiveUI, LiveObject, LiveUIState } from "./Base";
import { TMeta } from "../../types";
import { Bang } from "../Base";

interface LiveToggleProps extends LiveUIProps {
    bgColor: string;
    activeBgColor: string;
    bgOnColor: string;
    activeBgOnColor: string;
    borderColor: string;
    focusBorderColor: string;
}

class LiveToggleUI extends LiveUI<LiveToggle, LiveToggleProps> {
    static defaultSize: [number, number] = [30, 30];
    state: LiveToggleProps & LiveUIState = {
        ...this.state,
        bgColor: this.box.props.bgColor || this.object.meta.props.bgColor.default,
        activeBgColor: this.box.props.activeBgColor || this.object.meta.props.activeBgColor.default,
        bgOnColor: this.box.props.bgOnColor || this.object.meta.props.bgOnColor.default,
        activeBgOnColor: this.box.props.activeBgOnColor || this.object.meta.props.activeBgOnColor.default,
        borderColor: this.box.props.borderColor || this.object.meta.props.borderColor.default,
        focusBorderColor: this.box.props.focusBorderColor || this.object.meta.props.focusBorderColor.default
    }
    className = "live-toggle";
    paint() {
        const {
            active,
            focus,
            bgColor,
            activeBgColor,
            bgOnColor,
            activeBgOnColor,
            borderColor,
            focusBorderColor,
            value
        } = this.state;
        const { width, height } = this.box;
        const ctx = this.ctx;
        const borderWidth = 1;

        ctx.canvas.width = width;
        ctx.canvas.height = height;

        ctx.lineWidth = borderWidth;

        const buttonBgColor = active ? (value ? activeBgOnColor : activeBgColor) : (value ? bgOnColor : bgColor);
        const buttonBorderColor = focus ? focusBorderColor : borderColor;

        ctx.fillStyle = buttonBgColor;
        ctx.beginPath();
        ctx.rect(borderWidth, borderWidth, width - 2 * borderWidth, height - 2 * borderWidth);
        ctx.fill();
        ctx.strokeStyle = buttonBorderColor;
        ctx.stroke();
    }
    handlePointerDown = () => {
        this.setValueToOutput(1 - +!!this.state.value);
    }
}

export class LiveToggle extends LiveObject<{}, {}, [number | Bang, number], [number, string], [number], LiveToggleProps> {
    static description = "Toggle";
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
        max: {
            type: "number",
            default: 1,
            description: "Maximum value",
            isUIState: true
        },
        bgColor: {
            type: "color",
            default: "rgba(90, 90, 90, 1)",
            description: "Background color (inactive)",
            isUIState: true
        },
        activeBgColor: {
            type: "color",
            default: "rgba(195, 195, 195, 1)",
            description: "Background color (active)",
            isUIState: true
        },
        bgOnColor: {
            type: "color",
            default: "rgba(195, 195, 195, 1)",
            description: "Background color (on / inactive)",
            isUIState: true
        },
        activeBgOnColor: {
            type: "color",
            default: "rgba(109, 215, 255, 1)",
            description: "Background color (on / active)",
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
        }
    };
    uiComponent = LiveToggleUI;
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 2;
        });
        this.on("updateArgs", (args) => {
            this.state.value = +!!args[0];
            this.validateValue();
            this.updateUI({ value: this.state.value });
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
