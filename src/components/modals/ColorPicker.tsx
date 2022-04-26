import * as React from "react";
import { ColorResult, ChromePicker } from "react-color";

interface P {
    onChange?: (value: string) => any;
    onChangeComplete?: (value: string) => any;
    disableAlpha?: boolean;
    color: string;
}
interface S {
    showColorPicker: boolean;
    colorPickerY: number;
    color: string;
}
export default class ColorPicker extends React.PureComponent<P, S> {
    state = { showColorPicker: false, colorPickerY: 0, color: this.props.color };
    handleClickColorSpan = (e: React.MouseEvent) => {
        if (this.state.showColorPicker) return;
        this.setState({ showColorPicker: true, colorPickerY: e.clientY });
    };
    handleClickCover = (e: React.MouseEvent) => {
        this.setState({ showColorPicker: false });
        e.stopPropagation();
    };
    handleChangeColor = (e: ColorResult) => {
        const colorResult = e.rgb;
        const color = `rgba(${colorResult.r}, ${colorResult.g}, ${colorResult.b}, ${colorResult.a})`;
        this.setState({ color });
        this.props.onChange?.(color);
    };
    handleChangeCompleteColor = (e: ColorResult) => {
        const colorResult = e.rgb;
        const color = `rgba(${colorResult.r}, ${colorResult.g}, ${colorResult.b}, ${colorResult.a})`;
        this.props.onChangeComplete?.(color);
    };
    handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };
    componentDidMount() {
        this.setState({ color: this.props.color });
    }
    render() {
        const spanStyle: React.CSSProperties = {
            position: "relative",
            width: "40px",
            height: "18px",
            cursor: "pointer",
            display: "inline-block",
            border: "3px solid whitesmoke",
            borderRadius: "4px",
            lineHeight: "12px",
            verticalAlign: "middle"
        };
        const coverStyle: React.CSSProperties = {
            position: "fixed",
            top: "0px",
            right: "0px",
            bottom: "0px",
            left: "0px",
            zIndex: 1,
            cursor: "auto"
        };
        return (
            <>
                <span style={{ ...spanStyle, backgroundColor: this.props.color }} onClick={this.handleClickColorSpan} onKeyDown={this.handleKeyDown}>
                    {
                        this.state.showColorPicker
                            ? <div style={{ position: "absolute", margin: "15px 0px" }}>
                                <div className="color-picker-fullscreen-cover" style={coverStyle} onClick={this.handleClickCover} />
                                <div style={{ margin: window.innerHeight - this.state.colorPickerY < 220 ? "-220px -3px" : "5px -3px" }}>
                                    <ChromePicker styles={{ default: { picker: { position: "absolute", cursor: "auto", width: "150px", zIndex: 1200 } } }} color={this.state.color} disableAlpha={this.props.disableAlpha} onChange={this.handleChangeColor} onChangeComplete={this.handleChangeCompleteColor} />
                                </div>
                            </div>
                            : <></>
                    }
                </span>
            </>
        );
    }
}
