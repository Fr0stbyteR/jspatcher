import { Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";
import { ImportedObject, ImportedObjectUI } from "./ImportedObject";
import { PropertyUI } from "./Property";
import { TMeta } from "../../types";

type S<Static extends boolean> = { instance: Static extends true ? undefined : any; input: any; result: any };
type I<Static extends boolean> = Static extends true ? [any] : [any | Bang, any];
type O<Static extends boolean> = Static extends true ? [any] : [any, any];
export class SetterGetter<Static extends boolean = false> extends ImportedObject<any, S<Static>, I<Static>, O<Static>, [any], {}, { loading: boolean }> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Auto-imported setter / getter",
            inlets: [{
                isHot: true,
                type: "anything",
                description: "Instance to manipulate"
            }, {
                isHot: false,
                type: "anything",
                description: "Set the value"
            }],
            outlets: [{
                type: "anything",
                description: "Instance bypass"
            }, {
                type: "anything",
                description: "Value"
            }],
            args: [{
                type: "anything",
                optional: true,
                varLength: false,
                description: "Initial value to set"
            }]
        };
    }
    get initialInlets() {
        return 2;
    }
    get initialOutlets() {
        return 2;
    }
    state: S<Static> = { instance: undefined, input: null, result: null };
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = this.initialInlets;
        this.outlets = this.initialOutlets;
        this.update(box.args as [any]);
    }
    update(args?: [any?]) {
        this.updateBox(args);
        if (args && args.length) this.state.input = args[0];
        return this;
    }
    fn(data: any, inlet: number) {
        if (inlet === 0) {
            if (!(data instanceof Bang)) this.state.instance = data;
            if (typeof this.state.instance === "undefined") return this;
            if (typeof this.state.input !== "undefined") {
                try {
                    this.state.instance[this.name] = this.state.input;
                } catch (e) {
                    this.error(e);
                    return this;
                }
            }
            if (this.execute()) return this.output();
        } else if (inlet === 1) {
            this.state.input = data;
        }
        return this;
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
    get ui(): typeof ImportedObjectUI {
        return PropertyUI;
    }
}
