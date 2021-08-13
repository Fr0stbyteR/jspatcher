import TypedEventEmitter from "../utils/TypedEventEmitter";
import { ImporterDirSelfObject } from "../utils/symbols";
import { isJSPatcherObjectConstructor, IJSPatcherObject } from "./objects/base/AbstractObject";
import type ObjectImporter from "./objects/importer/Importer";
import type { TFlatPackage, TPackage, PatcherMode } from "./types";
import type GlobalPackageManager from "./GlobalPackageManager";

export interface PackageManagerEventMap {
    "libChanged": PatcherMode;
    "pathDuplicated": string;
}

export interface IPackageManager extends TypedEventEmitter<PackageManagerEventMap> {
    getLib(lib: PatcherMode): TFlatPackage;
    getPkg(lib: PatcherMode): TPackage;
    importFromURL(url: string, id: string): Promise<void>;
    removeURL(url: string): void;
    add(pkgIn: TPackage, lib: PatcherMode, pathIn?: string[]): void;
}

export default class PackageManager extends TypedEventEmitter<PackageManagerEventMap> implements IPackageManager {
    private readonly global: Partial<GlobalPackageManager>;
    private readonly Importer: typeof ObjectImporter;
    readonly pkgJS: TPackage;
    readonly pkgFaust: TPackage;
    readonly pkgMax: TPackage;
    readonly pkgGen: TPackage;
    readonly pkgJSAW: TPackage;
    private readonly libJS: TFlatPackage;
    private readonly libFaust: TFlatPackage;
    private readonly libMax: TFlatPackage;
    private readonly libGen: TFlatPackage;
    private readonly libJSAW: TFlatPackage;
    /** `[id, url]` */
    readonly imported: [string, string][] = [];
    constructor(globalIn: Partial<GlobalPackageManager>, Importer?: typeof ObjectImporter) {
        super();
        this.Importer = Importer;
        this.global = globalIn;
        const { js, faust, max, gen, jsaw } = this.global;
        this.pkgJS = { ...js };
        this.pkgFaust = { ...faust };
        this.pkgMax = { ...max };
        this.pkgGen = { ...gen };
        this.pkgJSAW = { ...jsaw };
        this.libJS = this.packageRegister(this.pkgJS);
        this.libFaust = this.packageRegister(this.pkgFaust);
        this.libMax = this.packageRegister(this.pkgMax);
        this.libGen = this.packageRegister(this.pkgGen);
        this.libJSAW = this.packageRegister(this.pkgJSAW);
    }
    getLib(lib: PatcherMode) {
        return {
            js: this.libJS,
            faust: this.libFaust,
            max: this.libMax,
            gen: this.libGen,
            jsaw: this.libJSAW
        }[lib];
    }
    getPkg(lib: PatcherMode) {
        return {
            js: this.pkgJS,
            faust: this.pkgFaust,
            max: this.pkgMax,
            gen: this.pkgGen,
            jsaw: this.pkgJSAW
        }[lib];
    }
    async importFromNPM(pkgID: string, idIn?: string) {
        const id = idIn || pkgID.split("/").pop();
        const url = `https://unpkg.com/${pkgID}`;
        return this.importFromURL(url, id);
    }
    async importFromURL(url: string, id: string) {
        if (!this.Importer) return;
        if (!this.global.getModuleFromURL) throw new Error("Cannot import from this context");
        if (this.imported.find(([$id, $url]) => $id === id && $url === url)) return;
        if (this.imported.find(([$id, $url]) => $id === id && $url !== url)) throw new Error(`Package with ID ${id} already exists.`);
        const jsModule = await this.global.getModuleFromURL(url, id);
        const pkg = this.Importer.import(id, jsModule);
        this.imported.push([id, url]);
        this.add(pkg, "js", [id]);
    }
    removeURL(url: string) {
        const { imported } = this;
        const i = imported.findIndex(t => t[1] === url);
        if (i === -1) return;
        imported.splice(i, 1);
    }
    add(pkgIn: TPackage, lib: PatcherMode, pathIn: string[] = []) {
        const path = pathIn.slice();
        let pkg = this.getPkg(lib);
        while (path.length) {
            const key = path.shift();
            if (!pkg[key]) pkg[key] = {};
            else if (isJSPatcherObjectConstructor(pkg[key])) pkg[key] = { [ImporterDirSelfObject]: pkg[key] };
            pkg = pkg[key] as TPackage;
        }
        Object.assign(pkg, pkgIn);
        this.packageRegister(pkgIn, this.getLib(lib), 2, pathIn);
        this.emit("libChanged", lib);
    }
    packageRegister(pkg: TPackage, libOut: TFlatPackage = {}, rootifyDepth = Infinity, pathIn?: string[]) {
        const path = pathIn ? pathIn.slice() : [];
        if (path.length && ImporterDirSelfObject in pkg) {
            const el = pkg[ImporterDirSelfObject as any];
            if (isJSPatcherObjectConstructor(el)) {
                const full = path.join(".");
                if (full in libOut) this.emit("pathDuplicated", full);
                // this.patcher.newLog("warn", "Patcher", "Path duplicated, cannot register " + full, this);
                else libOut[full] = el as typeof IJSPatcherObject;
                const p = path.slice();
                while (p.length && path.length - p.length < rootifyDepth) {
                    const k = p.join(".");
                    if (!(k in libOut)) libOut[k] = el as typeof IJSPatcherObject;
                    p.shift();
                }
            }
        }
        for (const key in pkg) {
            const el = pkg[key];
            if (typeof el === "object") {
                this.packageRegister(el, libOut, rootifyDepth, [...path, key]);
            } else if (isJSPatcherObjectConstructor(el)) {
                const full = [...path, key].join(".");
                if (full in libOut) this.emit("pathDuplicated", full);
                // this.patcher.newLog("warn", "Patcher", "Path duplicated, cannot register " + full, this);
                else libOut[full] = el;
                const p = [...path, key];
                while (p.length && path.length + 1 - p.length < rootifyDepth) {
                    const k = p.join(".");
                    if (!(k in libOut)) libOut[k] = el;
                    p.shift();
                }
            }
        }
        return libOut;
    }
    searchInLib(query: string, limit = Infinity, staticMethodOnly = false, lib: TFlatPackage) {
        const keys = Object.keys(lib).sort();
        const items: { key: string; object: typeof IJSPatcherObject }[] = [];
        for (let i = 0; i < keys.length; i++) {
            if (items.length >= limit) break;
            const key = keys[i];
            if (key.startsWith(query)) {
                const o = lib[key];
                if (staticMethodOnly) {
                    if (o[ImporterDirSelfObject as unknown as keyof typeof IJSPatcherObject]) {
                        items.push({ key, object: o });
                    }
                } else {
                    items.push({ key, object: o });
                }
            }
        }
        return items;
    }
    searchInPkg(query: string, limit = Infinity, staticMethodOnly = false, pkg: TPackage, path: string[] = []): { path: string[]; object?: typeof IJSPatcherObject | TPackage }[] {
        const outs: { path: string[]; object?: typeof IJSPatcherObject | TPackage }[] = [];
        for (const key in pkg) {
            if (outs.length >= limit) break;
            const o = pkg[key];
            if (typeof o === "object") {
                if (key.indexOf(query) !== -1) outs.push({ path: [...path, key], object: o });
                else outs.push(...this.searchInPkg(query, limit, staticMethodOnly, o, [...path, key]));
            } else {
                if (key.indexOf(query) !== -1) outs.push({ path: [...path, key], object: o });
            }
        }
        return outs;
    }
    getFromPath(pathIn: (string | symbol)[], pkg: TPackage) {
        const path = pathIn.slice();
        let o: TPackage | typeof IJSPatcherObject = pkg;
        while (path.length) {
            const key = path.shift() as any;
            o = (o as TPackage)[key];
            if (!o) return null;
            if (typeof o !== "object" && !isJSPatcherObjectConstructor(o)) return null;
        }
        return o;
    }
}
