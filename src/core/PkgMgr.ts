import Env from "./Env";
import Project from "./Project";
import Importer from "./objects/importer/Importer";
import { TFlatPackage, TPackage, PatcherMode } from "./types";
import Base, { AnyObject, BaseObject } from "./objects/Base";
import Std from "./objects/Std";
import New from "./objects/importer/New";
import Gen from "./objects/Gen";
import Max from "./objects/Max";
import Faust from "./objects/Faust";
import UI from "./objects/UI/exports";
import Op from "./objects/Op";
import Window from "./objects/Window";
import WebAudio from "./objects/WebAudio/exports";
import WebRTC from "./objects/WebRTC/exports";
import WebMIDI from "./objects/WebMIDI/exports";
import DSP from "./objects/dsp/exports";
import live from "./objects/live/exports";
import faust from "./objects/faust/exports";
import SubPatcher from "./objects/SubPatcher";
import { ImporterDirSelfObject } from "../utils/symbols";
import { TypedEventEmitter } from "../utils/TypedEventEmitter";

export interface PackageManagerEventMap {
    "libChanged": PatcherMode;
    "pathDuplicated": string;
}

export class PackageManager extends TypedEventEmitter<PackageManagerEventMap> {
    private readonly global: GlobalPackageManager;
    readonly pkgJS: TPackage;
    readonly pkgFaust: TPackage;
    readonly pkgMax: TPackage;
    readonly pkgGen: TPackage;
    private readonly libJS: TFlatPackage;
    private readonly libFaust: TFlatPackage;
    private readonly libMax: TFlatPackage;
    private readonly libGen: TFlatPackage;
    /**
     * `[id, url]`
     *
     * @type {[string, string][]}
     * @memberof PackageManager
     */
    readonly imported: [string, string][] = [];
    constructor(projectIn: Project) {
        super();
        this.global = projectIn.env.pkgMgr;
        const { js, faust, max, gen } = this.global;
        this.pkgJS = { ...js };
        this.pkgFaust = { ...faust };
        this.pkgMax = { ...max };
        this.pkgGen = { ...gen };
        this.libJS = this.packageRegister(this.pkgJS);
        this.libFaust = this.packageRegister(this.pkgFaust);
        this.libMax = this.packageRegister(this.pkgMax);
        this.libGen = this.packageRegister(this.pkgGen);
    }
    getLib(lib: PatcherMode) {
        return {
            js: this.libJS,
            faust: this.libFaust,
            max: this.libMax,
            gen: this.libGen
        }[lib];
    }
    getPkg(lib: PatcherMode) {
        return {
            js: this.pkgJS,
            faust: this.pkgFaust,
            max: this.pkgMax,
            gen: this.pkgGen
        }[lib];
    }
    async importFromNPM(pkgID: string, idIn?: string) {
        const id = idIn || pkgID.split("/").pop();
        const url = `https://unpkg.com/${pkgID}`;
        return this.importFromURL(url, id);
    }
    async importFromURL(url: string, id: string) {
        const jsModule = await this.global.getModuleFromURL(url, id);
        const pkg = Importer.import(id, jsModule);
        this.imported.push([id, url]);
        return this.add(pkg, "js", [id]);
    }
    remove(url: string) {
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
            else if (typeof pkg[key] === "function" && pkg[key].prototype instanceof BaseObject) pkg[key] = { [ImporterDirSelfObject]: pkg[key] };
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
            if (typeof el === "function" && el.prototype instanceof BaseObject) {
                const full = path.join(".");
                if (full in libOut) this.emit("pathDuplicated", full);
                // this.patcher.newLog("warn", "Patcher", "Path duplicated, cannot register " + full, this);
                else libOut[full] = el;
                const p = path.slice();
                while (p.length && path.length - p.length < rootifyDepth) {
                    const k = p.join(".");
                    if (!(k in libOut)) libOut[k] = el;
                    p.shift();
                }
            }
        }
        for (const key in pkg) {
            const el = pkg[key];
            if (typeof el === "object") {
                this.packageRegister(el, libOut, rootifyDepth, [...path, key]);
            } else if (typeof el === "function" && el.prototype instanceof BaseObject) {
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
        const items: { key: string; object: typeof AnyObject }[] = [];
        for (let i = 0; i < keys.length; i++) {
            if (items.length >= limit) break;
            const key = keys[i];
            if (key.startsWith(query)) {
                const o = lib[key];
                if (staticMethodOnly) {
                    if (o[ImporterDirSelfObject as unknown as keyof typeof AnyObject]) {
                        items.push({ key, object: o });
                    }
                } else {
                    items.push({ key, object: o });
                }
            }
        }
        return items;
    }
    searchInPkg(query: string, limit = Infinity, staticMethodOnly = false, pkg: TPackage, path: string[] = []): { path: string[]; object?: typeof AnyObject | TPackage }[] {
        const outs: { path: string[]; object?: typeof AnyObject | TPackage }[] = [];
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
        let o: TPackage | typeof AnyObject = pkg;
        while (path.length) {
            const key = path.shift() as any;
            o = (o as TPackage)[key];
            if (!o) return null;
            if (typeof o !== "object" && !(o.prototype instanceof BaseObject)) return null;
        }
        return o;
    }
}

export class GlobalPackageManager {
    readonly js: TPackage = {
        Base,
        Std,
        SubPatcher,
        Max,
        UI,
        Op,
        WebAudio,
        WebRTC,
        WebMIDI,
        DSP,
        new: New,
        live,
        faust,
        window: Window
    };
    readonly faust: TPackage = Faust;
    readonly max: TPackage = Max;
    readonly gen: TPackage = Gen;
    private readonly env: Env;
    externals = new Map<string, Record<string, any>>();
    constructor(envIn: Env) {
        this.env = envIn;
        this.add(this.env.faustAdditionalObjects, "js", ["faust"]);
        this.add(this.env.faustLibObjects, "faust");
        this.add({ window: Window }, "js");
    }
    private add(pkgIn: TPackage, lib: PatcherMode, pathIn: string[] = []) {
        const path = pathIn.slice();
        let pkg = this[lib];
        while (path.length) {
            const key = path.shift();
            if (!pkg[key]) pkg[key] = {};
            else if (typeof pkg[key] === "function" && pkg[key].prototype instanceof BaseObject) pkg[key] = { [ImporterDirSelfObject]: pkg[key] };
            pkg = pkg[key] as TPackage;
        }
        Object.assign(pkg, pkgIn);
    }
    /**
     * If the module bahave as ESM, then export ESModule
     * Simulate NodeJS environment, good to load NPM Package
     *
     * @private
     * @param {string} url
     * @returns
     * @memberof GlobalPackageManager
     */
    private async fetchModule(url: string) {
        let exported;
        const toExport = {};
        window.exports = toExport;
        window.module = { exports: toExport } as any;
        const esm = await import(/* webpackIgnore: true */url);
        const esmKeys = Object.keys(esm);
        if (esmKeys.length === 1 && esmKeys[0] === "default") exported = esm.default;
        else if (esmKeys.length) exported = esm;
        else exported = window.module.exports;
        delete window.exports;
        delete window.module;
        return exported;
    }
    async getModuleFromURL(url: string, id: string) {
        if (this.externals.has(url)) return this.externals.get(url);
        const rawModule = await this.fetchModule(url);
        const m = typeof rawModule === "object" ? rawModule : { [id]: rawModule };
        if (!Object.keys(m).length) throw new Error(`Module ${id} from ${url} is empty`);
        this.externals.set(url, m);
        return m;
    }
}
