import { BaseObject, TMeta, Bang } from "./objects/Base";
import Box from "./Box";
import Patcher from "./Patcher";
import { TPackage } from "./types";

type TImportedModule = { [key: string]: any };
declare const window: { module: { exports: TImportedModule }; exports: TImportedModule };

export default class AutoImporter {
    static async importFrom(address: string, pkgName: string) {
        const toExport: TImportedModule = {}; // Original exports, detect if exports is overwritten.
        window.exports = toExport;
        window.module = { exports: toExport };
        return new Promise((resolve: (script: HTMLScriptElement) => void, reject) => {
            const script = document.createElement("script");
            script.async = true;
            script.src = address;
            script.type = "module";
            script.addEventListener("load", () => resolve(script));
            script.addEventListener("error", () => reject(new Error("Error loading script.")));
            script.addEventListener("abort", () => reject(new Error("Script loading aborted.")));
            document.head.appendChild(script);
        }).then(() => {
            const exported = window.module.exports;
            delete window.exports;
            delete window.module;
            if (toExport === exported) return this.import(pkgName, exported);
            const o: { [key: string]: any } = {}; // if exports is overwritten, wrap it
            o[pkgName] = exported;
            return this.import(pkgName, o);
        });
    }
    /*
    static async test() {
        await AutoImporter.importFrom("https://unpkg.com/@tensorflow/tfjs", "tf").then(console.log);
        await AutoImporter.importFrom("https://unpkg.com/three", "THREE").then(console.log);
        await AutoImporter.importFrom("https://unpkg.com/webmidi", "MIDI").then(console.log);
    }
    */
    static import(pkgName: string, root: { [key: string]: any }, outIn?: TPackage, pathIn?: string[], stackIn?: any[], depthIn?: number, fromProto?: boolean) {
        const depth = typeof depthIn === "undefined" ? 0 : depthIn;
        const out = outIn || {};
        const path = pathIn ? pathIn.slice() : [];
        const stack = stackIn ? stackIn.slice() : [];
        let o = root;
        path.forEach(key => o = o[key]);
        if (stack.indexOf(o) !== -1 || (pkgName !== "Window" && o === window)) return out; // cyclic object
        stack[depth] = o;
        for (const key in o) {
            if (!o.hasOwnProperty(key)) continue;
            try {
                const el = o[key];
                path[depth] = key;
                out[path.filter(v => v !== "prototype").join(".")] = this.generate(el, pkgName, root, path, fromProto);
                if (typeof el === "object" && !Array.isArray(el)) {
                    this.import(pkgName, root, out, path, stack, depth + 1, false);
                } else if (el.hasOwnProperty("prototype")) this.import(pkgName, root, out, [...path, "prototype"], stack, depth + 2, true);
            } catch (e) {} // eslint-disable-line no-empty
        }
        return out;
    }
    static generate(el: any, pkgName: string, root: { [key: string]: any }, pathIn: string[], fromProto: boolean) {
        const path = pathIn.slice();
        const name = path[path.length - 1];
        if (typeof el === "function") { // static function or method
            return class extends BaseObject<{}, { name: string; fn: any; instance: any; inputs: any[]; result: any; fromProto: boolean }, any[], any[], any[], { inlets: number }, { loading: boolean }> {
                static get meta(): TMeta {
                    return {
                        ...super.meta,
                        name,
                        package: pkgName,
                        description: fromProto ? "Auto-imported OOP method" : "Auto-imported static function",
                        inlets: fromProto ? [{
                            isHot: true,
                            type: "anything",
                            description: "Instance of this prototype"
                        }, {
                            isHot: false,
                            type: "anything",
                            varLength: true,
                            description: "Method argument"
                        }] : [{
                            isHot: true,
                            type: "anything",
                            varLength: true,
                            description: "Function argument"
                        }],
                        outlets: fromProto ? [{
                            type: "anything",
                            description: "Instance with method called"
                        }, {
                            type: "anything",
                            description: "Return value of method called"
                        }, {
                            type: "anything",
                            description: "Arguments with method called as list"
                        }] : [{
                            type: "anything",
                            description: "Return value of function called"
                        }, {
                            type: "anything",
                            description: "Arguments with function called as list"
                        }],
                        props: [{
                            name: "inlets",
                            type: "number",
                            description: "arguments count for " + fromProto ? "method" : "function"
                        }]
                    };
                }
                state = { name, fn: el, instance: null as any, inputs: null as any[], result: null as any, fromProto: !!fromProto };
                constructor(box: Box, patcher: Patcher) {
                    super(box, patcher);
                    this.inlets = (fromProto ? 1 : 0) + (el.length === 0 ? 1 : el.length); // Function.length property
                    this.outlets = (fromProto ? 1 : 0) + 2;
                    this.state.inputs = box.parsed.args.slice(); // copy array
                    this.update(this.state.inputs, box.parsed.props);
                }
                update(args: any[], props: { inlets?: number; [key: string]: any }) {
                    if (props && props.inlets && typeof props.inlets === "number") {
                        this.inlets = (this.state.fromProto ? 1 : 0) + props.inlets;
                    }
                    if (!args) return this;
                    this.state.inputs = args;
                    return this;
                }
                fn(data: any, inlet: number) {
                    if (inlet === 0 && data instanceof Bang) {
                        if (this.execute()) return this.output();
                        return this;
                    }
                    if (this.state.fromProto) {
                        if (inlet === 0) this.state.instance = data;
                        else this.state.inputs[inlet - 1] = data;
                    } else this.state.inputs[inlet] = data;
                    if (inlet === 0) {
                        if (this.execute()) return this.output();
                    }
                    return this;
                }
                execute() {
                    try {
                        if (this.state.fromProto) {
                            if (this.state.instance) this.state.result = this.state.instance[this.state.name](...this.state.inputs);
                            else return false;
                        } else {
                            try {
                                this.state.result = new this.state.fn(...this.state.inputs); // eslint-disable-line new-cap
                            } catch (e) {
                                this.state.result = this.state.fn(...this.state.inputs);
                            }
                        }
                        return true;
                    } catch (e) {
                        this.error(e);
                        return false;
                    }
                }
                output() {
                    const callback = () => {
                        if (this.state.fromProto) return this.outlet(2, this.state.inputs).outlet(1, this.state.result).outlet(0, this.state.instance);
                        return this.outlet(1, this.state.inputs).outlet(0, this.state.result);
                    };
                    if (this.state.result instanceof Promise) {
                        this.loading = true;
                        this.state.result.then((r) => {
                            this.loading = false;
                            this.state.result = r;
                            callback();
                        }, (r) => {
                            this.loading = false;
                            this.error(r);
                        });
                        return this;
                    }
                    return callback();
                }
                set loading(loading: boolean) {
                    this.uiUpdate({ loading });
                }
            };
        }
        return class extends BaseObject<{}, { instance: any }, [any, any?], [any]> { // static values or property getter
            static get meta(): TMeta {
                return Object.assign(super.meta, {
                    name,
                    package: pkgName,
                    description: "Auto-imported " + fromProto ? "property getter" : "value",
                    inlets: fromProto ? [{
                        isHot: true,
                        type: "anything",
                        description: "Instance of this prototype, bang to trigger getter"
                    }, {
                        isHot: false,
                        type: "anything",
                        description: "anything to trigger setter"
                    }] : [{
                        isHot: true,
                        type: "anything",
                        description: "Bang to output value, anything to set the value"
                    }],
                    outlets: [{
                        type: "anything",
                        description: fromProto ? "Property got" : "Value got"
                    }]
                });
            }
            state = { instance: null as any }
            constructor(box: Box, patcher: Patcher) {
                super(box, patcher);
                this.inlets = fromProto ? 2 : 1;
                this.outlets = 1;
            }
            fn(data: any, inlet: number) {
                if (inlet === 0) {
                    if (data instanceof Bang) {
                        if (fromProto) return this.state.instance ? this.outlet(0, this.state.instance[name]) : this;
                        let r = root;
                        path.forEach(key => r = r[key]);
                        return this.outlet(0, r);
                    }
                    if (fromProto) {
                        this.state.instance = data;
                        return this;
                    }
                    try {
                        let r = root;
                        path.slice(0, -1).forEach(key => r = r[key]);
                        r[name] = data;
                    } catch (e) {
                        return this.error(e);
                    }
                }
                if (inlet === 1 && fromProto) {
                    try {
                        this.state.instance[name] = data;
                    } catch (e) {
                        this.error(e);
                    }
                }
                return this;
            }
        };
    }
}
