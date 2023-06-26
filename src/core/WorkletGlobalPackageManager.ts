import { ImporterDirSelfObject } from "../utils/symbols";
import { isJSPatcherObjectConstructor } from "./objects/base/AbstractObject";
import getBase from "./objects/base/index.jsdsppkg.aw";
import getGlobalThis from "./objects/globalThis/index.jsdsppkg";
import type { TPackage, PatcherMode, ObjectDescriptor, TAbstractPackage } from "./types";
import type { AnyImportedObject } from "./objects/importer/ImportedObject";
import type WorkletEnvProcessor from "./worklets/WorkletEnv.worklet";
import type { IExternalPackage, PackageGetter } from "./GlobalPackageManager";

export default class WorkletGlobalPackageManager {
    bell: TPackage;
    jsaw: TPackage;
    faust: TPackage;
    max: TPackage;
    gen: TPackage;
    private readonly env: WorkletEnvProcessor;
    externals = new Map<string, Record<string, any>>();
    readonly importedPackages: IExternalPackage[] = [];
    get builtInPackagesNames() {
        return [...this.importedPackages.filter(p => p.isBuiltIn).map(p => p.name), "Base", "globalThis"];
    }
    get externalPackagesNames() {
        return this.importedPackages.filter(p => !p.isBuiltIn).map(p => p.name);
    }
    constructor(envIn: WorkletEnvProcessor) {
        this.env = envIn;
    }
    async init() {
        this.jsaw = {
            Base: await getBase(),
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
    async fetchModule(url: string) {
        const toExport = {};
        globalThis.exports = toExport;
        globalThis.module = { exports: toExport } as any;
        await this.env.addWorkletModule(url);
        const exported = globalThis.module.exports;
        delete globalThis.exports;
        delete globalThis.module;
        return exported;
    }
    async importPackage(url: string, pkgInfo: IExternalPackage) {
        if (this.importedPackages.find(p => p.name === pkgInfo.name)) return;
        const getter: PackageGetter = (await this.fetchModule(url)).default;
        this.add(await getter(this.env), "jsaw", [pkgInfo.name]);
        this.importedPackages.push(pkgInfo);
    }
}
