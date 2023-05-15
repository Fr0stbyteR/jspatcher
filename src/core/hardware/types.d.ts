import type { TPresentationRect, TRect } from "../types";

export interface THardwareLine {
    id?: string;
    aIo: [string, number];
    bIo: [string, number];
    disabled?: boolean;
}
export type THardwareLineType = "analog" | "digital";

export type IoPosition =  {
    edge: "T" | "B" | "L" | "R";
    position: number; // proportion along edge from left-right or top-bottom
}

export interface THardwareBox {
    id?: string;
    text: string;
    ios: IoPosition[];
    rect: TRect;
    presentationRect: TPresentationRect;
    background?: boolean;
    presentation?: boolean;
    zIndex?: number;
    args?: any[];
    props?: Record<string, any>;
    data?: Record<string, any>;
    _editing?: boolean;
}
