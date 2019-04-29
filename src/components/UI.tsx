import * as React from "react";
import Patcher from "../core/Patcher";
import TopMenu from "./TopMenu";
import PatcherUI from "./PatcherUI";
import BottomMenu from "./BottomMenu";
import "./UI.scss";

export default class UI extends React.Component {
    props: { patcher: Patcher };
    render() {
        return (
            <div id="left">
                <TopMenu {...this.props} />
                <div className="patcher-container">
                    <PatcherUI {...this.props} />
                </div>
                <BottomMenu {...this.props} />
            </div>
        );
    }
}
