import { SemanticICONS } from "semantic-ui-react";
import { BaseObject, AnyObject, AbstractObject } from "./objects/Base";
import Patcher from "./Patcher";
import Box from "./Box";
import Line from "./Line";
import History from "./History";
import Env from "../env";
import PackageManager from "./PkgMgr";
import SharedData from "./Shared";

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

type TPatcherMode = "max" | "gen" | "faust" | "js";

type TPatcher = {
    lines: { [key: string]: TLine };
    boxes: { [key: string]: TBox };
    props?: {};
};
type TPatcherEnv = {
    patcher: TPatcher;
    data: TSharedData;
};

type TDependencies = { [name: string]: string };

type TPatcherProps = {
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
type TPublicPatcherProps = Pick<TPatcherProps, "dependencies" | "bgColor" | "editingBgColor" | "grid" | "openInPresentation">;

type TPatcherState = {
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
type TPublicPatcherState = Pick<TPatcherState, "locked" | "presentation" | "showGrid" | "snapToGrid">;

type TErrorLevel = "error" | "warn" | "info" | "none";

type TPatcherLog = {
    errorLevel: TErrorLevel;
    emitter?: any;
    title: string;
    message: string;
};

type TMaxPatcher = {
    patcher: {
        lines: TMaxLine[];
        boxes: TMaxBox[];
        rect: number[];
        bgcolor: [number, number, number, number];
        editing_bgcolor: [number, number, number, number];
        gridsize: [number, number];
        [key: string]: any;
    };
};
type TMaxBox = {
    box: {
        id: string;
        maxclass: "newobj" | string;
        text?: string;
        numinlets: number;
        numoutlets: number;
        patching_rect: TRect;
        presentation_rect?: TRect;
        background?: number;
        presentation?: number;
    };
};

type TMaxLine = {
    patchline: {
        destination: [string, number];
        source: [string, number];
        order: number;
        midpoints: number[];
    };
};

type TMaxClipboard = {
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
type TPackage = { [key: string]: typeof AnyObject | TPackage };
type TFlatPackage = { [key: string]: typeof AnyObject };
type TAudioNodeInletConnection<T = AudioNode | AudioParam> = { node: T; index?: T extends AudioNode ? number : never };
type TAudioNodeOutletConnection = { node: AudioNode; index: number };
type TPatcherAudioConnection = { node: GainNode; index: number };

declare type TLine = {
    id?: string;
    src: [string, number];
    dest: [string, number];
    disabled?: boolean;
};
type TLineType = "normal" | "audio";

type TBox = {
    id?: string;
    text: string;
    inlets: number;
    outlets: number;
    rect: TRect;
    background?: boolean;
    presentation?: boolean;
    presentationRect?: TRect;
    args?: any[];
    props?: { [key: string]: any };
    data?: { [key: string]: any };
    _editing?: boolean;
};

type TRect = [number, number, number, number];

type TResizeHandlerType = "n" |"ne" |"e" | "se" | "w" | "sw" | "s" | "nw";

type TSharedData = {
    [category: string]: {
        [key: string]: any;
    };
};
type TSharedDataConsumers = {
    [category: string]: {
        [key: string]: Set<BaseObject>;
    };
};

interface PatcherEventMap extends TPublicPatcherProps, TPublicPatcherState {
    "loading": string[] | undefined;
    "ready": never;
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
    "moved": { selected: string[]; delta: { x: number; y: number }; presentation: boolean };
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
    "dockUI": Box;
}

interface LineEventMap {
    "passData": any;
    "destPosChanged": { top: number; left: number };
    "srcPosChanged": { top: number; left: number };
    "posChanged": Line;
    "typeChanged": TLineType;
}

interface BoxEventMap {
    "rectChanged": Box;
    "presentationRectChanged": Box;
    "presentationResized": Box;
    "backgroundChanged": Box;
    "presentationChanged": Box;
    "textChanged": Box;
    "highlightPort": { isSrc: boolean; i: number; highlight: boolean };
    "connectedPort": { isSrc: boolean; i: number; last?: false };
    "disconnectedPort": { isSrc: boolean; i: number; last: boolean };
    "ioCountChanged": Box;
    "updatedFromObject": { args?: any[]; props?: { [key: string]: any } };
}
type TMetaType = "anything" | "signal" | "object" | "number" | "boolean" | "string" | "function" | "bang" | "color" | "enum";
type TInletMeta = {
    isHot: boolean;
    type: TMetaType;
    enums?: string[];
    varLength?: boolean;
    description: string;
};
type TInletsMeta = TInletMeta[];
type TOutletMeta = {
    type: TMetaType;
    enums?: string[];
    varLength?: boolean;
    description: string;
};
type TOutletsMeta = TOutletMeta[];
type TArgMeta = {
    type: TMetaType;
    enums?: string[];
    optional: boolean;
    default?: any;
    varLength?: boolean;
    description: string;
};
type TArgsMeta = TArgMeta[];
type TPropMeta<T extends any = any> = {
    type: TMetaType;
    enums?: string[];
    default: T;
    group?: string;
    description: string;
    isUIState?: boolean;
};
type TPropsMeta<T extends { [key: string]: any } = { [key: string]: any }> = { [K in keyof T]: TPropMeta<T[K]> };
type TMeta = {
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

type Data<T> = T extends AbstractObject<infer D, any, any, any, any, any, any, any> ? D : never;
type State<T> = T extends AbstractObject<any, infer S, any, any, any, any, any, any> ? S : never;
type Inputs<T> = T extends AbstractObject<any, any, infer I, any, any, any, any, any> ? I : never;
type Outputs<T> = T extends AbstractObject<any, any, any, infer O, any, any, any, any> ? O : never;
type Args<T> = T extends AbstractObject<any, any, any, any, infer A, any, any, any> ? A : never;
type Props<T> = T extends AbstractObject<any, any, any, any, any, infer P, any, any> ? P : never;
type UIState<T> = T extends AbstractObject<any, any, any, any, any, any, infer U, any> ? U : never;
type EventMap<T> = T extends AbstractObject<any, any, any, any, any, any, any, infer E> ? E : never;
type TInletEvent<I extends any[] = any[], $ extends keyof Pick<I, number> = keyof Pick<I, number>> = { inlet: $; data: I[$] };
type TOutletEvent<O extends any[] = any[], $ extends keyof Pick<O, number> = keyof Pick<O, number>> = { outlet: $; data: O[$] };
type ObjectEventMap<I extends any[], A extends any[], P, U, E> = {
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
    "sharedDataUpdated": { category: string; key: string; data: any };
} & E;
type THistoryElement = {
    [key in keyof PatcherEventMap]?: PatcherEventMap[key][];
};

type TBPF = string | number | number[] | number[][];
type TMIDIEvent = [number, number, number] | (Uint8Array & { length: 3 });
