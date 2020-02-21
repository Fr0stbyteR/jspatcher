import * as React from "react";
import Patcher from "../core/Patcher";
import TopMenu from "./TopMenu";
import PatcherUI from "./PatcherUI";
import BottomMenu from "./BottomMenu";
import RightMenu from "./RightMenu";
import LeftMenu from "./LeftMenu";
import "./UI.scss";

export default class UI extends React.PureComponent {
    props: { patcher: Patcher };
    handleKeyDown = (e: React.KeyboardEvent) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }
    render() {
        return (
            <>
                <div className="ui-left" onKeyDown={this.handleKeyDown}>
                    <LeftMenu {...this.props} />
                </div>
                <div className="ui-center">
                    <TopMenu {...this.props} />
                    <div className="patcher-container">
                        <PatcherUI {...this.props} />
                    </div>
                    <BottomMenu {...this.props} />
                </div>
                <div className="ui-right" onKeyDown={this.handleKeyDown}>
                    <RightMenu {...this.props} />
                </div>
            </>
        );
    }
}
