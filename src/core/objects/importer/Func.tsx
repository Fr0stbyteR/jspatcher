import StaticMethod from "./StaticMethod";
import Method from "./Method";
import BaseObject from "../base/BaseObject";
import Bang, { isBang } from "../base/Bang";
import type Env from "../../Env";
import type ImportedObject from "./ImportedObject";
import type { IJSPatcherObjectMeta } from "../base/AbstractObject";

type TAnyFunction = (...args: any[]) => any;
type TWrapper = typeof StaticMethod | typeof Method;
interface IS { Wrapper: TWrapper }
export default class Func extends BaseObject<{}, {}, [Bang], [TAnyFunction], any[], {}, { loading: boolean }> {
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
    _: IS = { Wrapper: null };
    subscribe() {
        super.subscribe();
        this.on("postInit", () => {
            this.inlets = 1;
            this.outlets = 1;
            handleUpdateArgs(this.args);
        });
        const handleUpdateArgs = (args: any[]) => {
            if (typeof args[0] !== "undefined") {
                const Wrapper = this.patcher.activeLib[args[0]];
                if (!Wrapper) this.error(`Function ${args[0]} not found.`);
                else if (Wrapper.prototype instanceof StaticMethod || Wrapper.prototype instanceof Method) {
                    this._.Wrapper = Wrapper as TWrapper;
                } else {
                    this.error("Given identifier function is not a function");
                }
            } else {
                this.error("A function identifier is needed.");
            }
        };
        this.on("updateArgs", handleUpdateArgs);
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
        const { path } = this;
        return path[path.length - 1];
    }
    get path() {
        return this._.Wrapper.path;
    }
    get tsText() {
        const pkgName = this._.Wrapper.package;
        return `\
${(this.env as Env).tsEnv.getImportString(this.patcher.props.dependencies)}
${[pkgName, ...this.path].map(s => s || "prototype").join(".")}
`;
    }
    get imported(): TAnyFunction {
        const c = this._.Wrapper || this.patcher.activeLib.Object as TWrapper;
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
