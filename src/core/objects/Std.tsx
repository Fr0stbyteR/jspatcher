import * as Util from "util";
import { DefaultObject, Bang } from "./Base";
import { TMeta } from "../types";
import { SharedDataNoValue } from "../../utils/symbols";

class StdObject<D = {}, S = {}, I extends any[] = any[], O extends any[] = any[], A extends any[] = any[], P = {}, U = {}> extends DefaultObject<D, S, I, O, A, P, U> {
    static package = "Std";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Standard Objects";
}

class print extends StdObject<{}, { title: string }, [any], [], [string]> {
    static description = "Print to console";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Anything to stringify"
    }];
    static args: TMeta["args"] = [{
        type: "string",
        optional: true,
        default: "Print",
        description: "Title"
    }];
    state = { title: "Print" };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 0;
        });
        this.on("updateArgs", (args) => {
            if (typeof args[0] !== "undefined") this.state.title = args[0];
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
class bang extends StdObject<{}, {}, [any], [Bang], []> {
    static description = "Transform to bang";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Anything to transform to a bang"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "bang",
        description: "Bang when inlet"
    }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("inlet", ({ inlet }) => {
            if (inlet === 0) this.outlet(0, new Bang());
        });
    }
}
class loadbang extends StdObject<{}, {}, [], [Bang], []> {
    static description = "Bang when patcher is loaded";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Anything to transform to a bang"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "bang",
        description: "Bang when inlet"
    }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 0;
            this.outlets = 1;
            this.patcher.on("ready", () => this.outlet(0, new Bang()));
        });
    }
}
class For extends StdObject<{}, { start: number; end: number; step: number }, [Bang, number, number, number], [number], [number, number, number?]> {
    static description = "Number iterator";
    static inlets: TMeta["inlets"] = [{
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
    }];
    static outlets: TMeta["outlets"] = [{
        type: "number",
        description: "Output all iterations one by one"
    }];
    static args: TMeta["args"] = [{
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
    }];
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
    static description = "Object key-value iterator";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Iterate input, bang to redo"
    }, {
        isHot: false,
        type: "object",
        description: "Set the iteration object"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "anything",
        description: "Key"
    }, {
        type: "anything",
        description: "Value"
    }];
    static args: TMeta["args"] = [{
        type: "object",
        optional: true,
        description: "Initial object to iterate"
    }];
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
class gate extends StdObject<{}, { pass: boolean }, [any, any], [any], [any]> {
    static description = "Bypass or block incoming data";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Anything to bypass"
    }, {
        isHot: false,
        type: "anything",
        description: "Test, falsable to block"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "anything",
        description: "Anything bypass"
    }];
    static args: TMeta["args"] = [{
        type: "anything",
        optional: true,
        default: true,
        description: "default state"
    }];
    state = { pass: true };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 1;
        });
        this.on("updateArgs", (args) => {
            this.state.pass = args[0] === "undefined" || args[0] === "" || !!args[0];
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (this.state.pass) this.outlet(0, data);
            } else if (inlet === 1) {
                this.state.pass = !!data;
            }
        });
    }
}
class set extends StdObject<{}, { key: string | number; value: any }, [{ [key: string]: any } | any[], string | number, any], [{ [key: string]: any } | any[]], [string | number, any]> {
    static description = "Set a property of incoming object";
    static inlets: TMeta["inlets"] = [{
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
    }];
    static outlets: TMeta["outlets"] = [{
        type: "anything",
        description: "Object bypass"
    }];
    static args: TMeta["args"] = [{
        type: "anything",
        optional: false,
        description: "Initial key of the property"
    }, {
        type: "anything",
        optional: true,
        default: undefined,
        description: "Initial value of the property"
    }];
    state = { key: undefined as string | number, value: undefined as any };
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
                    try {
                        data[this.state.key] = this.state.value;
                        this.outlet(0, data);
                    } catch (e) {
                        this.error((e as Error).message);
                    }
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
class get extends StdObject<{}, { keys: (string | number)[] }, [{ [key: string]: any } | any[], ...(string | number)[]], any[], (string | number)[]> {
    static description = "Get properties of incoming object";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "object",
        description: "Object to get a property"
    }, {
        isHot: false,
        type: "string",
        varLength: true,
        description: "Key / name of the property"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "anything",
        varLength: true,
        description: "Value got"
    }];
    static args: TMeta["args"] = [{
        type: "anything",
        optional: false,
        varLength: true,
        description: "Initial key of the property"
    }];
    state = { keys: [] as (string | number)[] };
    resetIO = () => {
        const { args } = this.box;
        this.state.keys = args.slice();
        this.inlets = 1 + args.length;
        this.outlets = args.length;
    };
    subscribe() {
        super.subscribe();
        this.on("postInit", this.resetIO);
        this.on("updateArgs", this.resetIO);
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                for (let i = this.state.keys.length - 1; i >= 0; i--) {
                    const key = this.state.keys[i];
                    if (typeof key === "string" || typeof key === "number") {
                        try {
                            this.outlet(i, (data as any)[key]);
                        } catch (e) {
                            this.error((e as Error).message);
                        }
                    }
                }
            } else {
                if (typeof data === "string" || typeof data === "number") this.state.keys[inlet - 1] = data;
                else this.error("Key should be a number or a string");
            }
        });
    }
}
class If extends StdObject<{}, {}, [boolean], [Bang, Bang]> {
    static description = "Output a bang on true / false";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "boolean",
        description: "True for a bang to left outlet, false for right"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "bang",
        description: "True?"
    }, {
        type: "bang",
        description: "False?"
    }];
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
    static description = "Output a bang on a matched inlet";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        varLength: false,
        description: "Test for match"
    }, {
        isHot: false,
        type: "anything",
        varLength: true,
        description: "Set value for match"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "bang",
        varLength: false,
        description: "Bang if match"
    }, {
        type: "anything",
        varLength: false,
        description: "Bypass if not matched"
    }];
    static args: TMeta["args"] = [{
        type: "anything",
        optional: false,
        varLength: true,
        description: "Initial value for match"
    }];
    _meta = sel.meta;
    get meta() {
        return this._meta;
    }
    state = { array: [] as any[] };
    resetIO = () => {
        const { args } = this.box;
        const testsCount = args.length;
        const [inletMeta0, inletMeta1] = sel.meta.inlets;
        const [outletMeta0, outletMeta1] = sel.meta.inlets;
        this._meta.inlets = [inletMeta0];
        this._meta.outlets = [];
        for (let i = 0; i < testsCount; i++) {
            this._meta.outlets[i] = { ...outletMeta0 };
            this._meta.outlets[i].description += ` index ${i}`;
            this._meta.inlets[i + 1] = { ...inletMeta1 };
            this._meta.inlets[i + 1].description += ` index ${i}`;
        }
        this._meta.outlets[testsCount] = outletMeta1;
        this.emit("metaChanged");
        this.state.array = args.slice();
        this.inlets = 1 + testsCount;
        this.outlets = testsCount + 1;
    };
    subscribe() {
        super.subscribe();
        this.on("postInit", this.resetIO);
        this.on("updateArgs", this.resetIO);
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
class v extends StdObject<{}, { key: string; value: any }, [Bang | any, any], [any], [string | number, any]> {
    static description = "Store anything as named sharable variable";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Bang to output stored value, anything to set the value then output it."
    }, {
        isHot: false,
        type: "anything",
        description: "Anything to set the value."
    }, {
        isHot: false,
        type: "anything",
        description: "Set variable name."
    }];
    static outlets: TMeta["outlets"] = [{
        type: "anything",
        description: "Value"
    }];
    static args: TMeta["args"] = [{
        type: "anything",
        optional: true,
        description: "Variable name"
    }, {
        type: "anything",
        optional: true,
        description: "Initial value"
    }];
    state = { key: undefined as string, value: undefined as any };
    subscribe() {
        super.subscribe();
        const reload = () => {
            if (this.state.key) this.sharedData.unsubscribe("_v", this.state.key, this);
            const { args } = this.box;
            if (typeof args[0] === "string" || typeof args[0] === "undefined") this.state.key = args[0];
            if (typeof args[1] !== "undefined") this.state.value = args[1];
            const { key } = this.state;
            if (key) {
                const shared = this.sharedData.get("_v", key);
                if (shared !== SharedDataNoValue) this.state.value = shared;
                else this.sharedData.set("_v", key, this.state.value, this);
                this.sharedData.subscribe("_v", this.state.key, this);
            }
        };
        this.on("preInit", () => {
            this.inlets = 3;
            this.outlets = 1;
        });
        this.on("updateArgs", (args) => {
            if (typeof args[0] === "string" || typeof args[0] === "undefined") {
                const key = args[0];
                if (key !== this.state.key) {
                    reload();
                } else {
                    if (typeof args[1] !== "undefined") {
                        this.state.value = args[1];
                        if (this.state.key) this.sharedData.set("_v", this.state.key, this.state.value, this);
                    }
                }
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!(data instanceof Bang)) {
                    this.state.value = data;
                    if (this.state.key) this.sharedData.set("_v", this.state.key, this.state.value, this);
                }
                this.outlet(0, this.state.value);
            } else if (inlet === 1) {
                this.state.value = data;
                if (this.state.key) this.sharedData.set("_v", this.state.key, this.state.value, this);
            } else if (inlet === 2) {
                if (typeof data === "string" || typeof data === "number") {
                    const key = data || "";
                    if (key !== this.state.key) {
                        reload();
                    }
                }
            }
        });
        this.on("sharedDataUpdated", ({ data }) => this.state.value = data);
        this.on("destroy", () => {
            if (this.state.key) this.sharedData.unsubscribe("_v", this.state.key, this);
        });
    }
}
class lambda extends StdObject<{}, { argsCount: number; result: any }, [Bang, any], [(...args: any[]) => any, ...any[]], [number]> {
    static description = "Generate anonymous function, output args when called";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "bang",
        description: "Output anonymous function"
    }, {
        isHot: false,
        type: "anything",
        description: "Result of the anonymous function"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "function",
        description: "Anonymous function"
    }, {
        type: "bang",
        description: "bang while lambda is called"
    }, {
        type: "anything",
        varLength: true,
        description: "If args=0, outlet args as array, else argument of current index"
    }];
    static args: TMeta["args"] = [{
        type: "number",
        optional: true,
        default: 0,
        description: "Arguments count"
    }];
    state = { argsCount: 0, result: undefined as any };
    lambda = (...args: any[]) => {
        this.state.result = undefined;
        if (this.state.argsCount === 0) {
            this.outletAll([, new Bang(), args]);
        } else {
            this.outletAll([, new Bang(), ...args]);
        }
        return this.state.result; // After outlet, result will be received.
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 3;
        });
        this.on("updateArgs", () => {
            const { args } = this.box;
            if (typeof args[0] === "number" && args[0] >= 0) {
                this.state.argsCount = ~~args[0];
                this.outlets = 2 + this.state.argsCount;
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (data instanceof Bang) this.outlet(0, this.lambda);
            } else if (inlet === 1) this.state.result = data;
        });
    }
}

export default { print, for: For, "for-in": ForIn, if: If, gate, sel, set, get, v, lambda, bang, loadbang };
