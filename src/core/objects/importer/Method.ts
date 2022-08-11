import ImportedObject from "./ImportedObject";
import Bang, { isBang } from "../base/Bang";
import type { IJSPatcherObjectMeta, IPropsMeta } from "../base/AbstractObject";
import type { ImportedObjectType } from "../../types";

type TAnyFunction = (...args: any[]) => any;
interface IS<Static extends boolean> {
    instance: Static extends true ? undefined : any;
    inputs: any[];
    result: any;
}
type I<Static extends boolean> = Static extends true ? [any | Bang, ...any[]] : [any | Bang, any, ...any[]];
type O<Static extends boolean> = Static extends true ? [any, ...any[]] : [any, any, ...any[]];
interface P {
    args: number;
    spreadArgs: boolean;
    sync: boolean;
}

export default class Method<Static extends boolean = false> extends ImportedObject<TAnyFunction, {}, I<Static>, O<Static>, any[], P, { loading: boolean }> {
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
    _: IS<Static> = { instance: undefined, inputs: [], result: null };
    initialInlets = 1;
    initialOutlets = 2;
    handleInlet = ({ data, inlet }: { data: any; inlet: number }) => {
        if (inlet === 0) {
            if (!isBang(data)) this._.instance = data;
            if (this.execute()) this.output();
        } else {
            this._.inputs[inlet - 1] = data;
        }
    };
    subscribe() {
        super.subscribe();
        this.on("postInit", () => {
            const { initialInlets } = this;
            const structure = this.updateFunctionMetaFromTS(initialInlets ? "Method" : "StaticMethod");
            this.inlets = Math.max(1, structure?.parameters?.length || initialInlets);
            handleUpdateArgs(this.args);
        });
        const handleUpdateArgs = (args: any[]) => {
            this._.inputs = args.slice();
            const fn = this.imported;
            const argsCount = Math.max(fn.length, args.length, ~~+this.getProp("args"));
            this.inlets = Math.max(1, this.inlets, this.initialInlets + argsCount);
            this.outlets = this.initialOutlets + argsCount;
        };
        this.on("updateArgs", handleUpdateArgs);
        this.on("updateProps", (props) => {
            if (props.args && typeof props.args === "number" && props.args >= 0) {
                const fn = this.imported;
                const argsCount = Math.max(fn.length, this.box.args.length, ~~props.args);
                this.inlets = Math.max(1, this.inlets, this.initialInlets + argsCount);
                this.outlets = this.initialOutlets + argsCount;
            }
        });
        this.on("inlet", this.handleInlet);
    }
    execute() {
        const fn = this.imported;
        try {
            this._.result = fn.call(this._.instance, ...(this.getProp("spreadArgs") ? this._.inputs.reduce<any[]>((acc, cur) => [...acc, ...cur], []) : this._.inputs));
            return true;
        } catch (e) {
            this.error(e);
            return false;
        }
    }
    callback = () => this.outletAll([this._.result, this._.instance, ...this._.inputs] as O<Static>);
    output() {
        if (this._.result instanceof Promise && !this.getProp("sync")) {
            this.loading = true;
            this._.result.then((r) => {
                this.loading = false;
                this._.result = r;
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
