import { SemanticICONS } from "semantic-ui-react";
import { BaseObject, AnyObject, AbstractObject } from "./objects/Base";
import Patcher from "./patcher/Patcher";
import Box from "./patcher/Box";
import Line from "./patcher/Line";
import PatcherHistory from "./patcher/PatcherHistory";
import Env from "./Env";
import SharedData from "./Shared";
import { PackageManager } from "./PkgMgr";
import TempPatcherFile from "./patcher/TempPatcherFile";
import PatcherFile from "./patcher/PatcherFile";
import TempAudioFile from "./audio/TempAudioFile";
import AudioFile from "./audio/AudioFile";
import TempTextFile from "./text/TempTextFile";
import TextFile from "./text/TextFile";
import TempData from "./file/TempData";

declare global {
    interface Window {
        patcher: Patcher;
        webkitAudioContext?: typeof AudioContext;
        jspatcherEnv: Env;
    }
    interface HTMLMediaElement extends HTMLElement {
        sinkId: string;
        setSinkId?(sinkId: string): Promise<undefined>;
    }
}

export interface EnvOptions {
    language: "en" | "zh-CN";
    audioUnit: TAudioUnit;
    audioUnitOptions: AudioUnitOptions;
    audioDisplayOptions: AudioDisplayOptions;
}

export type PatcherMode = "max" | "gen" | "faust" | "js";

export type PatcherFileExtension = "jspat" | "maxpat" | "gendsp" | "dsppat";

export type AudioFileExtension = "wav" | "aif" | "aiff" | "mp3" | "aac" | "flac" | "ogg";

export type TextFileExtension = "txt" | "json";

export type FileExtension = PatcherFileExtension | AudioFileExtension | TextFileExtension;

export type TempItemType = "patcher" | "audio" | "text" | "unknown";

export type SharedItemByType<T extends TempItemType> = T extends "patcher" ? TempPatcherFile | PatcherFile : T extends "audio" ? TempAudioFile | AudioFile : T extends "text" ? TempTextFile | TextFile : TempData;

export type TempItemByType<T extends TempItemType> = T extends "patcher" ? TempPatcherFile : T extends "audio" ? TempAudioFile : T extends "text" ? TempTextFile : TempData;

export type ProjectItemType = "patcher" | "audio" | "text" | "folder" | "unknown";

export type ProjectItemDataType<T extends ProjectItemType = any> = T extends "folder" ? RawProjectItems : T extends "patcher" ? RawPatcher : T extends "text" ? string : ArrayBuffer;

export interface RawProjectItem<T extends ProjectItemType = any> {
    type: T;
    name: string;
    data: T extends "folder" ? never : ProjectItemDataType<T>;
    items: T extends "folder" ? RawProjectItems : never;
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
    dataConsumers: TSharedDataConsumers;
    dataMgr: SharedData;
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
export type TPackage = { [key: string]: typeof AnyObject | TPackage };
export type TFlatPackage = { [key: string]: typeof AnyObject };
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
export interface TSharedDataConsumers {
    [category: string]: {
        [key: string]: Set<BaseObject>;
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
    history: any
}
export interface PatcherEventMap extends TPublicPatcherProps {
    "postInited": never;
    "ready": never;
    "unload": never;
    "changeBoxText": { box: Box; oldText: string; text: string };
    "newLog": TPatcherLog;
    "generateCode": string;
    "graphChanged": never;
    "changed": never;
    "ioChanged": TMeta;
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
    "metaChanged": TMeta;
    "dataUpdated": any;
    "highlightPort": { isSrc: boolean; i: number; highlight: boolean };
    "connectedPort": { isSrc: boolean; i: number; last?: false };
    "disconnectedPort": { isSrc: boolean; i: number; last: boolean };
    "ioCountChanged": Box;
    "updatedFromObject": { args?: any[]; props?: Record<string, any> };
}
export type TMetaType = "anything" | "signal" | "object" | "number" | "boolean" | "string" | "function" | "bang" | "color" | "enum";
export type TInletMeta = {
    isHot: boolean;
    type: TMetaType;
    enums?: string[];
    varLength?: boolean;
    description: string;
};
export type TInletsMeta = TInletMeta[];
export type TOutletMeta = {
    type: TMetaType;
    enums?: string[];
    varLength?: boolean;
    description: string;
};
export type TOutletsMeta = TOutletMeta[];
export type TArgMeta = {
    type: TMetaType;
    enums?: string[];
    optional: boolean;
    default?: any;
    varLength?: boolean;
    description: string;
};
export type TArgsMeta = TArgMeta[];
export type TPropMeta<T extends any = any> = {
    type: TMetaType;
    enums?: T[];
    default: T;
    group?: string;
    description: string;
    isUIState?: boolean;
};
export type TPropsMeta<T extends Record<string, any> = Record<string, any>> = { [K in keyof T]: TPropMeta<T[K]> };
export type TMeta = {
    package: string; // div will have class "package-name" "package-name-objectname"
    name: string;
    icon: SemanticICONS; // semantic icon to display in UI
    author: string;
    version: string;
    description: string;
    inlets: TInletsMeta;
    outlets: TOutletsMeta;
    args: TArgsMeta;
    props: TPropsMeta;
};

export type Data<T> = T extends AbstractObject<infer D, any, any, any, any, any, any, any> ? D : never;
export type State<T> = T extends AbstractObject<any, infer S, any, any, any, any, any, any> ? S : never;
export type Inputs<T> = T extends AbstractObject<any, any, infer I, any, any, any, any, any> ? I : never;
export type Outputs<T> = T extends AbstractObject<any, any, any, infer O, any, any, any, any> ? O : never;
export type Args<T> = T extends AbstractObject<any, any, any, any, infer A, any, any, any> ? A : never;
export type Props<T> = T extends AbstractObject<any, any, any, any, any, infer P, any, any> ? P : never;
export type UIState<T> = T extends AbstractObject<any, any, any, any, any, any, infer U, any> ? U : never;
export type EventMap<T> = T extends AbstractObject<any, any, any, any, any, any, any, infer E> ? E : never;
export type TInletEvent<I extends any[] = any[], $ extends keyof Pick<I, number> = keyof Pick<I, number>> = { inlet: $; data: I[$] };
export type TOutletEvent<O extends any[] = any[], $ extends keyof Pick<O, number> = keyof Pick<O, number>> = { outlet: $; data: O[$] };
export type ObjectEventMap<D, S, I extends any[], A extends any[], P, U, E> = {
    "preInit": never;
    "update": { args?: Partial<A>; props?: Partial<P> };
    "updateArgs": Partial<A>;
    "updateProps": Partial<P>;
    "postInit": never;
    "uiUpdate": Partial<U> | never;
    "inlet": TInletEvent<I>;
    "connectedInlet": { inlet: number; srcBox: Box; srcOutlet: number; lineID: string };
    "connectedOutlet": { outlet: number; destBox: Box; destInlet: number; lineID: string };
    "disconnectedInlet": { inlet: number; srcBox: Box; srcOutlet: number; lineID: string };
    "disconnectedOutlet": { outlet: number; destBox: Box; destInlet: number; lineID: string };
    "destroy": AnyObject;
    "metaChanged": TMeta;
    "dataUpdated": Partial<D>;
    "stateUpdated": Partial<S>;
    "sharedDataUpdated": { category: string; key: string; data: any };
} & E;
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
