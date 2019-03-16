import * as React from "react";
import { Patcher } from "../core/patcher";
import { Box } from "../core/Box";
import { Line } from "../core/Line";
import "./PatcherUI.scss";
import { LineUI, TempLineUI } from "./LineUI";
import { BoxUI } from "./BoxUI";

export class PatcherUI extends React.Component {
    props: { patcher: Patcher };
    state = {
        locked: this.props.patcher._state.locked,
        presentation: this.props.patcher._state.presentation,
        showGrid: this.props.patcher._state.showGrid,
        bgcolor: this.props.patcher.props.bgcolor,
        editing_bgcolor: this.props.patcher.props.editing_bgcolor
    };
    refGrid = React.createRef() as React.RefObject<Grid>;
    refBoxes = React.createRef() as React.RefObject<Boxes>;
    refLines = React.createRef() as React.RefObject<Lines>;
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
    componentDidMount() {
        const patcher = this.props.patcher;
        patcher.on("loaded", this.handleLoaded);
        patcher.on("lockedChange", this.handleLockedChange);
        patcher.on("presentationChange", this.handlePresentationChange);
        patcher.on("showGridChange", this.handleShowGridChange);
    }
    componentWillUnmount() {
        const patcher = this.props.patcher;
        patcher.off("loaded", this.handleLoaded);
        patcher.off("lockedChange", this.handleLockedChange);
        patcher.off("presentationChange", this.handlePresentationChange);
        patcher.off("showGridChange", this.handleShowGridChange);
    }
    render() {
        const classArray = ["patcher"];
        classArray.push(this.state.locked ? "locked" : "unlocked");
        if (this.state.presentation) classArray.push("presentation");
        if (this.state.showGrid) classArray.push("show-grid");
        const bgcolor = this.state.locked ? this.state.bgcolor : this.state.editing_bgcolor;
        return (
            <div className={classArray.join(" ")} style={{ backgroundColor: "rgba(" + bgcolor.join(",") + ")" }} onScroll={this.handleScroll}>
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
    lines = {} as { [key: string]: JSX.Element };
    componentDidMount() {
        this.props.patcher.on("loaded", this.onLoaded);
        this.props.patcher.on("createLine", this.onCreateLine);
        this.props.patcher.on("deleteLine", this.onDeleteLine);
    }
    componentWillUnmount() {
        this.props.patcher.off("loaded", this.onLoaded);
        this.props.patcher.off("createLine", this.onCreateLine);
        this.props.patcher.off("deleteLine", this.onDeleteLine);
    }
    onCreateLine = (line: Line) => {
        if (this.props.patcher._state.isLoading) return;
        this.lines[line.id] = <LineUI {...this.props} id={line.id} key={line.id} />;
        this.forceUpdate();
    }
    onDeleteLine = (line: Line) => {
        if (this.props.patcher._state.isLoading) return;
        delete this.lines[line.id];
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
    state = { width: "100%", height: "100%" };
    boxes = {} as { [key: string]: JSX.Element };
    componentDidMount() {
        this.props.patcher.on("loaded", this.onLoaded);
        this.props.patcher.on("createBox", this.onCreateBox);
        this.props.patcher.on("deleteBox", this.onDeleteBox);
    }
    componentWillUnmount() {
        this.props.patcher.off("loaded", this.onLoaded);
        this.props.patcher.off("createBox", this.onCreateBox);
        this.props.patcher.off("deleteBox", this.onDeleteBox);
    }
    onCreateBox = (box: Box) => {
        if (this.props.patcher._state.isLoading) return;
        this.boxes[box.id] = <BoxUI {...this.props} id={box.id} key={box.id} />;
        this.forceUpdate();
    }
    onDeleteBox = (box: Box) => {
        if (this.props.patcher._state.isLoading) return;
        delete this.boxes[box.id];
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
        e.stopPropagation();
    }
    handleClick = (e: React.MouseEvent) => {
        if (e.ctrlKey) this.props.patcher.setLock(!this.props.patcher._state.locked);
        e.stopPropagation();
    }
    render() {
        return (
            <div className="boxes" onMouseDown={this.handleMouseDown} onClick={this.handleClick} style={this.state}>
                {Object.values(this.boxes)}
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
