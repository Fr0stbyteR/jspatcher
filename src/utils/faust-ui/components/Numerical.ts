import { AbstractItem } from "./AbstractItem";
import { FaustUIItemProps } from "./types";
import "./Numerical.scss";
import { FaustUINentryStyle } from "./Nentry";

export class Numerical extends AbstractItem<FaustUINentryStyle> {
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
    className = "numerical";

    input: HTMLInputElement;
    componentWillMount() {
        super.componentWillMount();
        this.input = document.createElement("input");
        this.input.disabled = true;
        this.input.value = (+this.state.value.toFixed(3)).toString() + (this.state.unit || "");
        this.setStyle();
        return this;
    }
    setStyle = () => {
        const { height, grid, fontsize, textcolor, bgcolor, bordercolor } = this.state.style;
        this.input.style.backgroundColor = bgcolor;
        this.input.style.borderColor = bordercolor;
        this.input.style.color = textcolor;
        this.input.style.fontSize = `${fontsize || height * grid / 4}px`;
    };
    componentDidMount() {
        super.componentDidMount();
        this.on("style", () => this.schedule(this.setStyle));
        this.on("label", () => this.schedule(this.paintLabel));
        const valueChange = () => this.input.value = (+this.state.value.toFixed(3)).toString() + (this.state.unit || "");
        this.on("value", () => this.schedule(valueChange));
        return this;
    }
    mount() {
        this.container.appendChild(this.label);
        this.container.appendChild(this.input);
        return super.mount();
    }
}
