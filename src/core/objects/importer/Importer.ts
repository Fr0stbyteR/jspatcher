import { Constructor } from "./Constructor";
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
import { AnyImportedObject, TPackage } from "../../types";

type TImportedModule = { [key: string]: any };
declare const window: { module: { exports: TImportedModule }; exports: TImportedModule };

export default class Importer {
    static getObject(p: PropertyDescriptor, pkgName: string, root: { [key: string]: any }, path: string[]): typeof AnyImportedObject {
        const isStatic = path[path.length - 1] !== "prototype";
        let Super: typeof AnyImportedObject;
        const type = typeof p.value;
        if (type === "function") {
            const str: string = p.value.toString();
            const constructable = str.startsWith("class") || (str.startsWith("function") && str.match(/\bthis\b/));
            if (isStatic) {
                if (constructable) Super = Constructor;
                else Super = StaticMethod;
            } else Super = Method;
        } else if (type === "undefined") {
            const setter = p.set;
            const getter = p.get;
            if (isStatic) {
                if (setter && getter) Super = StaticSetterGetter;
                else if (setter) Super = StaticSetter;
                else if (getter) Super = StaticGetter;
                else return null;
            } else { // eslint-disable-next-line no-lonely-if
                if (setter && getter) Super = SetterGetter;
                else if (setter) Super = Setter;
                else if (getter) Super = Getter;
                else return null;
            }
        } else { // eslint-disable-next-line no-lonely-if
            if (isStatic) Super = StaticProperty;
            else Super = Property;
        }
        return class extends Super {
            static pkgName = pkgName;
            static root = root;
            static path = path;
        };
    }
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
        await Importer.importFrom("https://unpkg.com/@tensorflow/tfjs", "tf").then(console.log);
        await Importer.importFrom("https://unpkg.com/three", "THREE").then(console.log);
        await Importer.importFrom("https://unpkg.com/webmidi", "MIDI").then(console.log);
    }
    */
    static import(pkgName: string, root: { [key: string]: any }, outIn?: TPackage, pathIn?: string[], stackIn?: any[], depthIn?: number) {
        const depth = typeof depthIn === "undefined" ? 0 : depthIn;
        const out = outIn || {};
        const path = pathIn ? pathIn.slice() : [];
        const stack = stackIn ? stackIn.slice() : [];
        const o = path.reduce((acc, cur) => acc[cur], root);
        if (stack.indexOf(o) !== -1 || (pkgName !== "Window" && o === window)) return out; // cyclic object
        stack[depth] = o;
        const props = Object.getOwnPropertyDescriptors(o);
        for (const key in props) {
            const prop = props[key];
            if (key === "prototype") this.import(pkgName, root, out, [...path, "prototype"], stack, depth + 1);
            if (!prop.enumerable) continue;
            path[depth] = key;
            out[path.map(s => (s === "prototype" ? "" : s)).join(".")] = this.getObject(prop, pkgName, root, path.slice());
            const value = prop.value;
            if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                this.import(pkgName, root, out, path, stack, depth + 1);
            }
        }
        return out;
    }
}
