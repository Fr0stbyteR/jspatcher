import { Bang, isBang } from "../Base";
import { Getter } from "./Getter";
import { StaticPropertyUI } from "./StaticProperty";
import { TMeta } from "../../types";

export class StaticGetter extends Getter<true> {
    static description = "Auto-imported static getter";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "bang",
        description: "Get the value"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "anything",
        description: "Value"
    }];
    handlePreInit = () => {
        this.inlets = 1;
        this.outlets = 1;
    };
    handleInlet = ({ data, inlet }: { data: any; inlet: number }) => {
        if (inlet === 0 && isBang(data) && this.execute()) this.output();
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
    static UI = StaticPropertyUI;
}
