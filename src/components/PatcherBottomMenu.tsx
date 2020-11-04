import * as React from "react";
import { Menu, Icon } from "semantic-ui-react";
import Patcher from "../core/Patcher";
import "./PatcherBottomMenu.scss";

interface P {
    patcher: Patcher;
}

interface S {
    locked: boolean;
    presentation: boolean;
    showGrid: boolean;
}

export default class PatcherBottomMenu extends React.PureComponent<P, S> {
    state = {
        locked: this.props.patcher.state.locked,
        presentation: this.props.patcher.state.presentation,
        showGrid: this.props.patcher.state.showGrid
    };
    componentDidMount() {
        this.props.patcher.on("locked", this.handleLockedChange);
        this.props.patcher.on("presentation", this.handlePresentationChange);
        this.props.patcher.on("showGrid", this.handleShowGridChange);
        this.props.patcher.on("loading", this.handleLoading);
    }
    componentWillUnmount() {
        this.props.patcher.off("locked", this.handleLockedChange);
        this.props.patcher.off("presentation", this.handlePresentationChange);
        this.props.patcher.off("showGrid", this.handleShowGridChange);
        this.props.patcher.off("loading", this.handleLoading);
    }
    handleLockedChange = (locked: boolean) => this.setState({ locked });
    handleShowGridChange = (showGrid: boolean) => this.setState({ showGrid });
    handlePresentationChange = (presentation: boolean) => this.setState({ presentation });
    handleClickLock = () => this.props.patcher.setState({ locked: !this.state.locked });
    handleClickGrid = () => this.props.patcher.setState({ showGrid: !this.state.showGrid });
    handleClickPresentation = () => this.props.patcher.setState({ presentation: !this.state.presentation });
    handleLoading = (loading: string[]) => {
        if (!loading) this.setState({ presentation: this.props.patcher.state.presentation });
    };
    render() {
        return (
            <Menu inverted icon size="mini" className="patcher-bottom-menu">
                <Menu.Item name="lock" onClick={this.handleClickLock} title={this.state.locked ? "Unlock" : "Lock"}>
                    <Icon name={this.state.locked ? "lock" : "unlock"} color="grey" size="small" inverted />
                </Menu.Item>
                <Menu.Item name="presentation" onClick={this.handleClickPresentation} title="Switch Presentation Mode">
                    <Icon name="video" color={this.state.presentation ? "teal" : "grey"} size="small" inverted />
                </Menu.Item>
                <Menu.Item name="grid" onClick={this.handleClickGrid} title={this.state.showGrid ? "Hide Grid" : "Show Grid"}>
                    <Icon name="grid layout" color={this.state.showGrid ? "teal" : "grey"} size="small" inverted />
                </Menu.Item>
            </Menu>
        );
    }
}
