import { TMeta, Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";
import { ImportedObject, ImportedObjectUI } from "./ImportedObject";
import { PropertyUI } from "./Property";

type S<Static extends boolean> = { instance: Static extends true ? undefined : any; input: any };
type I<Static extends boolean> = Static extends true ? [any] : [any | Bang, any];
type O<Static extends boolean> = Static extends true ? [] : [any];
export class Setter<Static extends boolean = false> extends ImportedObject<any, S<Static>, I<Static>, O<Static>, [any], {}, {}> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Auto-imported setter",
            inlets: [{
                isHot: true,
                type: "anything",
                description: "Instance to set property"
            }, {
                isHot: false,
                type: "anything",
                description: "Set the value"
            }],
            outlets: [{
                type: "anything",
                description: "Instance bypass"
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
        return 1;
    }
    state: S<Static> = { instance: undefined, input: null };
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
            try {
                this.state.instance[this.name] = this.state.input;
            } catch (e) {
                this.error(e);
                return this;
            }
            this.outlet(0, this.state.instance);
        } else {
            this.state.input = data;
        }
        return this;
    }
    get ui(): typeof ImportedObjectUI {
        return PropertyUI;
    }
}
