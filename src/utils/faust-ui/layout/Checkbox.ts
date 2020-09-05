import { AbstractInputItem } from "./AbstractInputItem";

export class Checkbox extends AbstractInputItem {
    layout: TLayoutProp = {
        type: "checkbox",
        width: 2,
        height: 1,
        sizing: "horizontal"
    };
}
