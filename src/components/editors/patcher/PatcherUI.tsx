import * as React from "react";
import * as Color from "color-js";
import BoxUI from "./BoxUI";
import LineUI, { TempLineUI } from "./LineUI";
import { round } from "../../../utils/math";
import type PatcherEditor from "../../../core/patcher/PatcherEditor";
import type { RawPatcher, TRect } from "../../../core/types";
import "./PatcherUI.scss";

interface P {
    editor: PatcherEditor;
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
        locked: this.props.runtime || this.props.editor.state.locked,
        presentation: this.props.editor.state.presentation,
        showGrid: this.props.editor.state.showGrid,
        bgColor: this.props.editor.props.bgColor,
        editingBgColor: this.props.editor.props.editingBgColor,
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
    handleReady = () => {
        const { editor } = this.props;
        this.setState({ bgColor: editor.props.bgColor, editingBgColor: editor.props.editingBgColor, presentation: editor.state.presentation });
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
        this.props.editor.setActive();
        if (!e.shiftKey) this.props.editor.deselectAll();
        if (e.button !== 0) return;
        if (this.props.editor.state.locked) return;
        this.dragged = false;
        // Handle Draggable
        const handleDraggable = () => {
            const patcherDiv = this.refDiv.current;
            const patcherRect = patcherDiv.getBoundingClientRect();
            if (patcherRect.top + patcherDiv.clientHeight < e.clientY || patcherRect.left + patcherDiv.clientWidth < e.clientX) return; // Click on scrollbar
            let patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
            const selectedBefore = this.props.editor.state.selected.slice();
            const selectionRect = [e.clientX - patcherRect.left + patcherDiv.scrollLeft, e.clientY - patcherRect.top + patcherDiv.scrollTop, 0, 0] as TRect;
            const handleMouseMove = (e: MouseEvent) => {
                this.dragged = true;
                e.stopPropagation();
                e.preventDefault();
                if (e.movementX || e.movementY) {
                    selectionRect[2] = e.clientX - patcherRect.left + patcherDiv.scrollLeft;
                    selectionRect[3] = e.clientY - patcherRect.top + patcherDiv.scrollTop;
                    this.setState({ selectionRect: selectionRect.slice() as TRect });
                    this.props.editor.selectRegion(selectionRect, selectedBefore);
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
                    this.props.editor.selectRegion(selectionRect, selectedBefore);
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
        const ctrlKey = this.props.editor.env.os === "MacOS" ? e.metaKey : e.ctrlKey;
        if (ctrlKey && !this.props.editor.state.selected.length) this.props.editor.setState({ locked: !this.props.editor.state.locked });
    };
    handleDoubleClick = (e: React.MouseEvent) => {
        if (this.dragged) return;
        const { editor: patcher, runtime } = this.props;
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
        const { presentation } = patcher.state;
        this.props.editor.createBox({ text: "", inlets: 0, outlets: 0, rect: [x, y, 0, 0], presentation, _editing: true });
    };
    handleKeyDown = (e: KeyboardEvent) => {
        const { editor: patcher, runtime } = this.props;
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
            if (!e.shiftKey && patcher.state.snapToGrid) {
                x *= patcher.props.grid[0];
                y *= patcher.props.grid[1];
            }
            patcher.moveSelectedBox({ x, y });
        } else if ((e.key === "n" || e.key === "m" || e.key === "b" || e.key === "c" || e.key === "i" || e.key === "f" || e.key === "s" || e.key === "t") && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
            e.stopPropagation();
            e.preventDefault();
            const patcherDiv = this.refDiv.current as HTMLDivElement;
            if (!patcherDiv) return;
            const patcherRect = patcherDiv.getBoundingClientRect();
            const [gridX, gridY] = patcher.props.grid;
            const x = round(Math.max(0, this.cachedMousePos.x - patcherRect.left + patcherDiv.scrollLeft), gridX);
            const y = round(Math.max(0, this.cachedMousePos.y - patcherRect.top + patcherDiv.scrollTop), gridY);
            let text = "";
            const { presentation } = patcher.state;
            const { mode } = patcher.props;
            if (mode === "js" && e.key === "f") text = 'ui.number @format "Decimal (Floating-Point)"';
            else if (mode === "js" && e.key === "m") text = "message";
            else if (e.key === "c") text = "comment";
            else if (mode === "js" && e.key === "b") text = "live.button";
            else if (mode === "js" && e.key === "i") text = "ui.number";
            else if (mode === "js" && e.key === "s") text = "ui.slider";
            else if (mode === "js" && e.key === "t") text = "live.toggle";
            this.props.editor.createBox({ text, inlets: 0, outlets: 0, rect: [x, y, 0, 0], presentation, _editing: true });
        }
    };
    handleMouseMove = (e: React.MouseEvent) => this.cachedMousePos = { x: e.clientX, y: e.clientY };
    componentDidMount() {
        const { editor } = this.props;
        const { instance: patcher } = editor;
        editor.on("locked", this.handleLockedChange);
        editor.on("presentation", this.handlePresentationChange);
        editor.on("showGrid", this.handleShowGridChange);
        editor.on("ready", this.handleReady);
        patcher.on("bgColor", this.handleBgColorChange);
        patcher.on("editingBgColor", this.handleEditingBgColorChange);
        document.addEventListener("keydown", this.handleKeyDown);
    }
    componentWillUnmount() {
        const { editor } = this.props;
        const { instance: patcher } = editor;
        editor.off("locked", this.handleLockedChange);
        editor.off("presentation", this.handlePresentationChange);
        editor.off("showGrid", this.handleShowGridChange);
        editor.off("ready", this.handleReady);
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

interface LinesProps {
    editor: PatcherEditor;
    runtime?: boolean;
}

interface LinesState {
    width: string;
    height: string;
    timestamp: number;
}

class Lines extends React.PureComponent<LinesProps, LinesState> {
    state: LinesState = {
        width: "100%",
        height: "100%",
        timestamp: performance.now()
    };
    lines: Record<string, JSX.Element> = {};
    componentDidMount() {
        const { editor } = this.props;
        editor.on("create", this.handleCreate);
        editor.on("delete", this.handleDelete);
        if (editor.isReady) this.handleReady();
        else editor.on("ready", this.handleReady);
    }
    componentWillUnmount() {
        const { editor } = this.props;
        editor.off("create", this.handleCreate);
        editor.off("delete", this.handleDelete);
        editor.off("ready", this.handleReady);
    }
    handleCreate = (created: RawPatcher) => {
        Object.keys(created.lines).forEach((id) => {
            const line = created.lines[id];
            this.lines[line.id] = <LineUI {...this.props} id={line.id} key={this.state.timestamp + line.id} />;
        });
        this.setState({ timestamp: performance.now() });
    };
    handleDelete = (deleted: RawPatcher) => {
        Object.keys(deleted.lines).forEach(id => delete this.lines[id]);
        this.setState({ timestamp: performance.now() });
    };
    handleReady = () => {
        for (const lineId in this.lines) {
            delete this.lines[lineId];
        }
        for (const lineId in this.props.editor.lines) {
            const line = this.props.editor.lines[lineId];
            this.lines[lineId] = <LineUI {...this.props} id={line.id} key={this.state.timestamp + line.id} />;
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
interface BoxesProps {
    editor: PatcherEditor;
    runtime?: boolean;
}
interface BoxesState {
    width: string;
    height: string;
    timestamp: number;
}
class Boxes extends React.PureComponent<BoxesProps, BoxesState> {
    state: BoxesState = {
        width: "100%",
        height: "100%",
        timestamp: performance.now()
    };
    boxes: Record<string, JSX.Element> = {};
    zIndexes: Record<string, number> = {};
    handleCreate = (created: RawPatcher) => {
        Object.keys(created.boxes).forEach((id, i) => {
            const box = created.boxes[id];
            this.boxes[box.id] = <BoxUI {...this.props} id={box.id} key={box.id} scrollIntoView={i === 0}/>;
            this.zIndexes[box.id] = box.zIndex || 0;
        });
        this.setState({ timestamp: performance.now() });
    };
    handleDelete = (deleted: RawPatcher) => {
        Object.keys(deleted.boxes).forEach((id) => {
            delete this.boxes[id];
            delete this.zIndexes[id];
        });
        this.setState({ timestamp: performance.now() });
    };
    handleZIndexChanged = ({ boxId, zIndex }: { boxId: string; zIndex: number }) => {
        this.zIndexes[boxId] = zIndex;
        this.setState({ timestamp: performance.now() });
    };
    handleReady = () => {
        for (const boxId in this.boxes) {
            delete this.boxes[boxId];
            delete this.zIndexes[boxId];
        }
        for (const boxId in this.props.editor.boxes) {
            const box = this.props.editor.boxes[boxId];
            this.boxes[boxId] = <BoxUI {...this.props} id={box.id} key={box.id} />;
            this.zIndexes[box.id] = box.zIndex || 0;
        }
        this.setState({ timestamp: performance.now() });
    };
    componentDidMount() {
        const { editor } = this.props;
        editor.on("create", this.handleCreate);
        editor.on("delete", this.handleDelete);
        editor.on("zIndexChanged", this.handleZIndexChanged);
        if (editor.isReady) this.handleReady();
        else editor.on("ready", this.handleReady);
    }
    componentWillUnmount() {
        const { editor } = this.props;
        editor.off("create", this.handleCreate);
        editor.off("delete", this.handleDelete);
        editor.off("ready", this.handleReady);
        editor.off("zIndexChanged", this.handleZIndexChanged);
    }
    render() {
        return (
            <div className="boxes" style={this.state}>
                {Object.entries(this.boxes).sort(([a], [b]) => this.zIndexes[a] - this.zIndexes[b]).map(([, jsx]) => jsx)}
            </div>
        );
    }
}

interface GridProps {
    editor: PatcherEditor;
}

interface GridState {
    width: string;
    height: string;
    grid: [number, number];
    editingBgColor: string;
}

class Grid extends React.PureComponent<GridProps, GridState> {
    state: GridState = {
        width: "100%",
        height: "100%",
        grid: this.props.editor.props.grid,
        editingBgColor: this.props.editor.props.editingBgColor
    };
    handleReady = () => {
        const { grid, editingBgColor } = this.props.editor.props;
        this.setState({ grid: grid.slice() as [number, number], editingBgColor });
    };
    handleGridChange = (grid: [number, number]) => this.setState({ grid: grid.slice() as [number, number] });
    handleEditingBgColorChange = (editingBgColor: string) => this.setState({ editingBgColor });
    componentDidMount() {
        const { editor } = this.props;
        const { instance: patcher } = editor;
        patcher.on("grid", this.handleGridChange);
        patcher.on("editingBgColor", this.handleEditingBgColorChange);
        if (editor.isReady) this.handleReady();
        else editor.on("ready", this.handleReady);
    }
    componentWillUnmount() {
        const { editor } = this.props;
        const { instance: patcher } = editor;
        patcher.off("grid", this.handleGridChange);
        patcher.off("editingBgColor", this.handleEditingBgColorChange);
        editor.off("ready", this.handleReady);
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
