import * as React from "react";
import { Menu, Icon } from "semantic-ui-react";
import Patcher from "../core/Patcher";
import "./BottomMenu.scss";

type P = { patcher: Patcher };
type S = { locked: boolean; presentation: boolean; showGrid: boolean };
export default class BottomMenu extends React.PureComponent<P, S> {
    state = {
        locked: this.props.patcher.state.locked,
        presentation: this.props.patcher.state.presentation,
        showGrid: this.props.patcher.state.showGrid
    };
    componentDidMount() {
        this.props.patcher.on("locked", this.handleLockedChange);
        this.props.patcher.on("presentation", this.handlePresentationChange);
        this.props.patcher.on("showGrid", this.handleShowGridChange);
    }
    componentWillUnmount() {
        this.props.patcher.off("locked", this.handleLockedChange);
        this.props.patcher.off("presentation", this.handlePresentationChange);
        this.props.patcher.off("showGrid", this.handleShowGridChange);
    }
    handleLockedChange = (locked: boolean) => this.setState({ locked });
    handleShowGridChange = (showGrid: boolean) => this.setState({ showGrid });
    handlePresentationChange = (presentation: boolean) => this.setState({ presentation });
    handleClickLock = () => this.props.patcher.lock = !this.state.locked;
    handleClickGrid = () => this.props.patcher.showGrid = !this.state.showGrid;
    handleClickPresentation = () => this.props.patcher.presentation = !this.state.presentation;
    render() {
        return (
            <Menu inverted icon size="mini" className="bottom-menu">
                <Menu.Item name="lock" onClick={this.handleClickLock}>
                    <Icon name={this.state.locked ? "lock" : "unlock"} color="grey" size="small" inverted />
                </Menu.Item>
                <Menu.Item name="presentation" onClick={this.handleClickPresentation}>
                    <Icon name="video" color={this.state.presentation ? "teal" : "grey"} size="small" inverted />
                </Menu.Item>
                <Menu.Item name="lock" onClick={this.handleClickGrid}>
                    <Icon name="grid layout" color={this.state.showGrid ? "teal" : "grey"} size="small" inverted />
                </Menu.Item>
            </Menu>
        );
    }
}
