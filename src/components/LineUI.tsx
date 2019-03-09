import * as React from "react";
import { Patcher } from "../core/patcher";
import "./LineUI.scss";

export class LineUI extends React.Component {
    props: { patcher: Patcher, id: string };
    state: { selected: boolean, destPosition: { left: number, top: number }, srcPosition: { left: number, top: number }, dragging: boolean };
    refPath = React.createRef() as React.RefObject<SVGPathElement>;
    srcHandlerStyle = { left: 0, top: 0 };
    destHandlerStyle = { left: 0, top: 0 };
    dragged = false;
    handleDestPosChanged = (position: { left: number, top: number }) => {
        if (this.state.destPosition.left !== position.left || this.state.destPosition.top !== position.top) {
            this.setState({ destPosition: position });
            if (this.state && this.state.selected && !this.state.dragging) this.resetHandlersPos(true);
        }
    }
    handleSrcPosChanged = (position: { left: number, top: number }) => {
        if (this.state.srcPosition.left !== position.left || this.state.srcPosition.top !== position.top) {
            if (this.state && this.state.selected && !this.state.dragging) this.resetHandlersPos(true);
            this.setState({ srcPosition: position });
        }
    }
    handleResetPos = () => {
        const line = this.props.patcher.lines[this.props.id];
        if (!line) return null;
        this.setState({ destPosition: line.destPosition, srcPosition: line.srcPosition });
        if (this.state && this.state.selected && !this.state.dragging) this.resetHandlersPos(true);
        return line;
    }
    handleSelected = (id: string) => id === this.props.id ? this.setState({ selected: true }) : null;
    handleDeselected = (id: string) => id === this.props.id ? this.setState({ selected: false }) : null;
    componentWillMount() {
        this.handleResetPos();
        this.props.patcher.deselect(this.props.id);
        this.setState({ selected: false, dragging: false });
    }
    componentDidMount() {
        const line = this.props.patcher.lines[this.props.id];
        if (!line) return;
        line.on("destPosChanged", this.handleDestPosChanged);
        line.on("srcPosChanged", this.handleSrcPosChanged);
        line.on("posChanged", this.handleResetPos);
        this.props.patcher.on("selected", this.handleSelected);
        this.props.patcher.on("deselected", this.handleDeselected);
    }
    componentWillUnmount() {
        this.props.patcher.off("selected", this.handleSelected);
        this.props.patcher.off("deselected", this.handleDeselected);
        const line = this.props.patcher.lines[this.props.id];
        if (!line) return;
        line.off("destPosChanged", this.handleDestPosChanged);
        line.off("srcPosChanged", this.handleSrcPosChanged);
        line.off("posChanged", this.handleResetPos);
    }
    resetHandlersPos = (update: boolean) => {
        if (this.refPath.current) {
            const pathLength = this.refPath.current.getTotalLength();
            const srcHandlerPoint = this.refPath.current.getPointAtLength(Math.min(10, pathLength * 0.1));
            const destHandlerPoint = this.refPath.current.getPointAtLength(Math.max(pathLength - 10, pathLength * 0.9));
            this.srcHandlerStyle = { left: srcHandlerPoint.x, top: srcHandlerPoint.y };
            this.destHandlerStyle = { left: destHandlerPoint.x, top: destHandlerPoint.y };
            if (update) this.forceUpdate();
        }
    }
    handleMouseDown = (e: React.MouseEvent) => {
        if (this.props.patcher._state.locked) return;
        this.resetHandlersPos(false);
        if (e.shiftKey) {
            if (this.state.selected) this.props.patcher.deselect(this.props.id);
            else this.props.patcher.select(this.props.id);
        } else this.props.patcher.selectOnly(this.props.id);
        e.stopPropagation();
    }
    handleMouseDownSrc = (e: React.MouseEvent) => {
        if (this.props.patcher._state.locked) return;
        this.handleDraggable(true);
        e.stopPropagation();
    }
    handleMouseDownDest = (e: React.MouseEvent) => {
        if (this.props.patcher._state.locked) return;
        this.handleDraggable(false);
        e.stopPropagation();
    }
    handleDraggable = (isSrc: boolean) => {
        this.dragged = false;
        this.setState({ dragging: true });
        const dragOffset = { x: 0, y: 0 };
        let nearest = [null, null] as [string, number];
        const handleMouseMove = (e: MouseEvent) => {
            if (this.state.dragging && (e.movementX || e.movementY)) {
                if (!this.dragged) this.dragged = true;
                dragOffset.x += e.movementX;
                dragOffset.y += e.movementY;
                if (isSrc) this.setState({ srcPosition: { left: this.state.srcPosition.left + e.movementX, top: this.state.srcPosition.top + e.movementY } });
                else this.setState({ destPosition: { left: this.state.destPosition.left + e.movementX, top: this.state.destPosition.top + e.movementY } });
                nearest = this.props.patcher.highlightNearestPort(this.props.id, isSrc, dragOffset);
            }
            e.stopPropagation();
        };
        const handleMouseUp = (e: MouseEvent) => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            e.stopPropagation();
            this.setState({ dragging: false });
            if (!this.dragged) return;
            const line = this.props.patcher.lines[this.props.id];
            if (nearest[0]) {
                this.props.patcher.boxes[nearest[0]].highlightPort(isSrc, nearest[1], false);
                if (line[isSrc ? "srcID" : "destID"] === nearest[0] && line[isSrc ? "srcOutlet" : "destInlet"] === nearest[1]) this.handleResetPos();
                else this.props.patcher.lines[this.props.id][isSrc ? "setSrc" : "setDest"](nearest);
            } else {
                this.props.patcher.deleteLine(this.props.id);
            }
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }
    handleClick = (e: React.MouseEvent) => e.stopPropagation();
    render() {
        const className = "line" + (this.state.selected ? " selected" : "") + (this.state.dragging ? " dragging" : "");
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
        const dBezier = [dStart[0], dStart[1] + Math.max(5, (divStyle.height - 20) / 5)];
        if (dBezier[1] > divStyle.height) dBezier[1] = divStyle.height;
        const d = ["M", dStart[0], dStart[1], "Q", dBezier[0], dBezier[1], ",", dMid[0], dMid[1], "T", dEnd[0], dEnd[1]];
        return (
            <div className={className} id={this.props.id} tabIndex={0} style={divStyle} onMouseDown={this.handleMouseDown} onClick={this.handleClick}>
                <svg width={divStyle.width} height={divStyle.height}>
                    <path d={d.join(" ")} ref={this.refPath} />
                </svg>
                <div className="line-handler line-handler-src" style={this.srcHandlerStyle} onMouseDown={this.handleMouseDownSrc} />
                <div className="line-handler line-handler-dest" style={this.destHandlerStyle} onMouseDown={this.handleMouseDownDest} />
            </div>
        );
    }
}
