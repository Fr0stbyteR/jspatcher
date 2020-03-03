import * as React from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import Patcher from "../core/Patcher";
import TopMenu from "./TopMenu";
import PatcherUI from "./PatcherUI";
import BottomMenu from "./BottomMenu";
import RightMenu from "./RightMenu";
import LeftMenu from "./LeftMenu";
import "./UI.scss";

export default class UI extends React.PureComponent<{ patcher: Patcher }, { loading: string[] }> {
    state = { loading: this.props.patcher.state.isLoading ? [] : undefined as string[] };
    handleKeyDown = (e: React.KeyboardEvent) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };
    handleMouseDown = (e: React.MouseEvent) => {
        this.props.patcher.env.active = this.props.patcher;
        e.stopPropagation();
    };
    handleLoading = (loading?: string[]) => this.setState({ loading: loading ? loading.slice() : undefined });
    componentDidMount() {
        this.props.patcher.on("loading", this.handleLoading);
    }
    componentWillUnmount() {
        this.props.patcher.off("loading", this.handleLoading);
    }
    render() {
        let dimmer: JSX.Element;
        if (this.state.loading) {
            dimmer = <Dimmer active>
                <Loader>
                    <p>Loading Patcher...</p>
                    {this.state.loading.map(e => <p key={e}>Dependency: {e}</p>)}
                </Loader>
            </Dimmer>;
        }
        return (
            <>
                <div className="ui-left" onKeyDown={this.handleKeyDown} onMouseDown={this.handleMouseDown}>
                    <LeftMenu {...this.props} />
                </div>
                <div className="ui-center" onMouseDown={this.handleMouseDown}>
                    <TopMenu {...this.props} />
                    <div className="patcher-container">
                        {dimmer}
                        <PatcherUI {...this.props} />
                    </div>
                    <BottomMenu {...this.props} />
                </div>
                <div className="ui-right" onKeyDown={this.handleKeyDown} onMouseDown={this.handleMouseDown}>
                    <RightMenu {...this.props} />
                </div>
            </>
        );
    }
}
