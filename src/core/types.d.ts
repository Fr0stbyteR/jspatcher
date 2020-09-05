import { SemanticICONS } from "semantic-ui-react";
import { BaseObject, AnyObject, AbstractObject } from "./objects/Base";
import Patcher from "./Patcher";
import Box from "./Box";
import Line from "./Line";
import History from "./History";
import Env from "../env";
import SharedData from "./Shared";
import { PackageManager } from "./PkgMgr";

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

export type TPatcherMode = "max" | "gen" | "faust" | "js";

export type TPatcher = {
    lines: Record<string, TLine>;
    boxes: Record<string, TBox>;
    props?: {};
};
export type TPatcherEnv = {
    patcher: TPatcher;
    data: TSharedData;
};

export type TDependencies = [string, string][];

export type TPatcherProps = {
    mode: TPatcherMode;
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
};
export type TPublicPatcherProps = Pick<TPatcherProps, "dependencies" | "bgColor" | "editingBgColor" | "grid" | "openInPresentation">;

export type TPatcherState = {
    name: string;
    isLoading: boolean;
    locked: boolean;
    presentation: boolean;
    showGrid: boolean;
    snapToGrid: boolean;
    log: TPatcherLog[];
    history: History;
    selected: string[];
    pkgMgr: PackageManager;
    dataConsumers: TSharedDataConsumers;
    dataMgr: SharedData;
};
export type TPublicPatcherState = Pick<TPatcherState, "locked" | "presentation" | "showGrid" | "snapToGrid">;

export type TErrorLevel = "error" | "warn" | "info" | "none";

export type TPatcherLog = {
    errorLevel: TErrorLevel;
    emitter?: Box | Patcher | any;
    title: string;
    message: string;
};

export type TMaxPatcher = {
    patcher: {
        lines: TMaxLine[];
        boxes: TMaxBox[];
        rect: number[];
        bgcolor: [number, number, number, number];
        editing_bgcolor: [number, number, number, number]; // eslint-disable-line camelcase
        gridsize: [number, number];
        [key: string]: any;
    };
};
export type TMaxBox = {
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
};

export type TMaxLine = {
    patchline: {
        destination: [string, number];
        source: [string, number];
        order: number;
        midpoints: number[];
    };
};

export type TMaxClipboard = {
    boxes: TMaxBox[];
    lines: TMaxLine[];
    appversion: {
        major: number;
        minor: number;
        revision: number;
        architecture: string;
        modernui: number;
    };
};
export type TPackage = { [key: string]: typeof AnyObject | TPackage };
export type TFlatPackage = { [key: string]: typeof AnyObject };
export type TAudioNodeInletConnection<T = AudioNode | AudioParam> = { node: T; index?: T extends AudioNode ? number : never };
export type TAudioNodeOutletConnection = { node: AudioNode; index: number };
export type TPatcherAudioConnection = { node: GainNode; index: number };

export type TLine = {
    id?: string;
    src: [string, number];
    dest: [string, number];
    disabled?: boolean;
};
export type TLineType = "normal" | "audio";

export type TBox = {
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
};

export type TRect = [number, number, number, number];
export type TPresentationRect = [number | string, number | string, number | string, number | string];

export type TResizeHandlerType = "n" |"ne" |"e" | "se" | "w" | "sw" | "s" | "nw";

export type TSharedData = {
    [category: string]: {
        [key: string]: any;
    };
};
export type TSharedDataConsumers = {
    [category: string]: {
        [key: string]: Set<BaseObject>;
    };
};

export interface PatcherEventMap extends TPublicPatcherProps, TPublicPatcherState {
    "loading": string[] | undefined;
    "ready": never;
    "unload": never;
    "locked": boolean;
    "presentation": boolean;
    "showGrid": boolean;
    "create": TPatcher;
    "delete": TPatcher;
    "createBox": Box;
    "deleteBox": Box;
    "createObject": BaseObject;
    "changeBoxText": { box: Box; oldText: string; text: string };
    "createLine": Line;
    "deleteLine": Line;
    "redrawLine": Line;
    "changeLineSrc": { line: Line; oldSrc: [string, number]; src: [string, number] };
    "changeLineDest": { line: Line; oldDest: [string, number]; dest: [string, number] };
    "changeLine": { line: Line; isSrc: boolean; oldPort: [string, number]; port: [string, number] };
    "newLog": TPatcherLog;
    "selected": string[];
    "deselected": string[];
    "tempLine": { findSrc: boolean; from: [string, number] };
    "moving": { selected: string[]; delta: { x: number; y: number }; presentation: boolean };
    "moved": { selected: string[]; delta: { x: number; y: number }; presentation: boolean };
    "resizing": { selected: string[]; delta: { x: number; y: number }; type: TResizeHandlerType; presentation: boolean };
    "resized": { selected: string[]; delta: { x: number; y: number }; type: TResizeHandlerType; presentation: boolean };
    "generateCode": string;
    "graphChanged": never;
    "inlet": TInletEvent<any[]>;
    "outlet": TOutletEvent<any[]>;
    "disconnectAudioInlet": number;
    "disconnectAudioOutlet": number;
    "connectAudioInlet": number;
    "connectAudioOutlet": number;
    "ioChanged": TMeta;
    "stateChanged": Partial<TPublicPatcherState>;
    "propsChanged": Partial<TPublicPatcherProps>;
    "libChanged": { pkg: TPackage; lib: TFlatPackage };
    "changed": never;
    "inspector": Box;
    "dockUI": Box;
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
    enums?: string[];
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
