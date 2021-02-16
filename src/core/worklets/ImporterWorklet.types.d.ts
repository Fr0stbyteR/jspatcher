export type CtorType = `${"Static" | ""}Method` | `${"Static" | ""}SetterGetter` | `${"Static" | ""}Setter` | `${"Static" | ""}Getter` | `${"Static" | ""}Property`;
export interface ObjectDescriptor {
    isObjectDescriptor: true;
    ctor: CtorType,
    path: string[];
    name: string;
}
export type TAbstractPackage = { [key: string]: ObjectDescriptor | TAbstractPackage };

export interface IImporterProcessor {
    importGlobalThis(pkgName: string): TAbstractPackage;
    destroy(): void;
}
export interface IImporterNode {
}
export type ImporterParameters = never;
