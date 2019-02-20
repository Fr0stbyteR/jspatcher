import * as React from "react";
import { Patcher } from "../core/patcher";
import { Line } from "../core/Line";
import "./LineUI.css";

export class LineUI extends React.Component {
    props: { patcher: Patcher, id: string };
    state: { destPosition: { left: number, top: number }, srcPosition: { left: number, top: number } };
    handleChangeDestPos = (position: { left: number, top: number }) => this.setState({ destPosition: position });
    handleChangeSrcPos = (position: { left: number, top: number }) => this.setState({ srcPosition: position });
    handleResetPos = () => {
        const line = this.props.patcher.lines[this.props.id];
        if (!line) return null;
        this.setState({ destPosition: line.destPosition, srcPosition: line.srcPosition });
        return line;
    }
    componentWillMount() {
        const line = this.handleResetPos();
        if (!line) return;
        line.on("changeDestPos", this.handleChangeDestPos);
        line.on("changeSrcPos", this.handleChangeSrcPos);
        this.props.patcher.on("loaded", this.handleResetPos);
    }
    componentWillUnmount() {
        this.props.patcher.off("loaded", this.handleResetPos);
        const line = this.props.patcher.lines[this.props.id];
        if (!line) return;
        line.off("changeDestPos", this.handleChangeDestPos);
        line.off("changeSrcPos", this.handleChangeSrcPos);
    }
    render() {
        const start = this.state.srcPosition;
        const end = this.state.destPosition;
        const divStyle = {
            left: Math.min(start.left, end.left) - 5,
            top: Math.min(start.top, end.top) - 10,
            width: Math.abs(start.left - end.left) + 10,
            height: Math.abs(start.top - end.top) + 20,
        };
        const dStart = [start.left - divStyle.left, start.top - divStyle.top];
        const dMid = [divStyle.width / 2, divStyle.height / 2];
        const dEnd = [end.left - divStyle.left, end.top - divStyle.top];
        const dBezier = [dStart[0], dStart[1] + (divStyle.height - 20) / 5];
        if (dBezier[1] > divStyle.height) dBezier[1] = divStyle.height;
        const d = ["M", dStart[0], dStart[1], "Q", dBezier[0], dBezier[1], ",", dMid[0], dMid[1], "T", dEnd[0], dEnd[1]];
        return (
            <div className="line" id={this.props.id} tabIndex={0} style={divStyle}>
                <svg width={divStyle.width} height={divStyle.height}>
                    <path d={d.join(" ")} />
                </svg>
            </div>
        );
    }
}
