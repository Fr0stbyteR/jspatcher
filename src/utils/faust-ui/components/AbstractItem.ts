/* eslint-disable @typescript-eslint/no-unused-vars */
import { FaustUIItemStyle, FaustUIItemProps, PointerDownEvent, PointerDragEvent, PointerUpEvent } from "./types";
import "./Base.scss";
import { AbstractComponent } from "./AbstractComponent";
import { normExp, normLog } from "./utils";

/**
 * Abstract class that describes a FaustUI Component
 * this is an event emitter that emits every state change to inform UI renderer parts
 * Each UI parts could subscribe to a specific state such as `value`, `min`, `max` or `style`
 * when the event subscribed is fired, this part of ui updated using its own handler without updating the rest of UI parts
 * the types of events is restricted to the same as keys of `state` object:
 * `state` object is a `FaustUIItemProps` with a `style` object that contains `T` defined by child class.
 * Child class can override life cycle methods
 * `componentWillMount` prepare data before DOM get loads to page
 * `mount` get DOMs append to page
 * `componentDidMount` Now draw canvas etc.
 *
 * @export
 * @abstract
 * @class AbstractItem
 * @extends {EventEmitter}
 * @template T
 */
export abstract class AbstractItem<T extends FaustUIItemStyle> extends AbstractComponent<FaustUIItemProps<T>> {
    /**
     * The default state of the component.
     *
     * @static
     * @type {FaustUIItemProps<FaustUIItemStyle>}
     * @memberof AbstractItem
     */
    static defaultProps: FaustUIItemProps<FaustUIItemStyle> = {
        value: 0,
        active: true,
        focus: false,
        label: "",
        address: "",
        min: 0,
        max: 1,
        enums: {},
        type: "float",
        unit: "",
        scale: "linear",
        step: 0.01,
        style: { width: 45, height: 15, left: 0, top: 0, labelcolor: "rgba(226, 222, 255, 0.5)" }
    };
    /**
     * DOM Div container of the component
     *
     * @type {HTMLDivElement}
     * @memberof AbstractItem
     */
    container: HTMLDivElement;
    /**
     * DOM Div container of label canvas
     *
     * @type {HTMLDivElement}
     * @memberof AbstractItem
     */
    label: HTMLDivElement;
    /**
     * Use canvas as label to fit full text in.
     *
     * @type {HTMLCanvasElement}
     * @memberof AbstractItem
     */
    labelCanvas: HTMLCanvasElement;
    labelCtx: CanvasRenderingContext2D;
    /**
     * Override this to get css work
     *
     * @type {string}
     * @memberof AbstractItem
     */
    className: string;
    frameReduce = 3;
    /**
     * Default DOM event listeners, unify mousedown and touchstart events
     * For mouse or touch events, please use `handlePointerDown` `handlePointerUp` `handlePointerDrag` callbacks
     */
    handleKeyDown = (e: KeyboardEvent) => {};
    handleKeyUp = (e: KeyboardEvent) => {};
    handleTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
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
    handleWheel = (e: WheelEvent) => {};
    handleClick = (e: MouseEvent) => {};
    handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        (e.currentTarget as HTMLElement).focus();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
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
    handleMouseOver = (e: MouseEvent) => {};
    handleMouseOut = (e: MouseEvent) => {};
    handleContextMenu = (e: MouseEvent) => {};
    handlePointerDown = (e: PointerDownEvent) => {};
    handlePointerDrag = (e: PointerDragEvent) => {};
    handlePointerUp = (e: PointerUpEvent) => {};
    handleFocusIn = (e: FocusEvent) => this.setState({ focus: true });
    handleFocusOut = (e: FocusEvent) => this.setState({ focus: false });

    /**
     * Initiate default state with incoming state.
     * @param {FaustUIItemProps<T>} [props]
     * @memberof AbstractItem
     */
    constructor(props?: FaustUIItemProps<T>) {
        super(props);
        this.state.style = { ...this.defaultProps.style, ...props.style };
        if (this.state.emitter) this.state.emitter.register(this.state.address, this);
        return this;
    }
    /**
     * Get a nearest valid number
     *
     * @param {number} value
     * @returns {number}
     * @memberof AbstractItem
     */
    toValidNumber(value: number): number {
        const { min, max, step } = this.state;
        if (typeof min !== "number" || typeof max !== "number") return value;
        const v = Math.min(max, Math.max(min, value));
        if (!step) return v;
        return min + Math.floor((v - min) / step) * step;
    }
    /**
     * Use this method if you want the emitter to send value to DSP
     *
     * @param {number} valueIn
     * @returns {boolean}
     * @memberof AbstractItem
     */
    setValue(valueIn: number): boolean {
        const value = this.toValidNumber(valueIn);
        const changed = this.setState({ value });
        if (changed) this.change(value);
        return changed;
    }
    /**
     * Send value to DSP
     *
     * @param {number} [valueIn]
     * @memberof AbstractItem
     */
    change(valueIn?: number) {
        if (this.state.emitter) this.state.emitter.paramChangeByUI(this.state.address, typeof valueIn === "number" ? valueIn : this.state.value);
    }
    /**
     * set internal state and fire events for UI parts subscribed
     * This will not send anything to DSP
     *
     * @param {{ [key in keyof FaustUIItemProps<T>]?: FaustUIItemProps<T>[key] }} newState
     * @returns {boolean} - is state updated
     * @memberof AbstractItem
     */
    setState(newState: { [key in keyof FaustUIItemProps<T>]?: FaustUIItemProps<T>[key] }): boolean {
        let shouldUpdate = false;
        for (const key in newState) {
            const stateKey = key as keyof FaustUIItemProps<T>;
            const stateValue = newState[stateKey];
            if (stateKey === "style") {
                for (const styleKey in newState.style) {
                    if (styleKey in this.state.style && this.state.style[styleKey] !== newState.style[styleKey]) {
                        this.state.style[styleKey] = newState.style[styleKey];
                        shouldUpdate = true;
                    }
                }
            } else if (stateKey in this.state && this.state[stateKey] !== stateValue) {
                (this.state as any)[stateKey] = stateValue;
                shouldUpdate = true;
            } else return false;
            if (shouldUpdate) this.emit(stateKey, this.state[stateKey]);
        }
        return shouldUpdate;
    }
    /**
     * Create container with class name
     * override it with `super.componentWillMount();`
     *
     * @returns {this}
     * @memberof AbstractItem
     */
    componentWillMount(): this {
        this.container = document.createElement("div");
        this.container.className = ["faust-ui-component", "faust-ui-component-" + this.className].join(" ");
        this.container.tabIndex = 1;
        this.container.id = this.state.address;
        if (this.state.tooltip) this.container.title = this.state.tooltip;
        this.label = document.createElement("div");
        this.label.className = "faust-ui-component-label";
        this.labelCanvas = document.createElement("canvas");
        this.labelCtx = this.labelCanvas.getContext("2d");
        return this;
    }
    /**
     * Here append all child DOM to container
     *
     * @returns {this}
     * @memberof AbstractItem
     */
    mount(): this {
        this.label.appendChild(this.labelCanvas);
        return this;
    }
    paintLabel(align?: CanvasTextAlign): this {
        const label = this.state.label;
        const color = this.state.style.labelcolor;
        const ctx = this.labelCtx;
        const canvas = this.labelCanvas;
        let { width, height } = this.label.getBoundingClientRect();
        if (!width || !height) return this;
        width = Math.floor(width);
        height = Math.floor(height);
        canvas.height = height;
        canvas.width = width;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = color;
        ctx.textBaseline = "middle";
        ctx.textAlign = align || "center";
        ctx.font = `bold ${height * 0.9}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
        ctx.fillText(label, align === "left" ? 0 : align === "right" ? width : width / 2, height / 2, width);
        return this;
    }
    /**
     * will call this method when mounted
     *
     * @returns {this}
     * @memberof AbstractItem
     */
    componentDidMount(): this {
        const handleResize = () => {
            const { grid, left, top, width, height } = this.state.style;
            this.container.style.width = `${width * grid}px`;
            this.container.style.height = `${height * grid}px`;
            this.container.style.left = `${left * grid}px`;
            this.container.style.top = `${top * grid}px`;
            this.label.style.height = `${grid * 0.25}px`;
            this.paintLabel();
        };
        this.on("style", () => this.schedule(handleResize));
        handleResize();
        return this;
    }
    /**
     * Count steps in range min-max with step
     *
     * @readonly
     * @memberof AbstractItem
     */
    get stepsCount() {
        const { type, max, min, step, enums } = this.state;
        const maxSteps = type === "enum" ? enums.length : type === "int" ? max - min : (max - min) / step;
        if (step) {
            if (type === "enum") return enums.length;
            if (type === "int") return Math.min(Math.floor((max - min) / (Math.round(step) || 1)), maxSteps);
            return Math.floor((max - min) / step);
        }
        return maxSteps;
    }
    /**
     * Normalized value between 0 - 1.
     *
     * @readonly
     * @memberof AbstractItem
     */
    get distance() {
        const { type, max, min, value, enums, scale } = this.state;
        return AbstractItem.getDistance({ type, max, min, value, enums, scale });
    }
    static getDistance(state: { value: number; min: number; max: number; enums?: { [key: string]: number }; type: "enum" | "int" | "float"; scale: "linear" | "exp" | "log" }) {
        const { type, max, min, value, enums, scale } = state;
        const normalized = type === "enum" ? value / (enums.length - 1) : (value - min) / (max - min);
        return scale === "exp" ? normLog(normalized) : scale === "log" ? normExp(normalized) : normalized;
    }
    /**
     * Mousemove pixels for each step
     *
     * @readonly
     * @memberof AbstractItem
     */
    get stepRange() {
        const full = 100;
        const stepsCount = this.stepsCount;
        return full / stepsCount;
    }
}
