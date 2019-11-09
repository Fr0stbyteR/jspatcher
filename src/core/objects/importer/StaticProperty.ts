import { Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";
import { ImportedObjectUI } from "./ImportedObject";
import { Property } from "./Property";
import { TMeta } from "../../types";

export class StaticPropertyUI extends ImportedObjectUI<StaticProperty> {
    prependColor = "rgb(156, 220, 254)";
}
export class StaticProperty extends Property<true> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Auto-imported static property",
            inlets: [{
                isHot: true,
                type: "bang",
                description: "Get the value"
            }, {
                isHot: false,
                type: "anything",
                description: "Set the value"
            }],
            outlets: [{
                type: "anything",
                description: "Value"
            }],
            args: [{
                type: "anything",
                optional: true,
                description: "Set the value while loaded."
            }]
        };
    }
    outlets = 1;
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.update((box as Box<this>).args);
    }
    update(args?: [any?]) {
        this.updateBox(args);
        if (args && args.length) this.imported = args[0];
        return this;
    }
    fn(data: any, inlet: number) {
        if (inlet === 0) {
            if (data instanceof Bang) this.outlet(0, this.imported);
        } else if (inlet === 1) {
            this.imported = data;
        }
        return this;
    }
    get ui(): typeof ImportedObjectUI {
        return StaticPropertyUI;
    }
}
