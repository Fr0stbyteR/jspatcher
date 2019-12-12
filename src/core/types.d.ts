import { SemanticICONS } from "semantic-ui-react";
import { BaseObject, AnyObject, AbstractObject } from "./objects/Base";
import Patcher from "./Patcher";
import Box from "./Box";
import Line from "./Line";
import History from "./History";
import Env from "../env";

declare global {
    interface Window {
        patcher: Patcher;
        webkitAudioContext?: typeof AudioContext;
        jspatcherEnv: Env;
    }
}

type TPatcherMode = "max" | "gen" | "faust" | "js";

type TPatcher = {
    lines: { [key: string]: TLine };
    boxes: { [key: string]: TBox };
    props?: {};
};

type TPatcherProps = {
    mode: TPatcherMode;
    bgcolor: TRect;
    editing_bgcolor: TRect;
    grid: [number, number];
    boxIndexCount: number;
    lineIndexCount: number;
};

type TPatcherState = {
    isLoading: boolean;
    locked: boolean;
    presentation: boolean;
    showGrid: boolean;
    snapToGrid: boolean;
    log: TPatcherLog[];
    history: History;
    lib: { [key: string]: typeof AnyObject };
    libJS: { [key: string]: typeof AnyObject };
    libMax: { [key: string]: typeof AnyObject };
    libGen: { [key: string]: typeof AnyObject };
    libFaust: { [key: string]: typeof AnyObject };
    selected: string[];
};

type TErrorLevel = "error" | "warn" | "info" | "none"

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
        bgcolor: TRect;
        editing_bgcolor: TRect;
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
type TAudioNodeInletConnection<T = AudioNode | AudioParam> = { node: T; index?: T extends AudioNode ? number : never };
type TAudioNodeOutletConnection = { node: AudioNode; index: number };

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

interface PatcherEventMap {
    "loaded": Patcher;
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
    "moved": { selected: string[]; delta: { x: number; y: number } };
    "resized": { selected: string[]; delta: { x: number; y: number }; type: TResizeHandlerType };
    "generateCode": string;
    "graphChanged": any;
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
    "resized": Box;
    "presentationRectChanged": Box;
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
type TPropMeta = {
    type: TMetaType;
    enums?: string[];
    default: any;
    group?: string;
    description: string;
    isUIState?: boolean;
};
type TPropsMeta = { [key: string]: TPropMeta };
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

type BaseUIState = {
    hidden: boolean;
    ignoreClick: boolean;
    hint: string;
};
type DefaultUIState = {
    bgColor: string;
    borderColor: string;
    textColor: string;
    fontFamily: string;
    fontSize: number;
    fontStyle: "normal" | "italic" | "oblique";
    fontWeight: "normal" | "bold" | "lighter" | "bolder" | number;
    textAlign: "center" | "left" | "right";
} & BaseUIState;

type Data<T> = T extends AbstractObject<infer D, any, any, any, any, any, any, any> ? D : never;
type State<T> = T extends AbstractObject<any, infer S, any, any, any, any, any, any> ? S : never;
type Inputs<T> = T extends AbstractObject<any, any, infer I, any, any, any, any, any> ? I : never;
type Outputs<T> = T extends AbstractObject<any, any, any, infer O, any, any, any, any> ? O : never;
type Args<T> = T extends AbstractObject<any, any, any, any, infer A, any, any, any> ? A : never;
type Props<T> = T extends AbstractObject<any, any, any, any, any, infer P, any, any> ? P : never;
type UIState<T> = T extends AbstractObject<any, any, any, any, any, any, infer U, any> ? U : never;
type EventMap<T> = T extends AbstractObject<any, any, any, any, any, any, any, infer E> ? E : never;
type TInletEvent<I extends any[] = [], $ extends keyof Pick<I, number> = keyof Pick<I, number>> = { inlet: $; data: I[$] };
type ObjectEventMap<I extends any[], A extends any[], P, U, E> = {
    "preInit": null;
    "update": { args?: Partial<A>; props?: Partial<P> };
    "updateArgs": Partial<A>;
    "updateProps": Partial<P>;
    "postInit": null;
    "uiUpdate": Partial<U> | null;
    "inlet": TInletEvent<I>;
    "connectedInlet": { inlet: number; srcBox: Box; srcOutlet: number; lineID: string };
    "connectedOutlet": { outlet: number; destBox: Box; destInlet: number; lineID: string };
    "disconnectedInlet": { inlet: number; srcBox: Box; srcOutlet: number; lineID: string };
    "disconnectedOutlet": { outlet: number; destBox: Box; destInlet: number; lineID: string };
    "destroy": AnyObject;
    "metaChanged": TMeta;
} & E;
type THistoryElement = {
    [key in keyof PatcherEventMap]?: PatcherEventMap[key][];
};

type TBPF = string | number | number[] | number[][];
type TMIDIEvent = [number, number, number] | (Uint8Array & { length: 3 });
