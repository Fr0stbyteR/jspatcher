import { AbstractInputItem } from "./AbstractInputItem";

export class Knob extends AbstractInputItem {
    layout: TLayoutProp = {
        type: "knob",
        width: 1,
        height: 1.75,
        sizing: "none"
    };
}
