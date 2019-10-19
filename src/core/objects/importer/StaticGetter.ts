import { TMeta, Bang } from "../Base";
import { Getter } from "./Getter";
import { ImportedObjectUI } from "./ImportedObject";
import { StaticPropertyUI } from "./StaticProperty";

export class StaticGetter extends Getter<true> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Auto-imported static getter",
            inlets: [{
                isHot: true,
                type: "bang",
                description: "Get the value"
            }],
            outlets: [{
                type: "anything",
                description: "Value"
            }]
        };
    }
    execute() {
        try {
            this.state.result = this.imported;
            return true;
        } catch (e) {
            this.error(e);
            return false;
        }
    }
    fn(data: any, inlet: number) {
        if (inlet === 0 && data instanceof Bang && this.execute()) return this.output();
        return this;
    }
    callback = () => this.outlet(0, this.state.result);
    get ui(): typeof ImportedObjectUI {
        return StaticPropertyUI;
    }
}
