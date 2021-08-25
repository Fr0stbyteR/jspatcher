import { ImporterDirSelfObject } from "../../../utils/symbols";
import { getPropertyDescriptors } from "../../../utils/utils";
import { IJSPatcherObject, isJSPatcherObjectConstructor } from "../base/AbstractObject";
import type { TPackage } from "../../types";

export default abstract class Importer {
    static $self = ImporterDirSelfObject;
    static getObject(p: PropertyDescriptor, pkgName: string, root: Record<string, any>, path: string[]): typeof IJSPatcherObject {
        throw new Error("getObject not implemented");
    }
    /*
    static async test() {
        await Importer.importFrom("https://unpkg.com/@tensorflow/tfjs", "tf").then(console.log);
        await Importer.importFrom("https://unpkg.com/three", "THREE").then(console.log);
        await Importer.importFrom("https://unpkg.com/webmidi", "MIDI").then(console.log);
    }
    */
    static writeInPath(pkgIn: TPackage, pathIn: string[], object: typeof IJSPatcherObject) {
        if (pathIn.length === 0) {
            Object.assign(pkgIn, { [this.$self]: object });
            return;
        }
        const path = pathIn.slice();
        let pkg = pkgIn;
        while (path.length > 1) {
            const key = path.shift();
            if (!pkg[key]) pkg[key] = {};
            else if (isJSPatcherObjectConstructor(pkg[key])) pkg[key] = { [this.$self]: pkg[key] };
            pkg = pkg[key] as TPackage;
        }
        pkg[path[0]] = object;
    }
    /**
     * Recursive transform JavaScript object to JSPatcher Package
     *
     * @param {string} pkgName package identifier
     * @param {Record<string, any>} root imported JavaScript object
     * @param {boolean} [all] import non-iterables
     * @param {TPackage} [outIn]
     * @param {string[]} [pathIn]
     * @param {any[]} [stackIn]
     * @param {number} [depthIn]
     */
    static import(pkgName: string, root: Record<string, any>, all?: boolean, outIn?: TPackage, pathIn?: string[], stackIn?: any[], depthIn?: number) {
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
        if (typeof o === "undefined" || o === null || stack.indexOf(o) !== -1 || (depth && o === globalThis) || o === (globalThis as any).jspatcherEnv) return out; // cyclic object
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
            if (key.startsWith("$")) continue;
            if (typeof o === "function" && ["arguments", "caller", "length", "name", "__proto__"].indexOf(key) >= 0) continue;
            if (typeof o === "object" && ["constructor", "__proto__"].indexOf(key) >= 0) continue;
            const prop = props[key];
            const newPath = [...path, key];
            if (!all && !prop.enumerable && key.startsWith("_") && key !== "prototype") continue;
            const newObj = this.getObject(prop, pkgName, root, newPath);
            if (newObj) this.writeInPath(out, newPath.map((s, i) => (i !== newPath.length - 1 && s === "prototype" ? "" : s)), newObj);
            const value = prop.value;
            if ((typeof value === "object" || typeof value === "function") && value !== null && (value === Array.prototype || !Array.isArray(value))) {
                this.import(pkgName, root, all, out, newPath, stack, depth + 1);
            }
        }
        return out;
    }
}
