import { IJSPatcherObject, IJSPatcherObjectMeta, TInletEvent, TOutletEvent } from "./objects/base/AbstractObject";
import Patcher from "./patcher/Patcher";
import Box from "./patcher/Box";
import Line from "./patcher/Line";
import PatcherHistory from "./patcher/PatcherHistory";
import Env from "./Env";
import { PackageManager } from "./PkgMgr";
import TempPatcherFile from "./patcher/TempPatcherFile";
import TempAudioFile from "./audio/TempAudioFile";
import TempTextFile from "./text/TempTextFile";
import TempData from "./file/TempData";
import PersistentProjectFile from "./file/PersistentProjectFile";

export * from "./objects/base/AbstractObject";

declare global {
    interface Window {
        patcher: Patcher;
        webkitAudioContext?: typeof AudioContext;
        jspatcherEnv: Env;
    }
    interface AudioWorkletGlobalScope {
        jspatcherEnv: Env;
    }
    interface HTMLMediaElement extends HTMLElement {
        sinkId: string;
        setSinkId?(sinkId: string): Promise<undefined>;
    }
}

/** This class will know of if itself is observed and perform reactions when the situation changed. */
export interface IObservee<T = any> {
    addObserver(observer: T): Promise<void>;
    removeObserver(observer: T): Promise<void>;
}

export type PrefixKeys<I, P extends string> = { [K in keyof I & string as `${P}${Capitalize<K>}`]: I[K] };

export interface EnvOptions {
    language: "en" | "zh-CN";
    audioUnit: TAudioUnit;
    audioUnitOptions: AudioUnitOptions;
    audioDisplayOptions: AudioDisplayOptions;
}

export type PatcherMode = "max" | "gen" | "faust" | "js" | "jsaw";

export type PatcherFileExtension = "jspat" | "maxpat" | "gendsp" | "dsppat";

export type AudioFileExtension = "wav" | "aif" | "aiff" | "mp3" | "aac" | "flac" | "ogg" | "m4a";

export type TextFileExtension = "txt" | "json";

export type ImageFileExtension = "apng" | "avif" | "gif" | "jpg" | "jpeg" | "jfif" | "pjpeg" | "pjp" | "png" | "svg" | "webp" | "bmp" | "ico" | "cur" | "tif" | "tiff";

export type VideoFileExtension = "mp4" | "webm" | "3gp";

export type FileExtension = PatcherFileExtension | AudioFileExtension | TextFileExtension | ImageFileExtension | VideoFileExtension;

export type TempItemType = "patcher" | "audio" | "text" | "unknown";

export type SharedItemByType<T extends ProjectItemType> = T extends "patcher" ? TempPatcherFile | PersistentProjectFile : T extends "audio" ? TempAudioFile | PersistentProjectFile : T extends "text" ? TempTextFile | PersistentProjectFile : T extends "image" ? PersistentProjectFile : TempData;

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

export interface ProjectProps {
    name: string;
    author: string;
    version: string;
}

export interface RawProject {
    props: ProjectProps;
    files: RawProjectItems;
    data: TSharedData;
}

export interface RawPatcher {
    lines: Record<string, TLine>;
    boxes: Record<string, TBox>;
    props?: TPublicPatcherProps & Pick<TPatcherProps, "mode">;
}
export interface TPatcherEnv {
    patcher: RawPatcher;
    data: TSharedData;
}

export type TDependencies = [string, string][];

export interface TPatcherProps {
    mode: PatcherMode;
    dependencies: TDependencies;
    bgColor: string;
    editingBgColor: string;
    grid: [number, number];
    boxIndexCount: number;
    lineIndexCount: number;
    package?: string;
    name?: string;
    author?: string;
    version?: string;
    description?: string;
    openInPresentation: boolean;
}
export type TPublicPatcherProps = Pick<TPatcherProps, "dependencies" | "bgColor" | "editingBgColor" | "grid" | "openInPresentation">;

export interface TPatcherState {
    name: string;
    isReady: boolean;
    log: TPatcherLog[];
    history: PatcherHistory;
    selected: string[];
    pkgMgr: PackageManager;
    preventEmitChanged: boolean;
}
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
export interface FileEventMap {
    "ready": boolean;
    "changed": never;
    "destroyed": never;
}
export interface FileState {
    isLoading: boolean;
    isDirty: boolean;
    isMemoryOnly: boolean;
    isEditing: boolean;
}
export interface JSPatcherFile extends FileState {
    type: "patcher" | "audio" | "text";
    createdTime: number;
    lastModifiedTime: number;
    instance: any;
    history: any;
}
export interface PatcherEventMap extends TPublicPatcherProps {
    "postInited": never;
    "ready": never;
    "unload": never;
    "changeBoxText": { box: Box; oldText: string; text: string };
    "passiveDeleteLine": Line;
    "newLog": TPatcherLog;
    "generateCode": string;
    "graphChanged": never;
    "changed": never;
    "ioChanged": IJSPatcherObjectMeta;
    "inlet": TInletEvent<any[]>;
    "outlet": TOutletEvent<any[]>;
    "disconnectAudioInlet": number;
    "disconnectAudioOutlet": number;
    "connectAudioInlet": number;
    "connectAudioOutlet": number;
    "propsChanged": Partial<TPublicPatcherProps>;
    "libChanged": { pkg: TPackage; lib: TFlatPackage };
}

export interface LineEventMap {
    "passData": any;
    "destPosChanged": { top: number; left: number };
    "srcPosChanged": { top: number; left: number };
    "posChanged": Line;
    "typeChanged": TLineType;
}

export interface BoxEventMap {
    "rectChanged": Box;
    "presentationRectChanged": Box;
    "backgroundChanged": Box;
    "presentationChanged": Box;
    "textChanged": Box;
    "highlight": Box;
    "error": string;
    "metaChanged": IJSPatcherObjectMeta;
    "dataUpdated": any;
    "highlightPort": { isSrc: boolean; i: number; highlight: boolean };
    "connectedPort": { isSrc: boolean; i: number; last?: false };
    "disconnectedPort": { isSrc: boolean; i: number; last: boolean };
    "ioCountChanged": Box;
    "updatedFromObject": { args?: any[]; props?: Record<string, any> };
}

export type THistoryElement = {
    [key in keyof PatcherEventMap]?: PatcherEventMap[key][];
};

export type TBPF = string | number | number[] | number[][];
export type TBPFPoint = [number, number, number];
export type TStrictBPF = TBPFPoint[];
export type TMIDIEvent = [number, number, number] | (Uint8Array & { length: 3 });
export type TAudioUnit = "time" | "sample" | "measure";
export type TAudioPlayingState = "stopped" | "paused" | "playing";
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
