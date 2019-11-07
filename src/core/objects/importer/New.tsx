import { StaticMethod } from "./StaticMethod";
import { BaseObject, Bang, TMeta } from "../Base";
import Patcher from "../../Patcher";
import Box from "../../Box";
import { ImportedObject, ImportedObjectUI } from "./ImportedObject";

class NewUI extends ImportedObjectUI<New> {
    prependColor = "rgb(78, 201, 176)";
}
type TAnyConstructor = new (...args: any[]) => any;
type S = { Wrapper: typeof StaticMethod; inputs: any[]; result: any };
export default class New extends BaseObject<{}, S, [any | Bang, ...any[]], [any, ...any[]], any[], { args: number }, { loading: boolean }> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Call function as a constructor ",
            inlets: [{
                isHot: true,
                type: "anything",
                description: "Constructor argument, output instance constructed"
            }, {
                isHot: false,
                type: "anything",
                varLength: true,
                description: "Constructor argument"
            }],
            outlets: [{
                type: "anything",
                description: "Instance constructed"
            }, {
                type: "anything",
                varLength: true,
                description: "Argument after constructor called"
            }],
            args: [{
                type: "string",
                optional: false,
                varLength: false,
                description: "Constructor name"
            }, {
                type: "anything",
                optional: true,
                varLength: true,
                description: "Set arguments while loaded"
            }],
            props: [{
                name: "args",
                type: "number",
                description: "arguments count for constructor"
            }]
        };
    }
    state: S = { Wrapper: null, inputs: [], result: null };
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 1;
        this.outlets = 1;
        this.update(box.args.slice(), box.props);
    }
    update(args?: any[], props?: { args?: number }) {
        this.updateBox(args, props);
        if (args) {
            if (args[0]) {
                const Wrapper = this.patcher.state.lib[args[0]];
                if (!Wrapper) this.error(`Function ${args[0]} not found.`);
                else if (Wrapper.prototype instanceof StaticMethod) {
                    this.state.Wrapper = Wrapper as typeof StaticMethod;
                    const Fn = this.imported;
                    this.inlets = Fn.length === 0 ? 1 : Fn.length; // Function.length property
                    this.outlets = 1 + this.inlets;
                } else {
                    this.error("Given function is not constructable");
                }
            } else {
                this.error("A constructor is needed.");
            }
            this.state.inputs = args.slice(1);
        }
        if (props && props.args && typeof props.args === "number" && props.args >= 0) {
            this.inlets = ~~props.args;
            this.outlets = 1 + this.inlets;
        }
        return this;
    }
    fn(data: any, inlet: number) {
        if (inlet === 0) {
            if (!(data instanceof Bang)) this.state.inputs[inlet] = data;
            if (this.execute()) return this.output();
        } else {
            this.state.inputs[inlet] = data;
        }
        return this;
    }
    execute() {
        const Fn = this.imported;
        try {
            this.state.result = new Fn(...this.state.inputs);
            return true;
        } catch (e) {
            this.error(e);
            return false;
        }
    }
    callback = () => this.outletAll([this.state.result, ...this.state.inputs]);
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
    get ui() {
        return NewUI;
    }
    set loading(loading: boolean) {
        this.uiUpdate({ loading });
    }
    get name() {
        const c = this.state.Wrapper;
        return c.path[c.path.length - 1];
    }
    get imported(): TAnyConstructor {
        const c = this.state.Wrapper;
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
