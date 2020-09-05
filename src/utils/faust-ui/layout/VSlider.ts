import { AbstractInputItem } from "./AbstractInputItem";

export class VSlider extends AbstractInputItem {
    layout: TLayoutProp = {
        type: "vslider",
        width: 1,
        height: 5,
        sizing: "vertical"
    };
}
