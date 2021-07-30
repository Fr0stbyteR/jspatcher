import { getPropertyDescriptors } from "../../utils/utils";
import AudioWorkletProxyProcessor from "./AudioWorkletProxyProcessor";
import { ObjectDescriptor, CtorType, IImporterNode, IImporterProcessor, TAbstractPackage } from "./ImporterWorklet.types";
import { AudioWorkletGlobalScope } from "./TypedAudioWorklet";

const processorId = "__JSPatcher_Importer";
declare const globalThis: AudioWorkletGlobalScope;
const { registerProcessor } = globalThis;

class ImporterProcessor extends AudioWorkletProxyProcessor<IImporterProcessor, IImporterNode> implements IImporterProcessor {
    readonly $self = "__JSPatcher_Importer_ImporterDirSelfObject";
    getObject(p: PropertyDescriptor, pkgName: string, root: Record<string, any>, path: string[]): ObjectDescriptor {
        const isStatic = path[path.length - 2] !== "prototype";
        let Super: CtorType;
        const type = typeof p.value;
        if (type === "function") {
            if (isStatic) Super = "StaticMethod";
            else Super = "Method";
        } else if (type === "undefined") {
            const setter = p.set;
            const getter = p.get;
            if (isStatic) {
                if (setter && getter) Super = "StaticSetterGetter";
                else if (setter) Super = "StaticSetter";
                else if (getter) Super = "StaticGetter";
                else return null;
            } else {
                if (setter && getter) Super = "SetterGetter";
                else if (setter) Super = "Setter";
                else if (getter) Super = "Getter";
                else return null;
            }
        } else {
            if (isStatic) Super = "StaticProperty";
            else Super = "Property";
        }
        return {
            isObjectDescriptor: true,
            ctor: Super,
            path,
            name: path[path.length - 1] || pkgName
        };
    }
    writeInPath(pkgIn: TAbstractPackage, pathIn: string[], object: ObjectDescriptor) {
        if (pathIn.length === 0) {
            Object.assign(pkgIn, { [this.$self]: object });
            return;
        }
        const path = pathIn.slice();
        let pkg = pkgIn;
        while (path.length > 1) {
            const key = path.shift();
            if (!pkg[key]) pkg[key] = {};
            else if (pkg[key]?.isObjectDescriptor) pkg[key] = { [this.$self]: pkg[key] };
            pkg = pkg[key] as TAbstractPackage;
        }
        pkg[path[0]] = object;
    }
    import(pkgName: string, root: Record<string, any>, all?: boolean, outIn?: TAbstractPackage, pathIn?: string[], stackIn?: any[], depthIn?: number) {
        const depth = typeof depthIn === "undefined" ? 0 : depthIn;
        const out = outIn || {};
        const path = pathIn || [];
        const stack = stackIn ? stackIn.slice() : [];
        let o: any;
        try {
            o = path.reduce((acc, cur) => acc[cur], root);
        } catch (e) {
            return out;
        }
        if (typeof o === "undefined" || o === null || stack.indexOf(o) !== -1) return out; // cyclic object
        stack[depth] = o;
        let props: Record<string, TypedPropertyDescriptor<any> | PropertyDescriptor>;
        try { // mitigate opener.location.href error
            props = getPropertyDescriptors(o);
        } catch (e) {
            return out;
        }
        if (path.length === 0) {
            const newObj = this.getObject({ value: root }, pkgName, root, []);
            if (newObj) this.writeInPath(out, [], newObj);
        }
        for (const key in props) {
            if (all) {
                if (typeof o === "function" && ["arguments", "caller", "length", "name", "__proto__"].indexOf(key) >= 0) continue;
                if (typeof o === "object" && ["constructor", "__proto__"].indexOf(key) >= 0) continue;
            }
            const prop = props[key];
            const newPath = [...path, key];
            if (!all && !prop.enumerable && key !== "prototype") continue;
            const newObj = this.getObject(prop, pkgName, root, newPath);
            if (newObj) this.writeInPath(out, newPath.map((s, i) => (i !== newPath.length - 1 && s === "prototype" ? "" : s)), newObj);
            const value = prop.value;
            if ((typeof value === "object" || typeof value === "function") && value !== null && (value === Array.prototype || !Array.isArray(value))) {
                this.import(pkgName, root, all, out, newPath, stack, depth + 1);
            }
        }
        return out;
    }
    importGlobalThis(pkgName: string) {
        return this.import(pkgName, globalThis, true);
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][]) {
        if (this._disposed) return false;
        return true;
    }
    destroy() {
        this._disposed = true;
    }
}

try {
    registerProcessor(processorId, ImporterProcessor);
} catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
}
