import Property from "./Property";
import { isBang } from "../base/Bang";
import type { IJSPatcherObjectMeta } from "../base/AbstractObject";
import type { ImportedObjectType } from "../../types";

export default class StaticProperty extends Property<true> {
    static importedObjectType: ImportedObjectType = "StaticProperty";
    static description = "Auto-imported static property";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "bang",
        description: "Get the value"
    }, {
        isHot: false,
        type: "anything",
        description: "Set the value"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        description: "Value"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
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
            if (isBang(data)) this.outlet(0, this.imported);
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
}
