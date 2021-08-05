import type { IHistoryData } from "../file/History";
import type { PatcherEditorEventMap } from "../patcher/PatcherEditor";
import type { RawPatcher } from "../types";

export interface IPatcherProcessor {
    init(): Promise<void>;
    fn(data: any, port: number): void;
    sync(data: IHistoryData<PatcherEditorEventMap>): void;
    objectEmit(boxId: string, eventName: string, eventData: any): Promise<any>;
    destroy(): void;
}

export interface IPatcherNode {
    outlet(port: number, data: any): void;
    objectEmitFromWorklet(boxId: string, eventName: string, eventData: any): Promise<any>;
}

export type PatcherParameters = string;

export interface PatcherOptions {
    instanceId: string;
    fileId?: string;
    data?: RawPatcher;
}
