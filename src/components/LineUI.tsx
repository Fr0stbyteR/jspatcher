import * as React from "react";
import Patcher from "../core/Patcher";
import "./LineUI.scss";
import { TLineType } from "../core/types";

type TPosition = { left: number; top: number };
type P = { patcher: Patcher; id: string };
type S = { type: TLineType; selected: boolean; dragging: boolean; destPos: TPosition; srcPos: TPosition; srcHandlerPos: TPosition; destHandlerPos: TPosition };
export class LineUI extends React.PureComponent<P, S> {
    line = this.props.patcher.lines[this.props.id];
    state = { type: this.line.type, selected: false, dragging: false, destPos: this.line.destPos, srcPos: this.line.srcPos, srcHandlerPos: { left: 0, top: 0 }, destHandlerPos: { left: 0, top: 0 } };
    refDiv = React.createRef<HTMLDivElement>();
    refPath = React.createRef<SVGPathElement>();
    dragged = false;
    handleDestPosChanged = (position: { left: number; top: number }) => {
        const { line } = this;
        if (this.state.destPos.left !== position.left || this.state.destPos.top !== position.top) {
            this.setState({ type: line.type, destPos: position }, this.state.selected && !this.state.dragging ? () => this.setState(this.handlersPos) : null);
        }
    };
    handleSrcPosChanged = (position: { left: number; top: number }) => {
        const { line } = this;
        if (this.state.srcPos.left !== position.left || this.state.srcPos.top !== position.top) {
            this.setState({ type: line.type, srcPos: position }, this.state.selected && !this.state.dragging ? () => this.setState(this.handlersPos) : null);
        }
    };
    handleResetPos = () => {
        const { line } = this;
        this.setState({ destPos: line.destPos, srcPos: line.srcPos }, this.state.selected && !this.state.dragging ? () => this.setState(this.handlersPos) : null);
    };
    handleSelected = (ids: string[]) => (ids.indexOf(this.props.id) >= 0 ? this.setState({ selected: true }) : null);
    handleDeselected = (ids: string[]) => (ids.indexOf(this.props.id) >= 0 ? this.setState({ selected: false }) : null);
    handleTypeChanged = (type: TLineType) => this.setState({ type });
    componentDidMount() {
        const { line } = this;
        line.on("destPosChanged", this.handleDestPosChanged);
        line.on("srcPosChanged", this.handleSrcPosChanged);
        line.on("posChanged", this.handleResetPos);
        line.on("typeChanged", this.handleTypeChanged);
        this.props.patcher.on("selected", this.handleSelected);
        this.props.patcher.on("deselected", this.handleDeselected);
    }
    componentWillUnmount() {
        this.props.patcher.off("selected", this.handleSelected);
        this.props.patcher.off("deselected", this.handleDeselected);
        const { line } = this;
        line.off("destPosChanged", this.handleDestPosChanged);
        line.off("srcPosChanged", this.handleSrcPosChanged);
        line.off("posChanged", this.handleResetPos);
        line.off("typeChanged", this.handleTypeChanged);
    }
    get handlersPos() {
        if (this.refPath.current) {
            const pathLength = this.refPath.current.getTotalLength();
            const srcHandlerPoint = this.refPath.current.getPointAtLength(Math.min(10, pathLength * 0.1));
            const destHandlerPoint = this.refPath.current.getPointAtLength(Math.max(pathLength - 10, pathLength * 0.9));
            const srcHandlerPos = { left: srcHandlerPoint.x, top: srcHandlerPoint.y };
            const destHandlerPos = { left: destHandlerPoint.x, top: destHandlerPoint.y };
            return { srcHandlerPos, destHandlerPos };
        }
        return null;
    }
    handleMouseDown = (e: React.MouseEvent) => {
        if (this.props.patcher.state.locked) return;
        this.setState(this.handlersPos);
        if (e.shiftKey) {
            if (this.state.selected) this.props.patcher.deselect(this.props.id);
            else this.props.patcher.select(this.props.id);
        } else this.props.patcher.selectOnly(this.props.id);
        e.stopPropagation();
    };
    handleMouseDownSrc = (e: React.MouseEvent) => {
        if (this.props.patcher.state.locked) return;
        this.handleDraggable(e, true);
        e.stopPropagation();
    };
    handleMouseDownDest = (e: React.MouseEvent) => {
        if (this.props.patcher.state.locked) return;
        this.handleDraggable(e, false);
        e.stopPropagation();
    };
    handleDraggable = (e: React.MouseEvent, isSrc: boolean) => {
        this.dragged = false;
        this.setState({ dragging: true });
        const patcherDiv = this.refDiv.current.parentElement.parentElement as HTMLDivElement;
        const patcherRect = patcherDiv.getBoundingClientRect();
        let patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
        const lastPos = { x: e.pageX, y: e.pageY };
        const dragOffset = { x: 0, y: 0 };
        let nearest = [null, null] as [string, number];
        const { line } = this;
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            const movementX = e.pageX - lastPos.x;
            const movementY = e.pageY - lastPos.y;
            lastPos.x = e.pageX;
            lastPos.y = e.pageY;
            if (this.state.dragging && (movementX || movementY)) {
                if (!this.dragged) this.dragged = true;
                dragOffset.x += movementX;
                dragOffset.y += movementY;
                if (isSrc) this.setState({ srcPos: { left: this.state.srcPos.left + movementX, top: this.state.srcPos.top + movementY } });
                else this.setState({ destPos: { left: this.state.destPos.left + movementX, top: this.state.destPos.top + movementY } });
                nearest = this.props.patcher.highlightNearestPort(isSrc, dragOffset, isSrc ? line.getDest() : line.getSrc(), isSrc ? line.getSrc() : line.getDest());
            }
            const x = e.pageX - patcherRect.left;
            const y = e.pageY - patcherRect.top;
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
                if (!this.dragged) this.dragged = true;
                if (isSrc) this.setState({ srcPos: { left: this.state.srcPos.left + movementX, top: this.state.srcPos.top + movementY } });
                else this.setState({ destPos: { left: this.state.destPos.left + movementX, top: this.state.destPos.top + movementY } });
                nearest = this.props.patcher.highlightNearestPort(isSrc, dragOffset, isSrc ? line.getDest() : line.getSrc(), isSrc ? line.getSrc() : line.getDest());
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
                this.props.patcher.boxes[nearest[0]].highlightPort(isSrc, nearest[1], false);
                if (line[isSrc ? "srcID" : "destID"] === nearest[0] && line[isSrc ? "srcOutlet" : "destInlet"] === nearest[1]) this.handleResetPos();
                else this.props.patcher[isSrc ? "changeLineSrc" : "changeLineDest"](this.props.id, ...nearest);
            } else {
                this.props.patcher.deleteLine(this.props.id);
            }
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        patcherDiv.addEventListener("scroll", handlePatcherScroll);
    };
    handleClick = (e: React.MouseEvent) => e.stopPropagation();
    render() {
        const className = "line" + (this.state.selected ? " selected" : "") + (this.state.dragging ? " dragging" : "");
        const start = this.state.srcPos;
        const end = this.state.destPos;
        const divStyle = {
            left: Math.min(start.left, end.left) - 5,
            top: Math.min(start.top, end.top) - 10,
            width: Math.abs(start.left - end.left) + 10,
            height: Math.abs(start.top - end.top) + 20
        };
        const dStartL = start.left - divStyle.left;
        const dStartT = start.top - divStyle.top;
        const dMidL = divStyle.width * 0.5;
        const dMidT = divStyle.height * 0.5;
        const dEndL = end.left - divStyle.left;
        const dEndT = end.top - divStyle.top;
        const dBezierT = Math.min(divStyle.height, dStartT + Math.max(5, (divStyle.height - 20) * 0.2));
        const d = `M ${dStartL} ${dStartT} Q ${dStartL} ${dBezierT} ${dMidL} ${dMidT} T ${dEndL} ${dEndT}`;
        return (
            <div className={className} tabIndex={0} style={divStyle} ref={this.refDiv} onMouseDown={this.handleMouseDown} onClick={this.handleClick}>
                <svg width={divStyle.width} height={divStyle.height}>
                    <path className="normal" d={d} ref={this.refPath} />
                    {this.state.type === "audio" ? <path className="audio" d={d} /> : undefined}
                </svg>
                {this.state.selected ? <div className="line-handler line-handler-src" style={this.state.srcHandlerPos} onMouseDown={this.handleMouseDownSrc} /> : undefined}
                {this.state.selected ? <div className="line-handler line-handler-dest" style={this.state.destHandlerPos} onMouseDown={this.handleMouseDownDest} /> : undefined}
            </div>
        );
    }
}

export class TempLineUI extends React.PureComponent<{ patcher: Patcher }, { show: boolean; srcPos: TPosition; destPos: TPosition }> {
    state = { show: false, srcPos: { left: 0, top: 0 }, destPos: { left: 0, top: 0 } };
    refDiv = React.createRef<HTMLDivElement>();
    refPath = React.createRef<SVGPathElement>();
    dragged = false;
    findSrc = false;
    from = [null, null] as [string, number];
    componentDidMount() {
        this.props.patcher.on("tempLine", this.handleNewLine);
    }
    componentWillUnmount() {
        this.props.patcher.off("tempLine", this.handleNewLine);
    }
    handleNewLine = (e: { findSrc: boolean; from: [string, number] }) => {
        const { findSrc, from } = e;
        if (this.props.patcher.state.locked) return;
        if (this.state.show) return;
        this.findSrc = findSrc;
        this.from = from;
        const fromPos = this.props.patcher.boxes[from[0]][findSrc ? "getInletPos" : "getOutletPos"](from[1]);
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
            const movementX = e.pageX - lastPos.x;
            const movementY = e.pageY - lastPos.y;
            lastPos.x = e.pageX;
            lastPos.y = e.pageY;
            if (movementX || movementY) {
                if (!this.dragged) this.dragged = true;
                if (!this.state.show) this.setState({ show: true });
                dragOffset.x += movementX;
                dragOffset.y += movementY;
                if (isSrc) this.setState({ srcPos: { left: this.state.srcPos.left + movementX, top: this.state.srcPos.top + movementY } });
                else this.setState({ destPos: { left: this.state.destPos.left + movementX, top: this.state.destPos.top + movementY } });
                nearest = this.props.patcher.highlightNearestPort(this.findSrc, dragOffset, this.from);
            }
            const x = e.pageX - patcherRect.left;
            const y = e.pageY - patcherRect.top;
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
                nearest = this.props.patcher.highlightNearestPort(isSrc, dragOffset, this.from);
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (!this.dragged) return;
            if (nearest[0]) {
                this.props.patcher.boxes[nearest[0]].highlightPort(isSrc, nearest[1], false);
                this.props.patcher.createLine({ src: this.findSrc ? nearest : this.from, dest: this.findSrc ? this.from : nearest });
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
            if (!this.props.patcher.isActive) return;
            if (e.key === "Escape") {
                e.stopPropagation();
                e.preventDefault();
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
        const divStyle = {
            left: Math.min(start.left, end.left) - 5,
            top: Math.min(start.top, end.top) - 10,
            width: Math.abs(start.left - end.left) + 10,
            height: Math.abs(start.top - end.top) + 20
        };
        const dStart = [start.left - divStyle.left, start.top - divStyle.top];
        const dMid = [divStyle.width / 2, divStyle.height / 2];
        const dEnd = [end.left - divStyle.left, end.top - divStyle.top];
        const dBezier = [dStart[0], dStart[1] + Math.max(5, (divStyle.height - 20) / 5)];
        if (dBezier[1] > divStyle.height) dBezier[1] = divStyle.height;
        const d = ["M", dStart[0], dStart[1], "Q", dBezier[0], dBezier[1], ",", dMid[0], dMid[1], "T", dEnd[0], dEnd[1]];
        const dJoined = d.join(" ");
        return (
            <div className="line dragging" tabIndex={0} style={divStyle} ref={this.refDiv}>
                <svg width={divStyle.width} height={divStyle.height}>
                    <path className="normal" d={dJoined} ref={this.refPath} />
                </svg>
            </div>
        );
    }
}
