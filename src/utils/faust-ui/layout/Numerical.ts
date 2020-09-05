import { AbstractOutputItem } from "./AbstractOutputItem";

export class Numerical extends AbstractOutputItem {
    layout: TLayoutProp = {
        type: "numerical",
        width: 1,
        height: 1,
        sizing: "none"
    };
}
