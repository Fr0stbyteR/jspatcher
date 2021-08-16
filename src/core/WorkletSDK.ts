import BaseObject from "./objects/base/BaseObject";
import Patcher from "./patcher/Patcher";
import Box from "./patcher/Box";
import Line from "./patcher/Line";
import generateRemotedObject from "./objects/base/generateRemotedObject";
import Bang, { isBang } from "./objects/base/Bang";
import type { IJSPatcherSDK } from "./SDK";

export default class JSPatcherWorkletSDK implements IJSPatcherSDK {
    readonly Patcher = Patcher;
    readonly Box = Box;
    readonly Line = Line;
    readonly BaseObject = BaseObject;
    readonly generateRemotedObject = generateRemotedObject;
    readonly Bang = Bang;
    readonly isBang = isBang;
}
