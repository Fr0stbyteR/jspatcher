import * as React from "react";
import BaseObject from "./objects/base/BaseObject";
import BaseUI from "./objects/base/BaseUI";
import DefaultObject from "./objects/base/DefaultObject";
import DefaultUI from "./objects/base/DefaultUI";
import Patcher from "./patcher/Patcher";

export interface IJSPatcherSDK {
    readonly React?: typeof React;
    readonly Patcher: typeof Patcher;
    readonly BaseObject: typeof BaseObject;
    readonly DefaultObject?: typeof DefaultObject;
    readonly BaseUI?: typeof BaseUI;
    readonly DefaultUI?: typeof DefaultUI;
}

export default class JSPatcherSDK implements IJSPatcherSDK {
    readonly React = React;
    readonly BaseObject = BaseObject;
    readonly DefaultObject = DefaultObject;
    readonly BaseUI = BaseUI;
    readonly DefaultUI = DefaultUI;
    readonly Patcher = Patcher;
}
