import { LiveUI, LiveObject, LiveUIState } from "./Base";
import { IJSPatcherObjectMeta } from "../../types";
import { Bang, isBang } from "../Base";

interface LiveToggleProps extends LiveUIProps {
    bgColor: string;
    activeBgColor: string;
    bgOnColor: string;
    activeBgOnColor: string;
    borderColor: string;
    focusBorderColor: string;
}

interface LiveToggleUIState extends LiveToggleProps, LiveUIState {}
class LiveToggleUI extends LiveUI<LiveToggle, LiveToggleUIState> {
    static defaultSize: [number, number] = [30, 30];
    className = "live-toggle";
    paint() {
        const {
            // width,
            // height,
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
        const ctx = this.ctx;
        if (!ctx) return;
        const borderWidth = 1;

        const [width, height] = this.fullSize();
        ctx.clearRect(0, 0, width, height);

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
    };
}

export class LiveToggle extends LiveObject<{}, {}, [number | Bang, number], [number, string], [number], LiveToggleProps, LiveToggleUIState> {
    static description = "Toggle";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "number",
        description: "Set and output the value"
    }, {
        isHot: false,
        type: "number",
        description: "Set without output the value"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "number",
        description: "Number value"
    }, {
        type: "string",
        description: "Display value"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "number",
        optional: true,
        default: 0,
        description: "Initial value"
    }];
    static props: IJSPatcherObjectMeta["props"] = {
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
    static UI = LiveToggleUI;
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
                if (!isBang(data)) {
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
