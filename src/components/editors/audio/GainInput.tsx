import * as React from "react";
import { round } from "../../../utils/math";
import "./GainInput.scss";

interface P {
    unit: "dB" | "linear"
    gain: number;
    onAdjust?: (gain: number) => any;
    onChange?: (gain: number) => any;
    style?: React.CSSProperties;
}
interface S {
    editing: boolean;
}

export default class GainInputUI extends React.PureComponent<P, S> {
    state: S = { editing: false };
    dragged = false;
    handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (this.state.editing) return;
        this.dragged = false;
        const originalGain = this.props.gain;
        let delta = 0;
        e.stopPropagation();
        e.preventDefault();
        const originY = e.clientY;
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            this.dragged = true;
            if (e.movementY) {
                delta = (originY - e.clientY) / (this.props.unit === "dB" ? 5 : 50);
                if (this.props.onAdjust) this.props.onAdjust(originalGain + delta);
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.props.onChange) this.props.onChange(originalGain + delta);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("keydown", handleKeyDown);
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                e.preventDefault();
                if (delta && this.props.onChange) this.props.onChange(originalGain);
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                document.removeEventListener("keydown", handleKeyDown);
            }
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("keydown", handleKeyDown);
    };
    handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        if (this.state.editing) return;
        if (this.dragged) return;
        const span = e.currentTarget;
        const oldText = span.innerText;
        span.contentEditable = "true";
        this.setState({ editing: true });
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(span);
        selection.removeAllRanges();
        selection.addRange(range);
        span.focus();
        const handleBlur = async (e?: FocusEvent) => {
            if (e) e.stopPropagation();
            span.removeEventListener("blur", handleBlur);
            span.removeEventListener("keydown", handleKeyDown);
            const newText = span.innerText;
            try {
                let gain = parseFloat(newText);
                if (isNaN(gain) || !isFinite(gain)) gain = +(this.props.unit === "linear");
                if (this.props.onAdjust) this.props.onAdjust(gain);
                if (this.props.onChange) this.props.onChange(gain);
            } catch (e) {
                span.innerText = oldText;
            } finally {
                span.contentEditable = "false";
                this.setState({ editing: false });
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleBlur();
            }
            if (e.key === "Escape") {
                span.innerText = oldText;
                span.contentEditable = "false";
                this.setState({ editing: false });
                span.removeEventListener("blur", handleBlur);
                span.removeEventListener("keydown", handleKeyDown);
                span.blur();
            }
        };
        span.addEventListener("blur", handleBlur);
        span.addEventListener("keydown", handleKeyDown);
    };
    render() {
        const { unit, gain, style } = this.props;
        const classList = ["gain-input"];
        classList.push(unit === "dB" ? "gain-input-db" : "gain-input-linear");
        if (this.state.editing) classList.push("editing");
        return (
            <span className={classList.join(" ")} onClick={this.handleClick} onMouseDown={this.handleMouseDown} style={style}>
                {round(gain, 0.01) || 0}
            </span>
        );
    }
}
