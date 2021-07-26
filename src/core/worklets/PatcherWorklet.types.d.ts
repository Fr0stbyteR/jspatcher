import type { IHistoryData } from "../file/History";
import type { PatcherEditorEventMap } from "../patcher/PatcherEditor";

export interface IPatcherProcessor {
    init(): Promise<void>;
    fn(data: any, port: number): void;
    sync(data: IHistoryData<PatcherEditorEventMap>): void;
}

export interface IPatcherNode {
    outlet(port: number, data: any): void;
}

export type PatcherParameters = string;

export interface PatcherOptions {
    instanceId: string;
}
