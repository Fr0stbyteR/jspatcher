import ImportedObject from "./ImportedObject";
import Bang, { isBang } from "../base/Bang";
import type { IJSPatcherObjectMeta, IPropsMeta } from "../base/AbstractObject";
import type { ImportedObjectType } from "../../types";

type TAnyFunction = (...args: any[]) => any;
type S<Static extends boolean> = { instance: Static extends true ? undefined : any; inputs: any[]; result: any };
type I<Static extends boolean> = Static extends true ? [any | Bang, ...any[]] : [any | Bang, any, ...any[]];
type O<Static extends boolean> = Static extends true ? [any, ...any[]] : [any, any, ...any[]];
interface P {
    args: number;
    spreadArgs: boolean;
    sync: boolean;
}

export default class Method<Static extends boolean = false> extends ImportedObject<TAnyFunction, S<Static>, I<Static>, O<Static>, any[], P, { loading: boolean }> {
    static importedObjectType: ImportedObjectType = "Method";
    static description = "Auto-imported method";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Instance to read"
    }, {
        isHot: false,
        type: "anything",
        varLength: true,
        description: "Method argument"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        description: "Method return value"
    }, {
        type: "anything",
        description: "Instance bypass"
    }, {
        type: "anything",
        varLength: true,
        description: "Argument after method called"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "anything",
        optional: true,
        varLength: true,
        description: "Set arguments while loaded"
    }];
    static props: IPropsMeta<P> = {
        args: {
            type: "number",
            default: 0,
            description: "arguments count for method"
        },
        spreadArgs: {
            type: "boolean",
            default: false,
            description: "arguments input will be spreaded if true"
        },
        sync: {
            type: "boolean",
            default: false,
            description: "If true and in case the result is a Promise, instead of waiting for result, will output the Promise object"
        }
    };
    state: S<Static> = { instance: undefined, inputs: [], result: null };
    initialInlets = 1;
    initialOutlets = 2;
    handleInlet = ({ data, inlet }: { data: any; inlet: number }) => {
        if (inlet === 0) {
            if (!isBang(data)) this.state.instance = data;
            if (this.execute()) this.output();
        } else {
            this.state.inputs[inlet - 1] = data;
        }
    };
    subscribe() {
        super.subscribe();
        this.on("postInit", () => {
            const fn = this.imported;
            const argsCount = Math.max(fn.length, this.box.args.length, ~~+this.getProp("args"));
            this.inlets = Math.max(1, this.initialInlets + argsCount);
            this.outlets = this.initialOutlets + argsCount;
        });
        this.on("updateArgs", (args) => {
            this.state.inputs = args.slice();
            const fn = this.imported;
            const argsCount = Math.max(fn.length, args.length, ~~+this.getProp("args"));
            this.inlets = Math.max(1, this.initialInlets + argsCount);
            this.outlets = this.initialOutlets + argsCount;
        });
        this.on("updateProps", (props) => {
            if (props.args && typeof props.args === "number" && props.args >= 0) {
                const fn = this.imported;
                const argsCount = Math.max(fn.length, this.box.args.length, ~~props.args);
                this.inlets = Math.max(1, this.initialInlets + argsCount);
                this.outlets = this.initialOutlets + argsCount;
            }
        });
        this.on("inlet", this.handleInlet);
    }
    execute() {
        const fn = this.imported;
        try {
            this.state.result = fn.call(this.state.instance, ...(this.getProp("spreadArgs") ? this.state.inputs.reduce<any[]>((acc, cur) => [...acc, ...cur], []) : this.state.inputs));
            return true;
        } catch (e) {
            this.error(e);
            return false;
        }
    }
    callback = () => this.outletAll([this.state.result, this.state.instance, ...this.state.inputs] as O<Static>);
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
    set loading(loading: boolean) {
        this.updateUI({ loading });
    }
}
