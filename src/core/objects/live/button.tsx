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
    state: LiveButtonProps & LiveUIState = {
        ...this.state,
        shortName: this.box.props.shortName || "live.button",
        bgColor: this.box.props.bgColor || "rgba(90, 90, 90, 1)",
        activeBgColor: this.box.props.activeBgColor || "rgba(90, 90, 90, 1)",
        bgOnColor: this.box.props.bgColor || "rgba(195, 195, 195, 1)",
        activeBgOnColor: this.box.props.activeBgColor || "rgba(109, 215, 255, 1)",
        borderColor: this.box.props.borderColor || "rgba(80, 80, 80, 1)",
        focusBorderColor: this.box.props.focusBorderColor || "rgba(80, 80, 80, 1)"
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
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Button",
            inlets: [{
                isHot: true,
                type: "number",
                description: "Output a bang following transition prop."
            }],
            outlets: [{
                type: "bang",
                description: "Bang"
            }],
            args: [{
                type: "number",
                optional: true,
                default: 0,
                description: "Initial value"
            }],
            props: [...super.meta.props, {
                name: "bgColor",
                type: "color",
                default: "rgba(90, 90, 90, 1)",
                description: "Background color (inactive)",
                isUIState: true
            }, {
                name: "activeBgColor",
                type: "color",
                default: "rgba(90, 90, 90, 1)",
                description: "Background color (active)",
                isUIState: true
            }, {
                name: "bgOnColor",
                type: "color",
                default: "rgba(195, 195, 195, 1)",
                description: "Background color (on / inactive)",
                isUIState: true
            }, {
                name: "activeBgColor",
                type: "color",
                default: "rgba(109, 215, 255, 1)",
                description: "Background color (on /active)",
                isUIState: true
            }, {
                name: "borderColor",
                type: "color",
                default: "rgba(80, 80, 80, 1)",
                description: "Border color (unfocus)",
                isUIState: true
            }, {
                name: "focusBorderColor",
                type: "color",
                default: "rgba(80, 80, 80, 1)",
                description: "Border color (focus)",
                isUIState: true
            }, {
                name: "transition",
                type: "enum",
                enum: ["Zero->One", "One->Zero", "Both"],
                default: "Zero->One",
                description: "Specifies when a bang message will be sent to the outlet"
            }]
        };
    }
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
