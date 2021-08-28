import TypedEventEmitter from "../utils/TypedEventEmitter";
import { ImporterDirSelfObject } from "../utils/symbols";
import { isJSPatcherObjectConstructor, IJSPatcherObject } from "./objects/base/AbstractObject";
import type { TFlatPackage, TPackage } from "./types";
import type Patcher from "./patcher/Patcher";

export interface PackageManagerEventMap {
    "pathDuplicated": string;
}
export interface PackageInfo {
    id: string;
    url: string;
    enabled: boolean;
    isBuiltIn: boolean;
}

export interface IPackageManager extends TypedEventEmitter<PackageManagerEventMap> {
    pkg: TPackage;
    lib: TFlatPackage;
    readonly packagesInfo: PackageInfo[];
    init(): Promise<void>;
    importFromURL(url: string, id: string): Promise<void>;
    searchInPkg(query: string, limit: number, staticMethodOnly: boolean, pkg: TPackage, path?: string[]): { path: string[]; object?: typeof IJSPatcherObject | TPackage }[];
    searchInLib(query: string, limit: number, staticMethodOnly: boolean, lib: TFlatPackage): { key: string; object: typeof IJSPatcherObject }[];
    getFromPath(pathIn: (string | symbol)[], pkg: TPackage): TPackage | typeof IJSPatcherObject;
}

export default class PackageManager extends TypedEventEmitter<PackageManagerEventMap> implements IPackageManager {
    private readonly patcher: Patcher;
    pkg: TPackage;
    lib: TFlatPackage;
    get global() {
        return this.patcher.env.pkgMgr;
    }
    get mode() {
        return this.patcher.props.mode;
    }
    get patcherDependencies() {
        return this.patcher.props.dependencies;
    }
    get patcherDependenciesNames() {
        return this.patcher.props.dependencies.map(t => t[0]);
    }
    get packagesInfo() {
        return Object.keys(this.global[this.mode]).map(id => ({
            id,
            isBuiltIn: this.global.builtInPackagesNames.indexOf(id) !== -1,
            url: this.global.importedPackages.find(p => p.name === id)?.baseUrl,
            enabled: id in this.pkg
        } as PackageInfo));
    }
    constructor(patcher: Patcher) {
        super();
        this.patcher = patcher;
    }
    async init() {
        await this.loadPatcherDependencies();
        this.pkg = {};
        for (const pkgName of Object.keys(this.global[this.mode]).sort((a, b) => (b === "globalThis" ? -1 : 1))) {
            if (this.global.builtInPackagesNames.indexOf(pkgName) !== -1) {
                const pkg = this.global[this.mode][pkgName];
                if (pkg) this.pkg[pkgName] = pkg;
            }
        }
        for (const pkgName of this.patcherDependenciesNames) {
            const pkg = this.global[this.mode][pkgName];
            if (pkg) this.pkg[pkgName] = pkg;
        }
        this.lib = this.packageRegister(this.pkg);
        this.emitLibChanged();
    }
    async loadPatcherDependencies() {
        try {
            await this.patcher.env.taskMgr.newTask(this, `${this.patcher.file?.name || ""} Loading dependencies`, async (onUpdate: (newMsg: string) => any) => {
                for (let i = 0; i < this.patcherDependencies.length; i++) {
                    const [name, url] = this.patcherDependencies[i];
                    onUpdate(`${name} from ${url}`);
                    if (this.global[this.mode][name]) continue;
                    try {
                        await this.global.importFromURL?.(url, name);
                    } catch (e) {
                        throw new Error(`Loading dependency: ${name} from ${url} failed`);
                    }
                }
            });
        } catch (error) {
            this.patcher.error((error as Error).message);
        }
    }
    async importFromURL(url: string, id: string) {
        if (!this.global.importFromURL) throw new Error("Cannot import from this context");
        await this.global.importFromURL(url, id);
        this.init();
        this.emitLibChanged();
    }
    emitLibChanged() {
        this.patcher.emit("libChanged", { pkg: this.pkg, lib: this.lib });
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
