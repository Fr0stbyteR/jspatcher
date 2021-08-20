import SetterGetter from "./SetterGetter";
import { isBang } from "../base/Bang";
import type { IJSPatcherObjectMeta } from "../base/AbstractObject";
import type { ImportedObjectType } from "../../types";

export default class StaticSetterGetter extends SetterGetter<true> {
    static importedObjectType: ImportedObjectType = "StaticSetterGetter";
    static description = "Auto-imported static setter / getter";
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
    initialInlets = 2;
    initialOutlets = 1;
    handleInlet = ({ data, inlet }: { data: any; inlet: number }) => {
        if (inlet === 0) {
            if (!isBang(data)) return;
            if (typeof this._.input !== "undefined") {
                try {
                    this.imported = this._.input;
                } catch (e) {
                    this.error(e);
                    return;
                }
            }
            if (this.execute()) this.output();
        } else if (inlet === 1) {
            this._.input = data;
        }
    };
    execute() {
        try {
            this._.result = this.imported;
            return true;
        } catch (e) {
            this.error(e);
            return false;
        }
    }
    callback = () => this.outlet(0, this._.result);
}
