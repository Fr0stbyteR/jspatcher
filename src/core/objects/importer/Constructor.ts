import { TMeta, Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";
import { ImportedObjectUI, ImportedObject } from "./ImportedObject";

type TAnyConstructor = new (...args: any[]) => any;
class ConstructorUI extends ImportedObjectUI<Constructor> {
    prependColor = "rgb(78, 201, 176)";
}
export class Constructor extends ImportedObject<TAnyConstructor, { inputs: any[]; result: any }, [any | Bang, ...any[]], [any, ...any[]], any[], { args: number }, { loading: boolean }> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Auto-imported constructor",
            inlets: [{
                isHot: true,
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
            props: [{
                name: "args",
                type: "number",
                description: "arguments count for constructor"
            }]
        };
    }
    state = { inputs: [] as any[], result: null as any };
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        const Fn = this.imported;
        this.inlets = Fn.length === 0 ? 1 : Fn.length; // Function.length property
        this.outlets = 1 + this.inlets;
        this.update(box.parsed.args.slice(), box.parsed.props);
    }
    update(args: any[], props: { args?: number }) {
        if (props && props.args && typeof props.args === "number" && props.args >= 0) {
            this.inlets = ~~props.args;
            this.outlets = 1 + this.inlets;
        }
        if (args) this.state.inputs = args;
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
    get ui(): typeof ImportedObjectUI {
        return ConstructorUI;
    }
    set loading(loading: boolean) {
        this.uiUpdate({ loading });
    }
}
