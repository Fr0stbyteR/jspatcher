import { Setter } from "./Setter";
import { ImportedObjectUI } from "./ImportedObject";
import { StaticPropertyUI } from "./StaticProperty";
import { TMeta } from "../../types";

export class StaticSetter extends Setter<true> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Auto-imported static setter",
            inlets: [{
                isHot: false,
                type: "anything",
                description: "Set the value"
            }],
            outlets: []
        };
    }
    initialInlets = 1;
    initialOutlets = 0;
    handleInlet: (e: { data: any; inlet: number }) => void = ({ data, inlet }) => {
        if (inlet === 0) this.imported = data;
    };
    handleUpdateArgs = (args: [any?]) => {
        if (args.length) this.imported = args[0];
    };
    uiComponent: typeof ImportedObjectUI = StaticPropertyUI;
}
