import * as React from "react";
import BaseObject from "./objects/base/BaseObject";
import BaseUI from "./objects/base/BaseUI";
import DefaultObject from "./objects/base/DefaultObject";
import DefaultUI from "./objects/base/DefaultUI";
import Patcher from "./patcher/Patcher";
import Box from "./patcher/Box";
import Line from "./patcher/Line";
import generateRemoteObject from "./objects/base/generateRemoteObject";
import generateRemotedObject from "./objects/base/generateRemotedObject";
import generateDefaultObject from "./objects/base/generateDefaultObject";

export interface IJSPatcherSDK {
    readonly React?: typeof React;
    readonly Patcher: typeof Patcher;
    readonly Box: typeof Box;
    readonly Line: typeof Line;
    readonly BaseObject: typeof BaseObject;
    readonly DefaultObject?: typeof DefaultObject;
    readonly BaseUI?: typeof BaseUI;
    readonly DefaultUI?: typeof DefaultUI;
    readonly generateDefaultObject?: typeof generateDefaultObject;
    readonly generateRemoteObject?: typeof generateRemoteObject;
    readonly generateRemotedObject: typeof generateRemotedObject;
}

export default class JSPatcherSDK implements IJSPatcherSDK {
    readonly React = React;
    readonly Patcher = Patcher;
    readonly Box = Box;
    readonly Line = Line;
    readonly BaseObject = BaseObject;
    readonly DefaultObject = DefaultObject;
    readonly BaseUI = BaseUI;
    readonly DefaultUI = DefaultUI;
    readonly generateDefaultObject = generateDefaultObject;
    readonly generateRemoteObject = generateRemoteObject;
    readonly generateRemotedObject = generateRemotedObject;
}
