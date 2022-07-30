import { ConstructSignatureDeclarationStructure, createWrappedNode, FunctionDeclarationStructure, InterfaceDeclarationStructure, MethodSignatureStructure, PropertySignatureStructure, ts, VariableDeclarationStructure } from "ts-morph";
import BaseObject from "../base/BaseObject";
import type { ImportedObjectType } from "../../types";
import type Env from "../../Env";

/**
* ```JavaScript
*   class A {
*       static a = {} // A.a
*       static b() {} // A.b
*       static get c() {} // A.c (get)
*       static set d(x) {} // A.d (set)
*       e = {} // Nothing
*       f() {} // A.prototype.f
*       get g() {} // A.prototype.g (get)
*       set h(x) {} // A.prototype.h (set)
*       constructor() {} // A.prototype.constructor
*   }
*   const B = {
*       a: {}, // B.a
*       b() {} // B.b
*   }
*   const C = function() {
*       this.a = null; // C.prototype.constructor
*   }
* ```
*/

type StructuredSyntaxKind = ts.SyntaxKind.PropertySignature
    | ts.SyntaxKind.MethodSignature
    | ts.SyntaxKind.VariableDeclaration
    | ts.SyntaxKind.FunctionDeclaration
    | ts.SyntaxKind.InterfaceDeclaration
    | ts.SyntaxKind.ConstructSignature;

type StructureOfSyntaxKind<T extends StructuredSyntaxKind> = T extends ts.SyntaxKind.PropertySignature
    ? PropertySignatureStructure
    : T extends ts.SyntaxKind.MethodSignature
    ? MethodSignatureStructure
    : T extends ts.SyntaxKind.VariableDeclaration
    ? VariableDeclarationStructure
    : T extends ts.SyntaxKind.FunctionDeclaration
    ? FunctionDeclarationStructure
    : T extends ts.SyntaxKind.InterfaceDeclaration
    ? InterfaceDeclarationStructure
    : T extends ts.SyntaxKind.ConstructSignature
    ? ConstructSignatureDeclarationStructure
    : never;

export const getTypeScriptStructureFromString = <T extends StructuredSyntaxKind>(tsEnv: Env["tsEnv"], text: string, syntaxKind: T): StructureOfSyntaxKind<T> => {
    const { ts, typeChecker, compilerOptions } = tsEnv;
    tsEnv.updateFile("/index.ts", text);
    const sourceFile = tsEnv.getSourceFile("/index.ts");
    const node = createWrappedNode(sourceFile as ts.Node, { typeChecker, compilerOptions, sourceFile });
    const identifiers = node.getDescendantsOfKind(ts.SyntaxKind.Identifier);
    const identifier = identifiers[identifiers.length - 1];
    const symbol = identifier.getSymbolOrThrow();
    const declarations = symbol.getDeclarations();
    for (const declaration of declarations) {
        if (declaration?.isKind(syntaxKind)) {
            return declaration.getStructure() as StructureOfSyntaxKind<T>;
        }
    }
    for (const declaration of declarations) {
        const [decl1] = declaration.getDescendantsOfKind(syntaxKind);
        if (decl1) return decl1.getStructure() as StructureOfSyntaxKind<T>;
    }
    return null;
};

export const updateObjectPropertyMetaFromTS = (object: BaseObject, tsText: string) => {
    const { tsEnv, tsEnv: { ts } } = object.env as Env;
    const structure = (() => {
        try {
            return getTypeScriptStructureFromString(tsEnv, tsText, ts.SyntaxKind.PropertySignature)
            || getTypeScriptStructureFromString(tsEnv, tsText, ts.SyntaxKind.VariableDeclaration);
        } catch (error) {
            return null;
        }
    })();
    if (!structure) return null;
    const { type } = structure;
    const doc = "docs" in structure ? structure.docs?.[0] : null;
    let { inlets, outlets, description } = object.meta;
    let changed = false;
    if (typeof type === "string") {
        outlets = outlets.slice();
        const outlet0 = { ...outlets[0] };
        outlets[0] = { ...outlet0, description: `${outlet0.description}: ${type}` };
        changed = true;
    }
    if (typeof doc === "string") {
        description = doc;
        inlets = inlets.slice();
        const inlet0 = { ...inlets[0] };
        inlets[0] = { ...inlet0, description: `${inlet0.description} -> ${doc}` };
        changed = true;
    } else if (typeof doc?.description === "string") {
        description = doc.description;
        inlets = inlets.slice();
        const inlet0 = { ...inlets[0] };
        inlets[0] = { ...inlet0, description: `${inlet0.description} -> ${doc.description}` };
        changed = true;
    }
    if (changed) object.setMeta({ inlets, outlets, description });
    return structure;
};

export const updateObjectFunctionMetaFromTS = (object: BaseObject, tsText: string, kind: "StaticMethod" | "Method" | "Constructor" = "StaticMethod") => {
    const { tsEnv, tsEnv: { ts } } = object.env as Env;
    const syntaxKind = kind === "StaticMethod"
        ? ts.SyntaxKind.FunctionDeclaration
        : kind === "Method"
            ? ts.SyntaxKind.MethodSignature
            : kind === "Constructor"
                ? ts.SyntaxKind.ConstructSignature
                : null;
    const structure = (() => {
        try {
            return getTypeScriptStructureFromString(tsEnv, tsText, syntaxKind);
        } catch (error) {
            return null;
        }
    })();
    if (!structure) return null;
    const { parameters, returnType } = structure;
    const doc = structure.docs?.[0];
    let { inlets, outlets, description } = object.meta;
    let changed = false;
    if (parameters?.length) {
        inlets = inlets.slice();
        for (let i = 0; i < parameters.length; i++) {
            const parameter = parameters[i];
            const type = typeof parameter.type === "string" ? parameter.type : "";
            const { name, isRestParameter, isReadonly, hasQuestionToken } = parameter;
            const description = `${inlets[i].description} -> ${isReadonly ? "readonly " : ""}${isRestParameter ? "..." : ""}${name}${hasQuestionToken ? "?" : ""}: ${type}`;
            const $ = kind === "Method" ? i + 1 : i;
            inlets[$] = {
                ...inlets[$],
                description,
                varLength: isRestParameter
            };
        }
        changed = true;
    }
    if (typeof returnType === "string") {
        outlets = outlets.slice();
        const outlet0 = { ...outlets[0] };
        outlets[0] = { ...outlet0, description: `${outlet0.description}: ${returnType}` };
        changed = true;
    }
    if (typeof doc === "string") {
        description = doc;
        changed = true;
    } else if (typeof doc?.description === "string") {
        description = doc.description;
        changed = true;
    }
    if (changed) object.setMeta({ inlets, outlets, description });
    return structure;
};

export default abstract class ImportedObject<T, S, I extends any[], O extends any[], A extends any[], P, U> extends BaseObject<{}, S, I, O, A, P, U> {
    static importedObjectType: ImportedObjectType;
    static root: Record<string, any>;
    static path: string[];
    static description = "Auto-imported object";
    get root() {
        const { root } = (this.constructor as typeof ImportedObject);
        return root;
    }
    set root(value: Record<string, any>) {
        (this.constructor as typeof ImportedObject).root = value;
    }
    get path() {
        const { path } = (this.constructor as typeof ImportedObject);
        return path;
    }
    get name() {
        const { path } = this;
        return path[path.length - 1];
    }
    get tsText() {
        return this.path.map(s => s || "prototype").join(".");
    }
    get imported(): T {
        let r: T;
        try {
            r = this.path.reduce((acc, cur) => acc[cur], this.root);
        } catch (e) {
            this.error(e);
        }
        return r;
    }
    set imported(v: T) {
        const { path, root } = this;
        let parent = root;
        try {
            if (!path.length) {
                this.root = v;
            } else {
                path.slice(0, -1).forEach(key => parent = parent[key]);
                parent[path[this.path.length - 1]] = v;
            }
        } catch (e) {
            this.error(e);
        }
    }
    updatePropertyMetaFromTS = () => {
        const { tsText } = this;
        return updateObjectPropertyMetaFromTS(this, tsText);
    };
    updatefunctionMetaFromTS = (kind: "StaticMethod" | "Method" = "StaticMethod") => {
        const { tsText } = this;
        return updateObjectFunctionMetaFromTS(this, tsText, kind);
    };
}
export class AnyImportedObject extends ImportedObject<any, any, any, any, any, any, any> {}
