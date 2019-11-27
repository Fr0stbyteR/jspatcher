import { Bang } from "../Base";
import { ImportedObject, ImportedObjectUI } from "./ImportedObject";
import { PropertyUI } from "./Property";
import { TMeta } from "../../types";

type S<Static extends boolean> = { instance: Static extends true ? undefined : any; input: any; result: any };
type I<Static extends boolean> = Static extends true ? [any] : [any | Bang, any];
type O<Static extends boolean> = Static extends true ? [any] : [any, any];
export class SetterGetter<Static extends boolean = false> extends ImportedObject<any, S<Static>, I<Static>, O<Static>, [any], {}, { loading: boolean }> {
    static description = "Auto-imported setter / getter";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Instance to manipulate"
    }, {
        isHot: false,
        type: "anything",
        description: "Set the value"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "anything",
        description: "Instance bypass"
    }, {
        type: "anything",
        description: "Value"
    }];
    static args: TMeta["args"] = [{
        type: "anything",
        optional: true,
        varLength: false,
        description: "Initial value to set"
    }];
    initialInlets = 2;
    initialOutlets = 2;
    state: S<Static> = { instance: undefined, input: null, result: null };
    handleInlet: (e: { data: any; inlet: number }) => void = ({ data, inlet }) => {
        if (inlet === 0) {
            if (!(data instanceof Bang)) this.state.instance = data;
            if (typeof this.state.instance === "undefined") return;
            if (typeof this.state.input !== "undefined") {
                try {
                    this.state.instance[this.name] = this.state.input;
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
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = this.initialInlets;
            this.outlets = this.initialOutlets;
        });
        this.on("updateArgs", (args) => {
            if (args.length) this.state.input = args[0];
        });
        this.on("inlet", this.handleInlet);
    }
    execute() {
        try {
            this.state.result = this.state.instance[this.name];
            return true;
        } catch (e) {
            this.error(e);
            return false;
        }
    }
    callback = () => this.outletAll([this.state.instance, this.state.result] as O<Static>);
    output() {
        if (this.state.result instanceof Promise) {
            this.loading = true;
            this.state.result.then((r) => {
                this.loading = false;
                this.state.result = r;
                this.callback();
            }, (r) => {
                this.loading = false;
                this.error(r);
            });
            return this;
        }
        return this.callback();
    }
    set loading(loading: boolean) {
        this.updateUI({ loading });
    }
    uiComponent: typeof ImportedObjectUI = PropertyUI;
}
