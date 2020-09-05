import { AbstractItem } from "./AbstractItem";
import { FaustUIItemStyle, FaustUIItemProps } from "./types";
import "./Nentry.scss";

export interface FaustUINentryStyle extends FaustUIItemStyle {
    fontname?: string;
    fontsize?: number;
    fontface?: "regular" | "bold" | "italic" | "bold italic";
    bgcolor?: string;
    bordercolor?: string;
    labelcolor?: string;
    textcolor?: string;
}
export class Nentry extends AbstractItem<FaustUINentryStyle> {
    static get defaultProps(): FaustUIItemProps<FaustUINentryStyle> {
        const inherited = super.defaultProps;
        return {
            ...inherited,
            style: {
                ...inherited.style,
                fontname: "Arial",
                fontsize: undefined,
                fontface: "regular",
                bgcolor: "rgba(255, 255, 255, 0.25)",
                bordercolor: "rgba(80, 80, 80, 0)",
                labelcolor: "rgba(226, 222, 255, 0.5)",
                textcolor: "rgba(18, 18, 18, 1)"
            }
        };
    }
    className = "nentry";

    input: HTMLInputElement;
    componentWillMount() {
        super.componentWillMount();
        this.input = document.createElement("input");
        this.input.type = "number";
        this.input.value = (+this.state.value.toFixed(3)).toString();
        this.input.max = this.state.max.toString();
        this.input.min = this.state.min.toString();
        this.input.step = this.state.step.toString();
        this.setStyle();
        return this;
    }
    handleChange = (e: Event) => {
        this.setValue(+(e.currentTarget as HTMLInputElement).value);
    };
    setStyle = () => {
        const { height, grid, fontsize, textcolor, bgcolor, bordercolor } = this.state.style;
        this.input.style.backgroundColor = bgcolor;
        this.input.style.borderColor = bordercolor;
        this.input.style.color = textcolor;
        this.input.style.fontSize = `${fontsize || height * grid / 4}px`;
    };
    componentDidMount() {
        super.componentDidMount();
        this.input.addEventListener("change", this.handleChange);
        this.on("style", () => this.schedule(this.setStyle));
        this.on("label", () => this.schedule(this.paintLabel));
        const valueChange = () => this.input.value = (+this.state.value.toFixed(3)).toString();
        this.on("value", () => this.schedule(valueChange));
        const maxChange = () => this.input.max = this.state.max.toString();
        this.on("max", () => this.schedule(maxChange));
        const minChange = () => this.input.min = this.state.min.toString();
        this.on("min", () => this.schedule(minChange));
        const stepChange = () => this.input.step = this.state.step.toString();
        this.on("step", () => this.schedule(stepChange));
        return this;
    }
    mount() {
        this.container.appendChild(this.label);
        this.container.appendChild(this.input);
        return super.mount();
    }
}
