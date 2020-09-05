import { AbstractInputItem } from "./AbstractInputItem";

export class HSlider extends AbstractInputItem {
    layout: TLayoutProp = {
        type: "hslider",
        width: 5,
        height: 1,
        sizing: "horizontal"
    };
}
