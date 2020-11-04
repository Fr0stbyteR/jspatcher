import * as React from "react";
import { Menu, Icon } from "semantic-ui-react";
import Patcher from "../../core/Patcher";
import Box from "../../core/Box";
import { BaseUI } from "../../core/objects/BaseUI";

export default class UIDock extends React.PureComponent<{ patcher: Patcher; display: boolean; }, { box: Box; }> {
    state = { box: undefined as Box };
    refDiv = React.createRef<HTMLDivElement>();
    refUI = React.createRef<BaseUI>();
    handleDestroy = () => this.setState({ box: undefined });
    handleDock = (box: Box) => {
        if (this.state.box) this.state.box.object.off("destroy", this.handleDestroy);
        this.setState({ box: undefined });
        this.forceUpdate(() => {
            box.object.on("destroy", this.handleDestroy);
            this.setState({ box });
        });
    };
    handlePatcherLoading = () => {
        if (this.state.box) {
            this.state.box.object.off("destroy", this.handleDestroy);
            this.setState({ box: undefined });
        }
    };
    handleResize = () => {
        if (this.refDiv.current && this.refUI.current) {
            const { width, height } = this.refDiv.current.getBoundingClientRect();
            this.refUI.current.setState({ width, height });
        }
    };
    handleClear = () => {
        if (this.state.box) {
            this.state.box.object.off("destroy", this.handleDestroy);
            this.setState({ box: undefined });
        }
    };
    componentDidMount() {
        this.props.patcher.on("loading", this.handlePatcherLoading);
        this.props.patcher.on("dockUI", this.handleDock);
        window.addEventListener("resize", this.handleResize);
    }
    componentWillUnmount() {
        if (this.state.box) this.state.box.object.off("destroy", this.handleDestroy);
        this.props.patcher.off("loading", this.handlePatcherLoading);
        this.props.patcher.off("dockUI", this.handleDock);
        window.removeEventListener("resize", this.handleResize);
    }
    render() {
        if (!this.props.display) return <></>;
        const { box } = this.state;
        const ctrlKey = this.props.patcher.env.os === "MacOS" ? "Cmd" : "Ctrl";
        return (
            <>
                <div className="dock-ui" ref={this.refDiv}>
                    {box
                        ? <box.uiComponent object={box.object} editing={false} onEditEnd={() => undefined} inDock ref={this.refUI} />
                        : <div className="dock-ui-default">{ctrlKey} + Enter on selected box to dock UI</div>}
                </div>
                <Menu icon inverted size="mini">
                    <Menu.Item onClick={this.handleClear} title="Clear">
                        <Icon name="delete" inverted />
                    </Menu.Item>
                </Menu>
            </>
        );
    }
}
