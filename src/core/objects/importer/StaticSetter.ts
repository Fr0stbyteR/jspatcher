import Setter from "./Setter";
import { ImportedObjectUI } from "./ImportedObject";
import { StaticPropertyUI } from "./StaticProperty";
import type { IJSPatcherObjectMeta } from "../base/AbstractObject";

export default class StaticSetter extends Setter<true> {
    static description = "Auto-imported static setter";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: false,
        type: "anything",
        description: "Set the value"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [];
    initialInlets = 1;
    initialOutlets = 0;
    handleInlet = ({ data, inlet }: { data: any; inlet: number }) => {
        if (inlet === 0) this.imported = data;
    };
    handleUpdateArgs = (args: [any?]) => {
        if (args.length) this.imported = args[0];
    };
    static UI: typeof ImportedObjectUI = StaticPropertyUI;
}
