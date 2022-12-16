import ImportedObject from "./ImportedObject";
import Bang, { isBang } from "../base/Bang";
import type { IJSPatcherObjectMeta } from "../base/AbstractObject";
import type { ImportedObjectType } from "../../types";

interface IS<Static extends boolean> {
    instance: Static extends true ? undefined : any;
    input: any;
}
type I<Static extends boolean> = Static extends true ? [any] : [any | Bang, any];
type O<Static extends boolean> = Static extends true ? [] : [any];

export default class Setter<Static extends boolean = false> extends ImportedObject<any, {}, I<Static>, O<Static>, [any], {}, {}> {
    static importedObjectType: ImportedObjectType = "Setter";
    static description = "Auto-imported setter";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Instance to set property"
    }, {
        isHot: false,
        type: "anything",
        description: "Set the value"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        description: "Instance bypass"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "anything",
        optional: true,
        varLength: false,
        description: "Initial value to set"
    }];
    initialInlets = 2;
    initialOutlets = 1;
    _: IS<Static> = { instance: undefined, input: undefined };
    handleInlet = ({ data, inlet }: { data: any; inlet: number }) => {
        if (inlet === 0) {
            if (!isBang(data)) this._.instance = data;
            if (typeof this._.instance === "undefined") return;
            try {
                this._.instance[this.name] = this._.input;
            } catch (e) {
                this.error(e);
                return;
            }
            this.outlet(0, this._.instance);
        } else {
            this._.input = data;
        }
    };
    handleUpdateArgs = (args: [any?]) => {
        if (args.length) this._.input = args[0];
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = this.initialInlets;
            this.outlets = this.initialOutlets;
            this.handleUpdateArgs(this.args);
        });
        this.on("postInit", this.updatePropertyMetaFromTS);
        this.on("updateArgs", this.handleUpdateArgs);
        this.on("inlet", this.handleInlet);
    }
}
