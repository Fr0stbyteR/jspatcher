import type * as WindowFunction from "window-function";
import type { IJSPatcherObject, IJSPatcherObjectMeta } from "./objects/base/AbstractObject";
import type { TPatcherProps, TPublicPatcherProps } from "./patcher/Patcher";
import type Patcher from "./patcher/Patcher";
import type Box from "./patcher/Box";
import type Env from "./Env";
import type WorkletEnvProcessor from "./worklets/WorkletEnv.worklet";
import type TempPatcherFile from "./patcher/TempPatcherFile";
import type TempAudioFile from "./audio/TempAudioFile";
import type TempTextFile from "./text/TempTextFile";
import type TempData from "./file/TempData";
import type PersistentProjectFile from "./file/PersistentProjectFile";
import type { ProjectProps } from "./Project";

declare global {
    interface Window {
        patcher: Patcher;
        webkitAudioContext?: typeof AudioContext;
        jspatcherEnv: Env;
    }
    interface AudioWorkletGlobalScope {
        jspatcherEnv: WorkletEnvProcessor;
    }
    interface HTMLMediaElement extends HTMLElement {
        sinkId: string;
        setSinkId?(sinkId: string): Promise<undefined>;
    }
    interface Crypto {
        randomUUID?(): string;
    }
}

/** This class will know of if itself is observed and perform reactions when the situation changed. */
export interface IObservee<T = any> {
    addObserver(observer: T): Promise<void>;
    removeObserver(observer: T): Promise<void>;
}

export type PrefixKeys<I, P extends string> = { [K in keyof I & string as `${P}${Capitalize<K>}`]: I[K] };

export type PatcherMode = "max" | "gen" | "faust" | "js" | "jsaw";

export type PatcherFileExtension = "jspat" | "maxpat" | "gendsp" | "dsppat";

export type AudioFileExtension = "wav" | "aif" | "aiff" | "mp3" | "aac" | "flac" | "ogg" | "m4a";

export type TextFileExtension = "txt" | "json";

export type ImageFileExtension = "apng" | "avif" | "gif" | "jpg" | "jpeg" | "jfif" | "pjpeg" | "pjp" | "png" | "svg" | "webp" | "bmp" | "ico" | "cur" | "tif" | "tiff";

export type VideoFileExtension = "mp4" | "webm" | "3gp";

export type FileExtension = PatcherFileExtension | AudioFileExtension | TextFileExtension | ImageFileExtension | VideoFileExtension;

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

export interface TPatcherLog {
    errorLevel: TErrorLevel;
    emitter?: Box | Patcher | any;
    title: string;
    message: string;
}

export interface TMaxPatcher {
    patcher: {
        lines: TMaxLine[];
        boxes: TMaxBox[];
        rect: number[];
        bgcolor: [number, number, number, number];
        editing_bgcolor: [number, number, number, number]; // eslint-disable-line camelcase
        gridsize: [number, number];
        openinpresentation: number;
        [key: string]: any;
    };
}
export interface TMaxBox {
    box: {
        id: string;
        maxclass: "newobj" | string;
        text?: string;
        numinlets: number;
        numoutlets: number;
        patching_rect: TRect; // eslint-disable-line camelcase
        presentation_rect?: TRect; // eslint-disable-line camelcase
        background?: number;
        presentation?: number;
    };
}

export interface TMaxLine {
    patchline: {
        destination: [string, number];
        source: [string, number];
        order?: number;
        midpoints?: number[];
        hidden?: number;
        disabled?: number;
    };
}

export interface TMaxClipboard {
    boxes: TMaxBox[];
    lines: TMaxLine[];
    appversion: {
        major: number;
        minor: number;
        revision: number;
        architecture: string;
        modernui: number;
    };
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
export type TAudioNodeInletConnection<T = AudioNode | AudioParam> = { node: T; index?: T extends AudioNode ? number : never };
export type TAudioNodeOutletConnection = { node: AudioNode; index: number };
export type TPatcherAudioConnection = { node: GainNode; index: number };

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
    inlets: number;
    outlets: number;
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

export type TBPF = string | number | number[] | number[][];
export type TBPFPoint = [number, number, number];
export type TStrictBPF = TBPFPoint[];
export type TMIDIEvent = [number, number, number] | (Uint8Array & { length: 3 });
export type TAudioUnit = "time" | "sample" | "measure";
export type TAudioPlayingState = "stopped" | "paused" | "playing";
export type TWindowFunction = Exclude<keyof (typeof WindowFunction), "gaussian" | "tukey">;
export interface AudioUnitOptions {
    bpm: number;
    beatsPerMeasure: number;
    division: number;
}
export interface AudioDisplayOptions {
    frameRate: number;
    bgColor: string;
    gridColor: string;
    phosphorColor: string;
    hueOffset: number;
    seperatorColor: string;
    cursorColor: string;
    fftSize: number;
    fftWindowFunction: TWindowFunction;
    fftOverlap: number;
    fftDrawThreshold: number;
}

export interface WaveformMinMaxData {
    min: Float32Array;
    max: Float32Array;
}
export interface WaveformStepData extends Array<WaveformMinMaxData> {
    idx?: Int32Array;
}
export interface WaveformData {
    [step: number]: WaveformStepData;
}
