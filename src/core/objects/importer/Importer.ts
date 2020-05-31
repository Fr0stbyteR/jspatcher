import { StaticMethod } from "./StaticMethod";
import { StaticSetter } from "./StaticSetter";
import { StaticSetterGetter } from "./StaticSetterGetter";
import { StaticGetter } from "./StaticGetter";
import { StaticProperty } from "./StaticProperty";
import { Method } from "./Method";
import { SetterGetter } from "./SetterGetter";
import { Setter } from "./Setter";
import { Getter } from "./Getter";
import { Property } from "./Property";
import { TPackage } from "../../types";
import { AnyImportedObject } from "./ImportedObject";
import { BaseObject } from "../Base";
import { ImporterDirSelfObject } from "../../../utils/symbols";
import { getPropertyDescriptors } from "../../../utils/utils";

type TImportedModule = { [key: string]: any };
declare interface Window {
    module: { exports: TImportedModule };
    exports: TImportedModule;
}

export default class Importer {
    static $self = ImporterDirSelfObject;
    static getObject(p: PropertyDescriptor, pkgName: string, root: { [key: string]: any }, path: string[]): typeof AnyImportedObject {
        const isStatic = path[path.length - 2] !== "prototype";
        let Super: typeof AnyImportedObject;
        const type = typeof p.value;
        if (type === "function") {
            if (isStatic) Super = StaticMethod;
            else Super = Method;
        } else if (type === "undefined") {
            const setter = p.set;
            const getter = p.get;
            if (isStatic) {
                if (setter && getter) Super = StaticSetterGetter;
                else if (setter) Super = StaticSetter;
                else if (getter) Super = StaticGetter;
                else return null;
            } else {
                if (setter && getter) Super = SetterGetter;
                else if (setter) Super = Setter;
                else if (getter) Super = Getter;
                else return null;
            }
        } else {
            if (isStatic) Super = StaticProperty;
            else Super = Property;
        }
        return class extends Super {
            static package = pkgName;
            static root = root;
            static path = path;
            static get _name() { return path[path.length - 1] || pkgName; }
        };
    }
    /*
    static async test() {
        await Importer.importFrom("https://unpkg.com/@tensorflow/tfjs", "tf").then(console.log);
        await Importer.importFrom("https://unpkg.com/three", "THREE").then(console.log);
        await Importer.importFrom("https://unpkg.com/webmidi", "MIDI").then(console.log);
    }
    */
    static writeInPath(pkgIn: TPackage, pathIn: string[], object: typeof AnyImportedObject) {
        if (pathIn.length === 0) {
            Object.assign(pkgIn, { [this.$self]: object });
            return;
        }
        const path = pathIn.slice();
        let pkg = pkgIn;
        while (path.length > 1) {
            const key = path.shift();
            if (!pkg[key]) pkg[key] = {};
            else if (typeof pkg[key] === "function" && pkg[key].prototype instanceof BaseObject) pkg[key] = { [this.$self]: pkg[key] };
            pkg = pkg[key] as TPackage;
        }
        pkg[path[0]] = object;
    }
    /**
     * Recursive transform JavaScript object to JSPatcher Package
     *
     * @static
     * @param {string} pkgName package identifier
     * @param {{ [key: string]: any }} root imported JavaScript object
     * @param {boolean} [all] import non-iterables
     * @param {TPackage} [outIn]
     * @param {string[]} [pathIn]
     * @param {any[]} [stackIn]
     * @param {number} [depthIn]
     * @returns
     * @memberof Importer
     */
    static import(pkgName: string, root: { [key: string]: any }, all?: boolean, outIn?: TPackage, pathIn?: string[], stackIn?: any[], depthIn?: number) {
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
        if (typeof o === "undefined" || o === null || stack.indexOf(o) !== -1 || (pkgName !== "window" && o === window)) return out; // cyclic object
        stack[depth] = o;
        let props: { [key: string]: TypedPropertyDescriptor<any> | PropertyDescriptor };
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
}
