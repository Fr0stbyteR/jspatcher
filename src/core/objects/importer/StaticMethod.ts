import { Bang } from "../Base";
import { ImportedObjectUI } from "./ImportedObject";
import { StaticPropertyUI } from "./StaticProperty";
import { Method } from "./Method";
import { TMeta } from "../../types";

export class StaticMethod extends Method<true> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Auto-imported static method",
            inlets: [{
                isHot: true,
                type: "anything",
                varLength: true,
                description: "Method argument"
            }],
            outlets: [{
                type: "anything",
                description: "Method return value"
            }, {
                type: "anything",
                varLength: true,
                description: "Argument after method called"
            }],
            props: [{
                name: "args",
                type: "number",
                description: "arguments count for method"
            }]
        };
    }
    get fixedInlets() {
        return 0;
    }
    get fixedOutlets() {
        return 1;
    }
    fn(data: any, inlet: number) {
        if (inlet === 0) {
            if (!(data instanceof Bang)) this.state.inputs[inlet] = data;
            if (this.execute()) return this.output();
        } else {
            this.state.inputs[inlet] = data;
        }
        return this;
    }
    execute() {
        const fn = this.imported;
        try {
            this.state.result = fn(...this.state.inputs);
            return true;
        } catch (e) {
            this.error(e);
            return false;
        }
    }
    callback = () => this.outletAll([this.state.result, ...this.state.inputs]);
    get ui(): typeof ImportedObjectUI {
        return StaticPropertyUI;
    }
}
