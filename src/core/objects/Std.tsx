import * as Util from "util";
import { DefaultObject, Bang } from "./Base";
import "./Std.scss";
import { TMeta } from "../types";

class StdObject<D = {}, S = {}, I extends any[] = [], O extends any[] = [], A extends any[] = [], P = {}, U = {}> extends DefaultObject<D, S, I, O, A, P, U> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            package: "Std",
            author: "Fr0stbyteR",
            version: "1.0.0",
            description: "Standard Object"
        };
    }
}

class print extends StdObject<{}, { title: string }, [any], [], [string]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Print to console",
            inlets: [{
                isHot: true,
                type: "anything",
                description: "Anything to stringify"
            }],
            args: [{
                type: "string",
                optional: true,
                default: "Print",
                description: "Title"
            }]
        };
    }
    state = { title: "Print" };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 0;
        });
        this.on("updateArgs", (args) => {
            if (args[0]) this.state.title = args[0];
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (data instanceof Bang) {
                    this.patcher.newLog("none", this.state.title, "Bang");
                } else {
                    this.patcher.newLog("none", this.state.title, typeof data === "string" ? data : Util.inspect(data));
                }
            }
        });
    }
}
class For extends StdObject<{}, { start: number; end: number; step: number }, [Bang, number, number, number], [number], [number, number, number?]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Number iterator",
            inlets: [{
                isHot: true,
                type: "bang",
                description: "Do iterations"
            }, {
                isHot: false,
                type: "number",
                description: "Set the starting point"
            }, {
                isHot: false,
                type: "number",
                description: "Set the end point (excluded)"
            }, {
                isHot: false,
                type: "number",
                description: "Set the step"
            }],
            outlets: [{
                type: "number",
                description: "Output all iterations one by one"
            }],
            args: [{
                type: "number",
                optional: false,
                description: "The starting point"
            }, {
                type: "number",
                optional: false,
                description: "The end point (excluded)"
            }, {
                type: "number",
                optional: true,
                default: 1,
                description: "The step"
            }]
        };
    }
    state = { start: 0, end: 0, step: 1 };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 4;
            this.outlets = 1;
        });
        this.on("updateArgs", (args) => {
            this.state.start = +args[0] || 0;
            this.state.end = +args[1] || 0;
            this.state.step = +args[2] || 1;
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (data instanceof Bang) {
                    const { start, end, step } = this.state;
                    const times = (end - start) / step;
                    if (!isFinite(times) || times < 0) {
                        this.error(`Infinite loop from ${start} to ${end} with step ${step}.`);
                        return;
                    }
                    for (let i = start; i < end; i += step) {
                        this.outlet(0, i);
                    }
                }
            } else if (inlet === 1) this.state.start = +data;
            else if (inlet === 2) this.state.end = +data;
            else if (inlet === 3) this.state.step = +data;
        });
    }
}
class If extends StdObject<{}, {}, [boolean], [Bang, Bang]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Output a bang on true / false",
            inlets: [{
                isHot: true,
                type: "boolean",
                description: "True for a bang to left outlet, false for right"
            }],
            outlets: [{
                type: "bang",
                description: "True?"
            }, {
                type: "bang",
                description: "False?"
            }]
        };
    }
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 2;
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) this.outlet(+!data, new Bang());
        });
    }
}
class sel extends StdObject<{}, { array: any[] }, any[], (Bang | any)[], any[]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Output a bang on a matched inlet",
            inlets: [{
                isHot: true,
                type: "anything",
                varLength: false,
                description: "Test for match"
            }, {
                isHot: false,
                type: "anything",
                varLength: true,
                description: "Set value for match"
            }],
            outlets: [{
                type: "bang",
                varLength: false,
                description: "Bang if match"
            }, {
                type: "anything",
                varLength: false,
                description: "Bypass if not matched"
            }],
            args: [{
                type: "anything",
                optional: false,
                varLength: true,
                description: "Initial value for match"
            }]
        };
    }
    meta = sel.meta;
    state = { array: [] as any[] };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("updateArgs", (args) => {
            const testsCount = args.length;
            const inletMeta1 = this.meta.inlets[1];
            const outletMeta0 = this.meta.outlets[0];
            const outletMeta1 = this.meta.outlets[1];
            for (let i = 0; i < testsCount; i++) {
                this.meta.outlets[i] = { ...outletMeta0 };
                this.meta.outlets[i].description += ` index ${i}`;
                this.meta.inlets[i + 1] = { ...inletMeta1 };
                this.meta.inlets[i + 1].description += ` index ${i}`;
            }
            this.meta.outlets[testsCount] = outletMeta1;
            this.state.array = args.slice();
            this.inlets = 1 + testsCount;
            this.outlets = testsCount + 1;
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                const foundIndex = this.state.array.indexOf(data);
                if (foundIndex === -1) this.outlet(this.outlets - 1, data);
                else this.outlet(foundIndex, new Bang());
            } else {
                this.state.array[inlet - 1] = data;
            }
        });
    }
}
export default { print, for: For, if: If, sel };
