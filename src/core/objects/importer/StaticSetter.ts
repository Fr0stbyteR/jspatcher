import { TMeta } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";
import { ImportedObject } from "./ImportedObject";

export class StaticSetter extends ImportedObject<any, {}, [any], [], [any], {}, {}> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Auto-imported static setter / getter",
            inlets: [{
                isHot: false,
                type: "anything",
                description: "Set the value"
            }],
            outlets: []
        };
    }
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 1;
        this.outlets = 0;
        this.update([box.parsed.args]);
    }
    update(args: [any]) {
        if (args && args.length) this.imported = args[0];
        return this;
    }
    fn(data: any, inlet: number) {
        if (inlet === 0) this.imported = data;
        return this;
    }
}
