import { createDefaultMapFromCDN, VirtualTypeScriptEnvironment } from "@typescript/vfs";
import type * as ts from "typescript";
import { TDependencies } from "./types";

export default class TypeScriptEnv implements VirtualTypeScriptEnvironment {
    sys: ts.System;
    languageService: ts.LanguageService;
    getSourceFile: (fileName: string) => ts.SourceFile;
    createFile: (fileName: string, content: string) => void;
    updateFile: (fileName: string, content: string, replaceTextSpan?: ts.TextSpan) => void;

    ts: typeof ts;
    compilerOptions: ts.CompilerOptions;

    urlToFilenameMap: Record<string, string> = {};
    persistentModules: string[] = [];

    async init() {
        const ts = await import("typescript");
        const { createSystem, createVirtualTypeScriptEnvironment } = await import("@typescript/vfs");
        const compilerOptions: ts.CompilerOptions = { target: ts.ScriptTarget.ESNext, lib: ["es2021", "dom"] };
        const fsMap = await createDefaultMapFromCDN(compilerOptions, "4.5.4", true, ts);
        const tsSys = createSystem(fsMap);
        const tsEnv = createVirtualTypeScriptEnvironment(tsSys, [...fsMap.keys()], ts, compilerOptions);
        // const program = tsEnv.languageService.getProgram();
        // const typeChecker = program.getTypeChecker();
        tsEnv.createFile("/index.ts", "//");

        this.sys = tsEnv.sys;
        this.languageService = tsEnv.languageService;
        this.getSourceFile = tsEnv.getSourceFile;
        this.createFile = tsEnv.createFile;
        this.updateFile = tsEnv.updateFile;
        this.ts = ts;
        this.compilerOptions = compilerOptions;
    }
    addPersistentModule(namespace: string, dts: string) {
        this.createFile(`/${namespace}.d.ts`, dts);
        this.persistentModules.push(namespace);
    }
    async addModuleFromURL(dtsUrl: string, id: string) {
        if (!id) throw new Error("No ID for DTS file fetching");
        const r = await fetch(dtsUrl);
        if (!r.ok) throw new Error(r.statusText);
        const text = await r.text();
        const filename = `${id}.d.ts`;
        this.createFile(`/${filename}`, text);
        this.urlToFilenameMap[dtsUrl] = filename;
    }
    getImportString(dependencies: TDependencies) {
        return `\
${this.persistentModules.map(ns => `import * as ${ns} from "./${ns}.d";`).join("\n")}
${dependencies.map((dependency) => {
        const [namespace, url] = dependency;
        const filename = this.urlToFilenameMap[url];
        return filename ? `import * as ${namespace} from "./${filename.replace(/\.ts$/, "")}";` : "";
    }).filter(s => !!s).join("\n")}
`;
    }
}
