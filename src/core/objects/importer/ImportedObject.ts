import { AbstractObject, BaseObject, TMeta, DefaultUI } from "../Base";

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
export class ImportedObjectUI<T extends AbstractObject> extends DefaultUI<T> {
    prependColor: string;
    get prependProps(): JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> {
        return { style: { backgroundColor: this.prependColor } };
    }
}
export abstract class ImportedObject<T, S, I extends any[], O extends any[], A extends any[], P, U> extends BaseObject<{}, S, I, O, A, P, U> {
    static pkgName: string;
    static root: { [key: string]: any };
    static path: string[];
    static get meta(): TMeta {
        return {
            ...super.meta,
            name: this.path[this.path.length - 1],
            package: this.pkgName,
            description: "Auto-imported object"
        };
    }
    get name() {
        const c = (this.constructor as typeof ImportedObject);
        return c.path[c.path.length - 1];
    }
    get imported(): T {
        const c = (this.constructor as typeof ImportedObject);
        let r: T;
        try {
            r = c.path.reduce((acc, cur) => acc[cur], c.root);
        } catch (e) {
            this.error(e);
        }
        return r;
    }
    set imported(v: T) {
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
