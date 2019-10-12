import * as React from "react";
import { Popup } from "semantic-ui-react";
import Patcher from "../core/Patcher";
import Box from "../core/Box";
import { BaseUI, BaseObject } from "../core/objects/Base";
import "./BoxUI.scss";
import { TResizeHandlerType } from "../core/types";

type P = { patcher: Patcher; id: string };
type S = { selected: boolean; rect: [number, number, number, number]; innerUI: JSX.Element; sizing: "horizontal" | "vertical" | "both" | "ratio" };
export default class BoxUI extends React.Component<P, S> {
    refDiv = React.createRef<HTMLDivElement>();
    refUI = React.createRef<BaseUI<BaseObject>>();
    editing = false;
    handlingToggleEditOnClick = false;
    dragging = false;
    dragged = false;
    state = (() => {
        const box = this.props.patcher.boxes[this.props.id];
        return { selected: false, rect: box.rect.slice(), innerUI: <box.ui object={box.object} ref={this.refUI} key="0" />, sizing: "horizontal" };
    })() as S;
    handleResetPos = () => {
        const box = this.props.patcher.boxes[this.props.id];
        if (!box) return null;
        if (this.state && box.rect.every((v, i) => v === this.state.rect[i])) return null;
        this.setState({ rect: box.rect.slice() as [number, number, number, number] });
        return box;
    }
    handleTextChanged = () => {
        const box = this.props.patcher.boxes[this.props.id];
        if (!box) return null;
        this.setState({ rect: box.rect.slice() as [number, number, number, number], innerUI: <box.ui object={box.object} ref={this.refUI} />, sizing: box.ui.sizing }, () => this.inspectRectChange());
        return box;
    }
    handleRectChanged = () => {
        const box = this.props.patcher.boxes[this.props.id];
        if (!box) return null;
        if (box.rect.every((v, i) => v === this.state.rect[i])) return box;
        this.setState({ rect: box.rect.slice() as [number, number, number, number] }, () => this.inspectRectChange());
        return box;
    }
    handleBlur = () => {
        this.handlingToggleEditOnClick = false;
        this.tryToggleEdit(false);
    }
    handleMouseDown = (e: React.MouseEvent) => {
        if (this.props.patcher._state.locked) return;
        if (e.button !== 0) return;
        const box = this.props.patcher.boxes[this.props.id];
        // Handle Draggable
        const handleDraggable = () => {
            this.dragged = false;
            this.dragging = true;
            const patcherDiv = this.refDiv.current.parentElement.parentElement as HTMLDivElement;
            const patcherRect = patcherDiv.getBoundingClientRect();
            let patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
            let dragOffset = { x: 0, y: 0 };
            const origOffset = box.rect.slice(0, 2);
            const handleMouseMove = (e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                if (this.dragging && !this.editing && (e.movementX || e.movementY)) {
                    if (!this.dragged) this.dragged = true;
                    dragOffset.x += e.movementX;
                    dragOffset.y += e.movementY;
                    dragOffset = this.props.patcher.moveSelectedBox(this.props.id, dragOffset);
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
                if (this.dragging && !this.editing && (movementX || movementY)) {
                    if (!this.dragged) this.dragged = true;
                    dragOffset = this.props.patcher.moveSelectedBox(this.props.id, dragOffset);
                }
            };
            const handleKey = (e: KeyboardEvent) => {
                e.stopPropagation();
                e.preventDefault();
            };
            const handleMouseUp = (e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                this.dragging = false;
                const totalOffset = { x: box.rect[0] - origOffset[0], y: box.rect[1] - origOffset[1] };
                if (this.dragged) this.props.patcher.moveEnd(totalOffset);
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                this.refDiv.current.removeEventListener("keydown", handleKey);
                this.refDiv.current.removeEventListener("keyup", handleKey);
                patcherDiv.removeEventListener("scroll", handlePatcherScroll);
            };
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            this.refDiv.current.addEventListener("keydown", handleKey);
            this.refDiv.current.addEventListener("keyup", handleKey);
            patcherDiv.addEventListener("scroll", handlePatcherScroll);
        };
        // Handle select
        if (e.shiftKey) {
            if (this.state.selected) {
                this.props.patcher.deselect(this.props.id);
            } else {
                this.props.patcher.select(this.props.id);
                handleDraggable();
            }
        } else if (this.state.selected) {
            if (!this.editing) this.handlingToggleEditOnClick = true; // Handle edit
            handleDraggable();
        } else {
            this.props.patcher.selectOnly(this.props.id);
            handleDraggable();
        }
        e.stopPropagation();
    }
    handleClick = (e: React.MouseEvent) => {
        if (this.handlingToggleEditOnClick && this.state.selected && !this.editing && !this.dragged) this.tryToggleEdit(true);
        e.stopPropagation();
    }
    handleKeyDown = (e: React.KeyboardEvent) => {
        if (this.props.patcher._state.locked) return;
        if (e.key === "Enter") {
            if (this.tryToggleEdit()) e.preventDefault();
            else this.refDiv.current.focus();
        }
    }
    tryToggleEdit = (bool?: boolean) => {
        if (this.refUI.current && this.refUI.current.editableOnUnlock) {
            const toggled = this.refUI.current.toggleEdit(bool);
            this.editing = toggled;
            return toggled;
        }
        this.editing = false;
        return false;
    }
    /**
     * if calculated width and height is different from expected, update rect
     *
     * @memberof BoxUI
     */
    inspectRectChange = () => {
        if (!this.refDiv.current) return;
        const div = this.refDiv.current;
        const divRect = div.getBoundingClientRect();
        const box = this.props.patcher.boxes[this.props.id];
        if (divRect.width === box.rect[2] && divRect.height === box.rect[3]) return;
        const rect = [box.rect[0], box.rect[1], divRect.width, divRect.height] as [number, number, number, number];
        this.setState({ rect });
        box.setRect(rect);
    }
    handleSelected = (id: string) => (id === this.props.id ? this.setState({ selected: true }) : null);
    handleDeselected = (id: string) => (id === this.props.id ? this.setState({ selected: false }) : null);
    handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (this.props.patcher._state.locked) return;
        const classList = e.currentTarget.classList;
        const typeMap: { [key: string]: TResizeHandlerType } = {
            "resize-handler-n": "n",
            "resize-handler-ne": "ne",
            "resize-handler-e": "e",
            "resize-handler-se": "se",
            "resize-handler-s": "s",
            "resize-handler-sw": "sw",
            "resize-handler-w": "w",
            "resize-handler-nw": "nw"
        };
        let type: TResizeHandlerType;
        for (const key in typeMap) {
            if (classList.contains(key)) {
                type = typeMap[key];
            }
        }
        // Handle Draggable
        this.dragged = false;
        this.dragging = true;
        const patcherDiv = this.refDiv.current.parentElement.parentElement as HTMLDivElement;
        const patcherRect = patcherDiv.getBoundingClientRect();
        let patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
        let dragOffset = { x: 0, y: 0 };
        const totalOffset = { x: 0, y: 0 };
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.dragging && (e.movementX || e.movementY)) {
                if (!this.dragged) this.dragged = true;
                dragOffset.x += e.movementX;
                dragOffset.y += e.movementY;
                dragOffset = this.props.patcher.resizeSelectedBox(this.props.id, dragOffset, type);
                totalOffset.x += e.movementX;
                totalOffset.y += e.movementY;
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
            if (this.dragging && !this.editing && (movementX || movementY)) {
                if (!this.dragged) this.dragged = true;
                dragOffset = this.props.patcher.resizeSelectedBox(this.props.id, dragOffset, type);
            }
            totalOffset.x += movementX;
            totalOffset.y += movementY;
        };
        const handleKey = (e: KeyboardEvent) => {
            e.stopPropagation();
            e.preventDefault();
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            this.dragging = false;
            totalOffset.x -= dragOffset.x;
            totalOffset.y -= dragOffset.y;
            if (this.dragged) this.props.patcher.resizeEnd(totalOffset, type);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            this.refDiv.current.removeEventListener("keydown", handleKey);
            this.refDiv.current.removeEventListener("keyup", handleKey);
            patcherDiv.removeEventListener("scroll", handlePatcherScroll);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        this.refDiv.current.addEventListener("keydown", handleKey);
        this.refDiv.current.addEventListener("keyup", handleKey);
        patcherDiv.addEventListener("scroll", handlePatcherScroll);
        e.stopPropagation();
    };
    componentDidMount() {
        const box = this.props.patcher.boxes[this.props.id];
        if (!box) return;
        this.setState({ selected: this.props.patcher._state.selected.indexOf(box.id) !== -1 });
        box.on("textChanged", this.handleTextChanged);
        box.on("rectChanged", this.handleRectChanged);
        this.props.patcher.on("selected", this.handleSelected);
        this.props.patcher.on("deselected", this.handleDeselected);
        this.inspectRectChange();
    }
    componentWillUnmount() {
        this.props.patcher.deselect(this.props.id);
        this.props.patcher.off("selected", this.handleSelected);
        this.props.patcher.off("deselected", this.handleDeselected);
        const box = this.props.patcher.boxes[this.props.id];
        if (!box) return;
        box.off("textChanged", this.handleTextChanged);
        box.off("rectChanged", this.handleRectChanged);
    }
    render() {
        const box = this.props.patcher.boxes[this.props.id];
        if (!box) return null;
        const rect = this.state.rect;
        const divStyle = {
            left: rect[0],
            top: rect[1],
            width: this.state.sizing === "vertical" ? undefined : rect[2],
            height: this.state.sizing === "horizontal" ? undefined : rect[3]
        };
        return (
            <div className={"box box-default" + (this.state.selected ? " selected" : "")} id={this.props.id} tabIndex={0} style={divStyle} ref={this.refDiv} onClick={this.handleClick} onBlur={this.handleBlur} onMouseDown={this.handleMouseDown} onKeyDown={this.handleKeyDown}>
                <Inlets patcher={this.props.patcher} box={box} />
                <Outlets patcher={this.props.patcher} box={box} />
                <div className={"resize-handlers resize-handlers-" + this.state.sizing}>
                    <div className="resize-handler resize-handler-n" onMouseDown={this.handleResizeMouseDown}></div>
                    <div className="resize-handler resize-handler-ne" onMouseDown={this.handleResizeMouseDown}></div>
                    <div className="resize-handler resize-handler-e" onMouseDown={this.handleResizeMouseDown}></div>
                    <div className="resize-handler resize-handler-se" onMouseDown={this.handleResizeMouseDown}></div>
                    <div className="resize-handler resize-handler-s" onMouseDown={this.handleResizeMouseDown}></div>
                    <div className="resize-handler resize-handler-sw" onMouseDown={this.handleResizeMouseDown}></div>
                    <div className="resize-handler resize-handler-w" onMouseDown={this.handleResizeMouseDown}></div>
                    <div className="resize-handler resize-handler-nw" onMouseDown={this.handleResizeMouseDown}></div>
                </div>
                <div className="box-ui">
                    {this.state.innerUI}
                </div>
            </div>
        );
    }
}
class Inlets extends React.Component<{ patcher: Patcher; box: Box }, { ports: JSX.Element[] }> {
    get ports() {
        const ports: JSX.Element[] = [];
        for (let i = 0; i < this.props.box.inlets; i++) {
            ports.push(<Inlet {...this.props} index={i} key={i} />);
        }
        return ports;
    }
    state = { ports: this.ports };
    componentDidMount() {
        this.props.box.on("textChanged", this.handleUpdate);
    }
    componentWillUnmount() {
        if (!this.props.box) return;
        this.props.box.off("textChanged", this.handleUpdate);
    }
    handleUpdate = () => {
        this.setState({ ports: this.ports });
    }
    render() {
        return (
            <div className="box-inlets box-ports">
                {this.state.ports}
            </div>
        );
    }
}
class Outlets extends React.Component<{ patcher: Patcher; box: Box }, { ports: JSX.Element[] }> {
    get ports() {
        const ports: JSX.Element[] = [];
        for (let i = 0; i < this.props.box.outlets; i++) {
            ports.push(<Outlet {...this.props} index={i} key={i} />);
        }
        return ports;
    }
    state = { ports: this.ports };
    componentDidMount() {
        this.props.box.on("textChanged", this.handleUpdate);
    }
    componentWillUnmount() {
        if (!this.props.box) return;
        this.props.box.off("textChanged", this.handleUpdate);
    }
    handleUpdate = () => {
        this.setState({ ports: this.ports });
    }
    render() {
        return (
            <div className="box-outlets box-ports">
                {this.ports}
            </div>
        );
    }
}
class Inlet extends React.Component<{ patcher: Patcher; box: Box; index: number }, { isConnected: boolean; highlight: boolean }> {
    state = { isConnected: this.props.box.inletLines[this.props.index].length > 0, highlight: false };
    dragged = false;
    componentDidMount() {
        this.props.box.on("highlightPort", this.handleHighlight);
        this.props.box.on("connectedPort", this.handleConnectedChange);
        this.props.box.on("disconnectedPort", this.handleConnectedChange);
    }
    componentWillUnmount() {
        if (!this.props.box) return;
        this.props.box.off("highlightPort", this.handleHighlight);
        this.props.box.off("connectedPort", this.handleConnectedChange);
        this.props.box.off("disconnectedPort", this.handleConnectedChange);
    }
    handleHighlight = (e: { isSrc: boolean; i: number; highlight: boolean }) => {
        const { isSrc, i, highlight } = e;
        if (!isSrc && i === this.props.index && highlight !== this.state.highlight) this.setState({ highlight });
    }
    handleConnectedChange = (e: { isSrc: boolean; i: number }) => {
        const { isSrc, i } = e;
        if (!isSrc && i === this.props.index) this.setState({ isConnected: this.props.box.inletLines[this.props.index].length > 0 });
    }
    handleMouseDown = (e: React.MouseEvent) => {
        if (this.props.patcher._state.locked) return;
        if (e.button !== 0) return;
        if (e.target !== e.currentTarget) return;
        e.stopPropagation();
        this.props.patcher.tempLine(true, [this.props.box.id, this.props.index]);
    }
    handleMouseEnter = (e: React.MouseEvent) => {
        if (this.props.patcher._state.locked) return;
        if (e.buttons) return;
        this.setState({ highlight: true });
    }
    handleMouseMove = (e: React.MouseEvent) => {
        if (this.props.patcher._state.locked) return;
        if (e.currentTarget !== e.target) this.setState({ highlight: false });
    }
    handleMouseLeave = (e: React.MouseEvent) => {
        if (this.props.patcher._state.locked) return;
        this.setState({ highlight: false });
    }
    render() {
        const box = this.props.box;
        const i = this.props.index;
        let props = { isHot: false, type: "anything", description: "" };
        const meta = box.meta.inlets;
        if (meta && meta.length) props = { ...props, ...(i >= meta.length ? meta[meta.length - 1] : meta[i]) };
        const className = "box-port box-inlet" + (props.isHot ? " box-inlet-hot" : " box-inlet-cold") + (this.state.isConnected ? " box-port-connected" : "") + (this.state.highlight ? " box-port-highlight" : "");
        return (
            <div className={className} onMouseDown={this.handleMouseDown} onMouseEnter={this.handleMouseEnter} onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseLeave}>
                <Popup
                    trigger={<div style={{ pointerEvents: "none" }} />}
                    content={<>{props.description.length ? <span>{props.description}: </span> : undefined}<span style={{ color: "#30a0a0" }}>{props.type}</span></>}
                    position="top center"
                    open={this.state.highlight}
                    size="mini"
                    inverted
                />
            </div>
        );
    }
}
class Outlet extends React.Component< { patcher: Patcher; box: Box; index: number }, { isConnected: boolean; highlight: boolean }> {
    state = { isConnected: this.props.box.outletLines[this.props.index].length > 0, highlight: false };
    dragged = false;
    componentDidMount() {
        this.props.box.on("highlightPort", this.handleHighlight);
        this.props.box.on("connectedPort", this.handleConnectedChange);
        this.props.box.on("disconnectedPort", this.handleConnectedChange);
    }
    componentWillUnmount() {
        if (!this.props.box) return;
        this.props.box.off("highlightPort", this.handleHighlight);
        this.props.box.off("connectedPort", this.handleConnectedChange);
        this.props.box.off("disconnectedPort", this.handleConnectedChange);
    }
    handleHighlight = (e: { isSrc: boolean; i: number; highlight: boolean }) => {
        const { isSrc, i, highlight } = e;
        if (isSrc && i === this.props.index && highlight !== this.state.highlight) this.setState({ highlight });
    }
    handleConnectedChange = (e: { isSrc: boolean; i: number }) => {
        const { isSrc, i } = e;
        if (isSrc && i === this.props.index) this.setState({ isConnected: this.props.box.outletLines[this.props.index].length > 0 });
    }
    handleMouseDown = (e: React.MouseEvent) => {
        if (this.props.patcher._state.locked) return;
        if (e.button !== 0) return;
        if (e.target !== e.currentTarget) return;
        e.stopPropagation();
        this.props.patcher.tempLine(false, [this.props.box.id, this.props.index]);
    }
    handleMouseEnter = (e: React.MouseEvent) => {
        if (this.props.patcher._state.locked) return;
        if (e.buttons) return;
        this.setState({ highlight: true });
    }
    handleMouseLeave = () => {
        if (this.props.patcher._state.locked) return;
        this.setState({ highlight: false });
    }
    handleMouseMove = (e: React.MouseEvent) => {
        if (this.props.patcher._state.locked) return;
        if (e.currentTarget !== e.target) this.setState({ highlight: false });
    }
    render() {
        const box = this.props.box;
        const i = this.props.index;
        let props = { type: "anything", description: "" };
        const meta = box.meta.outlets;
        if (meta && meta.length) props = { ...props, ...(i >= meta.length ? meta[meta.length - 1] : meta[i]) };
        const className = "box-port box-outlet" + (this.state.isConnected ? " box-port-connected" : "") + (this.state.highlight ? " box-port-highlight" : "");
        return (
            <div className={className} onMouseDown={this.handleMouseDown} onMouseEnter={this.handleMouseEnter} onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseLeave}>
                <Popup
                    trigger={<div />}
                    content={<>{props.description.length ? <span>{props.description}: </span> : undefined}<span style={{ color: "#30a0a0" }}>{props.type}</span></>}
                    position="bottom center"
                    open={this.state.highlight}
                    size="mini"
                    inverted
                />
            </div>
        );
    }
}
