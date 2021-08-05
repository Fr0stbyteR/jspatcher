import StaticMethod from "./StaticMethod";
import BaseObject from "../base/BaseObject";
import Bang, { isBang } from "../base/Bang";
import type ImportedObject from "./ImportedObject";
import type { IJSPatcherObjectMeta, IPropsMeta } from "../base/AbstractObject";

type TAnyConstructor = new (...args: any[]) => any;
interface P {
    args: number;
    spreadArgs: boolean;
}
interface S {
    Wrapper: typeof StaticMethod;
    inputs: any[];
    result: any;
}

export default class New extends BaseObject<{}, S, [any | Bang, ...any[]], [any, ...any[]], any[], P, { loading: boolean }> {
    static description = "Call function as a constructor";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Constructor argument, output instance constructed"
    }, {
        isHot: false,
        type: "anything",
        varLength: true,
        description: "Constructor argument"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        description: "Instance constructed"
    }, {
        type: "anything",
        varLength: true,
        description: "Argument after constructor called"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "string",
        optional: false,
        varLength: false,
        description: "Constructor name"
    }, {
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
        }
    };
    state: S = { Wrapper: null, inputs: [], result: null };
    subscribe() {
        super.subscribe();
        this.on("postInit", () => {
            const Fn = this.imported;
            const argsCount = Math.max(Fn.length, this.box.args.length - 1, ~~+this.getProp("args"));
            this.inlets = Math.max(1, argsCount);
            this.outlets = 1 + this.inlets;
        });
        this.on("updateArgs", (args) => {
            if (typeof args[0] !== "undefined") {
                const Wrapper = this.patcher.activeLib[args[0]];
                if (!Wrapper) this.error(`Function ${args[0]} not found.`);
                else if (Wrapper.prototype instanceof StaticMethod) {
                    this.state.Wrapper = Wrapper as typeof StaticMethod;
                    const Fn = this.imported;
                    const argsCount = Math.max(Fn.length, args.length - 1, ~~+this.getProp("args"));
                    this.inlets = Math.max(1, argsCount);
                    this.outlets = 1 + this.inlets;
                } else {
                    this.error("Given function is not constructable");
                }
            } else {
                this.error("A constructor is needed.");
            }
            this.state.inputs = args.slice(1);
        });
        this.on("updateProps", (props) => {
            if (props.args && typeof props.args === "number" && props.args >= 0) {
                const Fn = this.imported;
                const argsCount = Math.max(Fn.length, this.box.args.length - 1, ~~+props.args);
                this.inlets = Math.max(1, argsCount);
                this.outlets = 1 + this.inlets;
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) this.state.inputs[inlet] = data;
                if (this.execute()) this.output();
            } else {
                this.state.inputs[inlet] = data;
            }
        });
    }
    execute() {
        const Fn = this.imported;
        try {
            this.state.result = new Fn(...(this.getProp("spreadArgs") ? this.state.inputs.reduce<any[]>((acc, cur) => [...acc, ...cur], []) : this.state.inputs));
            return true;
        } catch (e) {
            this.error(e);
            return false;
        }
    }
    callback = () => this.outletAll([this.state.result, ...this.state.inputs]);
    output() {
        return this.callback();
    }
    set loading(loading: boolean) {
        this.updateUI({ loading });
    }
    get name() {
        const c = this.state.Wrapper;
        return c.path[c.path.length - 1];
    }
    get imported(): TAnyConstructor {
        const c = this.state.Wrapper || this.patcher.activeLib.Object as typeof StaticMethod;
        let r: TAnyConstructor;
        try {
            r = c.path.reduce((acc, cur) => acc[cur], c.root);
        } catch (e) {
            this.error(e);
        }
        return r;
    }
    set imported(v: TAnyConstructor) {
        const c = (this.constructor as typeof ImportedObject);
        let parent = c.root;
        try {
            if (!c.path.length) {
                c.root = v;
            } else {
                c.path.slice(0, -1).forEach(key => parent = parent[key]);
                parent[c.path[c.path.length - 1]] = v;
            }
        } catch (e) {
            this.error(e);
        }
    }
}
