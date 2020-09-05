type TFaustUI = TFaustUIItem[];
type TFaustUIItem = TFaustUIInputItem | TFaustUIOutputItem | TFaustUIGroup;
type TFaustUIInputItem = {
    type: TFaustUIInputType;
    label: string;
    address: string;
    index: number;
    init?: number;
    min?: number;
    max?: number;
    step?: number;
    meta?: TFaustUIMeta[];
    layout?: TLayoutProp;
};
type TFaustUIOutputItem = {
    type: TFaustUIOutputType;
    label: string;
    address: string;
    index: number;
    min?: number;
    max?: number;
    meta?: TFaustUIMeta[];
    layout?: TLayoutProp;
};
type TFaustUIMeta = {
    [order: number]: string;
    style?: string; // "knob" | "menu{'Name0':value0;'Name1':value1}" | "radio{'Name0':value0;'Name1':value1}" | "led";
    unit?: string;
    scale?: "linear" | "exp" | "log";
    tooltip?: string;
    hidden?: string;
    [key: string]: string;
};
type TFaustUIGroupType = "vgroup" | "hgroup" | "tgroup";
type TFaustUIOutputType = "hbargraph" | "vbargraph";
type TFaustUIInputType = "vslider" | "hslider" | "button" | "checkbox" | "nentry";
type TFaustUIGroup = {
    type: TFaustUIGroupType;
    label: string;
    items: TFaustUIItem[];
    layout?: TLayoutProp;
};
type TFaustUIType = TFaustUIGroupType | TFaustUIOutputType | TFaustUIInputType;
interface FaustUIEventMap {
    "paramChangeByUI": { path: string; value: number };
    "paramChangeByDSP": { path: string; value: number };
    "uiWillChange": TFaustUI;
    "uiChanged": TFaustUI;
    "uiConnected": TFaustUI;
    "layoutChange": undefined;
}
type TLayoutProp = {
    type: TLayoutType;
    left?: number;
    top?: number;
    offsetLeft?: number; // relative to parent group
    offsetTop?: number;
    width: number;
    height: number;
    sizing: "horizontal" | "vertical" | "both" | "none";
};
type TLayoutType = "vgroup" | "hgroup" | "tgroup" | "hbargraph" | "vbargraph" | "vslider" | "hslider" | "button" | "checkbox" | "nentry" | "knob" | "menu" | "radio" | "led" | "numerical";
type TLayout = { [path: string]: TLayoutProp };
interface LayoutTypeMap {
    "vgroup": TFaustUIGroup;
    "hgroup": TFaustUIGroup;
    "tgroup": TFaustUIGroup;
    "hbargraph": TFaustUIOutputItem;
    "vbargraph": TFaustUIOutputItem;
    "led": TFaustUIOutputItem;
    "numerical": TFaustUIOutputItem;
    "vslider": TFaustUIInputItem;
    "hslider": TFaustUIInputItem;
    "button": TFaustUIInputItem;
    "checkbox": TFaustUIInputItem;
    "nentry": TFaustUIInputItem;
    "knob": TFaustUIInputItem;
    "menu": TFaustUIInputItem;
    "radio": TFaustUIInputItem;
}
