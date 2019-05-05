import * as React from "react";
import Patcher from "../core/Patcher";
import Box from "../core/Box";
import Line from "../core/Line";
import "./PatcherUI.scss";
import BoxUI from "./BoxUI";
import { LineUI, TempLineUI } from "./LineUI";
import { TPatcher } from "../core/types";

export default class PatcherUI extends React.Component {
    props: { patcher: Patcher };
    state: { locked: boolean; presentation: boolean; showGrid: boolean; bgcolor: [number, number, number, number]; editing_bgcolor: [number, number, number, number] };
    refDiv: React.RefObject<HTMLDivElement> = React.createRef();
    refGrid: React.RefObject<Grid> = React.createRef();
    refBoxes: React.RefObject<Boxes> = React.createRef();
    refLines: React.RefObject<Lines> = React.createRef();
    size = { width: 0, height: 0 };
    handleLoaded = () => {
        this.setState({ bgcolor: this.props.patcher.props.bgcolor, editing_bgcolor: this.props.patcher.props.editing_bgcolor });
        const grid = this.refGrid.current;
        const boxes = this.refBoxes.current;
        const lines = this.refLines.current;
        [grid, boxes, lines].forEach(el => el.setState({ width: "unset", height: "unset" }));
    }
    handleLockedChange = (e: boolean) => this.setState({ locked: e });
    handlePresentationChange = (e: boolean) => this.setState({ presentation: e });
    handleShowGridChange = (e: boolean) => this.setState({ showGrid: e });
    handleScroll = (e: React.UIEvent) => {
        const grid = this.refGrid.current;
        const boxes = this.refBoxes.current;
        const lines = this.refLines.current;
        const div = e.target as HTMLDivElement;
        let shouldUpdate = false;
        if (div.scrollWidth !== this.size.width || div.scrollHeight !== this.size.height) {
            shouldUpdate = true;
            this.size.width = div.scrollWidth;
            this.size.height = div.scrollHeight;
        }
        if (shouldUpdate) [grid, boxes, lines].forEach(el => el.setState({ width: this.size.width + "px", height: this.size.height + "px" }));
    }
    componentWillMount() {
        this.setState({
            locked: this.props.patcher._state.locked,
            presentation: this.props.patcher._state.presentation,
            showGrid: this.props.patcher._state.showGrid,
            bgcolor: this.props.patcher.props.bgcolor,
            editing_bgcolor: this.props.patcher.props.editing_bgcolor
        });
    }
    componentDidMount() {
        const patcher = this.props.patcher;
        patcher.on("loaded", this.handleLoaded);
        patcher.on("locked", this.handleLockedChange);
        patcher.on("presentation", this.handlePresentationChange);
        patcher.on("showGrid", this.handleShowGridChange);
    }
    componentWillUnmount() {
        const patcher = this.props.patcher;
        patcher.off("loaded", this.handleLoaded);
        patcher.off("locked", this.handleLockedChange);
        patcher.off("presentation", this.handlePresentationChange);
        patcher.off("showGrid", this.handleShowGridChange);
    }
    render() {
        const classArray = ["patcher"];
        classArray.push(this.state.locked ? "locked" : "unlocked");
        if (this.state.presentation) classArray.push("presentation");
        if (this.state.showGrid) classArray.push("show-grid");
        const bgcolor = this.state.locked ? this.state.bgcolor : this.state.editing_bgcolor;
        return (
            <div className={classArray.join(" ")} style={{ backgroundColor: "rgba(" + bgcolor.join(",") + ")" }} onScroll={this.handleScroll} ref={this.refDiv}>
                <Grid {...this.props} ref={this.refGrid} />
                <Boxes {...this.props} ref={this.refBoxes} />
                <Lines {...this.props} ref={this.refLines} />
            </div>
        );
    }
}

class Lines extends React.Component {
    props: { patcher: Patcher };
    state = { width: "100%", height: "100%" };
    lines: { [key: string]: JSX.Element } = {};
    componentDidMount() {
        this.props.patcher.on("loaded", this.onLoaded);
        this.props.patcher.on("createLine", this.onCreateLine);
        this.props.patcher.on("create", this.onCreate);
        this.props.patcher.on("deleteLine", this.onDeleteLine);
        this.props.patcher.on("delete", this.onDelete);
    }
    componentWillUnmount() {
        this.props.patcher.off("loaded", this.onLoaded);
        this.props.patcher.off("createLine", this.onCreateLine);
        this.props.patcher.off("create", this.onCreate);
        this.props.patcher.off("deleteLine", this.onDeleteLine);
        this.props.patcher.off("delete", this.onDelete);
    }
    onCreateLine = (line: Line) => {
        if (this.props.patcher._state.isLoading) return;
        this.lines[line.id] = <LineUI {...this.props} id={line.id} key={line.id} />;
        this.forceUpdate();
    }
    onCreate = (created: TPatcher) => {
        if (this.props.patcher._state.isLoading) return;
        Object.keys(created.lines).forEach((id) => {
            const line = created.lines[id];
            this.lines[line.id] = <LineUI {...this.props} id={line.id} key={line.id} />;
        });
        this.forceUpdate();
    }
    onDeleteLine = (line: Line) => {
        if (this.props.patcher._state.isLoading) return;
        delete this.lines[line.id];
        this.forceUpdate();
    }
    onDelete = (deleted: TPatcher) => {
        if (this.props.patcher._state.isLoading) return;
        Object.keys(deleted.lines).forEach(id => delete this.lines[id]);
        this.forceUpdate();
    }
    onLoaded = () => {
        for (const lineID in this.lines) {
            delete this.lines[lineID];
        }
        this.forceUpdate(() => { // Unmount All of them, please.
            for (const lineID in this.props.patcher.lines) {
                const line = this.props.patcher.lines[lineID];
                this.lines[lineID] = <LineUI {...this.props} id={line.id} key={line.id} />;
            }
            this.forceUpdate();
        });
    }
    render() {
        return (
            <div className="lines" style={this.state}>
                {Object.values(this.lines)}
                <TempLineUI {...this.props} />
            </div>
        );
    }
}

class Boxes extends React.Component {
    props: { patcher: Patcher };
    state = { width: "100%", height: "100%", selectionRect: [0, 0, 0, 0] };
    boxes: { [key: string]: JSX.Element } = {};
    refDiv: React.RefObject<HTMLDivElement> = React.createRef();
    dragged = false;
    componentDidMount() {
        this.props.patcher.on("loaded", this.onLoaded);
        this.props.patcher.on("createBox", this.onCreateBox);
        this.props.patcher.on("create", this.onCreate);
        this.props.patcher.on("deleteBox", this.onDeleteBox);
        this.props.patcher.on("delete", this.onDelete);
    }
    componentWillUnmount() {
        this.props.patcher.off("loaded", this.onLoaded);
        this.props.patcher.off("createBox", this.onCreateBox);
        this.props.patcher.off("create", this.onCreate);
        this.props.patcher.off("deleteBox", this.onDeleteBox);
        this.props.patcher.off("delete", this.onDelete);
    }
    onCreateBox = (box: Box) => {
        if (this.props.patcher._state.isLoading) return;
        this.boxes[box.id] = <BoxUI {...this.props} id={box.id} key={box.id} />;
        this.forceUpdate();
    }
    onCreate = (created: TPatcher) => {
        if (this.props.patcher._state.isLoading) return;
        Object.keys(created.boxes).forEach((id) => {
            const box = created.boxes[id];
            this.boxes[box.id] = <BoxUI {...this.props} id={box.id} key={box.id} />;
        });
        this.forceUpdate();
    }
    onDeleteBox = (box: Box) => {
        if (this.props.patcher._state.isLoading) return;
        delete this.boxes[box.id];
        this.forceUpdate();
    }
    onDelete = (deleted: TPatcher) => {
        if (this.props.patcher._state.isLoading) return;
        Object.keys(deleted.boxes).forEach(id => delete this.boxes[id]);
        this.forceUpdate();
    }
    onLoaded = () => {
        for (const boxID in this.boxes) {
            delete this.boxes[boxID];
        }
        this.forceUpdate(() => { // Unmount All of them, please.
            for (const boxID in this.props.patcher.boxes) {
                const box = this.props.patcher.boxes[boxID];
                this.boxes[boxID] = <BoxUI {...this.props} id={box.id} key={box.id} />;
            }
            this.forceUpdate();
        });
    }
    handleMouseDown = (e: React.MouseEvent) => {
        if (!e.shiftKey) this.props.patcher.deselectAll();
        if (this.props.patcher._state.locked) return;
        // Handle Draggable
        const handleDraggable = () => {
            this.dragged = false;
            const patcherDiv = this.refDiv.current.parentElement as HTMLDivElement;
            const patcherRect = [0, 0, patcherDiv.clientWidth, patcherDiv.clientHeight];
            let el = patcherDiv;
            do {
                patcherRect[0] += el.offsetLeft;
                patcherRect[1] += el.offsetTop;
                el = el.offsetParent as HTMLDivElement;
            } while (el.offsetParent);
            let patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
            const selectedBefore = this.props.patcher._state.selected.slice();
            const selectionRect = [e.pageX - patcherRect[0] + patcherDiv.scrollLeft, e.pageY - patcherRect[1] + patcherDiv.scrollTop, 0, 0];
            const handleMouseMove = (e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                if (e.movementX || e.movementY) {
                    if (!this.dragged) this.dragged = true;
                    selectionRect[2] = e.pageX - patcherRect[0] + patcherDiv.scrollLeft;
                    selectionRect[3] = e.pageY - patcherRect[1] + patcherDiv.scrollTop;
                    this.setState({ selectionRect });
                    this.props.patcher.selectRegion(selectionRect, selectedBefore);
                }
                const x = e.pageX - patcherRect[0];
                const y = e.pageY - patcherRect[1];
                if (x < 10) patcherDiv.scrollLeft += x - 10;
                if (x > patcherRect[2] - 10) patcherDiv.scrollLeft += x + 10 - patcherRect[2];
                if (y < 10) patcherDiv.scrollTop += y - 10;
                if (y > patcherRect[3] - 10) patcherDiv.scrollTop += y + 10 - patcherRect[3];
            };
            const handlePatcherScroll = (e: UIEvent) => {
                const movementX = patcherDiv.scrollLeft - patcherPrevScroll.left;
                const movementY = patcherDiv.scrollTop - patcherPrevScroll.top;
                selectionRect[2] += movementX;
                selectionRect[3] += movementY;
                patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
                if (movementX || movementY) {
                    if (!this.dragged) this.dragged = true;
                    this.setState({ selectionRect });
                    this.props.patcher.selectRegion(selectionRect, selectedBefore);
                }
            };
            const handleMouseUp = (e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                patcherDiv.removeEventListener("scroll", handlePatcherScroll);
                this.setState({ selectionRect: [0, 0, 0, 0] });
            };
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            patcherDiv.addEventListener("scroll", handlePatcherScroll);
        };
        handleDraggable();
    }
    handleClick = (e: React.MouseEvent) => {
        if (e.ctrlKey && !this.dragged) this.props.patcher.setLock(!this.props.patcher._state.locked);
    }
    handleDoubleClick = (e: React.MouseEvent) => {
        if (this.props.patcher._state.locked) return;
        if (e.target !== this.refDiv.current) return;
        const patcherDiv = this.refDiv.current.parentElement as HTMLDivElement;
        const patcherRect = [0, 0, patcherDiv.clientWidth, patcherDiv.clientHeight];
        let el = patcherDiv;
        do {
            patcherRect[0] += el.offsetLeft;
            patcherRect[1] += el.offsetTop;
            el = el.offsetParent as HTMLDivElement;
        } while (el.offsetParent);
        const x = e.pageX - patcherRect[0];
        const y = e.pageY - patcherRect[1];
        this.props.patcher.createBox({ text: "", inlets: 0, outlets: 0, rect: [x, y, 60, 20], _editing: true });
    }
    render() {
        const selectionRect = this.state.selectionRect;
        let selectionDiv;
        if (selectionRect[2] !== selectionRect[0] && selectionRect[3] !== selectionRect[1]) {
            const selectionDivStyle = {
                left: Math.min(selectionRect[0], selectionRect[2]),
                top: Math.min(selectionRect[1], selectionRect[3]),
                width: Math.abs(selectionRect[2] - selectionRect[0]),
                height: Math.abs(selectionRect[3] - selectionRect[1])
            } as React.CSSProperties;
            selectionDiv = <div className="selection" style={selectionDivStyle}/>;
        }
        return (
            <div className="boxes" onMouseDown={this.handleMouseDown} onDoubleClick={this.handleDoubleClick} ref={this.refDiv} onClick={this.handleClick} style={this.state}>
                {Object.values(this.boxes)}
                {selectionDiv}
            </div>
        );
    }
}

class Grid extends React.Component {
    props: { patcher: Patcher };
    state = { width: "100%", height: "100%" };
    render() {
        const patcher = this.props.patcher;
        const grid = patcher.props.grid;
        const bgcolor = patcher.props.bgcolor;
        const isWhite = bgcolor[0] + bgcolor[1] + bgcolor[2] < 128 * 3;
        const gridColor = isWhite ? "#FFFFFF1A" : "#0000001A";
        const pxx = grid[0] + "px";
        const pxx1 = (grid[0] - 1) + "px";
        const pxy = grid[1] + "px";
        const pxy1 = (grid[1] - 1) + "px";
        const sBGImageX = "repeating-linear-gradient(" + ["0deg, transparent, transparent " + pxx1, gridColor + " " + pxx1, gridColor + " " + pxx].join(", ") + ")";
        const sBGImageY = "repeating-linear-gradient(" + ["-90deg, transparent, transparent " + pxy1, gridColor + " " + pxy1, gridColor + " " + pxy].join(", ") + ")";
        const style = { backgroundImage: sBGImageX + ", " + sBGImageY, backgroundSize: pxx + " " + pxy, ...this.state };
        return (
            <div className="grid-background" style={style}/>
        );
    }
}
