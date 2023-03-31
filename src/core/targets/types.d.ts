import type { IJSPatcherObject, IJSPatcherObjectMeta } from "./objects/base/AbstractObject";
import type { TPatcherProps, TPublicPatcherProps } from "./patcher/Patcher";
import type Patcher from "./patcher/Patcher";
import type Box from "./patcher/Box";
import type TempPatcherFile from "../patcher/TempPatcherFile";
import type TempAudioFile from "../audio/TempAudioFile";
import type TempTextFile from "../text/TempTextFile";
import type TempData from "../file/TempData";
import type PersistentProjectFile from "../file/PersistentProjectFile";
import type { ProjectProps } from "../Project";

// declare global {
//     interface Window {
//         patcher: Patcher;
//         webkitAudioContext?: typeof AudioContext;
//         jspatcherEnv: Env;
//     }
//     interface AudioWorkletGlobalScope {
//         jspatcherEnv: WorkletEnvProcessor;
//     }
//     interface HTMLMediaElement extends HTMLElement {
//         sinkId: string;
//         setSinkId?(sinkId: string): Promise<undefined>;
//     }
// }

/** This class will know of if itself is observed and perform reactions when the situation changed. */
export interface IObservee<T = any> {
    addObserver(observer: T): Promise<void>;
    removeObserver(observer: T): Promise<void>;
}

export type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array;

export type PrefixKeys<I, P extends string> = { [K in keyof I & string as `${P}${Capitalize<K>}`]: I[K] };

export type PatcherMode = "max" | "gen" | "faust" | "js" | "jsaw";

export type PatcherFileExtension = "jspat" | "maxpat" | "gendsp" | "dsppat";

export type TextFileExtension = "txt" | "json";

export type ImageFileExtension = "apng" | "avif" | "gif" | "jpg" | "jpeg" | "jfif" | "pjpeg" | "pjp" | "png" | "svg" | "webp" | "bmp" | "ico" | "cur" | "tif" | "tiff";

export type VideoFileExtension = "mp4" | "webm" | "3gp";

export type FileExtension = PatcherFileExtension | TextFileExtension | ImageFileExtension | VideoFileExtension;

export type TempItemType = "patcher" | "audio" | "text" | "unknown";

export type SharedItemByType<T extends ProjectItemType> = T extends "patcher" ? TempPatcherFile | PersistentProjectFile : T extends "audio" ? TempAudioFile | PersistentProjectFile : T extends "text" ? TempTextFile | PersistentProjectFile : T extends "image" ? PersistentProjectFile : T extends "video" ? PersistentProjectFile : TempData;

export type TempItemByType<T extends ProjectItemType> = T extends "patcher" ? TempPatcherFile : T extends "audio" ? TempAudioFile : T extends "text" ? TempTextFile : TempData;

export type ProjectItemType = "patcher" | "audio" | "text" | "image" | "video" | "folder" | "unknown";

export type ProjectItemDataType<T extends ProjectItemType = any> = T extends "folder" ? RawProjectItems : T extends "patcher" ? RawPatcher : T extends "text" ? string : ArrayBuffer;

export interface RawProjectItem<T extends ProjectItemType = any> {
    id: string;
    type: T;
    isFolder: T extends "folder" ? true : false;
    name: string;
    data?: T extends "folder" ? never : ProjectItemDataType<T>;
    items?: T extends "folder" ? RawProjectItems : never;
}
export type RawProjectItems = RawProjectItem[];

export interface RawProject {
    props: ProjectProps;
    files: RawProjectItems;
}

export interface RawPatcher {
    lines: Record<string, TLine>;
    boxes: Record<string, TBox>;
    props?: TPublicPatcherProps & Pick<TPatcherProps, "mode">;
}

export type TDependencies = [string, string][];

export type TErrorLevel = "error" | "warn" | "info" | "none";

export interface ILogInfo {
    errorLevel: TErrorLevel;
    emitter?: Box | Patcher | any;
    title: string;
    message: string;
    timestamp: number;
}

export type ImportedObjectType = `${"Static" | ""}Method` | `${"Static" | ""}SetterGetter` | `${"Static" | ""}Setter` | `${"Static" | ""}Getter` | `${"Static" | ""}Property`;
export interface ObjectDescriptor {
    isObjectDescriptor: true;
    ctor: ImportedObjectType;
    path: string[];
    name: string;
    meta?: Partial<IJSPatcherObjectMeta>;
}
export type TAbstractPackage = { [key: string]: ObjectDescriptor | TAbstractPackage };
export type TPackage = { [key: string]: typeof IJSPatcherObject | TPackage };
export type TFlatPackage = { [key: string]: typeof IJSPatcherObject };

export interface TLine {
    id?: string;
    src: [string, number];
    dest: [string, number];
    disabled?: boolean;
}
export type TLineType = "normal" | "audio";

export interface TBox {
    id?: string;
    text: string;
    ios: number;
    rect: TRect;
    background?: boolean;
    presentation?: boolean;
    presentationRect?: TPresentationRect;
    zIndex?: number;
    args?: any[];
    props?: Record<string, any>;
    data?: Record<string, any>;
    _editing?: boolean;
}

export type TRect = [number, number, number, number];
export type TPresentationRect = [number | string, number | string, number | string, number | string];

export type TResizeHandlerType = "n" |"ne" |"e" | "se" | "w" | "sw" | "s" | "nw";

export interface TSharedData {
    [category: string]: {
        [key: string]: any;
    };
}
