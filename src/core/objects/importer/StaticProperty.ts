import { TMeta, Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";
import { ImportedObjectUI, ImportedObject } from "./ImportedObject";

export class StaticPropertyUI extends ImportedObjectUI<StaticProperty> {
    prependColor = "rgb(156, 220, 254)";
}
export class StaticProperty extends ImportedObject<any, { result: any }, [Bang, any], [any], [any], {}, {}> {
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
            }]
        };
    }
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 2;
        this.outlets = 1;
        this.update([box.parsed.args]);
    }
    update(args: [any]) {
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
