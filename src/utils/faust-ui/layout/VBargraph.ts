import { AbstractOutputItem } from "./AbstractOutputItem";

export class VBargraph extends AbstractOutputItem {
    layout: TLayoutProp = {
        type: "vbargraph",
        width: 1,
        height: 5,
        sizing: "vertical"
    };
}
