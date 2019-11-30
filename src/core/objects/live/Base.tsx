import * as React from "react";
import { toMIDI, iNormExp } from "../../../utils";
import { BaseAudioObject, BaseUI, BaseUIAdditionalState } from "../Base";
import { TMeta, BaseUIState } from "../../types";

export const getDisplayValue = (value: number, type: string, unitstyle: string, units: string, enums: string[]) => {
    if (type === "enum") return enums[value];
    if (unitstyle === "int") return value.toFixed(0);
    if (unitstyle === "float") return value.toFixed(2);
    if (unitstyle === "time") return value.toFixed(type === "int" ? 0 : 2) + " ms";
    if (unitstyle === "hertz") return value.toFixed(type === "int" ? 0 : 2) + " Hz";
    if (unitstyle === "decibel") return value.toFixed(type === "int" ? 0 : 2) + " dB";
    if (unitstyle === "%") return value.toFixed(type === "int" ? 0 : 2) + " %";
    if (unitstyle === "pan") return value === 0 ? "C" : (type === "int" ? Math.abs(value) : Math.abs(value).toFixed(2)) + (value < 0 ? " L" : " R");
    if (unitstyle === "semitones") return value.toFixed(type === "int" ? 0 : 2) + " st";
    if (unitstyle === "midi") return toMIDI(value);
    if (unitstyle === "custom") return value.toFixed(type === "int" ? 0 : 2) + " " + units;
    if (unitstyle === "native") return value.toFixed(type === "int" ? 0 : 2);
    return "N/A";
};
export type LiveUIState = LiveUIProps & BaseUIState & BaseUIAdditionalState;
export class LiveUI<T extends LiveObject, P extends Partial<LiveUIProps> & { [key: string]: any } = {}> extends BaseUI<T, {}, P & LiveUIProps> {
    state: P & LiveUIState = {
        ...this.state,
        value: this.box.props.value || 0,
        min: this.box.props.min || 0,
        max: typeof this.box.props.max === "number" ? this.box.props.max : 127,
        step: this.box.props.step || 1,
        type: this.box.props.type || "int",
        enums: this.box.props.enums || [""],
        active: typeof this.box.props.active === "boolean" ? this.box.props.active : true,
        focus: this.box.props.focus || false,
        shortName: this.box.props.shortName || "",
        longName: this.box.props.longName || "",
        unitStyle: this.box.props.unitStyle || "int",
        units: this.box.props.units || "",
        exponent: this.box.props.exponent || 0,
        speedLim: this.box.props.speedLim || 16,
        frameRate: this.box.props.frameRate || 60
    };
    static sizing: "horizontal" | "vertical" | "both" | "ratio" = "both";
    refCanvas = React.createRef<HTMLCanvasElement>();
    className: string;
    paintScheduled = false;
    $paintRaf = -1;
    $changeTimer = -1;
    get canvas() {
        return this.refCanvas.current;
    }
    get ctx() {
        return this.refCanvas.current.getContext("2d");
    }
    handleKeyDown = (e: React.KeyboardEvent) => {};
    handleKeyUp = (e: React.KeyboardEvent) => {};
    private handleTouchStart = (e: React.TouchEvent) => {
        this.canvas.focus();
        const rect = this.canvas.getBoundingClientRect();
        let prevX = e.touches[0].pageX;
        let prevY = e.touches[0].pageY;
        const fromX = prevX - rect.left;
        const fromY = prevY - rect.top;
        const prevValue = this.state.value;
        this.handlePointerDown({ x: fromX, y: fromY, originalEvent: e });
        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            const pageX = e.changedTouches[0].pageX;
            const pageY = e.changedTouches[0].pageY;
            const movementX = pageX - prevX;
            const movementY = pageY - prevY;
            prevX = pageX;
            prevY = pageY;
            const x = pageX - rect.left;
            const y = pageY - rect.top;
            this.handlePointerDrag({ prevValue, x, y, fromX, fromY, movementX, movementY, originalEvent: e });
        };
        const handleTouchEnd = (e: TouchEvent) => {
            e.preventDefault();
            const x = e.changedTouches[0].pageX - rect.left;
            const y = e.changedTouches[0].pageY - rect.top;
            this.handlePointerUp({ x, y, originalEvent: e });
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
        };
        document.addEventListener("touchmove", handleTouchMove, { passive: false });
        document.addEventListener("touchend", handleTouchEnd, { passive: false });
    };
    handleWheel = (e: React.WheelEvent) => {};
    handleClick = (e: React.MouseEvent) => {};
    private handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        this.canvas.focus();
        const rect = this.canvas.getBoundingClientRect();
        const fromX = e.pageX - rect.left;
        const fromY = e.pageY - rect.top;
        const prevValue = this.state.value;
        this.handlePointerDown({ x: fromX, y: fromY, originalEvent: e });
        const handleMouseMove = (e: MouseEvent) => {
            e.preventDefault();
            const x = e.pageX - rect.left;
            const y = e.pageY - rect.top;
            this.handlePointerDrag({ prevValue, x, y, fromX, fromY, movementX: e.movementX, movementY: e.movementY, originalEvent: e });
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.preventDefault();
            const x = e.pageX - rect.left;
            const y = e.pageY - rect.top;
            this.handlePointerUp({ x, y, originalEvent: e });
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    handleMouseOver = (e: React.MouseEvent) => {};
    handleMouseOut = (e: React.MouseEvent) => {};
    handleContextMenu = (e: React.MouseEvent) => {};
    handlePointerDown = (e: PointerDownEvent) => {};
    handlePointerDrag = (e: PointerDragEvent) => {};
    handlePointerUp = (e: PointerUpEvent) => {};
    handleFocusIn = (e: React.FocusEvent) => this.setState({ focus: true });
    handleFocusOut = (e: React.FocusEvent) => this.setState({ focus: false });
    /**
     * Normalized value between 0 - 1.
     *
     * @readonly
     * @memberof LiveUI
     */
    get distance() {
        return LiveUI.getDistance(this.state);
    }
    static getDistance(state: { type: "enum" | "int" | "float"; value: number; min: number; max: number; exponent: number; enums?: string[] }) {
        const { type, max, min, value, exponent, enums } = state;
        const normalized = type === "enum" ? Math.max(0, Math.min(enums.length - 1, value)) / (enums.length - 1) : (value - min) / (max - min);
        return iNormExp(normalized || 0, exponent);
    }
    /**
     * Count steps in range min-max with step
     *
     * @readonly
     * @memberof LiveUI
     */
    get stepsCount() {
        const { type, max, min, step, enums } = this.state;
        if (type === "enum") return enums.length - 1;
        if (type === "float") return Math.min(Number.MAX_SAFE_INTEGER, Math.floor((max - min) / step));
        return Math.min(Math.floor((max - min) / (Math.round(step) || 1)), max - min);
    }
    get displayValue() {
        const { value, type, unitStyle, units, enums } = this.state;
        return getDisplayValue(value, type, unitStyle, units, enums);
    }
    setValueToOutput(value: number) {
        this.setState({ value });
        this.scheduleChangeHandler();
    }
    changeCallback = () => {
        this.props.object.onChangeFromUI({ value: this.state.value, displayValue: this.displayValue });
        this.$changeTimer = -1;
    }
    scheduleChangeHandler() {
        if (this.$changeTimer === -1) this.$changeTimer = window.setTimeout(this.changeCallback, this.state.speedLim);
    }
    paintCallback = () => {
        this.paint();
        this.$paintRaf = (-1 * Math.round(Math.abs(60 / this.state.frameRate))) || -1;
        this.paintScheduled = false;
    }
    noPaintCallback = () => {
        this.$paintRaf++;
        this.paintScheduled = false;
        this.schedulePaint();
    }
    schedulePaint() {
        if (this.paintScheduled) return;
        if (this.$paintRaf === -1) this.$paintRaf = requestAnimationFrame(this.paintCallback);
        else if (this.$paintRaf < -1) requestAnimationFrame(this.noPaintCallback);
        this.paintScheduled = true;
    }
    handleResize = () => this.schedulePaint();
    componentDidMount() {
        super.componentDidMount();
        this.schedulePaint();
        this.box.on("resized", this.handleResize);
    }
    componentWillUnmount() {
        super.componentWillUnmount();
        this.box.off("resized", this.handleResize);
    }
    componentDidUpdate() {
        this.schedulePaint();
    }
    paint() {}
    render() {
        return (
            <BaseUI {...this.props}>
                <canvas
                    ref={this.refCanvas}
                    className={["live-component", this.className].join(" ")}
                    style={{ position: "absolute", display: "inline-block", width: "100%", height: "100%" }}
                    tabIndex={1}
                    onKeyDown={this.handleKeyDown}
                    onKeyUp={this.handleKeyUp}
                    onTouchStart={this.handleTouchStart}
                    onWheel={this.handleWheel}
                    onClick={this.handleClick}
                    onMouseDown={this.handleMouseDown}
                    onMouseOver={this.handleMouseOver}
                    onMouseOut={this.handleMouseOut}
                    onContextMenu={this.handleContextMenu}
                    onFocus={this.handleFocusIn}
                    onBlur={this.handleFocusOut}
                />
            </BaseUI>
        );
    }
}
type LiveObjectState = { value: number; displayValue: string };
type LiveObjectEventMap = { "changeFromUI": { value: number; displayValue: string } };
export class LiveObject<D = {}, S extends Partial<LiveObjectState> & { [key: string]: any } = {}, I extends any[] = [], O extends any[] = [], A extends any[] = [], P extends Partial<Exclude<LiveUIState, "value">> & { [key: string]: any } = {}, U extends Partial<LiveUIState> & { [key: string]: any } = {}> extends BaseAudioObject<D, S & LiveObjectState, I, O, A, P & Exclude<LiveUIState, "value">, U & LiveUIState, LiveObjectEventMap> {
    static package = "live";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Ab**ton Live User ?";
    static props: TMeta["props"] = {
        min: {
            type: "number",
            default: 0,
            description: "Minimum value",
            isUIState: true
        },
        max: {
            type: "number",
            default: 127,
            description: "Maximum value",
            isUIState: true
        },
        step: {
            type: "number",
            default: 1,
            description: "Value change step",
            isUIState: true
        },
        type: {
            type: "enum",
            enums: ["enum", "float", "int"],
            default: "int",
            description: "Value type",
            isUIState: true
        },
        enum: {
            type: "object",
            default: [""],
            description: "Enum values",
            isUIState: true
        },
        active: {
            type: "boolean",
            default: true,
            description: "Active state",
            isUIState: true
        },
        focus: {
            type: "boolean",
            default: false,
            description: "Focus state",
            isUIState: true
        },
        shortName: {
            type: "string",
            default: "",
            description: "Short name to display",
            isUIState: true
        },
        longName: {
            type: "string",
            default: "",
            description: "Long name to display",
            isUIState: true
        },
        unitStyle: {
            type: "enum",
            enums: ["float", "int", "time", "hertz", "decibel", "%", "pan", "semitones", "midi", "custom", "native"],
            default: "int",
            description: "Style of unit to display",
            isUIState: true
        },
        units: {
            type: "string",
            default: "",
            description: "If unitStyle set to custom, display this as unit",
            isUIState: true
        },
        exponent: {
            type: "number",
            default: 0,
            description: "UI modulation curve, 0 for linear",
            isUIState: true
        },
        speedLim: {
            type: "number",
            default: 16,
            description: "Value output speed limit in ms",
            isUIState: true
        },
        frameRate: {
            type: "number",
            default: 60,
            description: "UI refresh rate",
            isUIState: true
        }
    };
    state = { value: 0, displayValue: "0" } as S & LiveObjectState;
    uiComponent: typeof LiveUI;
    /**
     * Get a nearest valid number
     *
     * @returns {number}
     * @memberof LiveObject
     */
    toValidValue(value: number): number {
        const min = this.box.props.min || 0;
        const max = this.box.props.max || 127;
        const step = this.box.props.step || 1;
        const v = Math.min(max, Math.max(min, value));
        return min + Math.floor((v - min) / step) * step;
    }
    toDisplayValue(value: number): string {
        const { type, unitStyle, units, enums } = this.box.props;
        return getDisplayValue(value || 0, type || "int", unitStyle || "int", units || "", enums || [""]);
    }
    validateValue() {
        this.state.value = this.toValidValue(this.state.value);
        this.state.displayValue = this.toDisplayValue(this.state.value);
    }
    onChangeFromUI(e: { value: number; displayValue: string }) {
        this.emit("changeFromUI", e);
    }
    subscribe() {
        super.subscribe();
        this.on("updateProps", (props) => {
            if (typeof props.max !== "undefined" || typeof props.min !== "undefined" || typeof props.step !== "undefined") {
                const lastValue = this.state.value;
                this.validateValue();
                if (lastValue !== this.state.value) this.updateUI({ value: this.state.value } as any);
            }
        });
    }
}
