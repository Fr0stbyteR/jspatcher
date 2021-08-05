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
import generateDefaultObject from "../base/generateDefaultObject";
import Importer from "./Importer";
import type BaseObject from "../base/BaseObject";
import type { IJSPatcherObject } from "../base/AbstractObject";

export class NewUI extends ImportedObjectUI<New> {
    prependColor = "rgb(78, 201, 176)";
}
export class New extends generateDefaultObject(NewBase as typeof BaseObject) {
    static UI = NewUI;
}
export class FuncUI extends ImportedObjectUI<Func> {
    prependColor = "rgb(78, 201, 176)";
}
export class Func extends generateDefaultObject(FuncBase as typeof BaseObject) {
    static UI = FuncUI;
}
export class PropertyUI extends ImportedObjectUI<Property> {
    prependColor = "rgb(220, 200, 170)";
}
export class Property extends generateDefaultObject(PropertyBase as typeof BaseObject) {
    static UI: typeof ImportedObjectUI = PropertyUI;
}
export class Getter extends generateDefaultObject(GetterBase as typeof BaseObject) {
    static UI: typeof ImportedObjectUI = PropertyUI;
}
export class Setter extends generateDefaultObject(SetterBase as typeof BaseObject) {
    static UI: typeof ImportedObjectUI = PropertyUI;
}
export class SetterGetter extends generateDefaultObject(SetterGetterBase as typeof BaseObject) {
    static UI: typeof ImportedObjectUI = PropertyUI;
}
export class Method extends generateDefaultObject(MethodBase as typeof BaseObject) {
    static UI: typeof ImportedObjectUI = PropertyUI;
}
export class StaticPropertyUI extends ImportedObjectUI<StaticProperty> {
    prependColor = "rgb(156, 220, 254)";
}
export class StaticProperty extends generateDefaultObject(StaticPropertyBase as typeof BaseObject) {
    static UI = StaticPropertyUI;
}
export class StaticGetter extends generateDefaultObject(StaticGetterBase as typeof BaseObject) {
    static UI = StaticPropertyUI;
}
export class StaticSetter extends generateDefaultObject(StaticSetterBase as typeof BaseObject) {
    static UI = StaticPropertyUI;
}
export class StaticSetterGetter extends generateDefaultObject(StaticSetterGetterBase as typeof BaseObject) {
    static UI = StaticPropertyUI;
}
export class StaticMethod extends generateDefaultObject(StaticMethodBase as typeof BaseObject) {
    static UI = StaticPropertyUI;
}

export default class DefaultImporter extends Importer {
    static getObject(p: PropertyDescriptor, pkgName: string, root: Record<string, any>, path: string[]): typeof IJSPatcherObject {
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
        return class extends Super {
            static package = pkgName;
            static root = root;
            static path = path;
            static get _name() { return path[path.length - 1] || pkgName; }
        };
    }
}
