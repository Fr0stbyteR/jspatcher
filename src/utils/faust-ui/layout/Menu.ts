import { AbstractInputItem } from "./AbstractInputItem";

export class Menu extends AbstractInputItem {
    layout: TLayoutProp = {
        type: "menu",
        width: 2,
        height: 1,
        sizing: "horizontal"
    };
}
