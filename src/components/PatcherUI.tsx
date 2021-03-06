import * as React from "react";
import * as Color from "color-js";
import Patcher from "../core/patcher/Patcher";
import Box from "../core/patcher/Box";
import Line from "../core/patcher/Line";
import "./PatcherUI.scss";
import "./zIndex.scss";
import BoxUI from "./BoxUI";
import { LineUI, TempLineUI } from "./LineUI";
import { RawPatcher, TRect } from "../core/types";
import { round } from "../utils/math";

interface P {
    patcher: Patcher;
    transparent?: boolean;
    runtime?: boolean;
}

interface S {
    locked: boolean;
    presentation: boolean;
    showGrid: boolean;
    fileDropping: boolean;
    bgColor: string;
    editingBgColor: string;
    selectionRect: TRect;
}

export default class PatcherUI extends React.PureComponent<P, S> {
    state: S = {
        locked: this.props.runtime || this.props.patcher.state.locked,
        presentation: this.props.patcher.state.presentation,
        showGrid: this.props.patcher.state.showGrid,
        bgColor: this.props.patcher.props.bgColor,
        editingBgColor: this.props.patcher.props.editingBgColor,
        fileDropping: false,
        selectionRect: [0, 0, 0, 0]
    };
    refDiv = React.createRef<HTMLDivElement>();
    refGrid = React.createRef<Grid>();
    refBoxes = React.createRef<Boxes>();
    refLines = React.createRef<Lines>();
    size = { width: 0, height: 0 };
    cachedMousePos = { x: 0, y: 0 };
    dragged = false;
    handleLoading = (loading?: string[]) => {
        if (loading) return;
        const { patcher } = this.props;
        this.setState({ bgColor: patcher.props.bgColor, editingBgColor: patcher.props.editingBgColor, presentation: patcher.state.presentation });
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
    };
    handleLockedChange = (locked: boolean) => this.setState({ locked: this.props.runtime || locked });
    handlePresentationChange = (presentation: boolean) => this.setState({ presentation });
    handleShowGridChange = (showGrid: boolean) => this.setState({ showGrid });
    handleBgColorChange = (bgColor: string) => this.setState({ bgColor });
    handleEditingBgColorChange = (editingBgColor: string) => this.setState({ editingBgColor });
    handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (this.props.runtime) {
            // e.currentTarget.scrollTo(0, 0);
            return;
        }
        const grid = this.refGrid.current;
        // const boxes = this.refBoxes.current;
        // const lines = this.refLines.current;
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
            // boxes.setState(newState);
            // if (lines) lines.setState(newState);
        }
    };
    /*
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
            this.props.patcher.loadFromFile(file);
        }
    };
     */
    handleMouseDown = (e: React.MouseEvent) => {
        if (this.props.runtime) return;
        this.props.patcher.setActive();
        if (!e.shiftKey) this.props.patcher.deselectAll();
        if (e.button !== 0) return;
        if (this.props.patcher.state.locked) return;
        this.dragged = false;
        // Handle Draggable
        const handleDraggable = () => {
            const patcherDiv = this.refDiv.current;
            const patcherRect = patcherDiv.getBoundingClientRect();
            if (patcherRect.top + patcherDiv.clientHeight < e.clientY || patcherRect.left + patcherDiv.clientWidth < e.clientX) return; // Click on scrollbar
            let patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
            const selectedBefore = this.props.patcher.state.selected.slice();
            const selectionRect = [e.clientX - patcherRect.left + patcherDiv.scrollLeft, e.clientY - patcherRect.top + patcherDiv.scrollTop, 0, 0] as TRect;
            const handleMouseMove = (e: MouseEvent) => {
                this.dragged = true;
                e.stopPropagation();
                e.preventDefault();
                if (e.movementX || e.movementY) {
                    selectionRect[2] = e.clientX - patcherRect.left + patcherDiv.scrollLeft;
                    selectionRect[3] = e.clientY - patcherRect.top + patcherDiv.scrollTop;
                    this.setState({ selectionRect: selectionRect.slice() as TRect });
                    this.props.patcher.selectRegion(selectionRect, selectedBefore);
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
                selectionRect[2] += movementX;
                selectionRect[3] += movementY;
                patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
                if (movementX || movementY) {
                    this.setState({ selectionRect: selectionRect.slice() as TRect });
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
    };
    handleClick = (e: React.MouseEvent) => {
        if (this.props.runtime) return;
        const ctrlKey = this.props.patcher.env.os === "MacOS" ? e.metaKey : e.ctrlKey;
        if (ctrlKey && !this.props.patcher.state.selected.length) this.props.patcher.setState({ locked: !this.props.patcher.state.locked });
    };
    handleDoubleClick = (e: React.MouseEvent) => {
        if (this.dragged) return;
        const { patcher, runtime } = this.props;
        if (runtime) return;
        if (patcher.state.locked) return;
        if (!(e.target instanceof HTMLDivElement && (e.target.classList.contains("boxes") || e.target.classList.contains("patcher")))) return;
        const ctrlKey = patcher.env.os === "MacOS" ? e.metaKey : e.ctrlKey;
        if (ctrlKey || e.shiftKey) return;
        const patcherDiv = this.refDiv.current as HTMLDivElement;
        if (!patcherDiv) return;
        const patcherRect = patcherDiv.getBoundingClientRect();
        const [gridX, gridY] = patcher.props.grid;
        const x = round(Math.max(0, e.clientX - patcherRect.left + patcherDiv.scrollLeft), gridX);
        const y = round(Math.max(0, e.clientY - patcherRect.top + patcherDiv.scrollTop), gridY);
        const { presentation } = patcher._state;
        this.props.patcher.createBox({ text: "", inlets: 0, outlets: 0, rect: [x, y, 0, 0], presentation, _editing: true });
    };
    handleKeyDown = (e: KeyboardEvent) => {
        const { patcher, runtime } = this.props;
        if (runtime) return;
        if (!patcher.isActive) return;
        if (patcher.state.locked) return;
        if (e.target instanceof HTMLInputElement) return;
        if (e.target instanceof HTMLTextAreaElement) return;
        if ((e.target as HTMLElement).contentEditable === "true") return;
        if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.stopPropagation();
            e.preventDefault();
            let x = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
            let y = e.key === "ArrowUp" ? -1 : e.key === "ArrowDown" ? 1 : 0;
            if (!e.shiftKey && patcher._state.snapToGrid) {
                x *= patcher.props.grid[0];
                y *= patcher.props.grid[1];
            }
            patcher.moveSelectedBox({ x, y });
        } else if ((e.key === "n" || e.key === "m" || e.key === "b" || e.key === "c" || e.key === "i" || e.key === "s") && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
            e.stopPropagation();
            e.preventDefault();
            const patcherDiv = this.refDiv.current as HTMLDivElement;
            if (!patcherDiv) return;
            const patcherRect = patcherDiv.getBoundingClientRect();
            const [gridX, gridY] = patcher.props.grid;
            const x = round(Math.max(0, this.cachedMousePos.x - patcherRect.left + patcherDiv.scrollLeft), gridX);
            const y = round(Math.max(0, this.cachedMousePos.y - patcherRect.top + patcherDiv.scrollTop), gridY);
            let text = "";
            if (e.key === "m") text = "message";
            else if (e.key === "c") text = "comment";
            else if (e.key === "b") text = "live.button";
            else if (e.key === "i") text = "live.numbox";
            else if (e.key === "s") text = "live.slider";
            const { presentation } = patcher._state;
            this.props.patcher.createBox({ text, inlets: 0, outlets: 0, rect: [x, y, 0, 0], presentation, _editing: true });
        }
    };
    handleMouseMove = (e: React.MouseEvent) => this.cachedMousePos = { x: e.clientX, y: e.clientY };
    componentDidMount() {
        const patcher = this.props.patcher;
        patcher.on("loading", this.handleLoading);
        patcher.on("locked", this.handleLockedChange);
        patcher.on("presentation", this.handlePresentationChange);
        patcher.on("showGrid", this.handleShowGridChange);
        patcher.on("bgColor", this.handleBgColorChange);
        patcher.on("editingBgColor", this.handleEditingBgColorChange);
        document.addEventListener("keydown", this.handleKeyDown);
    }
    componentWillUnmount() {
        const patcher = this.props.patcher;
        patcher.off("loading", this.handleLoading);
        patcher.off("locked", this.handleLockedChange);
        patcher.off("presentation", this.handlePresentationChange);
        patcher.off("showGrid", this.handleShowGridChange);
        patcher.off("bgColor", this.handleBgColorChange);
        patcher.off("editingBgColor", this.handleEditingBgColorChange);
        document.removeEventListener("keydown", this.handleKeyDown);
    }
    render() {
        const { selectionRect } = this.state;
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
        const classArray = ["patcher"];
        classArray.push(this.state.locked ? "locked" : "unlocked");
        if (this.state.presentation) classArray.push("presentation");
        if (this.state.showGrid) classArray.push("show-grid");
        if (this.state.fileDropping) classArray.push("filedropping");
        const backgroundColor = this.props.transparent ? "transparent" : this.state.locked ? this.state.bgColor : this.state.editingBgColor;
        return (
            <div ref={this.refDiv} className={classArray.join(" ")} style={{ backgroundColor }} onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onDoubleClick={this.handleDoubleClick} onClick={this.handleClick} onScroll={this.handleScroll}/*  onDragEnter={this.handleDragEnter} onDragOver={this.handleDragOver} onDragLeave={this.handleDragLeave} onDrop={this.handleDrop} */>
                <Grid {...this.props} ref={this.refGrid} />
                <Boxes {...this.props} ref={this.refBoxes} />
                {this.state.presentation ? <></> : <Lines {...this.props} ref={this.refLines} />}
                {selectionDiv}
            </div>
        );
    }
}

class Lines extends React.PureComponent<{ patcher: Patcher; runtime?: boolean }, { width: string; height: string; timestamp: number }> {
    state = { width: "100%", height: "100%", timestamp: performance.now() };
    lines: Record<string, JSX.Element> = {};
    componentDidMount() {
        this.handleLoading();
        const patcher = this.props.patcher;
        patcher.on("loading", this.handleLoading);
        patcher.on("createLine", this.handleCreateLine);
        patcher.on("create", this.handleCreate);
        patcher.on("deleteLine", this.handleDeleteLine);
        patcher.on("delete", this.handleDelete);
    }
    componentWillUnmount() {
        const patcher = this.props.patcher;
        patcher.off("loading", this.handleLoading);
        patcher.off("createLine", this.handleCreateLine);
        patcher.off("create", this.handleCreate);
        patcher.off("deleteLine", this.handleDeleteLine);
        patcher.off("delete", this.handleDelete);
    }
    handleCreateLine = (line: Line) => {
        if (this.props.patcher.state.isLoading) return;
        this.lines[line.id] = <LineUI {...this.props} id={line.id} key={this.state.timestamp + line.id} />;
        this.setState({ timestamp: performance.now() });
    };
    handleCreate = (created: RawPatcher) => {
        if (this.props.patcher.state.isLoading) return;
        Object.keys(created.lines).forEach((id) => {
            const line = created.lines[id];
            this.lines[line.id] = <LineUI {...this.props} id={line.id} key={this.state.timestamp + line.id} />;
        });
        this.setState({ timestamp: performance.now() });
    };
    handleDeleteLine = (line: Line) => {
        if (this.props.patcher.state.isLoading) return;
        delete this.lines[line.id];
        this.setState({ timestamp: performance.now() });
    };
    handleDelete = (deleted: RawPatcher) => {
        if (this.props.patcher.state.isLoading) return;
        Object.keys(deleted.lines).forEach(id => delete this.lines[id]);
        this.setState({ timestamp: performance.now() });
    };
    handleLoading = (loading?: string[]) => {
        if (loading) return;
        for (const lineID in this.lines) {
            delete this.lines[lineID];
        }
        for (const lineID in this.props.patcher.lines) {
            const line = this.props.patcher.lines[lineID];
            this.lines[lineID] = <LineUI {...this.props} id={line.id} key={this.state.timestamp + line.id} />;
        }
        this.setState({ timestamp: performance.now() });
    };
    render() {
        return (
            <div className="lines" style={this.state}>
                {Object.values(this.lines)}
                {this.props.runtime ? undefined : <TempLineUI {...this.props} />}
            </div>
        );
    }
}
type BoxesState = { width: string; height: string };
class Boxes extends React.PureComponent<{ patcher: Patcher; runtime?: boolean }, BoxesState> {
    state: BoxesState = { width: "100%", height: "100%" };
    boxes: Record<string, JSX.Element> = {};
    componentDidMount() {
        this.handleLoading();
        const patcher = this.props.patcher;
        patcher.on("loading", this.handleLoading);
        patcher.on("createBox", this.handleCreateBox);
        patcher.on("create", this.handleCreate);
        patcher.on("deleteBox", this.handleDeleteBox);
        patcher.on("delete", this.handleDelete);
    }
    componentWillUnmount() {
        const patcher = this.props.patcher;
        patcher.off("loading", this.handleLoading);
        patcher.off("createBox", this.handleCreateBox);
        patcher.off("create", this.handleCreate);
        patcher.off("deleteBox", this.handleDeleteBox);
        patcher.off("delete", this.handleDelete);
    }
    handleCreateBox = (box: Box) => {
        if (this.props.patcher.state.isLoading) return;
        this.boxes[box.id] = <BoxUI {...this.props} id={box.id} key={box.id} />;
        this.forceUpdate();
    };
    handleCreate = (created: RawPatcher) => {
        if (this.props.patcher.state.isLoading) return;
        Object.keys(created.boxes).forEach((id) => {
            const box = created.boxes[id];
            this.boxes[box.id] = <BoxUI {...this.props} id={box.id} key={box.id} />;
        });
        this.forceUpdate();
    };
    handleDeleteBox = (box: Box) => {
        if (this.props.patcher.state.isLoading) return;
        delete this.boxes[box.id];
        this.forceUpdate();
    };
    handleDelete = (deleted: RawPatcher) => {
        if (this.props.patcher.state.isLoading) return;
        Object.keys(deleted.boxes).forEach(id => delete this.boxes[id]);
        this.forceUpdate();
    };
    handleLoading = (loading?: string[]) => {
        if (loading) return;
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
    };
    render() {
        return (
            <div className="boxes" style={this.state}>
                {Object.values(this.boxes)}
            </div>
        );
    }
}

class Grid extends React.PureComponent<{ patcher: Patcher }, { width: string; height: string; grid: [number, number]; editingBgColor: string }> {
    state = { width: "100%", height: "100%", grid: this.props.patcher.props.grid, editingBgColor: this.props.patcher.props.editingBgColor };
    handleLoading = (loading?: string[]) => {
        if (loading) return;
        const { grid, editingBgColor } = this.props.patcher.props;
        this.setState({ grid: grid.slice() as [number, number], editingBgColor });
    };
    handleGridChange = (grid: [number, number]) => this.setState({ grid: grid.slice() as [number, number] });
    handleEditingBgColorChange = (editingBgColor: string) => this.setState({ editingBgColor });
    componentDidMount() {
        this.props.patcher.on("loading", this.handleLoading);
        this.props.patcher.on("grid", this.handleGridChange);
        this.props.patcher.on("editingBgColor", this.handleEditingBgColorChange);
    }
    componentWillUnmount() {
        this.props.patcher.off("loading", this.handleLoading);
        this.props.patcher.off("grid", this.handleGridChange);
        this.props.patcher.off("editingBgColor", this.handleEditingBgColorChange);
    }
    render() {
        const { grid, editingBgColor, width, height } = this.state;
        const gridIsWhite = Color(editingBgColor).getLightness() < 0.5;
        const gridColor = gridIsWhite ? "#FFFFFF1A" : "#0000001A";
        const pxx = grid[0] + "px";
        const pxx1 = (grid[0] - 1) + "px";
        const pxy = grid[1] + "px";
        const pxy1 = (grid[1] - 1) + "px";
        const sBGImageX = `repeating-linear-gradient(-90deg, transparent, transparent ${pxx1}, ${gridColor} ${pxx1}, ${gridColor} ${pxx})`;
        const sBGImageY = `repeating-linear-gradient(0deg, transparent, transparent ${pxy1}, ${gridColor} ${pxy1}, ${gridColor} ${pxy})`;
        const style = { backgroundImage: `${sBGImageX}, ${sBGImageY}`, backgroundSize: `${pxx} ${pxy}`, width, height };
        return (
            <div className="grid-background" style={style}/>
        );
    }
}
