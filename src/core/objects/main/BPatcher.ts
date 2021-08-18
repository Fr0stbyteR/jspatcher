import BaseObject from "../base/BaseObject";
import BPatcherUI from "./BPatcherUI";
import SubPatcher from "./SubPatcher";

export default class BPatcher extends SubPatcher {
    static props = BaseObject.props;
    static UI = BPatcherUI as any;
}
