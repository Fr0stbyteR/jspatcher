interface PointerDownEvent {
    x: number;
    y: number;
    originalEvent: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent;
}

interface PointerDragEvent {
    prevValue: number;
    x: number;
    y: number;
    fromX: number;
    fromY: number;
    movementX: number;
    movementY: number;
    originalEvent: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent;
}

interface PointerUpEvent {
    x: number;
    y: number;
    originalEvent: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent;
}


declare interface LiveUIProps {
    value: number;
    min: number;
    max: number;
    step: number;
    type: "float" | "int" | "enum";
    enums: string[];
    active: boolean;
    focus: boolean;
    shortName: string;
    longName: string;
    unitStyle: "int" | "float" | "time" | "hertz" | "decibel" | "%" | "pan" | "semitones" | "midi" | "custom" | "native";
    units: string;
    exponent: number;
    speedLim: number;
    frameRate: number;
}
