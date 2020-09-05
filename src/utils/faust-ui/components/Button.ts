import { AbstractItem } from "./AbstractItem";
import { FaustUIItemStyle, FaustUIItemProps } from "./types";
import "./Button.scss";

export interface FaustUIButtonStyle extends FaustUIItemStyle {
    fontname?: string;
    fontsize?: number;
    fontface?: "normal" | "bold" | "italic" | "bold italic";
    bgcolor?: string;
    bgoncolor?: string;
    bordercolor?: string;
    borderoncolor?: string;
    textcolor?: string;
    textoncolor?: string;
}
export class Button extends AbstractItem<FaustUIButtonStyle> {
    static get defaultProps(): FaustUIItemProps<FaustUIButtonStyle> {
        const inherited = super.defaultProps;
        return {
            ...inherited,
            style: {
                ...inherited.style,
                fontname: "Arial",
                fontsize: undefined,
                fontface: "normal",
                bgcolor: "rgba(40, 40, 40, 1)",
                bgoncolor: "rgba(18, 18, 18, 1)",
                bordercolor: "rgba(80, 80, 80, 1)",
                borderoncolor: "rgba(255, 165, 0, 1)",
                textcolor: "rgba(226, 222, 255, 0.5)",
                textoncolor: "rgba(255, 165, 0, 1)"
            }
        };
    }
    className = "button";

    btn: HTMLDivElement;
    span: HTMLSpanElement;
    componentWillMount() {
        super.componentWillMount();
        this.btn = document.createElement("div");
        this.span = document.createElement("span");
        this.span.innerText = this.state.label;
        this.setStyle();
        return this;
    }
    setStyle = () => {
        const { value, style } = this.state;
        const { height, grid, fontsize, fontname, fontface, textcolor, textoncolor, bgoncolor, bgcolor, bordercolor, borderoncolor } = style;
        this.btn.style.backgroundColor = value ? bgoncolor : bgcolor;
        this.btn.style.borderColor = value ? borderoncolor : bordercolor;
        this.btn.style.color = value ? textoncolor : textcolor;
        this.btn.style.fontSize = `${fontsize || height * grid / 4}px`;
        this.btn.style.fontFamily = `${fontname}, sans-serif`;
        this.btn.style.fontStyle = fontface;
    };
    mount() {
        this.btn.appendChild(this.span);
        this.container.appendChild(this.btn);
        return super.mount();
    }
    componentDidMount() {
        super.componentDidMount();
        this.btn.addEventListener("mousedown", this.handleMouseDown);
        this.btn.addEventListener("touchstart", this.handleTouchStart);
        this.on("style", () => this.schedule(this.setStyle));
        const labelChange = () => this.span.innerText = this.state.label;
        this.on("label", () => this.schedule(labelChange));
        this.on("value", () => this.schedule(this.setStyle));
        return this;
    }
    handlePointerDown = () => {
        this.setValue(1);
    };
    handlePointerUp = () => {
        this.setValue(0);
    };
}
