import Method from "./Method";
import { ImportedStaticMethodObject } from "../../../utils/symbols";
import { isBang } from "../base/Bang";
import type { IJSPatcherObjectMeta } from "../base/AbstractObject";
import type { ImportedObjectType } from "../../types";

export default class StaticMethod extends Method<true> {
    static importedObjectType: ImportedObjectType = "StaticMethod";
    static [ImportedStaticMethodObject] = true;
    static description = "Auto-imported static method";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        varLength: true,
        description: "Method argument"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        description: "Method return value"
    }, {
        type: "anything",
        varLength: true,
        description: "Argument after method called"
    }];
    initialInlets = 0;
    initialOutlets = 1;
    handleInlet = ({ data, inlet }: { data: any; inlet: number }) => {
        if (inlet === 0) {
            if (!isBang(data)) this._.inputs[inlet] = data;
            if (this.execute()) this.output();
        } else {
            this._.inputs[inlet] = data;
        }
    };
    execute() {
        const fn = this.imported;
        try {
            this._.result = fn(...(this.getProp("spreadArgs") ? this._.inputs.reduce<any[]>((acc, cur) => [...acc, ...cur], []) : this._.inputs));
            return true;
        } catch (e) {
            this.error(e);
            return false;
        }
    }
    callback = () => this.outletAll([this._.result, ...this._.inputs]);
}
