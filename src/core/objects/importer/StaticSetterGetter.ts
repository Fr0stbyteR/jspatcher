import { Bang } from "../Base";
import { SetterGetter } from "./SetterGetter";
import { StaticPropertyUI } from "./StaticProperty";
import { TMeta } from "../../types";

export class StaticSetterGetter extends SetterGetter<true> {
    static description = "Auto-imported static setter / getter";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "bang",
        description: "Get the value"
    }, {
        isHot: false,
        type: "anything",
        description: "Set the value"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "anything",
        description: "Value"
    }];
    initialInlets = 2;
    initialOutlets = 1;
    handleInlet: (e: { data: any; inlet: number }) => void = ({ data, inlet }) => {
        if (inlet === 0) {
            if (!(data instanceof Bang)) return;
            if (typeof this.state.input !== "undefined") {
                try {
                    this.imported = this.state.input;
                } catch (e) {
                    this.error(e);
                    return;
                }
            }
            if (this.execute()) this.output();
        } else if (inlet === 1) {
            this.state.input = data;
        }
    };
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
    static ui = StaticPropertyUI;
}
