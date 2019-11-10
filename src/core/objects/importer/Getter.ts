import { Bang } from "../Base";
import { ImportedObject, ImportedObjectUI } from "./ImportedObject";
import { PropertyUI } from "./Property";
import Patcher from "../../Patcher";
import Box from "../../Box";
import { TMeta } from "../../types";

type S<Static extends boolean> = { instance: Static extends true ? undefined : any; result: any };
type I<Static extends boolean> = Static extends true ? [Bang] : [any | Bang];
type O<Static extends boolean> = Static extends true ? [any] : [any, any];
export class Getter<Static extends boolean = false> extends ImportedObject<any, S<Static>, I<Static>, O<Static>, [], {}, { loading: boolean }> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Auto-imported getter",
            inlets: [{
                isHot: true,
                type: "anything",
                description: "Instance to read"
            }],
            outlets: [{
                type: "anything",
                description: "Instance bypass"
            }, {
                type: "anything",
                description: "Value"
            }]
        };
    }
    state: S<Static> = { instance: undefined, result: null };
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.configurePorts();
    }
    configurePorts() {
        this.inlets = 1;
        this.outlets = 2;
    }
    fn(data: any, inlet: number) {
        if (inlet === 0) {
            if (!(data instanceof Bang)) this.state.instance = data;
            if (this.execute()) return this.output();
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
    get ui(): typeof ImportedObjectUI {
        return PropertyUI;
    }
    set loading(loading: boolean) {
        this.updateUI({ loading });
    }
}
