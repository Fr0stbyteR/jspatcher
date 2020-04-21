import { Bang } from "../Base";
import { ImportedObjectUI } from "./ImportedObject";
import { Property } from "./Property";
import { TMeta } from "../../types";

export class StaticPropertyUI extends ImportedObjectUI<StaticProperty> {
    prependColor = "rgb(156, 220, 254)";
}
export class StaticProperty extends Property<true> {
    static description = "Auto-imported static property";
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
    static args: TMeta["args"] = [{
        type: "anything",
        optional: true,
        description: "Set the value while loaded."
    }];
    handlePreInit = () => {
        this.inlets = 2;
        this.outlets = 1;
    };
    handleInlet = ({ data, inlet }: { data: any; inlet: number }) => {
        if (inlet === 0) {
            if (data instanceof Bang) this.outlet(0, this.imported);
        } else if (inlet === 1) {
            this.imported = data;
        }
    };
    subscribe() {
        super.subscribe();
        this.on("updateArgs", (args) => {
            if (args.length) this.imported = args[0];
        });
        this.on("inlet", this.handleInlet);
    }
    static ui = StaticPropertyUI;
}
