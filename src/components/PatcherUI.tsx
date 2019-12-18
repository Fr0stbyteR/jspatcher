import * as React from "react";
import Patcher from "../core/Patcher";
import Box from "../core/Box";
import Line from "../core/Line";
import "./PatcherUI.scss";
import "./zIndex.scss";
import BoxUI from "./BoxUI";
import { LineUI, TempLineUI } from "./LineUI";
import { TPatcher, TPatcherMode, TRect } from "../core/types";

type P = { patcher: Patcher };
type S = { locked: boolean; presentation: boolean; showGrid: boolean; fileDropping: boolean; bgColor: TRect; editingBgColor: TRect };
export default class PatcherUI extends React.Component<P, S> {
    state: S = {
        locked: this.props.patcher.state.locked,
        presentation: this.props.patcher.state.presentation,
        showGrid: this.props.patcher.state.showGrid,
        bgColor: this.props.patcher.props.bgColor,
        editingBgColor: this.props.patcher.props.editingBgColor,
        fileDropping: false
    };
    refDiv = React.createRef<HTMLDivElement>();
    refGrid = React.createRef<Grid>();
    refBoxes = React.createRef<Boxes>();
    refLines = React.createRef<Lines>();
    size = { width: 0, height: 0 };
    handleLoaded = () => {
        this.setState({ bgColor: this.props.patcher.props.bgColor, editingBgColor: this.props.patcher.props.editingBgColor });
        const grid = this.refGrid.current;
        const boxes = this.refBoxes.current;
        const lines = this.refLines.current;
        const div = this.refDiv.current;
        div.scrollLeft = 0;
        div.scrollTop = 0;
        this.size = { width: 0, height: 0 };
        const newState = { width: "unset", height: "unset" };
        grid.setState(newState);
        boxes.setState(newState);
        if (lines) lines.setState(newState);
    }
    handleLockedChange = (e: boolean) => this.setState({ locked: e });
    handlePresentationChange = (e: boolean) => this.setState({ presentation: e });
    handleShowGridChange = (e: boolean) => this.setState({ showGrid: e });
    handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const grid = this.refGrid.current;
        const boxes = this.refBoxes.current;
        const lines = this.refLines.current;
        const div = e.currentTarget;
        let shouldUpdate = false;
        if (div.scrollWidth !== this.size.width || div.scrollHeight !== this.size.height) {
            shouldUpdate = true;
            this.size.width = div.scrollWidth;
            this.size.height = div.scrollHeight;
        }
        if (shouldUpdate) {
            const newState = { width: this.size.width + "px", height: this.size.height + "px" };
            grid.setState(newState);
            boxes.setState(newState);
            if (lines) lines.setState(newState);
        }
    }
    handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const { dataTransfer } = e;
        if (dataTransfer && dataTransfer.items.length && dataTransfer.items[0].kind === "file") this.setState({ fileDropping: true });
    };
    handleDragOver = (e: React.DragEvent<HTMLDivElement>) => this.handleDragEnter(e);
    handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ fileDropping: false });
    };
    handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ fileDropping: false });
        const { dataTransfer } = e;
        if (dataTransfer && dataTransfer.files.length) {
            const file = e.dataTransfer.files[0];
            const ext = file.name.split(".").pop();
            const extMap: { [key: string]: TPatcherMode } = { json: "js", maxpat: "max", gendsp: "gen", dsppat: "faust" };
            if (!extMap[ext]) return;
            const reader = new FileReader();
            reader.onload = () => {
                let parsed: TPatcher;
                try {
                    parsed = JSON.parse(reader.result.toString());
                } catch (e) {
                    this.props.patcher.error((e as Error).message);
                }
                if (parsed) this.props.patcher.load(parsed, extMap[ext]);
            };
            reader.onerror = () => this.props.patcher.error(reader.error.message);
            reader.readAsText(file, "UTF-8");
        }
    };
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
        if (this.state.fileDropping) classArray.push("filedropping");
        const bgcolor = this.state.locked ? this.state.bgColor : this.state.editingBgColor;
        return (
            <div ref={this.refDiv} className={classArray.join(" ")} style={{ backgroundColor: "rgba(" + bgcolor.join(",") + ")" }} onScroll={this.handleScroll} onDragEnter={this.handleDragEnter} onDragOver={this.handleDragOver} onDragLeave={this.handleDragLeave} onDrop={this.handleDrop}>
                <Grid {...this.props} ref={this.refGrid} />
                <Boxes {...this.props} ref={this.refBoxes} />
                {this.state.presentation ? <></> : <Lines {...this.props} ref={this.refLines} />}
            </div>
        );
    }
}

class Lines extends React.Component<{ patcher: Patcher }, { width: string; height: string }> {
    state = { width: "100%", height: "100%" };
    lines: { [key: string]: JSX.Element } = {};
    componentDidMount() {
        this.onLoaded();
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
        if (this.props.patcher.state.isLoading) return;
        this.lines[line.id] = <LineUI {...this.props} id={line.id} key={line.id} />;
        this.forceUpdate();
    }
    onCreate = (created: TPatcher) => {
        if (this.props.patcher.state.isLoading) return;
        Object.keys(created.lines).forEach((id) => {
            const line = created.lines[id];
            this.lines[line.id] = <LineUI {...this.props} id={line.id} key={line.id} />;
        });
        this.forceUpdate();
    }
    onDeleteLine = (line: Line) => {
        if (this.props.patcher.state.isLoading) return;
        delete this.lines[line.id];
        this.forceUpdate();
    }
    onDelete = (deleted: TPatcher) => {
        if (this.props.patcher.state.isLoading) return;
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
type BoxesState = { width: string; height: string; selectionRect: TRect };
class Boxes extends React.Component<{ patcher: Patcher }, BoxesState> {
    state: BoxesState = { width: "100%", height: "100%", selectionRect: [0, 0, 0, 0] };
    boxes: { [key: string]: JSX.Element } = {};
    refDiv = React.createRef<HTMLDivElement>();
    dragged = false;
    cachedMousePos = { x: 0, y: 0 };
    componentDidMount() {
        this.onLoaded();
        this.props.patcher.on("loaded", this.onLoaded);
        this.props.patcher.on("createBox", this.onCreateBox);
        this.props.patcher.on("create", this.onCreate);
        this.props.patcher.on("deleteBox", this.onDeleteBox);
        this.props.patcher.on("delete", this.onDelete);
        document.addEventListener("keydown", this.handleKeyDown);
    }
    componentWillUnmount() {
        this.props.patcher.off("loaded", this.onLoaded);
        this.props.patcher.off("createBox", this.onCreateBox);
        this.props.patcher.off("create", this.onCreate);
        this.props.patcher.off("deleteBox", this.onDeleteBox);
        this.props.patcher.off("delete", this.onDelete);
        document.removeEventListener("keydown", this.handleKeyDown);
    }
    onCreateBox = (box: Box) => {
        if (this.props.patcher.state.isLoading) return;
        this.boxes[box.id] = <BoxUI {...this.props} id={box.id} key={box.id} />;
        this.forceUpdate();
    }
    onCreate = (created: TPatcher) => {
        if (this.props.patcher.state.isLoading) return;
        Object.keys(created.boxes).forEach((id) => {
            const box = created.boxes[id];
            this.boxes[box.id] = <BoxUI {...this.props} id={box.id} key={box.id} />;
        });
        this.forceUpdate();
    }
    onDeleteBox = (box: Box) => {
        if (this.props.patcher.state.isLoading) return;
        delete this.boxes[box.id];
        this.forceUpdate();
    }
    onDelete = (deleted: TPatcher) => {
        if (this.props.patcher.state.isLoading) return;
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
        if (e.button !== 0) return;
        if (this.props.patcher.state.locked) return;
        // Handle Draggable
        const handleDraggable = () => {
            this.dragged = false;
            const patcherDiv = this.refDiv.current.parentElement as HTMLDivElement;
            const patcherRect = patcherDiv.getBoundingClientRect();
            let patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
            const selectedBefore = this.props.patcher.state.selected.slice();
            const selectionRect = [e.pageX - patcherRect.left + patcherDiv.scrollLeft, e.pageY - patcherRect.top + patcherDiv.scrollTop, 0, 0] as TRect;
            const handleMouseMove = (e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                if (e.movementX || e.movementY) {
                    if (!this.dragged) this.dragged = true;
                    selectionRect[2] = e.pageX - patcherRect.left + patcherDiv.scrollLeft;
                    selectionRect[3] = e.pageY - patcherRect.top + patcherDiv.scrollTop;
                    this.setState({ selectionRect });
                    this.props.patcher.selectRegion(selectionRect, selectedBefore);
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
        const ctrlKey = this.props.patcher.env.os === "MacOS" ? e.metaKey : e.ctrlKey;
        if (ctrlKey && !this.props.patcher.state.selected.length) this.props.patcher.lock = !this.props.patcher.state.locked;
    }
    handleDoubleClick = (e: React.MouseEvent) => {
        const { patcher } = this.props;
        if (patcher.state.locked) return;
        if (e.target !== this.refDiv.current) return;
        const ctrlKey = patcher.env.os === "MacOS" ? e.metaKey : e.ctrlKey;
        if (ctrlKey || e.shiftKey) return;
        const patcherDiv = this.refDiv.current.parentElement as HTMLDivElement;
        const patcherRect = patcherDiv.getBoundingClientRect();
        const x = Math.max(0, e.pageX - patcherRect.left + patcherDiv.scrollLeft);
        const y = Math.max(0, e.pageY - patcherRect.top + patcherDiv.scrollTop);
        const { presentation } = patcher._state;
        this.props.patcher.createBox({ text: "", inlets: 0, outlets: 0, rect: [x, y, 90, 20], presentation, _editing: true });
    }
    handleKeyDown = (e: KeyboardEvent) => {
        const { patcher } = this.props;
        if (patcher.state.locked) return;
        if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
            let x = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
            let y = e.key === "ArrowUp" ? -1 : e.key === "ArrowDown" ? 1 : 0;
            if (!e.shiftKey && patcher._state.snapToGrid) {
                x *= patcher.props.grid[0];
                y *= patcher.props.grid[1];
            }
            patcher.moveSelectedBox({ x, y });
        } else if ((e.key === "n" || e.key === "m" || e.key === "b" || e.key === "c") && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
            e.stopPropagation();
            e.preventDefault();
            const patcherDiv = this.refDiv.current.parentElement as HTMLDivElement;
            const patcherRect = patcherDiv.getBoundingClientRect();
            const x = Math.max(0, this.cachedMousePos.x - patcherRect.left + patcherDiv.scrollLeft);
            const y = Math.max(0, this.cachedMousePos.y - patcherRect.top + patcherDiv.scrollTop);
            let w = 90;
            const h = 20;
            let text = "";
            if (e.key === "m") text = "message";
            else if (e.key === "c") text = "comment";
            else if (e.key === "b") {
                text = "live.button";
                w = 20;
            }
            const { presentation } = patcher._state;
            this.props.patcher.createBox({ text, inlets: 0, outlets: 0, rect: [x, y, w, h], presentation, _editing: true });
        }
    }
    handleMouseMove = (e: React.MouseEvent) => this.cachedMousePos = { x: e.pageX, y: e.pageY };
    render() {
        const selectionRect = this.state.selectionRect;
        let selectionDiv;
        if (selectionRect[2] !== selectionRect[0] || selectionRect[3] !== selectionRect[1]) {
            const selectionDivStyle = {
                left: Math.min(selectionRect[0], selectionRect[2]),
                top: Math.min(selectionRect[1], selectionRect[3]),
                width: Math.abs(selectionRect[2] - selectionRect[0]),
                height: Math.abs(selectionRect[3] - selectionRect[1])
            } as React.CSSProperties;
            selectionDiv = <div className="selection" style={selectionDivStyle}/>;
        }
        return (
            <div className="boxes" onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onDoubleClick={this.handleDoubleClick} ref={this.refDiv} onClick={this.handleClick} style={this.state}>
                {Object.values(this.boxes)}
                {selectionDiv}
            </div>
        );
    }
}

class Grid extends React.Component<{ patcher: Patcher }, { width: string; height: string }> {
    state = { width: "100%", height: "100%" };
    render() {
        const patcher = this.props.patcher;
        const grid = patcher.props.grid;
        const bgcolor = patcher.props.bgColor;
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
