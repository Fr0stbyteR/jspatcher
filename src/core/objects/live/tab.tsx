import { LiveUI, LiveObject, LiveUIState } from "./Base";
import { TMeta, TRect } from "../../types";
import { Bang } from "../Base";

interface LiveTabProps extends LiveUIProps {
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
    mode: "equal" | "proportional";
    spacingX: number;
    spacingY: number;
    multiline: boolean;
}
class LiveTabUI extends LiveUI<LiveTab, LiveTabProps> {
    static defaultSize: [number, number] = [120, 15];
    state: LiveTabProps & LiveUIState = {
        ...this.state,
        bgColor: this.box.props.bgColor || this.object.meta.props.bgColor.default,
        bgOnColor: this.box.props.bgOnColor || this.object.meta.props.bgOnColor.default,
        activeBgColor: this.box.props.activeBgColor || this.object.meta.props.activeBgColor.default,
        activeBgOnColor: this.box.props.activeBgOnColor || this.object.meta.props.activeBgOnColor.default,
        borderColor: this.box.props.borderColor || this.object.meta.props.borderColor.default,
        focusBorderColor: this.box.props.focusBorderColor || this.object.meta.props.focusBorderColor.default,
        textColor: this.box.props.textColor || this.object.meta.props.textColor.default,
        textOnColor: this.box.props.textOnColor || this.object.meta.props.textOnColor.default,
        activeTextColor: this.box.props.activeTextColor || this.object.meta.props.activeTextColor.default,
        activeTextOnColor: this.box.props.activeTextOnColor || this.object.meta.props.activeTextOnColor.default,
        fontFamily: this.box.props.fontFamily || this.object.meta.props.fontFamily.default,
        fontSize: this.box.props.fontSize || this.object.meta.props.fontSize.default,
        fontFace: this.box.props.fontFace || this.object.meta.props.fontFace.default,
        mode: this.box.props.mode || this.object.meta.props.mode.default,
        spacingX: this.box.props.spacingX || this.object.meta.props.spacingX.default,
        spacingY: this.box.props.spacingY || this.object.meta.props.spacingY.default,
        multiline: typeof this.box.props.multiline === "boolean" ? this.box.props.multiline : this.object.meta.props.multiline.default
    }
    className = "live-tab";
    tabRects: TRect[] = [];
    inTouch = false;
    getTabRects() {
        const {
            multiline,
            mode,
            enums,
            spacingX: spacingXIn,
            spacingY: spacingYIn
        } = this.state;
        const { width, height } = this.box;
        const margin = 4;
        const minHeight = 10;
        const count = enums.length;
        let countPerLine = count;
        let lines = 1;
        let step = height / lines;
        let interval = 0;
        let rectWidth = 0;
        const spacingX = spacingXIn * 0.5;
        const spacingY = spacingYIn * 0.5;

        if (multiline && height >= 2 * minHeight) {
            lines = Math.max(1, Math.min(count, Math.floor(height / minHeight)));
            countPerLine = Math.ceil(count / lines);
            // if there's not enough height, increase the number of tabs per row
            while (lines * countPerLine < count) {
                countPerLine++;
                if (lines > 1) lines--;
            }
            // if there's extra height, reduce the number of rows
            while (lines * countPerLine > count && (lines - 1) * countPerLine >= count) {
                lines--;
            }
            step = height / lines;
        }
        if (mode === "equal") {
            interval = width / countPerLine;
            rectWidth = interval - spacingX;
            for (let i = 0; i < count; i++) {
                this.tabRects[i] = [
                    (i % countPerLine) * interval + spacingX * 0.5,
                    Math.floor(i / countPerLine) * step + spacingY * 0.5,
                    rectWidth,
                    (height / lines) - spacingY
                ];
            }
        } else {
            const textWidths = [];
            for (let i = 0; i < lines; i++) {
                let total = 0;
                let space = width;
                for (let j = i * countPerLine; j < Math.min((i + 1) * countPerLine, count); j++) {
                    const textDimensions = this.ctx.measureText(enums[j]);
                    textWidths[j] = textDimensions.width;
                    total += textWidths[j];
                    space -= 2 * margin + spacingX;
                }
                let used = 0;
                for (let j = i * countPerLine; j < Math.min((i + 1) * countPerLine, count); j++) {
                    const rectSpace = textWidths[j] / total;
                    this.tabRects[j] = [
                        used + spacingX * 0.5,
                        i * step + spacingY * 0.5,
                        space * rectSpace + 2 * margin,
                        height / lines - spacingY
                    ];
                    used += this.tabRects[j][2] + spacingX;
                }
            }
        }
        return this.tabRects;
    }
    paint() {
        const {
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
            enums,
            value
        } = this.state;
        const { width, height } = this.box;
        const ctx = this.ctx;
        if (!ctx) return;
        const tabRects = this.getTabRects();

        const borderWidth = 0.5;

        ctx.canvas.width = width;
        ctx.canvas.height = height;
        ctx.lineWidth = borderWidth;

        const buttonBorderColor = focus ? focusBorderColor : borderColor;
        for (let i = 0; i < enums.length; i++) {
            const buttonBgColor = active ? (value === i ? activeBgOnColor : activeBgColor) : (value === i ? bgOnColor : bgColor);
            ctx.fillStyle = buttonBgColor;
            ctx.beginPath();
            ctx.rect(...tabRects[i]);
            ctx.fill();
            ctx.strokeStyle = buttonBorderColor;
            ctx.stroke();

            ctx.font = `${fontFace === "regular" ? "" : fontFace} ${fontSize}px ${fontFamily}, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = active ? (value === i ? activeTextOnColor : activeTextColor) : (value === i ? textOnColor : textColor);
            ctx.fillText(enums[i], tabRects[i][0] + tabRects[i][2] * 0.5, tabRects[i][1] + tabRects[i][3] * 0.5);
        }
    }
    handlePointerDown = (e: PointerDownEvent) => {
        this.inTouch = true;
        for (let i = 0; i < this.tabRects.length; i++) {
            const rect = this.tabRects[i];
            if (e.x >= rect[0] && e.x <= rect[2] + rect[0] && e.y >= rect[1] && e.y <= rect[3] + rect[1]) {
                this.setValueToOutput(i);
                return;
            }
        }
    }
    handlePointerDrag = (e: PointerDragEvent) => {
        this.handlePointerDown(e);
    }
    handleKeyDown = (e: React.KeyboardEvent) => {
        let addStep = 0;
        if (e.key === "ArrowUp" || e.key === "ArrowRight") addStep = 1;
        if (e.key === "ArrowDown" || e.key === "ArrowLeft") addStep = -1;
        if (addStep !== 0) {
            const newValue = this.object.toValidValue(this.state.value + this.state.step * addStep);
            if (newValue !== this.state.value) this.setValueToOutput(newValue);
        }
    }
}

export class LiveTab extends LiveObject<{}, {}, [number | Bang, number], [number, string], [number], LiveTabProps> {
    static description = "Buttons as tab";
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
            enums: ["equal", "proportional"],
            default: "equal",
            description: "Spacing mode",
            isUIState: true
        },
        spacingX: {
            type: "number",
            default: 6,
            description: "Tab horizontal spacing",
            isUIState: true
        },
        spacingY: {
            type: "number",
            default: 6,
            description: "Tab vertical spacing",
            isUIState: true
        },
        multiline: {
            type: "boolean",
            default: true,
            description: "Multi-line tabs",
            isUIState: true
        },
        enums: {
            type: "object",
            default: ["one", "two", "three"],
            description: "Enum values",
            isUIState: true
        }
    };
    uiComponent = LiveTabUI;
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
