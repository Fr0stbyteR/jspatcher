import * as React from "react";
import BaseUI, { BaseUIProps, BaseUIState } from "./BaseUI";
import type BaseObject from "./BaseObject";

export class DivContainer extends React.PureComponent<{ containerProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>; children?: ChildNode[] }, { root: HTMLDivElement }> {
    root = React.createRef<HTMLDivElement>();
    state = { root: undefined as HTMLDivElement };
    componentDidMount() {
        const root = this.root.current;
        if (this.props.children) this.props.children.forEach(v => root.appendChild(v));
        this.setState({ root });
    }
    componentDidUpdate(prevProps: Readonly<{ children: ChildNode[] }>, prevState: Readonly<{ root: HTMLDivElement }>) {
        if (!this.state.root) return;
        if (this.props.children !== prevProps.children) {
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.root.innerHTML = "";
            this.props.children.forEach(v => this.state.root.appendChild(v));
        }
    }
    render() {
        const { containerProps } = this.props;
        const containerStyle: React.CSSProperties = { width: "100%", height: "100%", position: "absolute", display: "block", overflow: "auto", ...((containerProps && containerProps.style) ? containerProps.style : {}) };
        return (
            <div {...containerProps} style={containerStyle} ref={this.root} />
        );
    }
}
export class ShadowDOMContainer extends React.PureComponent<{ children: ChildNode[] }, { root: ShadowRoot }> {
    root = React.createRef<HTMLDivElement>();
    state = { root: undefined as ShadowRoot };
    componentDidMount() {
        const root = this.root.current.attachShadow({ mode: "open" });
        if (this.props.children) this.props.children.forEach(v => root.appendChild(v));
        this.setState({ root });
    }
    componentDidUpdate(prevProps: Readonly<{ children: ChildNode[] }>, prevState: Readonly<{ root: ShadowRoot }>) {
        if (!this.state.root) return;
        if (this.props.children !== prevProps.children) {
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.root.innerHTML = "";
            this.props.children.forEach(v => this.state.root.appendChild(v));
        }
    }
    render() {
        return (
            <div style={{ width: "100%", height: "100%", position: "absolute", display: "block", overflow: "auto" }} ref={this.root} />
        );
    }
}
export interface DOMUIState extends BaseUIState {
    shadow: boolean;
    containerProps: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
    children: ChildNode[];
}
export default class DOMUI<T extends BaseObject = BaseObject, P extends Partial<BaseUIProps> & Record<string, any> = {}, S extends Partial<DOMUIState> & Record<string, any> = {}> extends BaseUI<T, P & BaseUIProps<T>, S & DOMUIState> {
    static sizing: "horizontal" | "vertical" | "both" | "ratio" = "both";
    static defaultSize: [number, number] = [210, 90];
    state: S & DOMUIState = { ...this.state, children: [] };
    render() {
        return (
            <BaseUI {...this.props}>
                {this.state.shadow ? <ShadowDOMContainer children={this.state.children} /> : <DivContainer containerProps={this.state.containerProps} children={this.state.children} />}
            </BaseUI>
        );
    }
}
