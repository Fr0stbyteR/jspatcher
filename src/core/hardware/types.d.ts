import type { TPresentationRect, TRect } from "../types";
import type { TPatcherProps, TPublicPatcherProps } from "./Patcher";

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
    presentationRect?: TPresentationRect;
    background?: boolean;
    presentation?: boolean;
    zIndex?: number;
    args?: any[];
    props?: Record<string, any>;
    data?: Record<string, any>;
    _editing?: boolean;
}

export interface RawHardwarePatcher {
    lines: Record<string, THardwareLine>;
    boxes: Record<string, THardwareBox>;
    props?: TPublicPatcherProps & Pick<TPatcherProps, "mode">;
}

interface BasePin {
    pinNumber: number;
    digitalIO?: boolean;
    analogInput?: boolean;
    analogOutput?: boolean;
    pwmOutput?: boolean;
    interruptCapable?: boolean;
    busCapabilities?: Record<string, I2CBus | SPIBus | I2SBus | USARTBus | USBBus>;
    specialFunctions?: string[];
}

interface I2CBus {
    i2c: true;
    sda: boolean; // Serial Data Line
    scl: boolean; // Serial Clock Line
}

interface SPIBus {
    spi: true;
    mosi: boolean; // Master Out Slave In
    miso: boolean; // Master In Slave Out
    sck: boolean;  // Serial Clock
    ss: boolean;   // Slave Select
}

interface I2SBus {
    i2s: true;
    ws: boolean;   // Word Select
    sd: boolean;   // Serial Data
    sck: boolean;  // Serial Clock
}

interface USARTBus {
    usart: true;
    tx: boolean;  // Transmit data line
    rx: boolean;  // Receive data line
    cts?: boolean; // Clear To Send (Optional, for hardware flow control)
    rts?: boolean; // Ready To Send (Optional, for hardware flow control)
}

interface USBBus {
    usb: true;
    dplus: boolean;  // Data Plus line
    dminus: boolean; // Data Minus line
    id?: boolean;    // ID pin (Optional, used in OTG devices)
}

type AnalogInputPin = BasePin & { analogInput: true };
