import * as React from "react";
import { Patcher } from "../core/patcher";
import "./BoxUI.scss";

export class BoxUI extends React.Component {
    props: { patcher: Patcher, id: string };
    state: { selected: boolean, patching_rect: [number, number, number, number], innerUI: JSX.Element };
    refDiv = React.createRef() as React.RefObject<HTMLDivElement>;
    handleResetPos = () => {
        const box = this.props.patcher.boxes[this.props.id];
        if (!box) return null;
        this.setState({ patching_rect: box.patching_rect });
        return box;
    }
    handleBlur = (e: React.FocusEvent) => {
        const boxDiv = e.target as HTMLDivElement;
        const related = e.relatedTarget as HTMLDivElement;
        if (related && boxDiv.contains(related)) return; // is one of Children
        this.setState({ selected: false });
    }
    handleMouseDown = (e: React.MouseEvent) => {
        if (this.props.patcher._state.locked) return;
        if (!this.state.selected) this.setState({ selected: true });
    }
    updateBoxRect = () => {
        const box = this.props.patcher.boxes[this.props.id];
        if (this.refDiv.current) {
            const div = this.refDiv.current;
            box.patching_rect = [div.offsetLeft, div.offsetTop, div.offsetWidth, div.offsetHeight];
        }
    }
    componentWillMount() {
        const box = this.handleResetPos();
        this.setState({ selected: false, innerUI: box.ui });
        if (!box) return;
        this.props.patcher.on("loaded", this.handleResetPos);
    }
    componentDidMount() {
        this.updateBoxRect();
    }
    componentWillUnmount() {
        this.props.patcher.off("loaded", this.handleResetPos);
        const box = this.props.patcher.lines[this.props.id];
        if (!box) return;
    }
    render() {
        const box = this.props.patcher.boxes[this.props.id];
        const rect = this.state.patching_rect;
        const divStyle = { left: rect[0], top: rect[1], width: rect[2]/*, height: rect[3]*/ };
        return (
            <div className={"box box-default" + (this.state.selected ? " selected" : "")} id={this.props.id} tabIndex={0} style={divStyle} ref={this.refDiv} onBlur={this.handleBlur} onMouseDown={this.handleMouseDown}>
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
