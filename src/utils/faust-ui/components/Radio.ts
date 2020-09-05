import { AbstractItem } from "./AbstractItem";
import { FaustUIItemStyle, FaustUIItemProps } from "./types";
import "./Radio.scss";

export interface FaustUIRadioStyle extends FaustUIItemStyle {
    fontname?: string;
    fontsize?: number;
    fontface?: "regular" | "bold" | "italic" | "bold italic";
    bgcolor?: string;
    bordercolor?: string;
    labelcolor?: string;
    textcolor?: string;
}
export class Radio extends AbstractItem<FaustUIRadioStyle> {
    static get defaultProps(): FaustUIItemProps<FaustUIRadioStyle> {
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
    className = "radio";

    group: HTMLDivElement;
    componentWillMount() {
        super.componentWillMount();
        this.group = document.createElement("div");
        this.group.className = "faust-ui-component-radio-group";
        this.getOptions();
        this.setStyle();
        return this;
    }
    getOptions = () => {
        const { enums, address } = this.state;
        this.group.innerHTML = "";
        if (enums) {
            let i = 0;
            for (const key in enums) {
                const input = document.createElement("input");
                const div = document.createElement("div");
                input.value = enums[key].toString();
                input.name = address;
                input.type = "radio";
                if (i === 0) input.checked = true;
                input.addEventListener("change", () => {
                    if (input.checked) this.setValue(enums[key]);
                });
                div.appendChild(input);
                div.append(key);
                this.group.appendChild(div);
                i++;
            }
        }
    };
    setStyle = () => {
        const { height, width, grid, fontsize, textcolor, bgcolor, bordercolor } = this.state.style;
        const fontSize = Math.min(height * grid * 0.1, width * grid * 0.1);
        this.group.style.backgroundColor = bgcolor;
        this.group.style.borderColor = bordercolor;
        this.group.style.color = textcolor;
        this.group.style.fontSize = `${fontsize || fontSize}px`;
    };
    componentDidMount() {
        super.componentDidMount();
        this.on("style", () => this.schedule(this.setStyle));
        this.on("label", () => this.schedule(this.paintLabel));
        this.on("enums", () => this.schedule(this.getOptions));
        const valueChange = () => {
            for (let i = this.group.children.length - 1; i >= 0; i--) {
                const input = this.group.children[i].querySelector("input");
                if (+input.value === this.state.value) input.checked = true;
            }
        };
        this.on("value", () => this.schedule(valueChange));
        valueChange();
        return this;
    }
    mount() {
        this.container.appendChild(this.label);
        this.container.appendChild(this.group);
        return super.mount();
    }
}
