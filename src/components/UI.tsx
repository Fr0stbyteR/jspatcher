import * as React from "react";
import { Patcher } from "../core/Patcher";
import { TopMenu } from "./TopMenu";
import { PatcherUI } from "./PatcherUI";
import "./UI.scss";
export class UI extends React.Component {
    props: { patcher: Patcher };
    render() {
        return (
            <div id="left">
                <TopMenu {...this.props} />
                <div className="patcher-container">
                    <PatcherUI {...this.props} />
                </div>
            </div>
        );
    }
}
