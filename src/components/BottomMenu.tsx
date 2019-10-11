import * as React from "react";
import { Menu, Icon } from "semantic-ui-react";
import Patcher from "../core/Patcher";
import "./BottomMenu.scss";

type P = { patcher: Patcher };
type S = { locked: boolean; showGrid: boolean };
export default class BottomMenu extends React.Component<P, S> {
    state = { locked: this.props.patcher._state.locked, showGrid: this.props.patcher._state.showGrid };
    componentDidMount() {
        this.props.patcher.on("locked", this.handleLockedChange);
        this.props.patcher.on("showGrid", this.handleShowGridChange);
    }
    componentWillUnmount() {
        this.props.patcher.off("locked", this.handleLockedChange);
        this.props.patcher.off("showGrid", this.handleShowGridChange);
    }
    handleLockedChange = (locked: boolean) => this.setState({ locked });
    handleShowGridChange = (showGrid: boolean) => this.setState({ showGrid });
    handleClickLock = () => this.props.patcher.setLock(!this.state.locked);
    handleClickGrid = () => this.props.patcher.setShowGrid(!this.state.showGrid);
    render() {
        return (
            <Menu inverted icon size="mini" fixed={"bottom"} id="bottom-menu">
                <Menu.Item name="lock" onClick={this.handleClickLock}>
                    <Icon name={this.state.locked ? "lock" : "unlock"} color="grey" size="small" inverted />
                </Menu.Item>
                <Menu.Item name="lock" onClick={this.handleClickGrid}>
                    <Icon name="grid layout" color={this.state.showGrid ? "teal" : "grey"} size="small" inverted />
                </Menu.Item>
            </Menu>
        );
    }
}
