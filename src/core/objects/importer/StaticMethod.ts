import { Bang } from "../Base";
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
    initialInlets = 0;
    initialOutlets = 1;
    handleInlet: (e: { data: any; inlet: number }) => void = ({ data, inlet }) => {
        if (inlet === 0) {
            if (!(data instanceof Bang)) this.state.inputs[inlet] = data;
            if (this.execute()) this.output();
        } else {
            this.state.inputs[inlet] = data;
        }
    };
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
    uiComponent = StaticPropertyUI;
}
