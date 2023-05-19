import * as React from "react";
import AbstractUI, { AbstractUIProps, AbstractUIState } from "./AbstractHardwareUI";
import type BaseObject from "./BaseHardwareObject";
import "./BaseHardwareUI.scss";

export interface BaseUIProps<T extends BaseObject = BaseObject> extends AbstractUIProps<T> {
    containerProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
    additionalClassName?: string;
}
export interface BaseUIState extends AbstractUIState {
    hidden: boolean;
    ignoreClick: boolean;
    hint: string;
}
export default class BaseUI<T extends BaseObject = BaseObject, P extends Partial<BaseUIProps<T>> & Record<string, any> = {}, S extends Partial<BaseUIState> & Record<string, any> = {}> extends AbstractUI<T, P & BaseUIProps<T>, S & BaseUIState> {
    static sizing: "horizontal" | "vertical" | "both" | "ratio" = "horizontal";
    static defaultSize: [number, number] = [90, 20];
    static editableOnUnlock = false;
    static dockable = false;
    state: S & BaseUIState & AbstractUIState = {
        ...this.state,
        background: this.box.background || false,
        presentation: this.box.presentation || false
    };
    private _handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        if (this.editor.state.locked) e.currentTarget.title = this.state.hint;
    };
    private _handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.title = "";
    render() {
        const { object } = this;
        // const packageName = "package-" + object.meta.package.toLowerCase();
        const className = object.meta.name.toLowerCase();
        const classArray = [className, "box-ui-container"];
        if (this.props.additionalClassName) classArray.push(this.props.additionalClassName);
        if (this.state.hidden) classArray.push("hidden");
        if (this.state.ignoreClick) classArray.push("ignore-click");
        return (
            <div className={classArray.join(" ")} {...this.props.containerProps} onMouseEnter={this._handleMouseEnter} onMouseLeave={this._handleMouseLeave}>
                {this.props.children}
            </div>
        );
    }
}
