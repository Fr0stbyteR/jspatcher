import Patcher from "./Patcher";
import Importer from "./objects/importer/Importer";
import { TFlatPackage, TPackage, TPatcherMode } from "./types";
import Base, { AnyObject, BaseObject } from "./objects/Base";
import Std from "./objects/Std";
import New from "./objects/importer/New";
import Gen from "./objects/Gen";
import Max from "./objects/Max";
import Faust from "./objects/Faust";
import UI from "./objects/UI";
import Op from "./objects/Op";
import Window from "./objects/Window";
import WebAudio from "./objects/WebAudio/Imports";
import DSP from "./objects/dsp/exports";
import live from "./objects/live/exports";
import faust from "./objects/faust/exports";
import SubPatcher from "./objects/SubPatcher";

export default class PackageManager {
    private readonly patcher: Patcher;
    private readonly externals: { [id: string]: string } = {};
    readonly pkgJS: TPackage = {
        Base,
        Std,
        SubPatcher,
        Max,
        UI,
        Op,
        WebAudio,
        DSP,
        new:
        New,
        live,
        faust
    };
    readonly pkgFaust: TPackage = Faust;
    readonly pkgMax: TPackage = {};
    readonly pkgGen: TPackage = Gen;
    private readonly libJS: TFlatPackage = this.packageRegister(this.pkgJS, {});
    private readonly libFaust: TFlatPackage = this.packageRegister(this.pkgFaust, {});
    private readonly libMax: TFlatPackage = {};
    private readonly libGen: TFlatPackage = this.packageRegister(this.pkgGen, {});
    constructor(patcherIn: Patcher) {
        this.patcher = patcherIn;
        const { env } = patcherIn;
        // Faust stuffs
        if (!env.faustInjected) {
            this.add(patcherIn.env.faustAdditionalObjects, "js", ["faust"]);
            this.add(patcherIn.env.faustLibObjects, "faust");
        }
        // Window
        this.add({ Window }, "js");
    }
    get patcherMode() {
        return this.patcher.props.mode;
    }
    get activePkg() {
        return this.getPkg(this.patcherMode);
    }
    get activeLib() {
        return this.getLib(this.patcherMode);
    }
    getLib(lib: TPatcherMode) {
        return {
            js: this.libJS,
            faust: this.libFaust,
            max: this.libMax,
            gen: this.libGen
        }[lib];
    }
    getPkg(lib: TPatcherMode) {
        return {
            js: this.pkgJS,
            faust: this.pkgFaust,
            max: this.pkgMax,
            gen: this.pkgGen
        }[lib];
    }
    async getModuleFromURL(address: string, id: string) {
        const toExport: { [key: string]: any } = {}; // Original exports, detect if exports is overwritten.
        window.exports = toExport;
        window.module = { exports: toExport } as any;
        const executor = (resolve: (script: HTMLScriptElement) => void, reject: (reason?: Error) => void) => {
            const script = document.createElement("script");
            script.async = true;
            script.src = address;
            script.type = "module";
            script.addEventListener("load", () => resolve(script));
            script.addEventListener("error", () => reject(new Error(`Error loading script: ${address}`)));
            script.addEventListener("abort", () => reject(new Error(`Script loading aborted: ${address}`)));
            document.head.appendChild(script);
        };
        try {
            await new Promise(executor);
        } catch (e) {
            if (e) this.patcher.error((e as Error).message);
            return toExport;
        }
        const exported = window.module.exports as { [key: string]: any };
        delete window.exports;
        delete window.module;
        if (toExport === exported) return exported;
        return { [id]: exported }; // if exports is overwritten, wrap it
    }
    async importFromNPM(pkgID: string) {
        const id = pkgID.split("/").pop();
        if (id in this.externals) return;
        const jsModule = await this.getModuleFromURL(`https://unpkg.com/${pkgID}`, id);
        const pkg = Importer.import(id, jsModule);
        this.add(pkg, "js", [id]);
    }
    async importFromURL(address: string, id: string) {
        if (id in this.externals) return;
        const jsModule = await this.getModuleFromURL(address, id);
        const pkg = Importer.import(id, jsModule);
        this.add(pkg, "js", [id]);
    }
    add(pkgIn: TPackage, lib: TPatcherMode, pathIn: string[] = []) {
        const path = pathIn.slice();
        let pkg = this.getPkg(lib);
        while (path.length) {
            const key = path.shift();
            if (!pkg[key]) pkg[key] = {};
            else if (typeof pkg[key] === "function" && pkg[key].prototype instanceof BaseObject) pkg[key] = { [Importer.$self]: pkg[key] };
            pkg = pkg[key] as TPackage;
        }
        Object.assign(pkg, pkgIn);
        this.packageRegister(pkgIn, this.getLib(lib), 2, pathIn);
        this.patcher.emit("libChanged", { pkg: this.activePkg, lib: this.activeLib });
    }
    packageRegister(pkg: TPackage, libOut: { [key: string]: typeof AnyObject }, rootifyDepth = Infinity, pathIn?: string[]) {
        const path = pathIn ? pathIn.slice() : [];
        if (path.length && Importer.$self in pkg) {
            const el = pkg[Importer.$self as any];
            if (typeof el === "function" && el.prototype instanceof BaseObject) {
                const full = path.join(".");
                if (full in libOut) this.patcher.newLog("warn", "Patcher", "Path duplicated, cannot register " + full, this);
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
                if (full in libOut) this.patcher.newLog("warn", "Patcher", "Path duplicated, cannot register " + full, this);
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
}
