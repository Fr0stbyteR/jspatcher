import { ImporterDirSelfObject } from "../utils/symbols";
import { isJSPatcherObjectConstructor } from "./objects/base/AbstractObject";
import type Env from "./Env";
import type { TPackage, PatcherMode } from "./types";

export default class GlobalPackageManager {
    js: TPackage;
    jsaw: TPackage;
    faust: TPackage;
    max: TPackage;
    gen: TPackage;
    private readonly env: Env;
    externals = new Map<string, Record<string, any>>();
    constructor(envIn: Env) {
        this.env = envIn;
    }
    async init() {
        this.js = {
            Base: await (await import("./objects/base/index.jspatpkg")).default(),
            globalThis: (await import("./objects/globalThis/index.jspatpkg")).default/* ,
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
            Base: await (await import("./objects/base/index.jspatpkg")).default()
        };
        /*
        this.jsaw = await (await import("./objects/JSAW")).default();
        this.gen = (await import("./objects/Gen")).default;
        this.max = (await import("./objects/Max")).default;
        this.add(this.env.faustAdditionalObjects, "js", ["faust"]);
        this.add(this.env.faustLibObjects, "faust");
        */
        this.faust = (await import("./objects/Faust")).default;
        // this.add({ window: Window }, "js");
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
    /**
     * If the module bahave as ESM, then export ESModule
     * Simulate NodeJS environment, good to load NPM Package
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
