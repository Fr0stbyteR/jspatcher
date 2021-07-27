import * as Util from "util";
import Patcher from "../patcher/Patcher";
import { Bang, isBang } from "./base/index.jspatpkg";
import { IJSPatcherObjectMeta } from "./base/AbstractObject";
import AbstractProjectItem from "../file/AbstractProjectItem";
import TemporaryProjectFile from "../file/TemporaryProjectFile";
import AbstractProjectFile, { ProjectFileEventMap } from "../file/AbstractProjectFile";
import DefaultObject from "./base/DefaultObject";

class StdObject<D = {}, S = {}, I extends any[] = any[], O extends any[] = any[], A extends any[] = any[], P = {}, U = {}> extends DefaultObject<D, S, I, O, A, P, U> {
    static package = "Std";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Standard Objects";
}

class print extends StdObject<{}, { title: string }, [any], [], [string]> {
    static description = "Print to console";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Anything to stringify"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
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
                if (isBang(data)) {
                    this.patcher.newLog("none", this.state.title, "Bang", this.box);
                } else {
                    this.patcher.newLog("none", this.state.title, typeof data === "string" ? data : Util.inspect(data), this.box);
                }
            }
        });
    }
}
class bang extends StdObject<{}, {}, [any], [Bang], []> {
    static description = "Transform to bang";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Anything to transform to a bang"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
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
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Anything to transform to a bang"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "bang",
        description: "Bang when inlet"
    }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
            this.patcher.on("postInited", () => this.outlet(0, new Bang()));
        });
    }
}
class unloadbang extends StdObject<{}, {}, [], [Bang], []> {
    static description = "Bang when patcher will be unloaded";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Anything to transform to a bang"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "bang",
        description: "Bang when inlet"
    }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
            this.patcher.on("unload", () => this.outlet(0, new Bang()));
        });
    }
}
class For extends StdObject<{}, { start: number; end: number; step: number }, [Bang, number, number, number], [Bang, number], [number, number, number?]> {
    static description = "Number iterator";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
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
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "bang",
        description: "Bang when finished"
    }, {
        type: "number",
        description: "Output all iterations one by one"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
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
            this.outlets = 2;
        });
        this.on("updateArgs", (args) => {
            this.state.start = +args[0] || 0;
            this.state.end = +args[1] || 0;
            this.state.step = +args[2] || 1;
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (isBang(data)) {
                    const { start, end, step } = this.state;
                    const times = (end - start) / step;
                    if (!isFinite(times) || times < 0) {
                        this.error(`Infinite loop from ${start} to ${end} with step ${step}.`);
                        return;
                    }
                    for (let i = start; i < end; i += step) {
                        this.outlet(1, i);
                    }
                    this.outlet(0, new Bang());
                }
            } else if (inlet === 1) this.state.start = +data;
            else if (inlet === 2) this.state.end = +data;
            else if (inlet === 3) this.state.step = +data;
        });
    }
}
class ForIn extends StdObject<{}, { buffer: any }, [any, any], [Bang, string | number | symbol, any], [Record<string, any>]> {
    static description = "Object key-value iterator";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Iterate input, bang to redo"
    }, {
        isHot: false,
        type: "object",
        description: "Set the iteration object"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "bang",
        description: "Bang when finished"
    }, {
        type: "anything",
        description: "Key"
    }, {
        type: "anything",
        description: "Value"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "object",
        optional: true,
        description: "Initial object to iterate"
    }];
    state = { buffer: null as any };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 3;
        });
        this.on("updateArgs", args => this.state.buffer = args[0]);
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) this.state.buffer = data;
                for (const key in this.state.buffer) {
                    this.outletAll([, key, this.state.buffer[key]]);
                }
                this.outlet(0, new Bang());
            } else if (inlet === 1) {
                this.state.buffer = data;
            }
        });
    }
}
class gate extends StdObject<{}, { pass: boolean }, [any, any], [any], [any]> {
    static description = "Bypass or block incoming data";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Anything to bypass"
    }, {
        isHot: false,
        type: "anything",
        description: "Test, falsable to block"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        description: "Anything bypass"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
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
class obj extends StdObject<{}, { obj: Record<string, any> }, [Bang, ...any], [Record<string, any>], (string | number)[]> {
    static description = "Construct an object with various properties";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "object",
        description: "Bang to output current object and initialize a new one"
    }, {
        isHot: false,
        type: "anything",
        varLength: true,
        description: "Value to set to the property"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "object",
        description: "Created object"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "anything",
        optional: true,
        varLength: true,
        description: "Key / name of the property"
    }];
    state = { obj: {} as Record<string, any> };
    subscribe() {
        super.subscribe();
        this.on("updateArgs", (args) => {
            this.inlets = args.length + 1;
        });
        this.on("postInit", () => {
            this.inlets = this.box.args.length + 1;
            this.outlets = 1;
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                this.outlet(0, this.state.obj);
                this.state.obj = {};
            } else {
                const propKey = this.box.args[inlet - 1];
                this.state.obj[propKey] = data;
            }
        });
    }
}
class set extends StdObject<{}, { key: string | number; value: any }, [Record<string, any> | any[], string | number, any], [Record<string, any> | any[]], [string | number, any]> {
    static description = "Set a property of incoming object";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
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
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        description: "Object bypass"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
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
class get extends StdObject<{}, { keys: (string | number)[] }, [Record<string, any> | any[], ...(string | number)[]], any[], (string | number)[]> {
    static description = "Get properties of incoming object";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "object",
        description: "Object to get a property"
    }, {
        isHot: false,
        type: "string",
        varLength: true,
        description: "Key / name of the property"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        varLength: true,
        description: "Value got"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
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
class dget extends StdObject<{}, { keys: (string | number)[] }, [Record<string, any> | any[], ...(string | number)[]], any[], (string | number)[]> {
    static description = "Get a deep property of incoming object";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "object",
        description: "Object to get a property"
    }, {
        isHot: false,
        type: "string",
        varLength: true,
        description: "Key / name of the property (recursive)"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        varLength: true,
        description: "Value got"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "anything",
        optional: false,
        varLength: true,
        description: "Initial key of the property (recursive)"
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
                let v = data as any;
                for (let i = 0; i < this.state.keys.length; i++) {
                    const key = this.state.keys[i];
                    if (typeof key === "string" || typeof key === "number") {
                        try {
                            v = v[key];
                        } catch (e) {
                            this.error((e as Error).message);
                            return;
                        }
                    }
                }
                this.outlet(0, v);
            } else {
                if (typeof data === "string" || typeof data === "number") this.state.keys[inlet - 1] = data;
                else this.error("Key should be a number or a string");
            }
        });
    }
}
class If extends StdObject<{}, {}, [boolean], [Bang, Bang]> {
    static description = "Output a bang on true / false";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "boolean",
        description: "True for a bang to left outlet, false for right"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
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
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
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
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "bang",
        varLength: false,
        description: "Bang if match"
    }, {
        type: "anything",
        varLength: false,
        description: "Bypass if not matched"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "anything",
        optional: false,
        varLength: true,
        description: "Initial value for match"
    }];
    state = { array: [] as any[] };
    resetIO = () => {
        const { args } = this.box;
        const testsCount = args.length;
        const [inletMeta0, inletMeta1] = sel.meta.inlets;
        const [outletMeta0, outletMeta1] = sel.meta.inlets;
        const { meta } = this;
        meta.inlets = [inletMeta0];
        meta.outlets = [];
        for (let i = 0; i < testsCount; i++) {
            meta.outlets[i] = { ...outletMeta0 };
            meta.outlets[i].description += ` index ${i}`;
            meta.inlets[i + 1] = { ...inletMeta1 };
            meta.inlets[i + 1].description += ` index ${i}`;
        }
        meta.outlets[testsCount] = outletMeta1;
        this.setMeta(meta);
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
class v extends StdObject<{}, { key: string; value: any; sharedItem: AbstractProjectItem | TemporaryProjectFile }, [Bang | any, any, string | number], [any], [string | number, any]> {
    static description = "Store anything as named sharable variable";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
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
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        description: "Value"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "anything",
        optional: true,
        description: "Variable name"
    }, {
        type: "anything",
        optional: true,
        description: "Initial value"
    }];
    state: { key: string; value: any; sharedItem: AbstractProjectFile | TemporaryProjectFile } = { key: this.box.args[0]?.toString(), value: undefined, sharedItem: null };
    subscribe() {
        super.subscribe();
        const handleFilePathChanged = () => {
            this.setState({ key: this.state.sharedItem?.projectPath });
        };
        const handleSaved = (e: ProjectFileEventMap["saved"]) => {
            if (e === this) return;
            this.setState({ value: this.state.sharedItem?.data });
        };
        const subscribeItem = async () => {
            const file = this.state.sharedItem;
            if (!file) return;
            await file.addObserver(this.id);
            file.on("destroyed", reload);
            file.on("nameChanged", handleFilePathChanged);
            file.on("pathChanged", handleFilePathChanged);
            file.on("saved", handleSaved);
        };
        const unsubscribeItem = async () => {
            const file = this.state.sharedItem;
            if (!file) return;
            file.off("destroyed", reload);
            file.off("nameChanged", handleFilePathChanged);
            file.off("pathChanged", handleFilePathChanged);
            file.off("saved", handleSaved);
            await file.removeObserver(this.id);
        };
        const reload = async () => {
            await unsubscribeItem();
            const { key } = this.state;
            try {
                const { item } = await this.getSharedItem(key, "unknown", () => this.state.value);
                this.setState({ value: item.data, sharedItem: item });
            } catch (error) {
                this.error(error);
            } finally {
                await subscribeItem();
            }
        };
        this.on("preInit", () => {
            this.inlets = 3;
            this.outlets = 1;
        });
        this.on("updateArgs", async (args) => {
            const key = args[0]?.toString();
            if (key !== this.state.key) {
                this.setState({ key });
                await reload();
            } else {
                if (typeof args[1] !== "undefined") {
                    this.setState({ value: args[1] });
                    this.state.sharedItem?.save(this.state.value, this);
                }
            }
        });
        this.on("postInit", reload);
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) {
                    this.setState({ value: data });
                    this.state.sharedItem?.save(this.state.value, this);
                }
                this.outlet(0, this.state.value);
            } else if (inlet === 1) {
                this.setState({ value: data });
                this.state.sharedItem?.save(this.state.value, this);
            } else if (inlet === 2) {
                if (typeof data === "string" || typeof data === "number") {
                    const key = data.toString() || "";
                    if (key !== this.state.key) {
                        this.setState({ key });
                        reload();
                    }
                }
            }
        });
        this.on("destroy", unsubscribeItem);
    }
}
class lambda extends StdObject<{}, { argsCount: number; result: any }, [Bang, any], [(...args: any[]) => any, ...any[]], [number]> {
    static description = "Generate anonymous function, output args when called";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "bang",
        description: "Output anonymous function"
    }, {
        isHot: false,
        type: "anything",
        description: "Result of the anonymous function"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
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
    static args: IJSPatcherObjectMeta["args"] = [{
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
                if (isBang(data)) this.outlet(0, this.lambda);
            } else if (inlet === 1) this.state.result = data;
        });
    }
}
class delay extends StdObject<{}, { time: number; ref: Set<number> }, [any, number], [any]> {
    static description = "Delay an input";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Input to be delayed"
    }, {
        isHot: false,
        type: "number",
        description: "Delay time in seconds"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        description: "Delayed input"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "number",
        optional: true,
        default: 0,
        description: "Default delay time"
    }];
    state = { time: 0, ref: new Set<number>() };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 1;
        });
        this.on("updateArgs", () => {
            const { args } = this.box;
            if (typeof args[0] === "number") this.state.time = +args[0];
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                this.state.ref.add(window.setTimeout(() => this.outlet(0, data), this.state.time || 0));
            } else if (inlet === 1) {
                this.state.time = +data;
            }
        });
        this.on("destroy", () => {
            this.state.ref.forEach(ref => window.clearTimeout(ref));
        });
    }
}

type CallState = { instance: any; inputs: any[]; result: any };
export class call extends DefaultObject<{}, CallState, [any | Bang, ...any[]], any[], [string, ...any[]], { args: number; sync: boolean }, { loading: boolean }> {
    static description = "Call a method of current object";
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
        type: "string",
        optional: false,
        description: "Method name"
    }, {
        type: "anything",
        optional: true,
        varLength: true,
        description: "Set arguments while loaded"
    }];
    static props: IJSPatcherObjectMeta["props"] = {
        args: {
            type: "number",
            default: 0,
            description: "arguments count for method"
        },
        sync: {
            type: "boolean",
            default: false,
            description: "If true and in case the result is a Promise, instead of waiting for result, will output the Promise object"
        }
    };
    state: CallState = { instance: undefined, inputs: [], result: null };
    initialInlets = 1;
    initialOutlets = 2;
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = this.initialInlets;
            this.outlets = this.initialOutlets;
        });
        this.on("updateArgs", (args) => {
            this.state.inputs = args.slice(1);
            const argsCount = Math.max(args.length - 1, ~~+this.getProp("args"));
            this.inlets = Math.max(1, this.initialInlets + argsCount);
            this.outlets = this.initialOutlets + argsCount;
        });
        this.on("updateProps", (props) => {
            if (props.args && typeof props.args === "number" && props.args >= 0) {
                const argsCount = Math.max(this.box.args.length - 1, ~~props.args);
                this.inlets = Math.max(1, this.initialInlets + argsCount);
                this.outlets = this.initialOutlets + argsCount;
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) this.state.instance = data;
                if (this.execute()) this.output();
            } else {
                this.state.inputs[inlet - 1] = data;
            }
        });
    }
    execute() {
        const m = this.box.args[0];
        try {
            this.state.result = this.state.instance[m](...this.state.inputs);
            return true;
        } catch (e) {
            this.error(e);
            return false;
        }
    }
    callback = () => this.outletAll([this.state.result, this.state.instance, ...this.state.inputs]);
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
class thispatcher extends StdObject<{}, {}, [Bang], [Patcher]> {
    static description = "Current patcher instance";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "bang",
        description: "Bang to output patcher instance"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "object",
        description: "Patcher instance"
    }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                this.outlet(0, this.patcher);
            }
        });
    }
}

export default { print, for: For, "for-in": ForIn, if: If, gate, sel, obj, set, get, dget, call, v, lambda, bang, loadbang, unloadbang, delay, thispatcher };
