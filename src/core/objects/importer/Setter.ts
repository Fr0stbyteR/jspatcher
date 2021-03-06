import { Bang, isBang } from "../Base";
import { ImportedObject, ImportedObjectUI } from "./ImportedObject";
import { PropertyUI } from "./Property";
import { TMeta } from "../../types";

type S<Static extends boolean> = { instance: Static extends true ? undefined : any; input: any };
type I<Static extends boolean> = Static extends true ? [any] : [any | Bang, any];
type O<Static extends boolean> = Static extends true ? [] : [any];
export class Setter<Static extends boolean = false> extends ImportedObject<any, S<Static>, I<Static>, O<Static>, [any], {}, {}> {
    static description = "Auto-imported setter";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Instance to set property"
    }, {
        isHot: false,
        type: "anything",
        description: "Set the value"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "anything",
        description: "Instance bypass"
    }];
    static args: TMeta["args"] = [{
        type: "anything",
        optional: true,
        varLength: false,
        description: "Initial value to set"
    }];
    initialInlets = 2;
    initialOutlets = 1;
    state: S<Static> = { instance: undefined, input: null };
    handleInlet = ({ data, inlet }: { data: any; inlet: number }) => {
        if (inlet === 0) {
            if (!isBang(data)) this.state.instance = data;
            if (typeof this.state.instance === "undefined") return;
            try {
                this.state.instance[this.name] = this.state.input;
            } catch (e) {
                this.error(e);
                return;
            }
            this.outlet(0, this.state.instance);
        } else {
            this.state.input = data;
        }
    };
    handleUpdateArgs = (args: [any?]) => {
        if (args.length) this.state.input = args[0];
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = this.initialInlets;
            this.outlets = this.initialOutlets;
        });
        this.on("updateArgs", this.handleUpdateArgs);
        this.on("inlet", this.handleInlet);
    }
    static UI: typeof ImportedObjectUI = PropertyUI;
}
