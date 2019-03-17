import * as React from "react";
import { Patcher } from "../core/patcher";
import "./LineUI.scss";

export class LineUI extends React.Component {
    props: { patcher: Patcher, id: string };
    state: { selected: boolean, destPosition: { left: number, top: number }, srcPosition: { left: number, top: number }, dragging: boolean };
    refDiv = React.createRef() as React.RefObject<HTMLDivElement>;
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
        const patcherDiv = this.refDiv.current.parentElement.parentElement as HTMLDivElement;
        let patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
        const dragOffset = { x: 0, y: 0 };
        let nearest = [null, null] as [string, number];
        const line = this.props.patcher.lines[this.props.id];
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.state.dragging && (e.movementX || e.movementY)) {
                if (!this.dragged) this.dragged = true;
                dragOffset.x += e.movementX;
                dragOffset.y += e.movementY;
                if (isSrc) this.setState({ srcPosition: { left: this.state.srcPosition.left + e.movementX, top: this.state.srcPosition.top + e.movementY } });
                else this.setState({ destPosition: { left: this.state.destPosition.left + e.movementX, top: this.state.destPosition.top + e.movementY } });
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
                else this.props.patcher.lines[this.props.id][isSrc ? "setSrc" : "setDest"](nearest);
            } else {
                this.props.patcher.deleteLine(this.props.id);
            }
        };
        const handlePatcherScroll = (e: UIEvent) => {
            const movementX = patcherDiv.scrollLeft - patcherPrevScroll.left;
            const movementY = patcherDiv.scrollTop - patcherPrevScroll.top;
            dragOffset.x += movementX;
            dragOffset.y += movementY;
            patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
            if (this.state.dragging && (movementX || movementY)) {
                if (!this.dragged) this.dragged = true;
                if (isSrc) this.setState({ srcPosition: { left: this.state.srcPosition.left + movementX, top: this.state.srcPosition.top + movementY } });
                else this.setState({ destPosition: { left: this.state.destPosition.left + movementX, top: this.state.destPosition.top + movementY } });
                nearest = this.props.patcher.highlightNearestPort(isSrc, dragOffset, isSrc ? line.getDest() : line.getSrc(), isSrc ? line.getSrc() : line.getDest());
            }
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        patcherDiv.addEventListener("scroll", handlePatcherScroll);
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
            <div className={className} id={this.props.id} tabIndex={0} style={divStyle} ref={this.refDiv} onMouseDown={this.handleMouseDown} onClick={this.handleClick}>
                <svg width={divStyle.width} height={divStyle.height}>
                    <path d={d.join(" ")} ref={this.refPath} />
                </svg>
                <div className="line-handler line-handler-src" style={this.srcHandlerStyle} onMouseDown={this.handleMouseDownSrc} />
                <div className="line-handler line-handler-dest" style={this.destHandlerStyle} onMouseDown={this.handleMouseDownDest} />
            </div>
        );
    }
}

export class TempLineUI extends React.Component {
    props: { patcher: Patcher };
    state = { show: false, destPosition: { left: 0, top: 0 }, srcPosition: { left: 0, top: 0 } };
    refDiv = React.createRef() as React.RefObject<HTMLDivElement>;
    refPath = React.createRef() as React.RefObject<SVGPathElement>;
    dragged = false;
    findSrc = false;
    from = [null, null] as [string, number];
    componentDidMount() {
        this.props.patcher.on("tempLine", this.handleNewLine);
    }
    componentWillUnmount() {
        this.props.patcher.on("tempLine", this.handleNewLine);
    }
    handleNewLine = (findSrc: boolean, from: [string, number]) => {
        if (this.props.patcher._state.locked) return;
        if (this.state.show) return;
        this.findSrc = findSrc;
        this.from = from;
        const fromPosition = this.props.patcher.boxes[from[0]][findSrc ? "getInletPosition" : "getOutletPosition"](from[1]);
        this.setState({ srcPosition: fromPosition, destPosition: fromPosition });
        this.handleDraggable(findSrc);
    }
    handleDraggable = (isSrc: boolean) => {
        this.dragged = false;
        const patcherDiv = this.refDiv.current.parentElement.parentElement as HTMLDivElement;
        let patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
        const dragOffset = { x: 0, y: 0 };
        let nearest = [null, null] as [string, number];
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (e.movementX || e.movementY) {
                if (!this.dragged) this.dragged = true;
                if (!this.state.show) this.setState({ show: true });
                dragOffset.x += e.movementX;
                dragOffset.y += e.movementY;
                if (isSrc) this.setState({ srcPosition: { left: this.state.srcPosition.left + e.movementX, top: this.state.srcPosition.top + e.movementY } });
                else this.setState({ destPosition: { left: this.state.destPosition.left + e.movementX, top: this.state.destPosition.top + e.movementY } });
                nearest = this.props.patcher.highlightNearestPort(this.findSrc, dragOffset, this.from);
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
        const handlePatcherScroll = (e: UIEvent) => {
            const movementX = patcherDiv.scrollLeft - patcherPrevScroll.left;
            const movementY = patcherDiv.scrollTop - patcherPrevScroll.top;
            dragOffset.x += movementX;
            dragOffset.y += movementY;
            patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
            if (movementX || movementY) {
                if (!this.dragged) this.dragged = true;
                if (!this.state.show) this.setState({ show: true });
                if (isSrc) this.setState({ srcPosition: { left: this.state.srcPosition.left + movementX, top: this.state.srcPosition.top + movementY } });
                else this.setState({ destPosition: { left: this.state.destPosition.left + movementX, top: this.state.destPosition.top + movementY } });
                nearest = this.props.patcher.highlightNearestPort(isSrc, dragOffset, this.from);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
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
    }
    render() {
        if (!this.state.show) {
            return (
                <div className="line" id="line-temp" ref={this.refDiv} />
            );
        }
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
            <div className="line dragging" id="line-temp" tabIndex={0} style={divStyle} ref={this.refDiv}>
                <svg width={divStyle.width} height={divStyle.height}>
                    <path d={d.join(" ")} ref={this.refPath} />
                </svg>
            </div>
        );
    }
}
