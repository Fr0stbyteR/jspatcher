import * as React from "react";
import { convertSampleToUnit, convertUnitToSample } from "../utils/utils";
import { UnitOptions, TUnit } from "../core/types";
import "./TimeInput.scss";

interface Props extends UnitOptions {
    unit: TUnit;
    samples: number;
    sampleRate: number;
    style?: React.CSSProperties;
    onChange?: (samples: number) => any;
}
interface State {
    editing: boolean;
}

export default class TimeInputUI extends React.PureComponent<Props, State> {
    state: State = { editing: false };
    dragged = false;
    handleMouseDown = (e: React.MouseEvent<HTMLSpanElement>) => {
        if (this.state.editing) return;
        e.stopPropagation();
        e.preventDefault();
        this.dragged = false;
        const originX = e.clientX;
        const { samples, unit, sampleRate, bpm } = this.props;
        const deltaMultiplier = unit === "measure" ? sampleRate * bpm / 60 : sampleRate / 10;
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            this.dragged = true;
            const delta = e.clientX - originX;
            if (e.movementX && this.props.onChange) this.props.onChange(samples + delta * deltaMultiplier);
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        if (this.state.editing) return;
        if (this.dragged) return;
        const span = e.currentTarget;
        const { unit, sampleRate, bpm, beatsPerMeasure, division } = this.props;
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
                const s = Math.round(convertUnitToSample(newText, unit, { sampleRate, bpm, beatsPerMeasure, division }));
                if (this.props.onChange) this.props.onChange(s);
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
        const { samples, unit, sampleRate, bpm, beatsPerMeasure, division } = this.props;
        return (
            <span className={"time-input" + (this.state.editing ? " editing" : "")} onClick={this.handleClick} onMouseDown={this.handleMouseDown} style={this.props.style}>
                {convertSampleToUnit(samples, unit, { sampleRate, bpm, beatsPerMeasure, division }).str}
            </span>
        );
    }
}
