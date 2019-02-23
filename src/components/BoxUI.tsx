import * as React from "react";
import { Patcher } from "../core/patcher";
import { BaseUI } from "../core/objects/Base";
import "./BoxUI.scss";

export class BoxUI extends React.Component {
    props: { patcher: Patcher, id: string };
    state: { selected: boolean, rect: [number, number, number, number], innerUI: JSX.Element };
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
        const innerUI = <box.ui object={box.object} ref={this.refUI} />;
        this.setState({ innerUI, rect: box.rect });
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
            const handleMouseMove = (e: MouseEvent) => {
                if (this.dragging && !this.editingOnUnlock && (e.movementX || e.movementY)) {
                    if (!this.dragged) this.dragged = true;
                    this.props.patcher.moveSelectedBox(e.movementX, e.movementY);
                }
                e.stopPropagation();
            }
            const handleMouseUp = (e: MouseEvent) => {
                this.dragging = false;
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                e.stopPropagation();
            }
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
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
        const innerUI = <box.ui object={box.object} ref={this.refUI} />;
        this.props.patcher.deselect(this.props.id);
        this.setState({ innerUI, selected: false, rect: box.rect });
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
                <Inlets count={box.inlets} portProps={box.meta.inlets} lines={box.inletLines} />
                <Outlets count={box.outlets} portProps={box.meta.outlets} lines={box.outletLines} />
                <div className="box-ui">
                    {this.state.innerUI}
                </div>
            </div>
        );
    }
}
type TInletProps = { isHot: boolean, type: "anything" | "signal" | "object" | "number" | "boolean" | string, description: string };
class Inlets extends React.Component {
    props: { count: number, portProps: TInletProps[], lines: string[][] };
    render() {
        const inlets = [];
        const props = this.props.portProps;
        for (let i = 0; i < this.props.count; i++) {
            let propsI = { isHot : false, type : "anything", description : "" };
            if (props) propsI = i >= props.length ? props[props.length - 1] : props[i];
            const isConnected = this.props.lines[i].length > 0;
            inlets.push(<Inlet {...propsI} key={i} isConnected={isConnected} />);
        }
        return (
            <div className="box-inlets box-ports">
                {inlets}
            </div>
        );
    }
}
type TOutletProps = { type: "anything" | "signal" | "object" | "number" | "boolean" | string, description: string };
class Outlets extends React.Component {
    props: { count: number, portProps: TOutletProps[], lines: string[][] };
    render() {
        const outlets = [];
        const props = this.props.portProps;
        for (let i = 0; i < this.props.count; i++) {
            let propsI = { type : "anything", description : "" };
            if (props) propsI = i >= props.length ? props[props.length - 1] : props[i];
            const isConnected = this.props.lines[i].length > 0;
            outlets.push(<Outlet {...propsI} key={i} isConnected={isConnected}/>);
        }
        return (
            <div className="box-outlets box-ports">
                {outlets}
            </div>
        );
    }
}
class Inlet extends React.Component {
    props: { isHot: boolean, type: "anything" | "signal" | "object" | "number" | "boolean" | string, description: string, isConnected: boolean };
    render() {
        return (
            <div className={"box-port box-inlet" + (this.props.isHot ? " box-inlet-hot" : " box-inlet-cold") + (this.props.isConnected ? " box-port-connected" : "")} />
        );
    }
}
class Outlet extends React.Component {
    props: { type: "anything" | "signal" | "object" | "number" | "boolean" | string, description: string, isConnected: boolean };
    render() {
        return (
            <div className={"box-port box-outlet" + (this.props.isConnected ? " box-port-connected" : "")} />
        );
    }
}
