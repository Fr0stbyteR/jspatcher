import { Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";
import { ImportedObjectUI, ImportedObject } from "./ImportedObject";
import { PropertyUI } from "./Property";
import { TMeta } from "../../types";

type TAnyFunction = (...args: any[]) => any;
type S<Static extends boolean> = { instance: Static extends true ? undefined : any; inputs: any[]; result: any };
type I<Static extends boolean> = Static extends true ? [any | Bang, ...any[]] : [any | Bang, any, ...any[]];
type O<Static extends boolean> = Static extends true ? [any, ...any[]] : [any, any, ...any[]];
export class Method<Static extends boolean = false> extends ImportedObject<TAnyFunction, S<Static>, I<Static>, O<Static>, any[], { args: number }, { loading: boolean }> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Auto-imported method",
            inlets: [{
                isHot: true,
                type: "anything",
                description: "Instance to read"
            }, {
                isHot: false,
                type: "anything",
                varLength: true,
                description: "Method argument"
            }],
            outlets: [{
                type: "anything",
                description: "Instance bypass"
            }, {
                type: "anything",
                description: "Method return value"
            }, {
                type: "anything",
                varLength: true,
                description: "Argument after method called"
            }],
            args: [{
                type: "anything",
                optional: true,
                varLength: true,
                description: "Set arguments while loaded"
            }],
            props: [{
                name: "args",
                type: "number",
                description: "arguments count for method"
            }]
        };
    }
    state: S<Static> = { instance: undefined, inputs: [], result: null };
    get fixedInlets() {
        return 1;
    }
    get fixedOutlets() {
        return 2;
    }
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        const fn = this.imported;
        this.inlets = Math.max(1, this.fixedInlets + fn.length); // Function.length property
        this.outlets = this.fixedOutlets + fn.length;
        this.update(box.args.slice(), box.props);
    }
    update(args?: any[], props?: { args?: number }) {
        this.updateBox(args, props);
        if (props && props.args && typeof props.args === "number" && props.args >= 0) {
            const argsCount = ~~props.args;
            this.inlets = Math.max(1, this.fixedInlets + argsCount);
            this.outlets = this.fixedOutlets + argsCount;
        }
        if (args) this.state.inputs = args;
        return this;
    }
    fn(data: any, inlet: number) {
        if (inlet === 0) {
            if (!(data instanceof Bang)) this.state.instance = data;
            if (this.execute()) return this.output();
        } else {
            this.state.inputs[inlet] = data;
        }
        return this;
    }
    execute() {
        const fn = this.imported;
        try {
            this.state.result = fn.call(this.state.instance, ...this.state.inputs);
            return true;
        } catch (e) {
            this.error(e);
            return false;
        }
    }
    callback = () => this.outletAll([this.state.instance, this.state.result, ...this.state.inputs] as O<Static>);
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
        this.uiUpdate({ loading });
    }
}
