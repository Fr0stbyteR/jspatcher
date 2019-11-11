import { Bang } from "../Base";
import { ImportedObject, ImportedObjectUI } from "./ImportedObject";
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
            props: [...super.meta.props, {
                name: "args",
                type: "number",
                description: "arguments count for method"
            }]
        };
    }
    state: S<Static> = { instance: undefined, inputs: [], result: null };
    initialInlets = 1;
    initialOutlets = 2;
    handleInlet: (e: { data: any; inlet: number }) => void = ({ data, inlet }) => {
        if (inlet === 0) {
            if (!(data instanceof Bang)) this.state.instance = data;
            if (this.execute()) this.output();
        } else {
            this.state.inputs[inlet] = data;
        }
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            const fn = this.imported;
            this.inlets = Math.max(1, this.initialInlets + fn.length); // Function.length property
            this.outlets = this.initialOutlets + fn.length;
        });
        this.on("updateArgs", (args) => {
            this.state.inputs = args.slice();
        });
        this.on("updateProps", (props) => {
            if (props.args && typeof props.args === "number" && props.args >= 0) {
                const argsCount = ~~props.args;
                this.inlets = Math.max(1, this.initialInlets + argsCount);
                this.outlets = this.initialOutlets + argsCount;
            }
        });
        this.on("inlet", this.handleInlet);
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
    uiComponent: typeof ImportedObjectUI = PropertyUI;
    set loading(loading: boolean) {
        this.updateUI({ loading });
    }
}
