import * as React from "react";
import { Patcher } from "../core/patcher";
import { Box } from "../core/box";
import { BaseUI } from "../core/objects/Base";
import "./BoxUI.scss";

export class BoxUI extends React.Component {
    props: { patcher: Patcher, id: string };
    state: { selected: boolean, rect: [number, number, number, number] };
    innerUI: JSX.Element;
    refDiv = React.createRef() as React.RefObject<HTMLDivElement>;
    refUI = React.createRef() as React.RefObject<BaseUI>;
    editingOnUnlock = false;
    handlingToggleEditOnClick = false;
    dragging = false;
    dragged = false;
    handleResetPos = () => {
        const box = this.props.patcher.boxes[this.props.id];
        if (!box) return null;
        if (this.state && box.rect.every((v, i) => v === this.state.rect[i])) return null;
        this.setState({ rect: box.rect });
        return box;
    }
    handleTextChanged = () => {
        const box = this.props.patcher.boxes[this.props.id];
        if (!box) return null;
        this.innerUI = null;
        this.forceUpdate(() => { // Unmount and remount, please.
            this.innerUI = <box.ui object={box.object} ref={this.refUI} />;
            this.setState({ rect: box.rect }, () => {
                this.inspectRectChange();
            });
        });
        return box;
    }
    handleRectChanged = () => {
        const box = this.props.patcher.boxes[this.props.id];
        if (!box) return null;
        this.setState({ rect: box.rect });
        return box;
    }
    handleBlur = (e: React.FocusEvent) => {
        this.handlingToggleEditOnClick = false;
        this.tryToggleEdit(false);
    }
    handleMouseDown = (e: React.MouseEvent) => {
        if (this.props.patcher._state.locked) return;
        // Handle Draggable
        const handleDraggable = () => {
            this.dragged = false;
            this.dragging = true;
            const patcherDiv = this.refDiv.current.parentElement.parentElement as HTMLDivElement;
            const patcherRect = [0, 0, patcherDiv.clientWidth, patcherDiv.clientHeight];
            let el = patcherDiv;
            do {
                patcherRect[0] += el.offsetLeft;
                patcherRect[1] += el.offsetTop;
                el = el.offsetParent as HTMLDivElement;
            } while (el.offsetParent);
            let patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
            let dragOffset = { x: 0, y: 0 };
            const handleMouseMove = (e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                if (this.dragging && !this.editingOnUnlock && (e.movementX || e.movementY)) {
                    if (!this.dragged) this.dragged = true;
                    dragOffset.x += e.movementX;
                    dragOffset.y += e.movementY;
                    dragOffset = this.props.patcher.moveSelectedBox(this.props.id, dragOffset);
                }
                const x = e.pageX - patcherRect[0];
                const y = e.pageY - patcherRect[1];
                if (x < 10) patcherDiv.scrollLeft += x - 10;
                if (x > patcherRect[2] - 10) patcherDiv.scrollLeft += x + 10 - patcherRect[2];
                if (y < 10) patcherDiv.scrollTop += y - 10;
                if (y > patcherRect[3] - 10) patcherDiv.scrollTop += y + 10 - patcherRect[3];
            };
            const handleMouseUp = (e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                this.dragging = false;
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                patcherDiv.removeEventListener("scroll", handlePatcherScroll);
            };
            const handlePatcherScroll = (e: UIEvent) => {
                const movementX = patcherDiv.scrollLeft - patcherPrevScroll.left;
                const movementY = patcherDiv.scrollTop - patcherPrevScroll.top;
                dragOffset.x += movementX;
                dragOffset.y += movementY;
                patcherPrevScroll = { left: patcherDiv.scrollLeft, top: patcherDiv.scrollTop };
                if (this.dragging && !this.editingOnUnlock && (movementX || movementY)) {
                    if (!this.dragged) this.dragged = true;
                    dragOffset = this.props.patcher.moveSelectedBox(this.props.id, dragOffset);
                }
            };
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
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
        } else {
            if (this.state.selected) {
                if (!this.editingOnUnlock) this.handlingToggleEditOnClick = true; // Handle edit
                handleDraggable();
            } else {
                this.props.patcher.selectOnly(this.props.id);
                handleDraggable();
            }
        }
        e.stopPropagation();
    }
    handleClick = (e: React.MouseEvent) => {
        if (this.handlingToggleEditOnClick && this.state.selected && !this.editingOnUnlock && !this.dragged) this.tryToggleEdit(true);
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
            this.editingOnUnlock = toggled;
            return toggled;
        }
        this.editingOnUnlock = false;
        return false;
    }
    inspectRectChange = () => {
        if (!this.refDiv.current) return;
        const div = this.refDiv.current;
        const divRect = [div.offsetLeft, div.offsetTop, div.offsetWidth, div.offsetHeight] as [number, number, number, number];
        const box = this.props.patcher.boxes[this.props.id];
        if (divRect.every((v, i) => v === this.state.rect[i])) return;
        this.setState({ rect: divRect });
        box.setRect(divRect);
    }
    handleSelected = (id: string) => id === this.props.id ? this.setState({ selected: true }) : null;
    handleDeselected = (id: string) => id === this.props.id ? this.setState({ selected: false }) : null;
    componentWillMount() {
        const box = this.props.patcher.boxes[this.props.id];
        if (!box) return null;
        this.innerUI = <box.ui object={box.object} ref={this.refUI} key="0" />;
        this.props.patcher.deselect(this.props.id);
        this.setState({ selected: false, rect: box.rect });
        return box;
    }
    componentDidMount() {
        const box = this.props.patcher.boxes[this.props.id];
        if (!box) return;
        box.on("textChanged", this.handleTextChanged);
        box.on("rectChanged", this.handleRectChanged);
        this.props.patcher.on("selected", this.handleSelected);
        this.props.patcher.on("deselected", this.handleDeselected);
        this.inspectRectChange();
    }
    componentWillUnmount() {
        this.props.patcher.off("selected", this.handleSelected);
        this.props.patcher.off("deselected", this.handleDeselected);
        const box = this.props.patcher.boxes[this.props.id];
        if (!box) return;
        box.off("textChanged", this.handleTextChanged);
        box.off("rectChanged", this.handleRectChanged);
    }
    render() {
        const box = this.props.patcher.boxes[this.props.id];
        const rect = this.state.rect;
        const divStyle = { left: rect[0], top: rect[1], width: rect[2]/*, height: rect[3]*/ };
        return (
            <div className={"box box-default" + (this.state.selected ? " selected" : "")} id={this.props.id} tabIndex={0} style={divStyle} ref={this.refDiv} onClick={this.handleClick} onBlur={this.handleBlur} onMouseDown={this.handleMouseDown} onKeyDown={this.handleKeyDown}>
                <Inlets patcher={this.props.patcher} box={box} />
                <Outlets patcher={this.props.patcher} box={box} />
                <div className="box-ui">
                    {this.innerUI}
                </div>
            </div>
        );
    }
}
type TInletProps = { isHot: boolean, type: "anything" | "signal" | "object" | "number" | "boolean" | string, description: string };
class Inlets extends React.Component {
    props: { patcher: Patcher, box: Box };
    ports = [] as JSX.Element[];
    componentWillMount() {
        this.handleUpdate();
    }
    componentDidMount() {
        this.props.box.on("textChanged", this.handleUpdate);
    }
    componentWillUnmount() {
        this.props.box.off("textChanged", this.handleUpdate);
    }
    handleUpdate = () => {
        this.ports = [];
        this.forceUpdate(() => {
            for (let i = 0; i < this.props.box.inlets; i++) {
                this.ports.push(<Inlet {...this.props} index={i} key={i} />);
            }
            this.forceUpdate();
        });
    }
    render() {
        return (
            <div className="box-inlets box-ports">
                {this.ports}
            </div>
        );
    }
}
type TOutletProps = { type: "anything" | "signal" | "object" | "number" | "boolean" | string, description: string };
class Outlets extends React.Component {
    props: { patcher: Patcher, box: Box };
    ports = [] as JSX.Element[];
    componentWillMount() {
        this.handleUpdate();
    }
    componentDidMount() {
        this.props.box.on("textChanged", this.handleUpdate);
    }
    componentWillUnmount() {
        this.props.box.off("textChanged", this.handleUpdate);
    }
    handleUpdate = () => {
        this.ports = [];
        this.forceUpdate(() => {
            for (let i = 0; i < this.props.box.outlets; i++) {
                this.ports.push(<Outlet {...this.props} index={i} key={i} />);
            }
            this.forceUpdate();
        });
    }
    render() {
        return (
            <div className="box-outlets box-ports">
                {this.ports}
            </div>
        );
    }
}
class Inlet extends React.Component {
    props: { patcher: Patcher, box: Box, index: number };
    state = { isConnected: this.props.box.inletLines[this.props.index].length > 0, highlight: false };
    dragged = false;
    componentDidMount() {
        this.props.box.on("highlightPort", this.handleHighlight);
        this.props.box.on("connectedPort", this.handleConnectedChange);
        this.props.box.on("disconnectedPort", this.handleConnectedChange);
    }
    componentWillUnmount() {
        this.props.box.off("highlightPort", this.handleHighlight);
        this.props.box.off("connectedPort", this.handleConnectedChange);
        this.props.box.off("disconnectedPort", this.handleConnectedChange);
    }
    handleHighlight = (isSrc: boolean, i: number, highlight: boolean) => {
        if (!isSrc && i === this.props.index && highlight !== this.state.highlight) this.setState({ highlight });
    }
    handleConnectedChange = (isSrc: boolean, i: number) => {
        if (!isSrc && i === this.props.index) this.setState({ isConnected: this.props.box.inletLines[this.props.index].length > 0 });
    }
    handleMouseDown = (e: React.MouseEvent) => {
        if (this.props.patcher._state.locked) return;
        e.stopPropagation();
        this.props.patcher.tempLine(true, [this.props.box.id, this.props.index]);
    }
    render() {
        const box = this.props.box;
        const i = this.props.index;
        let props = { isHot : false, type : "anything", description : "" };
        const meta = box.meta.inlets;
        if (meta && meta.length) props = { ...props, ...(i >= meta.length ? meta[meta.length - 1] : meta[i]) };
        const className = "box-port box-inlet" + (props.isHot ? " box-inlet-hot" : " box-inlet-cold") + (this.state.isConnected ? " box-port-connected" : "") + (this.state.highlight ? " box-port-highlight" : "");
        return (
            <div className={className} onMouseDown={this.handleMouseDown} />
        );
    }
}
class Outlet extends React.Component {
    props: { patcher: Patcher, box: Box, index: number };
    state = { isConnected: this.props.box.outletLines[this.props.index].length > 0, highlight: false };
    dragged = false;
    componentDidMount() {
        this.props.box.on("highlightPort", this.handleHighlight);
        this.props.box.on("connectedPort", this.handleConnectedChange);
        this.props.box.on("disconnectedPort", this.handleConnectedChange);
    }
    componentWillUnmount() {
        this.props.box.off("highlightPort", this.handleHighlight);
        this.props.box.off("connectedPort", this.handleConnectedChange);
        this.props.box.off("disconnectedPort", this.handleConnectedChange);
    }
    handleHighlight = (isSrc: boolean, i: number, highlight: boolean) => {
        if (isSrc && i === this.props.index && highlight !== this.state.highlight) this.setState({ highlight });
    }
    handleConnectedChange = (isSrc: boolean, i: number) => {
        if (isSrc && i === this.props.index) this.setState({ isConnected: this.props.box.outletLines[this.props.index].length > 0 });
    }
    handleMouseDown = (e: React.MouseEvent) => {
        if (this.props.patcher._state.locked) return;
        e.stopPropagation();
        this.props.patcher.tempLine(false, [this.props.box.id, this.props.index]);
    }
    render() {
        const box = this.props.box;
        const i = this.props.index;
        let props = { type : "anything", description : "" };
        const meta = box.meta.outlets;
        if (meta && meta.length) props = { ...props, ...(i >= meta.length ? meta[meta.length - 1] : meta[i]) };
        const className = "box-port box-outlet" + (this.state.isConnected ? " box-port-connected" : "") + (this.state.highlight ? " box-port-highlight" : "");
        return (
            <div className={className} onMouseDown={this.handleMouseDown} />
        );
    }
}
