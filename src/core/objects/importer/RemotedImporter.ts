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
import generateRemotedObject from "../base/generateRemotedObject";
import Importer from "./Importer";
import type BaseObject from "../base/BaseObject";
import type { IJSPatcherObject, IJSPatcherObjectMeta } from "../base/AbstractObject";

export class New extends generateRemotedObject(NewBase as typeof BaseObject) {
}
export class Func extends generateRemotedObject(FuncBase as typeof BaseObject) {
}
export class Property extends generateRemotedObject(PropertyBase as typeof BaseObject) {
}
export class Getter extends generateRemotedObject(GetterBase as typeof BaseObject) {
}
export class Setter extends generateRemotedObject(SetterBase as typeof BaseObject) {
}
export class SetterGetter extends generateRemotedObject(SetterGetterBase as typeof BaseObject) {
}
export class Method extends generateRemotedObject(MethodBase as typeof BaseObject) {
}
export class StaticProperty extends generateRemotedObject(StaticPropertyBase as typeof BaseObject) {
}
export class StaticGetter extends generateRemotedObject(StaticGetterBase as typeof BaseObject) {
}
export class StaticSetter extends generateRemotedObject(StaticSetterBase as typeof BaseObject) {
}
export class StaticSetterGetter extends generateRemotedObject(StaticSetterGetterBase as typeof BaseObject) {
}
export class StaticMethod extends generateRemotedObject(StaticMethodBase as typeof BaseObject) {
}

export default class RemotedImporter extends Importer {
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
}
