import { LiveUI, LiveObject, LiveUIState } from "./Base";
import { TMeta } from "../../types";
import { Bang } from "../Base";

interface LiveButtonProps extends LiveUIProps {
    bgColor: string;
    activeBgColor: string;
    bgOnColor: string;
    activeBgOnColor: string;
    borderColor: string;
    focusBorderColor: string;
}

class LiveButtonUI extends LiveUI<LiveButton, LiveButtonProps> {
    static defaultSize: [number, number] = [30, 30];
    state: LiveButtonProps & LiveUIState = {
        ...this.state,
        shortName: this.box.props.shortName || this.object.meta.props.shortName.default,
        bgColor: this.box.props.bgColor || this.object.meta.props.bgColor.default,
        activeBgColor: this.box.props.activeBgColor || this.object.meta.props.activeBgColor.default,
        bgOnColor: this.box.props.bgOnColor || this.object.meta.props.bgOnColor.default,
        activeBgOnColor: this.box.props.activeBgOnColor || this.object.meta.props.activeBgOnColor.default,
        borderColor: this.box.props.borderColor || this.object.meta.props.borderColor.default,
        focusBorderColor: this.box.props.focusBorderColor || this.object.meta.props.focusBorderColor.default
    }
    className = "live-button";
    inTouch = false;
    $resetTimer = -1;
    resetCallback = () => {
        this.setValueToOutput(0);
        this.$resetTimer = -1;
    };
    paint() {
        if (this.$resetTimer !== -1) {
            window.clearTimeout(this.$resetTimer);
            this.resetCallback();
        }
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
        const width = this.box.rect[2];
        const height = this.box.rect[3];
        const ctx = this.ctx;
        const borderWidth = 1;

        ctx.canvas.width = width;
        ctx.canvas.height = height;

        ctx.lineWidth = borderWidth;
        const buttonBgColor = active ? (value ? activeBgOnColor : activeBgColor) : (value ? bgOnColor : bgColor);
        const buttonBorderColor = focus ? focusBorderColor : borderColor;

        ctx.fillStyle = buttonBgColor;
        ctx.beginPath();
        ctx.ellipse(width * 0.5, height * 0.5, width * 0.5 - 2 * borderWidth, height * 0.5 - 2 * borderWidth, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = buttonBorderColor;
        ctx.stroke();

        if (value && !this.inTouch) this.$resetTimer = window.setTimeout(this.resetCallback, 100);
    }
    handlePointerDown = () => {
        this.inTouch = true;
        this.setValueToOutput(1);
    }
    handlePointerUp = () => {
        this.inTouch = false;
        this.setValueToOutput(0);
    }
}

export class LiveButton extends LiveObject<{}, {}, [any], [Bang], [number], LiveButtonProps & { transition: "Zero->One" | "One->Zero" | "Both" }> {
    static description = "Button";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "number",
        description: "Output a bang following transition prop."
    }];
    static outlets: TMeta["outlets"] = [{
        type: "bang",
        description: "Bang"
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
        },
        transition: {
            type: "enum",
            enums: ["Zero->One", "One->Zero", "Both"],
            default: "Zero->One",
            description: "Specifies when a bang message will be sent to the outlet"
        }
    };
    uiComponent = LiveButtonUI;
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("updateArgs", (args) => {
            this.state.value = +!!args[0];
            this.validateValue();
            this.updateUI({ value: this.state.value });
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                this.state.value = +!!data;
                this.validateValue();
                this.updateUI({ value: this.state.value });
                if (this.state.value && this.box.props.transition !== "One->Zero") this.outlet(0, new Bang());
            }
        });
        this.on("changeFromUI", ({ value }) => {
            const lastValue = this.state.value;
            this.state.value = value;
            this.validateValue();
            const b01 = this.box.props.transition !== "One->Zero";
            const b10 = this.box.props.transition === "One->Zero" || this.box.props.transition === "Both";
            if ((b01 && lastValue < this.state.value) || (b10 && lastValue > this.state.value)) this.outlet(0, new Bang());
        });
    }
}
