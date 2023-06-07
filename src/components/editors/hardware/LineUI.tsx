import * as React from "react";
import type { THardwareLineType } from "../../../core/hardware/types";
import type PatcherEditor from "../../../core/hardware/HardwareEditor";
import "./LineUI.scss";
import en from "../../../i18n/en";

interface TPosition {
    left: number;
    top: number;
}
interface P {
    editor: PatcherEditor;
    id: string;
    runtime?: boolean;
}
interface S {
    type: THardwareLineType;
    selected: boolean;
    dragging: boolean;
    aPos: TPosition;
    bPos: TPosition;
    aHandlerPos: TPosition;
    bHandlerPos: TPosition;
}

export default class LineUI extends React.PureComponent<P, S> {
    line = this.props.editor.lines[this.props.id];
    state = { type: this.line.type, selected: false, dragging: false, aPos: this.line.aPos, bPos: this.line.bPos, aHandlerPos: { left: 0, top: 0 }, bHandlerPos: { left: 0, top: 0 } };
    refDiv = React.createRef<HTMLDivElement>();
    refPath = React.createRef<SVGPathElement>();
    dragged = false;
    handleResetPos = () => {
        const { line } = this;
        const { aPos, bPos } = line;
        if (
            this.refDiv.current
            && aPos.left - this.state.aPos.left === bPos.left - this.state.bPos.left
            && aPos.top - this.state.aPos.top === bPos.top - this.state.bPos.top
        ) {
            const x = Math.min(aPos.left, bPos.left) - 5;
            const y = Math.min(aPos.top, bPos.top) - 10;
            this.refDiv.current.style.transform = `translate(${x}px, ${y}px)`;
            return;
        }
        this.setState({ bPos: line.bPos, aPos: line.aPos }, this.state.selected && !this.state.dragging ? () => this.setState(this.handlersPos) : null);
    };
    handleSelected = (ids: string[]) => {
        const selected = ids.indexOf(this.props.id) >= 0;
        if (this.state.selected !== selected) this.setState({ selected });
    };
    handleTypeChanged = (type: THardwareLineType) => this.setState({ type });
    componentDidMount() {
        const { line } = this;
        line.on("bPosChanged", this.handleResetPos);
        line.on("aPosChanged", this.handleResetPos);
        line.on("posChanged", this.handleResetPos);
        line.on("typeChanged", this.handleTypeChanged);
        this.props.editor.on("selected", this.handleSelected);
    }
    componentWillUnmount() {
        this.props.editor.off("selected", this.handleSelected);
        const { line } = this;
        line.off("bPosChanged", this.handleResetPos);
        line.off("aPosChanged", this.handleResetPos);
        line.off("posChanged", this.handleResetPos);
        line.off("typeChanged", this.handleTypeChanged);
    }
    get handlersPos() {
        if (this.refPath.current) {
            const pathLength = this.refPath.current.getTotalLength();
            const srcHandlerPoint = this.refPath.current.getPointAtLength(Math.min(10, pathLength * 0.1));
            const destHandlerPoint = this.refPath.current.getPointAtLength(Math.max(pathLength - 10, pathLength * 0.9));
            const aHandlerPos = { left: srcHandlerPoint.x, top: srcHandlerPoint.y };
            const bHandlerPos = { left: destHandlerPoint.x, top: destHandlerPoint.y };
            return { aHandlerPos, bHandlerPos };
        }
        return null;
    }
    handleMouseDown = (e: React.MouseEvent) => {
        if (this.props.runtime) return;
        if (this.props.editor.state.locked) return;
        this.setState(this.handlersPos);
        if (e.shiftKey) {
            if (this.state.selected) this.props.editor.deselect(this.props.id);
            else this.props.editor.select(this.props.id);
        } else this.props.editor.selectOnly(this.props.id);
        e.stopPropagation();
    };
    handleMouseDownSrc = (e: React.MouseEvent) => {
        if (this.props.runtime) return;
        if (this.props.editor.state.locked) return;
        this.handleDraggable(e, true);
        e.stopPropagation();
    };
    handleMouseDownDest = (e: React.MouseEvent) => {
        if (this.props.runtime) return;
        if (this.props.editor.state.locked) return;
        this.handleDraggable(e, false);
        e.stopPropagation();
    };
    handleDraggable = (e: React.MouseEvent, isSrc: boolean) => {
        this.dragged = false;
        this.setState({ dragging: true });
        const patcherDiv = this.refDiv.current.parentElement.parentElement as HTMLDivElement;
        const patcherRect = patcherDiv.getBoundingClientRect();
        let patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
        const lastPos = { x: e.clientX, y: e.clientY };
        const dragOffset = { x: 0, y: 0 };
        let nearest = [null, null] as [string, number];
        const { line } = this;
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            const movementX = e.clientX - lastPos.x;
            const movementY = e.clientY - lastPos.y;
            lastPos.x = e.clientX;
            lastPos.y = e.clientY;
            if (this.state.dragging && (movementX || movementY)) {
                if (!this.dragged) this.dragged = true;
                dragOffset.x += movementX;
                dragOffset.y += movementY;
                if (isSrc)
                    this.setState({ aPos: { left: this.state.aPos.left + movementX, top: this.state.aPos.top + movementY } });
                else
                    this.setState({ bPos: { left: this.state.bPos.left + movementX, top: this.state.bPos.top + movementY } });
                nearest = this.props.editor.highlightNearestPort(isSrc, dragOffset, isSrc ? line.getB() : line.getA(), isSrc ? line.getA() : line.getB());
            }
            const x = e.clientX - patcherRect.left;
            const y = e.clientY - patcherRect.top;
            if (x < 10) patcherDiv.scrollLeft += x - 10;
            if (x > patcherRect.width - 10) patcherDiv.scrollLeft += x + 10 - patcherRect.width;
            if (y < 10) patcherDiv.scrollTop += y - 10;
            if (y > patcherRect.height - 10) patcherDiv.scrollTop += y + 10 - patcherRect.height;
        };
        const handlePatcherScroll = (e: UIEvent) => {
            const movementX = patcherDiv.scrollLeft - patcherPrevScroll.left;
            const movementY = patcherDiv.scrollTop - patcherPrevScroll.top;
            dragOffset.x += movementX;
            dragOffset.y += movementY;
            patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
            if (this.state.dragging && (movementX || movementY)) {
                if (!this.dragged)
                    this.dragged = true;
                if (isSrc)
                    this.setState({ aPos: { left: this.state.aPos.left + movementX, top: this.state.aPos.top + movementY } });
                else
                    this.setState({ bPos: { left: this.state.bPos.left + movementX, top: this.state.bPos.top + movementY } });
                nearest = this.props.editor.highlightNearestPort(isSrc, dragOffset, isSrc ? line.getB() : line.getA(), isSrc ? line.getA() : line.getB());
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            patcherDiv.removeEventListener("scroll", handlePatcherScroll);
            this.setState({ dragging: false });
            if (!this.dragged) return;
            if (nearest[0]) {
                this.props.editor.unhighlightPort();
                if (line[isSrc ? "aId" : "bId"] === nearest[0] && line[isSrc ? "aIo" : "bIo"][1] === nearest[1])
                    this.handleResetPos();
                else
                    this.props.editor[isSrc ? "changeLineA" : "changeLineB"](this.props.id, ...nearest);
            } else {
                this.props.editor.deleteLine(this.props.id);
            }
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        patcherDiv.addEventListener("scroll", handlePatcherScroll);
    };
    handleClick = (e: React.MouseEvent) => e.stopPropagation();
    render() {
        const className = "line" + (this.state.selected ? " selected" : "") + (this.state.dragging ? " dragging" : "");
        const { left: startLeft, top: startTop } = this.state.aPos;
        const { left: endLeft, top: endTop } = this.state.bPos;

        const startEdge = this.props.editor.boxes[this.line.getA()[0]].ios[this.line.getA()[1]].edge;
        const endEdge = this.props.editor.boxes[this.line.getB()[0]].ios[this.line.getB()[1]].edge;
        const isVerticalStart = startEdge === 'B' || startEdge === 'T';
        const isVerticalEnd = endEdge === 'B' || endEdge === 'T';

        const divStyle = {
            left: Math.min(startLeft, endLeft) - 5,
            top: Math.min(startTop, endTop) - 10,
            width: Math.abs(startLeft - endLeft) + 10,
            height: Math.abs(startTop - endTop) + 20
        };

        const dStart = { left: startLeft - divStyle.left, top: startTop - divStyle.top };
        const dMid = { left: divStyle.width * 0.5, top: divStyle.height * 0.5 };
        const dEnd = { left: endLeft - divStyle.left, top: endTop - divStyle.top };

        let dBezierStart;
        if (isVerticalStart) {
            dBezierStart = { left: dStart.left, top: dStart.top + Math.max(5, (divStyle.height - 20) * 0.2) };
            if (dBezierStart.top > divStyle.height) dBezierStart.top = divStyle.height;
        } else {
            dBezierStart = { left: dStart.left + Math.max(5, (divStyle.width - 20) * 0.2), top: dStart.top };
            if (dBezierStart.left > divStyle.width) dBezierStart.left = divStyle.width;
        }

        let dBezierEnd;
        if (isVerticalEnd) {
            dBezierEnd = { left: dEnd.left, top: dEnd.top - Math.max(5, (divStyle.height - 20) * 0.2) };
            if (dBezierEnd.top < 0) dBezierEnd.top = 0;
        } else {
            dBezierEnd = { left: dEnd.left - Math.max(5, (divStyle.width - 20) * 0.2), top: dEnd.top };
            if (dBezierEnd.left < 0) dBezierEnd.left = 0;
        }

        const d = `M ${dStart.left} ${dStart.top} Q ${dBezierStart.left} ${dBezierStart.top} ${dMid.left} ${dMid.top} Q ${dBezierEnd.left} ${dBezierEnd.top} ${dEnd.left} ${dEnd.top}`;

        return (
            <div className={className} tabIndex={0} data-id={this.props.id} style={{ transform: `translate(${divStyle.left}px, ${divStyle.top}px)` }} ref={this.refDiv} onMouseDown={this.handleMouseDown} onClick={this.handleClick}>
                <svg width={divStyle.width} height={divStyle.height}>
                    <path className="normal" d={d} ref={this.refPath} />
                    {/* {this.state.type === "audio" ? <path className="audio" d={d} /> : undefined} */}
                </svg>
                {this.state.selected ? <div className="line-handler line-handler-src" style={this.state.aHandlerPos} onMouseDown={this.handleMouseDownSrc} /> : undefined}
                {this.state.selected ? <div className="line-handler line-handler-dest" style={this.state.bHandlerPos} onMouseDown={this.handleMouseDownDest} /> : undefined}
            </div>
        );
    }
}

export class TempLineUI extends React.PureComponent<{ editor: PatcherEditor }, { show: boolean; srcPos: TPosition; destPos: TPosition }> {
    state = { show: false, srcPos: { left: 0, top: 0 }, destPos: { left: 0, top: 0 } };
    refDiv = React.createRef<HTMLDivElement>();
    refPath = React.createRef<SVGPathElement>();
    dragged = false;
    findSrc = false;
    from = [null, null] as [string, number];
    componentDidMount() {
        this.props.editor.on("tempLine", this.handleNewLine);
    }
    componentWillUnmount() {
        this.props.editor.off("tempLine", this.handleNewLine);
    }
    handleNewLine = (e: { findSrc: boolean; from: [string, number] }) => {
        const { findSrc, from } = e;
        if (this.props.editor.state.locked) return;
        if (this.state.show) return;
        this.findSrc = findSrc;
        this.from = from;
        // const fromPos = this.props.editor.boxes[from[0]][findSrc ? "getInletPos" : "getOutletPos"](from[1]);
        const fromPos = this.props.editor.boxes[from[0]].getIoPos(from[1]);
        this.setState({ srcPos: fromPos, destPos: fromPos });
        this.handleDraggable(findSrc, fromPos);
    };
    handleDraggable = (isSrc: boolean, pos: { top: number; left: number }) => {
        this.dragged = false;
        const patcherDiv = this.refDiv.current.parentElement.parentElement as HTMLDivElement;
        const patcherRect = patcherDiv.getBoundingClientRect();
        let patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
        const lastPos = { x: pos.left + patcherRect.left - patcherPrevScroll.left, y: pos.top + patcherRect.top - patcherPrevScroll.top };
        const dragOffset = { x: 0, y: 0 };
        let nearest = [null, null] as [string, number];
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            const movementX = e.clientX - lastPos.x;
            const movementY = e.clientY - lastPos.y;
            lastPos.x = e.clientX;
            lastPos.y = e.clientY;
            if (movementX || movementY) {
                if (!this.dragged) this.dragged = true;
                if (!this.state.show) this.setState({ show: true });
                dragOffset.x += movementX;
                dragOffset.y += movementY;
                if (isSrc) this.setState({ srcPos: { left: this.state.srcPos.left + movementX, top: this.state.srcPos.top + movementY } });
                else this.setState({ destPos: { left: this.state.destPos.left + movementX, top: this.state.destPos.top + movementY } });
                nearest = this.props.editor.highlightNearestPort(this.findSrc, dragOffset, this.from);
            }
            const x = e.clientX - patcherRect.left;
            const y = e.clientY - patcherRect.top;
            if (x < 10) patcherDiv.scrollLeft += x - 10;
            if (x > patcherRect.width - 10) patcherDiv.scrollLeft += x + 10 - patcherRect.width;
            if (y < 10) patcherDiv.scrollTop += y - 10;
            if (y > patcherRect.height - 10) patcherDiv.scrollTop += y + 10 - patcherRect.height;
        };
        const handlePatcherScroll = (e: UIEvent) => {
            const movementX = patcherDiv.scrollLeft - patcherPrevScroll.left;
            const movementY = patcherDiv.scrollTop - patcherPrevScroll.top;
            dragOffset.x += movementX;
            dragOffset.y += movementY;
            patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
            if (movementX || movementY) {
                if (!this.dragged) this.dragged = true;
                if (!this.state.show) this.setState({ show: true });
                if (isSrc) this.setState({ srcPos: { left: this.state.srcPos.left + movementX, top: this.state.srcPos.top + movementY } });
                else this.setState({ destPos: { left: this.state.destPos.left + movementX, top: this.state.destPos.top + movementY } });
                nearest = this.props.editor.highlightNearestPort(isSrc, dragOffset, this.from);
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (!this.dragged) return;
            if (nearest[0]) {
                this.props.editor.unhighlightPort();
                this.props.editor.unBubblePorts();
                this.props.editor.createLine({ aIo: this.findSrc ? nearest : this.from, bIo: this.findSrc ? this.from : nearest });
            }
            if (!e.shiftKey) {
                this.setState({ show: false });
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                document.removeEventListener("keydown", handleKeyDown);
                patcherDiv.removeEventListener("scroll", handlePatcherScroll);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!this.props.editor.isActive) return;
            if (e.key === "Escape") {
                e.stopPropagation();
                e.preventDefault();
                this.props.editor.unBubblePorts();
                this.setState({ show: false });
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                document.removeEventListener("keydown", handleKeyDown);
                patcherDiv.removeEventListener("scroll", handlePatcherScroll);
            }
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("keydown", handleKeyDown);
        patcherDiv.addEventListener("scroll", handlePatcherScroll);
    };
    render() {
        if (!this.state.show) {
            return (
                <div className="line" ref={this.refDiv} />
            );
        }

        const start = this.state.srcPos;
        const end = this.state.destPos;
        const startEdge = this.props.editor.boxes[this.from[0]].ios[this.from[1]].edge;
        const isVerticalStart = startEdge === 'T' || startEdge === 'B'; // true if the line is more vertical, false otherwise
        const isVerticalEnd = true; // true if the line is more vertical, false otherwise

        const divStyle = {
            left: Math.min(start.left, end.left) - 5,
            top: Math.min(start.top, end.top) - 10,
            width: Math.abs(start.left - end.left) + 10,
            height: Math.abs(start.top - end.top) + 20
        };
        const dStart = [start.left - divStyle.left, start.top - divStyle.top];
        const dMid = [divStyle.width / 2, divStyle.height / 2];
        const dEnd = [end.left - divStyle.left, end.top - divStyle.top];

        let dBezierStart;
        if (isVerticalStart) {
            dBezierStart = [dStart[0], dStart[1] + Math.max(5, (divStyle.height - 20) / 5)];
            if (dBezierStart[1] > divStyle.height) dBezierStart[1] = divStyle.height;
        } else {
            dBezierStart = [dStart[0] + Math.max(5, (divStyle.width - 20) / 5), dStart[1]];
            if (dBezierStart[0] > divStyle.width) dBezierStart[0] = divStyle.width;
        }

        let dBezierEnd;
        if (isVerticalEnd) {
            dBezierEnd = [dEnd[0], dEnd[1] - Math.max(5, (divStyle.height - 20) / 5)];
            if (dBezierEnd[1] < 0) dBezierEnd[1] = 0;
        } else {
            dBezierEnd = [dEnd[0] - Math.max(5, (divStyle.width - 20) / 5), dEnd[1]];
            if (dBezierEnd[0] < 0) dBezierEnd[0] = 0;
        }

        const d = ["M", dStart[0], dStart[1], "Q", dBezierStart[0], dBezierStart[1], ",", dMid[0], dMid[1], "Q", dBezierEnd[0], dBezierEnd[1], ",", dEnd[0], dEnd[1]];
        const dJoined = d.join(" ");
        // console.log(dJoined);
        return (
            <div className="line dragging" tabIndex={0} style={divStyle} ref={this.refDiv}>
                <svg width={divStyle.width} height={divStyle.height}>
                    <path className="normal" d={dJoined} ref={this.refPath} />
                </svg>
            </div>
        );
    }
}
