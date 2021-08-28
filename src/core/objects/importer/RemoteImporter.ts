import NewBase from "./New";
import FuncBase from "./Func";
import PropertyBase from "./Property";
import GetterBase from "./Getter";
import SetterBase from "./Setter";
import SetterGetterBase from "./SetterGetter";
import MethodBase from "./Method";
import StaticPropertyBase from "./StaticProperty";
import StaticGetterBase from "./StaticGetter";
import StaticSetterBase from "./StaticSetter";
import StaticSetterGetterBase from "./StaticSetterGetter";
import StaticMethodBase from "./StaticMethod";
import ImportedObjectUI from "./ImportedObjectUI";
import generateRemoteObject from "../base/generateRemoteObject";
import Importer from "./Importer";
import { ImporterDirSelfObject } from "../../../utils/symbols";
import type BaseObject from "../base/BaseObject";
import type { IJSPatcherObject, IJSPatcherObjectMeta } from "../base/AbstractObject";
import type { ObjectDescriptor, TAbstractPackage, TPackage } from "../../types";

export class NewUI extends ImportedObjectUI<New> {
    prependColor = "rgb(78, 201, 176)";
}
export class New extends generateRemoteObject(NewBase as typeof BaseObject) {
    static UI = NewUI;
}
export class FuncUI extends ImportedObjectUI<Func> {
    prependColor = "rgb(78, 201, 176)";
}
export class Func extends generateRemoteObject(FuncBase as typeof BaseObject) {
    static UI = FuncUI;
}
export class PropertyUI extends ImportedObjectUI<Property> {
    prependColor = "rgb(220, 200, 170)";
}
export class Property extends generateRemoteObject(PropertyBase as typeof BaseObject) {
    static UI: typeof ImportedObjectUI = PropertyUI;
}
export class Getter extends generateRemoteObject(GetterBase as typeof BaseObject) {
    static UI: typeof ImportedObjectUI = PropertyUI;
}
export class Setter extends generateRemoteObject(SetterBase as typeof BaseObject) {
    static UI: typeof ImportedObjectUI = PropertyUI;
}
export class SetterGetter extends generateRemoteObject(SetterGetterBase as typeof BaseObject) {
    static UI: typeof ImportedObjectUI = PropertyUI;
}
export class Method extends generateRemoteObject(MethodBase as typeof BaseObject) {
    static UI: typeof ImportedObjectUI = PropertyUI;
}
export class StaticPropertyUI extends ImportedObjectUI<StaticProperty> {
    prependColor = "rgb(156, 220, 254)";
}
export class StaticProperty extends generateRemoteObject(StaticPropertyBase as typeof BaseObject) {
    static UI = StaticPropertyUI;
}
export class StaticGetter extends generateRemoteObject(StaticGetterBase as typeof BaseObject) {
    static UI = StaticPropertyUI;
}
export class StaticSetter extends generateRemoteObject(StaticSetterBase as typeof BaseObject) {
    static UI = StaticPropertyUI;
}
export class StaticSetterGetter extends generateRemoteObject(StaticSetterGetterBase as typeof BaseObject) {
    static UI = StaticPropertyUI;
}
export class StaticMethod extends generateRemoteObject(StaticMethodBase as typeof BaseObject) {
    static UI = StaticPropertyUI;
}

export default class RemoteImporter extends Importer {
    static getObject(p: PropertyDescriptor, pkgName: string, root: Record<string, any>, path: string[], meta?: Partial<IJSPatcherObjectMeta>): typeof IJSPatcherObject {
        const isStatic = path[path.length - 2] !== "prototype";
        let Super: typeof IJSPatcherObject;
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
        const Ctor = class extends Super {
            static package = pkgName;
            static root = root;
            static path = path;
            static get _name() { return path[path.length - 1] || pkgName; }
        };
        if (meta) {
            for (const keyIn in meta) {
                const key = keyIn as keyof IJSPatcherObjectMeta;
                if (key === "name") continue;
                (Ctor as any)[key] = meta[key];
            }
        }
        return Ctor;
    }
    static getObjectFromDescriptor(descriptor: ObjectDescriptor, pkgName: string) {
        const Ctors = {
            StaticMethod,
            StaticSetter,
            StaticSetterGetter,
            StaticGetter,
            StaticProperty,
            Method,
            Setter,
            SetterGetter,
            Getter,
            Property
        };
        const { ctor, path, name, meta } = descriptor;
        const Super = Ctors[ctor] as typeof IJSPatcherObject;
        const Ctor = class extends Super {
            static package = pkgName;
            static root = globalThis;
            static path = path;
            static get _name() { return name; }
        };
        if (meta) {
            for (const keyIn in meta) {
                const key = keyIn as keyof IJSPatcherObjectMeta;
                if (key === "name") continue;
                (Ctor as any)[key] = meta[key];
            }
        }
        return Ctor;
    }
    static getPackageFromDescriptors(descriptors: TAbstractPackage, pkgName: string) {
        const $self = ImporterDirSelfObject;
        const self = "__JSPatcher_Importer_ImporterDirSelfObject";
        const pkg = descriptors;
        const rec = (pkg: TAbstractPackage, out: TPackage = {}) => {
            for (const key in pkg) {
                const e = pkg[key];
                if (e?.isObjectDescriptor) {
                    const newObj = this.getObjectFromDescriptor(e as ObjectDescriptor, pkgName);
                    if (key === self) out[$self as any] = newObj;
                    else out[key] = newObj;
                } else {
                    out[key] = {} as TPackage;
                    rec(e as TAbstractPackage, out[key] as TPackage);
                }
            }
            return out;
        };
        return rec(pkg);
    }
}
