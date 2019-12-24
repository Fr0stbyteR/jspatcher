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

type TImportedModule = { [key: string]: any };
declare interface Window {
    module: { exports: TImportedModule };
    exports: TImportedModule;
}

export default class Importer {
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
            static get _name() { return path[path.length - 1]; }
        };
    }
    static async importFrom(address: string, pkgName: string) {
        const toExport: TImportedModule = {}; // Original exports, detect if exports is overwritten.
        window.exports = toExport;
        window.module = { exports: toExport } as any;
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
        await Importer.importFrom("https://unpkg.com/@tensorflow/tfjs", "tf").then(console.log);
        await Importer.importFrom("https://unpkg.com/three", "THREE").then(console.log);
        await Importer.importFrom("https://unpkg.com/webmidi", "MIDI").then(console.log);
    }
    */
    static import(pkgName: string, root: { [key: string]: any }, all?: boolean, outIn?: TPackage, pathIn?: string[], stackIn?: any[], depthIn?: number) {
        const depth = typeof depthIn === "undefined" ? 0 : depthIn;
        const out = outIn || {};
        const path = pathIn ? pathIn.slice() : [];
        const stack = stackIn ? stackIn.slice() : [];
        const o = path.reduce((acc, cur) => acc[cur], root);
        if (typeof o === "undefined" || o === null || stack.indexOf(o) !== -1 || (pkgName !== "window" && o === window)) return out; // cyclic object
        stack[depth] = o;
        const props = Object.getOwnPropertyDescriptors(o);
        for (const key in props) {
            if (all) {
                if (typeof o === "function" && ["arguments", "caller", "length", "name"].indexOf(key) >= 0) continue;
                if (typeof o === "object" && ["constructor"].indexOf(key) >= 0) continue;
            }
            const prop = props[key];
            if (key === "prototype") {
                this.import(pkgName, root, all, out, [...path, "prototype"], stack, depth + 1);
                continue;
            }
            if (!all && !prop.enumerable) continue;
            path[depth] = key;
            out[path.map(s => (s === "prototype" ? "" : s)).join(".")] = this.getObject(prop, pkgName, root, path.slice());
            const value = prop.value;
            if ((typeof value === "object" || typeof value === "function") && value !== null && !Array.isArray(value)) {
                this.import(pkgName, root, all, out, path, stack, depth + 1);
            }
        }
        return out;
    }
}
