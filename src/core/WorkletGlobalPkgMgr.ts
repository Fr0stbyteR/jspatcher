import { ImporterDirSelfObject } from "../utils/symbols";
import { isJSPatcherObjectConstructor } from "./objects/base/AbstractObject";
import BaseObject from "./objects/base/BaseObject";
import type { TPackage, PatcherMode } from "./types";
import type { IJSPatcherEnv } from "./Env";

export default class WorkletGlobalPackageManager {
    js: TPackage;
    jsaw: TPackage;
    faust: TPackage;
    max: TPackage;
    gen: TPackage;
    private readonly env: IJSPatcherEnv;
    externals = new Map<string, Record<string, any>>();
    constructor(envIn: IJSPatcherEnv) {
        this.env = envIn;
    }
    async init() {
        this.jsaw = {
            Base: { BaseObject, EmptyObject: BaseObject, InvalidObject: BaseObject }
        };
    }
    private add(pkgIn: TPackage, lib: PatcherMode, pathIn: string[] = []) {
        const path = pathIn.slice();
        let pkg = this[lib];
        while (path.length) {
            const key = path.shift();
            if (!pkg[key]) pkg[key] = {};
            else if (isJSPatcherObjectConstructor(pkg[key])) pkg[key] = { [ImporterDirSelfObject]: pkg[key] };
            pkg = pkg[key] as TPackage;
        }
        Object.assign(pkg, pkgIn);
    }
}
