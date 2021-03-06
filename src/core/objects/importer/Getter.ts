import { Bang, isBang } from "../Base";
import { ImportedObject, ImportedObjectUI } from "./ImportedObject";
import { PropertyUI } from "./Property";
import { TMeta } from "../../types";

type S<Static extends boolean> = { instance: Static extends true ? undefined : any; result: any };
type I<Static extends boolean> = Static extends true ? [Bang] : [any | Bang];
type O<Static extends boolean> = Static extends true ? [any] : [any, any];
export class Getter<Static extends boolean = false> extends ImportedObject<any, S<Static>, I<Static>, O<Static>, [], { sync: boolean }, { loading: boolean }> {
    static description = "Auto-imported getter";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Instance to read"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "anything",
        description: "Value"
    }, {
        type: "anything",
        description: "Instance bypass"
    }];
    static props: TMeta["props"] = {
        sync: {
            type: "boolean",
            default: false,
            description: "If true and in case the result is a Promise, instead of waiting for result, will output the Promise object"
        }
    };
    state: S<Static> = { instance: undefined, result: null };
    handlePreInit = () => {
        this.inlets = 1;
        this.outlets = 2;
    };
    handleInlet = ({ data, inlet }: { data: any; inlet: number }) => {
        if (inlet === 0) {
            if (!isBang(data)) this.state.instance = data;
            if (this.execute()) this.output();
        }
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", this.handlePreInit);
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
    callback = () => this.outletAll([this.state.result, this.state.instance] as O<Static>);
    output() {
        if (this.state.result instanceof Promise && !this.getProp("sync")) {
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
    static UI: typeof ImportedObjectUI = PropertyUI;
    set loading(loading: boolean) {
        this.updateUI({ loading });
    }
}
