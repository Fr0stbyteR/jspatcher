import { StaticMethod } from "./StaticMethod";
import { Bang, isBang } from "../Base";
import { ImportedObject, ImportedObjectUI } from "./ImportedObject";
import { IJSPatcherObjectMeta } from "../../types";
import { Method } from "./Method";
import DefaultObject from "../base/DefaultObject";

class FuncUI extends ImportedObjectUI<Func> {
    prependColor = "rgb(78, 201, 176)";
}
type TAnyFunction = (...args: any[]) => any;
type TWrapper = typeof StaticMethod | typeof Method;
type S = { Wrapper: TWrapper };
export default class Func extends DefaultObject<{}, S, [Bang], [TAnyFunction], any[], {}, {}> {
    static description = "Get the function itself";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "bang",
        description: "Bang to get the function itself"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "function",
        description: "function"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "string",
        optional: false,
        varLength: false,
        description: "Function name"
    }];
    static UI = FuncUI;
    state: S = { Wrapper: null };
    subscribe() {
        super.subscribe();
        this.on("postInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("updateArgs", (args) => {
            if (typeof args[0] !== "undefined") {
                const Wrapper = this.patcher.activeLib[args[0]];
                if (!Wrapper) this.error(`Function ${args[0]} not found.`);
                else if (Wrapper.prototype instanceof StaticMethod || Wrapper.prototype instanceof Method) {
                    this.state.Wrapper = Wrapper as TWrapper;
                } else {
                    this.error("Given identifier function is not a function");
                }
            } else {
                this.error("A function identifier is needed.");
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (isBang(data)) this.output();
            }
        });
    }
    callback = () => this.outlet(0, this.imported);
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
    get imported(): TAnyFunction {
        const c = this.state.Wrapper || this.patcher.activeLib.Object as TWrapper;
        let r: TAnyFunction;
        try {
            r = c.path.reduce((acc, cur) => acc[cur], c.root);
        } catch (e) {
            this.error(e);
        }
        return r;
    }
    set imported(v: TAnyFunction) {
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
