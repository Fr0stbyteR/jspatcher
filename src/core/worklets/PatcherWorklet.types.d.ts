import type { PatcherEventMap } from "../patcher/Patcher";

export interface IPatcherProcessor {
    fn(data: any, port: number): void;
    edit(e: PatcherEventMap["remoteEdit"]): void;
}

export interface IPatcherNode {
    outlet(port: number, data: any): void;
}

export type PatcherParameters = string;

export interface PatcherOptions {
    instanceId: string;
}
