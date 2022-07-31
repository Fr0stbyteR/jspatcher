import { ImporterDirSelfObject } from "../utils/symbols";
import { isJSPatcherObjectConstructor } from "./objects/base/AbstractObject";
import DefaultImporter from "./objects/importer/DefaultImporter";
import type Env from "./Env";
import type { IJSPatcherEnv } from "./Env";
import type { TPackage, PatcherMode } from "./types";

export interface IExternalPackage {
    isJSPatcherPackage: true;
    name: string;
    version: string;
    description: string;
    keywords: string[];
    license: string;
    thumbnail: string;
    jspatpkg?: string;
    "jsdsppkg.main"?: string;
    "jsdsppkg.aw"?: string;
    baseUrl?: string;
    isBuiltIn?: boolean;
}
export type PackageGetter = (env: IJSPatcherEnv) => Promise<TPackage>;

export default class GlobalPackageManager {
    js: TPackage;
    jsaw: TPackage;
    faust: TPackage;
    max: TPackage;
    gen: TPackage;
    private readonly env: Env;
    readonly externals = new Map<string, Record<string, any>>();
    readonly importedPackages: IExternalPackage[] = [];
    get builtInPackagesNames() {
        return [...this.importedPackages.filter(p => p.isBuiltIn).map(p => p.name), "Base", "globalThis", "API", "Faust", "Csound", "stdfaust.lib"];
    }
    get externalPackagesNames() {
        return this.importedPackages.filter(p => !p.isBuiltIn).map(p => p.name);
    }
    constructor(envIn: Env) {
        this.env = envIn;
    }
    async init() {
        this.js = {
            Base: await (await import("./objects/base/index.jspatpkg")).default()/* ,
            globalThis: await (await import("./objects/globalThis/index.jspatpkg")).default(),
            api: await (await import("./objects/api/index.jspatpkg")).default(),
            faust: await (await import("./objects/faust/index.jspatpkg")).default(),
            Std: (await import("./objects/Std")).default,
            new: (await import("./objects/importer/New")).default,
            func: (await import("./objects/importer/Func")).default,
            UI: (await import("./objects/UI/exports")).default,
            Op: (await import("./objects/Op")).default,
            WebAudio: (await import("./objects/WebAudio/exports")).default,
            WebRTC: (await import("./objects/WebRTC/exports")).default,
            WebMIDI: (await import("./objects/WebMIDI/exports")).default,
            DSP: (await import("./objects/dsp/exports")).default,
            live: (await import("./objects/live/exports")).default,
            faust: (await import("./objects/faust/exports")).default,
            guido: { view: (await import("./objects/guido/view")).default, ...Importer.import("guido", this.env.guidoWorker) },
            SubPatcher: (await import("./objects/SubPatcher")).default*/
        };
        this.jsaw = {
            Base: await (await import("./objects/base/index.jsdsppkg.main")).default()
        };
        this.gen = {
            Base: (await import("./objects/Gen")).default
        };
        /*
        this.max = (await import("./objects/Max")).default;
        this.add(this.env.faustAdditionalObjects, "js", ["faust"]);
        this.add(this.env.faustLibObjects, "faust");
        */
        this.faust = {
            Base: (await import("./objects/Faust")).default,
            "stdfaust.lib": this.env.faustLibObjects
        };
        // this.add({ globalThis: globalThis }, "js");
    }
    async postInit() {
        this.add(await (await import("./objects/globalThis/index.jspatpkg")).default(), "js", ["globalThis"]);
        this.add(await (await import("./objects/api/index.jspatpkg")).default(), "js", ["API"]);
        this.add(await (await import("./objects/faust/index.jspatpkg")).default(this.env), "js", ["Faust"]);
        this.add(await (await import("./objects/csound/index.jspatpkg")).default(this.env), "js", ["Csound"]);
    }
    add(pkgIn: TPackage, lib: PatcherMode, pathIn: string[] = []) {
        const path = pathIn.slice();
        let pkg = this[lib];
        while (path.length) {
            const key = path.shift();
            if (!pkg[key]) pkg[key] = {};
            else if (isJSPatcherObjectConstructor(pkg[key])) pkg[key] = { [ImporterDirSelfObject]: pkg[key] } as any;
            pkg = pkg[key] as TPackage;
        }
        Object.assign(pkg, pkgIn);
    }
    /**
     * If the module bahave as ESM, then export ESModule
     * Simulate NodeJS environment, good to load NPM Package
     */
    private async fetchModule(url: string) {
        let exported;
        const toExport = {};
        globalThis.exports = toExport;
        globalThis.module = { exports: toExport } as any;
        const esm = await import(/* webpackIgnore: true */url);
        const esmKeys = Object.keys(esm);
        if (esmKeys.length === 1 && esmKeys[0] === "default") exported = esm.default;
        else if (esmKeys.length) exported = esm;
        else exported = globalThis.module.exports;
        delete globalThis.exports;
        delete globalThis.module;
        return exported;
    }
    async addWorkletModule(url: string) {
        await this.env.audioCtx.audioWorklet.addModule(url);
    }
    async getModuleFromURL(url: string, id?: string) {
        if (this.externals.has(url)) return this.externals.get(url);
        const rawModule = await this.fetchModule(url);
        if (id && url.match(/.js$/)) {
            const dtsUrl = url.replace(/.js$/, ".d.ts");
            try {
                await this.env.tsEnv.addModuleFromURL(dtsUrl, id);
            } catch (error) {
            }
        }
        const m = typeof rawModule === "object" ? rawModule : { [id]: rawModule };
        if (!Object.keys(m).length) throw new Error(`Module ${id} from ${url} is empty`);
        this.externals.set(url, m);
        return m;
    }
    async resolveModule(m: any, url: string, id?: string, isBuiltIn = false) {
        if (typeof m === "object" && m !== null) {
            if (m.default?.isJSPatcherPackage) {
                if (this.importedPackages.find(p => p.name === m.name)) return;
                const p: IExternalPackage = { ...m.default, baseUrl: new URL(".", new URL(url, location.href)).href, isBuiltIn };
                if (p.jspatpkg) {
                    const url = new URL(p.jspatpkg, p.baseUrl).href;
                    const fetched = await this.fetchModule(url);
                    const getter: PackageGetter = typeof fetched === "function" ? fetched : fetched.default;
                    this.add(await getter(this.env), "js", [p.name]);
                }
                if (p["jsdsppkg.main"]) {
                    const url = new URL(p["jsdsppkg.main"], p.baseUrl).href;
                    const fetched = await this.fetchModule(url);
                    const getter: PackageGetter = typeof fetched === "function" ? fetched : fetched.default;
                    this.add(await getter(this.env), "jsaw", [p.name]);
                }
                if (p["jsdsppkg.aw"]) {
                    const url = new URL(p["jsdsppkg.aw"], p.baseUrl).href;
                    await this.env.envNode.importPackage(url, p);
                }
                this.importedPackages.push(p);
            } else {
                const pkg = DefaultImporter.import(id, m);
                this.importedPackages.push({
                    isJSPatcherPackage: true,
                    name: id,
                    version: null,
                    description: "Auto-Imported",
                    keywords: [],
                    license: null,
                    thumbnail: null,
                    isBuiltIn,
                    baseUrl: url
                });
                this.add(pkg, "js", [id]);
            }
        }
    }
    async importFromURL(url: string, id?: string, isBuiltIn = false) {
        const m = await this.getModuleFromURL(url, id);
        await this.resolveModule(m, url, id, isBuiltIn);
    }
}
