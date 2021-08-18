import * as React from "react";
import BaseObject from "./objects/base/BaseObject";
import BaseUI from "./objects/base/BaseUI";
import DefaultObject from "./objects/base/DefaultObject";
import DefaultUI from "./objects/base/DefaultUI";
import PatcherAudio from "./audio/PatcherAudio";
import Patcher from "./patcher/Patcher";
import Box from "./patcher/Box";
import Line from "./patcher/Line";
import generateRemoteObject from "./objects/base/generateRemoteObject";
import generateRemotedObject from "./objects/base/generateRemotedObject";
import generateDefaultObject from "./objects/base/generateDefaultObject";
import Bang, { isBang } from "./objects/base/Bang";

export interface IJSPatcherSDK {
    readonly React?: typeof React;
    readonly PatcherAudio?: typeof PatcherAudio;
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
    readonly Bang: typeof Bang;
    readonly isBang: typeof isBang;
}

export default class JSPatcherSDK implements IJSPatcherSDK {
    readonly React = React;
    readonly PatcherAudio = PatcherAudio;
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
    readonly Bang = Bang;
    readonly isBang = isBang;
}
