import * as React from "react";
import { toMIDI } from "../../../utils";
import { BaseAudioObject, BaseUI, BaseUIAdditionalState } from "../Base";
import { TMeta, BaseUIState } from "../../types";

type LiveUIState = LiveUIProps & BaseUIState & BaseUIAdditionalState;
export class LiveUI<T extends Partial<LiveUIProps> & { [key: string]: any } = {}> extends BaseUI<LiveObject, T & LiveUIProps, T & LiveUIProps> {
    // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
    state: T & LiveUIState = {
        ...this.state,
        value: this.props.value || 0,
        min: this.props.min || 0,
        max: typeof this.props.max === "number" ? this.props.max : 127,
        step: this.props.step || 0,
        type: this.props.type || "int",
        enum: this.props.enum || [] as string[],
        active: typeof this.props.active === "boolean" ? this.props.active : true,
        focus: this.props.focus || false,
        width: this.props.width || 15,
        height: this.props.height || 15,
        shortName: this.props.shortName || "",
        longName: this.props.longName || "",
        unitStyle: this.props.unitStyle || "int",
        units: this.props.units || "",
        exponent: this.props.exponent || 0,
        speedLim: this.props.speedLim || 16,
        frameRate: this.props.frameRate || 60,
        onChange: this.props.onChange || (() => {})
    };
    refCanvas = React.createRef<HTMLCanvasElement>();
    className: string;
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
    handleTouchStart = (e: React.TouchEvent) => {
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
    handleMouseDown = (e: React.MouseEvent) => {
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
    get displayValue() {
        const { value, type, unitStyle, units } = this.state;
        if (type === "enum") return this.state.enum[value];
        if (unitStyle === "int") return value.toFixed(0);
        if (unitStyle === "float") return value.toFixed(2);
        if (unitStyle === "time") return value.toFixed(type === "int" ? 0 : 2) + " ms";
        if (unitStyle === "hertz") return value.toFixed(type === "int" ? 0 : 2) + " Hz";
        if (unitStyle === "decibel") return value.toFixed(type === "int" ? 0 : 2) + " dB";
        if (unitStyle === "%") return value.toFixed(type === "int" ? 0 : 2) + " %";
        if (unitStyle === "pan") return value === 0 ? "C" : (type === "int" ? Math.abs(value) : Math.abs(value).toFixed(2)) + (value < 0 ? " L" : " R");
        if (unitStyle === "semitones") return value.toFixed(type === "int" ? 0 : 2) + " st";
        if (unitStyle === "midi") return toMIDI(value);
        if (unitStyle === "custom") return value.toFixed(type === "int" ? 0 : 2) + " " + units;
        if (unitStyle === "native") return value.toFixed(type === "int" ? 0 : 2);
        return "N/A";
    }
    setValue(value: number) {
        this.setState({ value });
    }
    changeCallback = () => {
        this.state.onChange({ value: this.state.value, displayValue: this.displayValue });
        this.$changeTimer = -1;
    }
    scheduleChangeHandler() {
        if (this.$changeTimer === -1) this.$changeTimer = window.setTimeout(this.changeCallback, this.state.speedLim);
    }
    paintCallback = () => {
        this.paint();
        this.$paintRaf = -1 * Math.round(Math.abs(60 / this.state.frameRate)) || -1;
    }
    noPaintCallback = () => {
        this.$paintRaf++;
    }
    schedulePaint() {
        if (this.$paintRaf === -1) this.$paintRaf = requestAnimationFrame(this.paintCallback);
        else if (this.$paintRaf < -1) this.$paintRaf = requestAnimationFrame(this.noPaintCallback);
    }
    componentDidMount() {
        this.schedulePaint();
    }
    componentDidUpdate() {
        this.schedulePaint();
    }
    paint() {}
    render() {
        return (
            <canvas
                ref={this.refCanvas}
                className={["live-component", this.className].join(" ")}
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
        );
    }
}
type LiveObjectState = { value: number };
export class LiveObject<D = {}, S extends Partial<LiveObjectState> & { [key: string]: any } = {}, I extends any[] = [], O extends any[] = [], A extends any[] = [], P extends Partial<LiveUIState> & { [key: string]: any } = {}, U extends Partial<LiveUIState> & { [key: string]: any } = {}> extends BaseAudioObject<D, S & LiveObjectState, I, O, A, P & LiveUIState, U & LiveUIState> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            package: "live",
            author: "Fr0stbyteR",
            version: "1.0.0",
            description: "Ab**ton Live User ?",
            props: [...super.meta.props, {
                name: "value",
                type: "number",
                default: 0,
                description: "Value",
                isUIState: true
            }, {
                name: "min",
                type: "number",
                default: 0,
                description: "Minimum value",
                isUIState: true
            }, {
                name: "max",
                type: "number",
                default: 127,
                description: "Maximum value",
                isUIState: true
            }, {
                name: "step",
                type: "number",
                default: 0,
                description: "Value change step",
                isUIState: true
            }]
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
    state = { value: 0 } as S & LiveObjectState;
    uiComponent: typeof LiveUI;
}
