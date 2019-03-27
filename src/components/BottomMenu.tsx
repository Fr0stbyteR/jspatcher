import * as React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Patcher } from "../core/patcher";
import "./BottomMenu.scss";

export class BottomMenu extends React.Component {
    props: { patcher: Patcher };
    state: { locked: boolean };
    componentWillMount() {
        const pState = this.props.patcher._state;
        this.setState({ locked: pState.locked });
    }
    componentDidMount() {
        this.props.patcher.on("lockedChange", this.handleLockedChange);
    }
    componentWillUnmount() {
        this.props.patcher.off("lockedChange", this.handleLockedChange);
    }
    handleLockedChange = (locked: boolean) => this.setState({ locked });
    handleClickLock = (event: React.MouseEvent) => {
        this.props.patcher.setLock(!this.state.locked);
    };
    render() {
        return (
            <Menu inverted={true} fixed={"bottom"} id="bottom-menu">
                <Menu.Item name="lock" onClick={this.handleClickLock}>
                    <Icon name={this.state.locked ? "lock" : "unlock"} size="small" />
                </Menu.Item>
            </Menu>
        );
    }
}
