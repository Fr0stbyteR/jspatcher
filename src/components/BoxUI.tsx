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
    handleResetPos = () => {
        const box = this.props.patcher.boxes[this.props.id];
        if (!box) return null;
        if (this.state && box.rect.every((v, i) => v === this.state.rect[i])) return null;
        this.setState({ rect: box.rect });
        return box;
    }
    handleReset = () => {
        const box = this.props.patcher.boxes[this.props.id];
        if (!box) return null;
        box.once("textChanged", this.handleReset);
        const innerUI = <box.ui object={box.object} ref={this.refUI}/>;
        this.setState({ innerUI, selected: false, rect: box.rect });
        return box;
    }
    handleFocus = (e: React.FocusEvent) => {
        if (this.props.patcher._state.locked) return;
        this.setState({ selected: true });
    }
    handleBlur = (e: React.FocusEvent) => {
        if (this.props.patcher._state.locked) return;
        const target = e.target as HTMLElement;
        const related = e.relatedTarget as HTMLElement;
        const current = e.currentTarget as HTMLDivElement;
        if (current.contains(related)) return; // is one of Children
        this.tryToggleEdit(false);
        this.setState({ selected: false });
    }
    handleMouseDown = (e: React.MouseEvent) => {
        if (this.props.patcher._state.locked) return;
        if (!this.refDiv.current.contains(e.target as HTMLElement)) return;
        if (this.state.selected) {
            if (!this.editingOnUnlock) this.tryToggleEdit(true);
        } else this.setState({ selected: true });
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
    componentWillMount() {
        const box = this.handleResetPos();
        if (!box) return;
        const innerUI = <box.ui object={box.object} ref={this.refUI}/>;
        this.setState({ innerUI, selected: false });
    }
    componentDidMount() {
        const box = this.props.patcher.boxes[this.props.id];
        if (!box) return;
        box.on("textChanged", this.handleReset);
        this.props.patcher.on("loaded", this.handleReset);
        this.inspectRectChange();
    }
    componentWillUnmount() {
        const box = this.props.patcher.boxes[this.props.id];
        if (!box) return;
        box.off("textChanged", this.handleReset);
        this.props.patcher.off("loaded", this.handleReset);
    }
    render() {
        const box = this.props.patcher.boxes[this.props.id];
        const rect = this.state.rect;
        const divStyle = { left: rect[0], top: rect[1], width: rect[2]/*, height: rect[3]*/ };
        return (
            <div className={"box box-default" + (this.state.selected ? " selected" : "")} id={this.props.id} tabIndex={0} style={divStyle} ref={this.refDiv} onFocus={this.handleFocus} onBlur={this.handleBlur} onMouseDown={this.handleMouseDown} onKeyDown={this.handleKeyDown}>
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
