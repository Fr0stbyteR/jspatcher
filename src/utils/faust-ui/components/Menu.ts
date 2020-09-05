import { AbstractItem } from "./AbstractItem";
import { FaustUIItemStyle, FaustUIItemProps } from "./types";
import "./Menu.scss";

export interface FaustUIMenuStyle extends FaustUIItemStyle {
    fontname?: string;
    fontsize?: number;
    fontface?: "regular" | "bold" | "italic" | "bold italic";
    bgcolor?: string;
    bordercolor?: string;
    labelcolor?: string;
    textcolor?: string;
}
export class Menu extends AbstractItem<FaustUIMenuStyle> {
    static get defaultProps(): FaustUIItemProps<FaustUIMenuStyle> {
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
    className = "menu";

    select: HTMLSelectElement;
    componentWillMount() {
        super.componentWillMount();
        this.select = document.createElement("select");
        this.getOptions();
        this.setStyle();
        return this;
    }
    getOptions() {
        const { enums } = this.state;
        this.select.innerHTML = "";
        if (enums) {
            let i = 0;
            for (const key in enums) {
                const option = document.createElement("option");
                option.value = enums[key].toString();
                option.text = key;
                if (i === 0) option.selected = true;
                this.select.appendChild(option);
                i++;
            }
        }
    }
    handleChange = (e: Event) => {
        this.setValue(+(e.currentTarget as HTMLInputElement).value);
    };
    setStyle = () => {
        const { height, grid, fontsize, textcolor, bgcolor, bordercolor } = this.state.style;
        this.select.style.backgroundColor = bgcolor;
        this.select.style.borderColor = bordercolor;
        this.select.style.color = textcolor;
        this.select.style.fontSize = `${fontsize || height * grid / 4}px`;
    };
    componentDidMount() {
        super.componentDidMount();
        this.select.addEventListener("change", this.handleChange);
        this.on("style", () => this.schedule(this.setStyle));
        this.on("label", () => this.schedule(this.paintLabel));
        this.on("enums", () => this.schedule(this.getOptions));
        const valueChange = () => {
            for (let i = this.select.children.length - 1; i >= 0; i--) {
                const option = this.select.children[i] as HTMLOptionElement;
                if (+option.value === this.state.value) this.select.selectedIndex = i;
            }
        };
        this.on("value", () => this.schedule(valueChange));
        valueChange();
        return this;
    }
    mount() {
        this.container.appendChild(this.label);
        this.container.appendChild(this.select);
        return super.mount();
    }
}
