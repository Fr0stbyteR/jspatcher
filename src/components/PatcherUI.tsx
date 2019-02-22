import * as React from "react";
import { Patcher } from "../core/patcher";
import "./PatcherUI.scss";
import { LineUI } from "./LineUI";
import { BoxUI } from "./BoxUI";

export class PatcherUI extends React.Component {
    props: { patcher: Patcher };
    state = {
        locked: this.props.patcher._state.locked,
        presentation: this.props.patcher._state.presentation,
        showGrid: this.props.patcher._state.showGrid
    };
    refGrid = React.createRef() as React.RefObject<Grid>;
    refBoxes = React.createRef() as React.RefObject<Boxes>;
    refLines = React.createRef() as React.RefObject<Lines>;
    size = { width: 0, height: 0 };
    handleLockedChange = (e: boolean) => this.setState({ locked: e });
    handlePresentationChange = (e: boolean) => this.setState({ presentation: e });
    handleShowGridChange = (e: boolean) => this.setState({ showGrid: e });
    handleScroll = (e: React.UIEvent) => {
        const grid = this.refGrid.current;
        const boxes = this.refBoxes.current;
        const lines = this.refLines.current;
        const div = e.target as HTMLDivElement;
        let needUpdate = false;
        if (div.scrollWidth !== this.size.width || div.scrollHeight !== this.size.height) {
            needUpdate = true;
            this.size.width = div.scrollWidth;
            this.size.height = div.scrollHeight;
        }
        if (needUpdate) [grid, boxes, lines].forEach(el => el.setState({ width: this.size.width + "px", height: this.size.height + "px" }));
    }
    componentDidMount() {
        this.props.patcher.on("lockedChange", this.handleLockedChange);
        this.props.patcher.on("presentationChange", this.handlePresentationChange);
        this.props.patcher.on("showGridChange", this.handleShowGridChange);
    }
    componentWillUnmount() {
        this.props.patcher.off("lockedChange", this.handleLockedChange);
        this.props.patcher.off("presentationChange", this.handlePresentationChange);
        this.props.patcher.off("showGridChange", this.handleShowGridChange);
    }
    render() {
        const classArray = ["patcher"];
        classArray.push(this.state.locked ? "locked" : "unlocked");
        if (this.state.presentation) classArray.push("presentation");
        if (this.state.showGrid) classArray.push("show-grid");
        const bgcolor = this.state.locked ? this.props.patcher.props.bgcolor : this.props.patcher.props.editing_bgcolor;
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
    componentDidMount() {
        this.props.patcher.on("loaded", this.update);
        this.props.patcher.on("createLine", this.update);
        this.props.patcher.on("deleteLine", this.update);
    }
    componentWillUnmount() {
        this.props.patcher.off("createLine", this.update);
        this.props.patcher.off("deleteLine", this.update);
    }
    update = () => this.props.patcher._state.isLoading ? null : this.forceUpdate();
    render() { // TODO: NOT GOOD TO RECALCULATE EACH TIME
        const lines = [];
        for (const lineID in this.props.patcher.lines) {
            const line = this.props.patcher.lines[lineID];
            lines.push(<LineUI {...this.props} id={line.id} key={line.id} />);
        }
        return (
            <div className="lines" style={this.state}>
                {lines}
            </div>
        );
    }
}

class Boxes extends React.Component {
    props: { patcher: Patcher };
    state = { width: "100%", height: "100%" };
    componentDidMount() {
        this.props.patcher.on("loaded", this.update);
        this.props.patcher.on("createBox", this.update);
        this.props.patcher.on("deleteBox", this.update);
    }
    componentWillUnmount() {
        this.props.patcher.off("createBox", this.update);
        this.props.patcher.off("deleteBox", this.update);
    }
    update = () => this.props.patcher._state.isLoading ? null : this.forceUpdate();
    handleClick = (e: React.MouseEvent) => {
        if (e.ctrlKey) this.props.patcher.setLock(!this.props.patcher._state.locked);
        e.stopPropagation;
    }
    render() {
        const boxes = [];
        for (const boxID in this.props.patcher.boxes) {
            const box = this.props.patcher.boxes[boxID];
            boxes.push(<BoxUI {...this.props} id={box.id} key={box.id} />);
        }
        return (
            <div className="boxes" onClick={this.handleClick} style={this.state}>
                {boxes}
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
