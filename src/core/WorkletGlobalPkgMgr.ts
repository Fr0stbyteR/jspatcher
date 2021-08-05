import { ImporterDirSelfObject } from "../utils/symbols";
import { isJSPatcherObjectConstructor } from "./objects/base/AbstractObject";
import getBase from "./objects/base/index.jsdsppkg";
import getGlobalThis from "./objects/globalThis/index.jsdsppkg";
import { Func, New } from "./objects/importer/RemotedImporter";
import type { TPackage, PatcherMode, ObjectDescriptor, TAbstractPackage } from "./types";
import type { AnyImportedObject } from "./objects/importer/ImportedObject";
import type WorkletEnvProcessor from "./worklets/WorkletEnv.worklet";

export default class WorkletGlobalPackageManager {
    js: TPackage;
    jsaw: TPackage;
    faust: TPackage;
    max: TPackage;
    gen: TPackage;
    private readonly env: WorkletEnvProcessor;
    externals = new Map<string, Record<string, any>>();
    constructor(envIn: WorkletEnvProcessor) {
        this.env = envIn;
    }
    async init() {
        this.jsaw = {
            Base: { ...await getBase(), func: Func, new: New },
            globalThis: await getGlobalThis()
        };
        await this.env.addObjects(this.getDescriptors(this.jsaw.globalThis, "globalThis"), "globalThis");
    }
    toDescriptor(O: typeof AnyImportedObject, pkgName: string): ObjectDescriptor {
        const { path } = O;
        return {
            isObjectDescriptor: true as const,
            ctor: O.importedObjectType,
            path,
            name: path[path.length - 1] || pkgName
        };
    }
    getDescriptors(pkgIn = this.jsaw.globalThis, pkgName = "globalThis") {
        const $self = "__JSPatcher_Importer_ImporterDirSelfObject";
        const pkg = Object.entries(pkgIn).reduce((acc, [k, v]) => {
            if (typeof v === "function") {
                const descriptor = this.toDescriptor(v, pkgName);
                if (k as any === ImporterDirSelfObject) acc[$self] = descriptor;
                else acc[k] = descriptor;
            } else {
                acc[k] = this.getDescriptors(v, pkgName);
            }
            return acc;
        }, {} as TAbstractPackage);
        if (ImporterDirSelfObject in pkgIn) pkg[$self] = this.toDescriptor((pkgIn as any)[ImporterDirSelfObject], pkgName);
        return pkg;
    }
    add(pkgIn: TPackage, lib: PatcherMode, pathIn: string[] = []) {
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
