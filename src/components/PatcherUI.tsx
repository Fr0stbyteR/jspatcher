import * as React from "react";
import { Patcher } from "../core/patcher";
import "./PatcherUI.css";
import { LineUI } from "./LineUI";

export class PatcherUI extends React.Component {
    props: { patcher: Patcher };
    state = {
        locked: this.props.patcher._state.locked,
        presentation: this.props.patcher._state.presentation,
        showGrid: this.props.patcher._state.showGrid
    };
    handleLockedChange = (e: boolean) => this.setState({ locked: e });
    handlePresentationChange = (e: boolean) => this.setState({ presentation: e });
    handleShowGridChange = (e: boolean) => this.setState({ showGrid: e });
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
        let className = "patcher";
        className += this.state.locked ? " locked" : " unlocked";
        if (this.state.presentation) className += " presentation";
        if (this.state.showGrid) className += " show-grid";
        const bgcolor = this.state.locked ? this.props.patcher.props.bgcolor : this.props.patcher.props.editing_bgcolor;
        return (
            <div className={className} style={{ backgroundColor: "rgba(" + bgcolor.join(",") + ")" }}>
                <Grid {...this.props} />
                <Lines {...this.props} />
                <Boxes {...this.props} />
            </div>
        );
    }
}

class Lines extends React.Component {
    props: { patcher: Patcher };
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
    render() {
        const lines = [];
        for (const lineID in this.props.patcher.lines) {
            const line = this.props.patcher.lines[lineID];
            lines.push(<LineUI {...this.props} id={line.id} key={line.id} />);
        }
        return (
            <div className="lines">
                {lines}
            </div>
        );
    }
}

class Boxes extends React.Component {
    props: { patcher: Patcher };
    handleClick = (e: React.MouseEvent) => {
        if (e.ctrlKey) this.props.patcher.setLock(!this.props.patcher._state.locked);
        e.stopPropagation;
    }
    render() {
        return (
            <div className="boxes" onClick={this.handleClick}/>
        );
    }
}

class Grid extends React.Component {
    props: { patcher: Patcher };
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
        const style = { backgroundImage: sBGImageX + ", " + sBGImageY, backgroundSize: pxx + " " + pxy };
        return (
            <div className="grid-background" style={style}/>
        );
    }
}
