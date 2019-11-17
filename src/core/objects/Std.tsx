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
class ForIn extends StdObject<{}, { buffer: any }, [any, any], [string | number | symbol, any], [{ [key: string]: any }]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Object key-value iterator",
            inlets: [{
                isHot: true,
                type: "anything",
                description: "Iterate input, bang to redo"
            }, {
                isHot: false,
                type: "object",
                description: "Set the iteration object"
            }],
            outlets: [{
                type: "anything",
                description: "Key"
            }, {
                type: "anything",
                description: "Value"
            }],
            args: [{
                type: "object",
                optional: true,
                description: "Initial object to iterate"
            }]
        };
    }
    state = { buffer: null as any };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 2;
        });
        this.on("updateArgs", args => this.state.buffer = args[0]);
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!(data instanceof Bang)) this.state.buffer = data;
                for (const key in this.state.buffer) {
                    this.outletAll([key, this.state.buffer[key]]);
                }
            } else if (inlet === 1) {
                this.state.buffer = data;
            }
        });
    }
}
class set extends StdObject<{}, { object: { [key: string]: any } | any[]; key: string | number; value: any }, [{ [key: string]: any } | any[], string | number, any], [{ [key: string]: any } | any[]], [string | number, any]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Set a property of incoming object",
            inlets: [{
                isHot: true,
                type: "object",
                description: "Object to set a property"
            }, {
                isHot: false,
                type: "string",
                description: "Key / name of the property"
            }, {
                isHot: false,
                type: "anything",
                description: "Value to set to the property"
            }],
            outlets: [{
                type: "anything",
                description: "Object bypass"
            }],
            args: [{
                type: "anything",
                optional: false,
                description: "Initial key of the property"
            }, {
                type: "anything",
                optional: true,
                default: undefined,
                description: "Initial value of the property"
            }]
        };
    }
    state = { object: null as { [key: string]: any } | any[], key: undefined as string | number, value: undefined as any };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 3;
            this.outlets = 1;
        });
        this.on("updateArgs", (args) => {
            if (typeof args[0] === "string" || typeof args[0] === "number") this.state.key = args[0];
            if (typeof args[1] !== "undefined") this.state.value = args[1];
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (typeof this.state.key === "string" || typeof this.state.key === "number") {
                    data[this.state.key] = this.state.value;
                    this.outlet(0, data);
                } else {
                    this.error("Key not defined");
                }
            } else if (inlet === 1) {
                if (typeof data === "string" || typeof data === "number") this.state.key = data;
                else this.error("Key should be a number or a string");
            } else if (inlet === 2) {
                this.state.value = data;
            }
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
export default { print, for: For, "for-in": ForIn, if: If, sel, set };
