import { TMeta, Bang } from "../Base";
import { SetterGetter } from "./SetterGetter";
import { StaticPropertyUI } from "./StaticProperty";
import { ImportedObjectUI } from "./ImportedObject";

export class StaticSetterGetter extends SetterGetter<true> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Auto-imported static setter / getter",
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
    get initialInlets() {
        return 2;
    }
    get initialOutlets() {
        return 1;
    }
    fn(data: any, inlet: number) {
        if (inlet === 0) {
            if (!(data instanceof Bang)) return this;
            if (typeof this.state.input !== "undefined") {
                try {
                    this.imported = this.state.input;
                } catch (e) {
                    this.error(e);
                    return this;
                }
            }
            if (this.execute()) return this.output();
        } else if (inlet === 1) {
            this.state.input = data;
        }
        return this;
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
    callback = () => this.outlet(0, this.state.result);
    get ui(): typeof ImportedObjectUI {
        return StaticPropertyUI;
    }
}
