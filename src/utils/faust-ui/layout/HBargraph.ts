import { AbstractOutputItem } from "./AbstractOutputItem";

export class HBargraph extends AbstractOutputItem {
    layout: TLayoutProp = {
        type: "hbargraph",
        width: 5,
        height: 1,
        sizing: "horizontal"
    };
}
