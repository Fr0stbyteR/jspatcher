import { TMeta, Bang } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";
import { StaticPropertyUI } from "./StaticProperty";
import { ImportedObject } from "./ImportedObject";

export class StaticSetterGetter extends ImportedObject<any, { result: any }, [Bang, any], [any], [any], {}, { loading: boolean }> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Auto-imported static setter / getter",
            inlets: [{
                isHot: true,
                type: "bang",
                description: "Get the value"
            }, {
                isHot: false,
                type: "anything",
                description: "Set the value"
            }],
            outlets: [{
                type: "anything",
                description: "Value"
            }]
        };
    }
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 2;
        this.outlets = 1;
        this.update([box.parsed.args]);
    }
    update(args: [any]) {
        if (args && args.length) this.imported = args[0];
        return this;
    }
    fn(data: any, inlet: number) {
        if (inlet === 0) {
            if (data instanceof Bang && this.execute()) this.output();
        } else if (inlet === 1) {
            this.imported = data;
        }
        return this;
    }
    execute() {
        try {
            this.state.result = this.imported;
            return true;
        } catch (e) {
            this.error(e);
            return false;
        }
    }
    callback = () => this.outlet(0, this.state.result);
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
        this.uiUpdate({ loading });
    }
    get ui(): typeof StaticPropertyUI {
        return StaticPropertyUI;
    }
}
