import type { TPresentationRect, TRect } from "../types";
import type { TPatcherProps, TPublicPatcherProps } from "./Patcher";

export interface THardwareLine {
    id?: string;
    aIo: [string, number];
    bIo: [string, number];
    disabled?: boolean;
}
export type THardwareLineType = "analog" | "digital";

export type IoPosition = {
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

/**
 * This interface represents the base structure that all pins should extend.
 * It models and provides information about the pin's capabilities in a visual patching environment.
 * This aids users in making connections that align with real-world applications.
 *
 * @param pinName - The name of the pin, used for code generation purposes.
 * @param tie - (Optional) Indicates if the pin acts as a virtual tie point.
 * @param digitalIO - (Optional) Indicates if the pin is capable of digital input/output operations.
 * @param analogInput - (Optional) Indicates if the pin is capable of analog input operations.
 * @param analogOutput - (Optional) Indicates if the pin is capable of analog output operations.
 * @param pwmOutput - (Optional) Indicates if the pin is capable of Pulse Width Modulation (PWM) output.
 * @param interruptCapable - (Optional) Indicates if the pin can trigger interrupts.
 * @param busCapabilities - (Optional) A record of different bus types that the pin is compatible with.
 * @param specialFunctions - (Optional) Placeholder for any special functions the pin might possess in future. Not currently in use.
 */
interface BasePin {
    pinName: string;
    tie?: boolean;
    digitalInput?: boolean;
    digitalOutput?: boolean;
    analogInput?: boolean;
    analogOutput?: boolean;
    pwmOutput?: boolean;
    interruptCapable?: boolean;
    busCapabilities?: Record<string, I2CBus | SPIBus | I2SBus | USARTBus | USBBus | SDMMCBus>;
    specialFunctions?: string[];
}

/**
 * This interface represents the I2C bus capabilities of a pin.
 * The properties indicate whether the pin is capable of functioning in the specified roles within the I2C bus.
 *
 * @param i2c - Explicitly states that this interface is for an I2C bus.
 * @param sda - Indicates if the pin can function as the Serial Data Line within an I2C bus.
 * @param scl - Indicates if the pin can function as the Serial Clock Line within an I2C bus.
 */
interface I2CBus {
    i2c: boolean;
    sda: boolean; // Serial Data Line
    scl: boolean; // Serial Clock Line
}

/**
 * This interface represents the SPI bus capabilities of a pin.
 * The properties indicate whether the pin is capable of functioning in the specified roles within the SPI bus.
 *
 * @param spi - Explicitly states that this interface is for an SPI bus.
 * @param mosi - Indicates if the pin can function as the Master Out Slave In within an SPI bus.
 * @param miso - Indicates if the pin can function as the Master In Slave Out within an SPI bus.
 * @param sck - Indicates if the pin can function as the Serial Clock within an SPI bus.
 * @param ss - Indicates if the pin can function as the Slave Select within an SPI bus.
 */
interface SPIBus {
    spi: boolean;
    mosi: boolean; // Master Out Slave In
    miso: boolean; // Master In Slave Out
    sck: boolean;  // Serial Clock
    ss: boolean;   // Slave Select
}

/**
 * This interface represents the I2S bus capabilities of a pin.
 * The properties indicate whether the pin is capable of functioning in the specified roles within the I2S bus.
 *
 * @param i2s - Explicitly states that this interface is for an I2S bus.
 * @param ws - Indicates if the pin can function as the Word Select within an I2S bus.
 * @param sd - Indicates if the pin can function as the Serial Data within an I2S bus.
 * @param sck - Indicates if the pin can function as the Serial Clock within an I2S bus.
 */
interface I2SBus {
    i2s: boolean;
    ws: boolean;   // Word Select
    sd: boolean;   // Serial Data
    sck: boolean;  // Serial Clock
}

/**
 * This interface represents the USART bus capabilities of a pin.
 * The properties indicate whether the pin is capable of functioning in the specified roles within the USART bus.
 *
 * @param usart - Explicitly states that this interface is for a USART bus.
 * @param tx - Indicates if the pin can function as the Transmit Data line within a USART bus.
 * @param rx - Indicates if the pin can function as the Receive Data line within a USART bus.
 * @param cts - (Optional) Indicates if the pin can function as the Clear To Send within a USART bus for hardware flow control.
 * @param rts - (Optional) Indicates if the pin can function as the Ready To Send within a USART bus for hardware flow control.
 */
interface USARTBus {
    usart: boolean;
    tx: boolean;  // Transmit data line
    rx: boolean;  // Receive data line
    cts?: boolean; // Clear To Send (Optional, for hardware flow control)
    rts?: boolean; // Ready To Send (Optional, for hardware flow control)
}

/**
 * This interface represents the USB capabilities of a pin.
 * The properties indicate whether the pin is capable of functioning in the specified roles within a USB connection.
 *
 * @param usb - Explicitly states that this interface is for USB.
 * @param dplus - Indicates if the pin can function as the Data Plus line within a USB connection.
 * @param dminus - Indicates if the pin can function as the Data Minus line within a USB connection.
 * @param id - (Optional) Indicates if the pin can function as the ID pin within a USB connection, used in OTG (On-The-Go) devices.
 */
interface USBBus {
    usb: boolean;
    dplus: boolean;  // Data Plus line
    dminus: boolean; // Data Minus line
    id?: boolean;    // ID pin (Optional, used in OTG devices)
}

/**
 * This interface represents the SDMMC (Secure Digital MultiMediaCard) bus capabilities of a pin.
 * The properties indicate whether the pin is capable of functioning in the specified roles within the SDMMC bus.
 *
 * @param sdmmc - Explicitly states that this interface is for an SDMMC bus.
 * @param cmd - Indicates if the pin can function as the Command line within an SDMMC bus.
 * @param clk - Indicates if the pin can function as the Clock line within an SDMMC bus.
 * @param dat0 - Indicates if the pin can function as the Data0 line within an SDMMC bus.
 * @param dat1 - (Optional) Indicates if the pin can function as the Data1 line within an SDMMC bus.
 * @param dat2 - (Optional) Indicates if the pin can function as the Data2 line within an SDMMC bus.
 * @param dat3 - (Optional) Indicates if the pin can function as the Data3 line within an SDMMC bus.
 */
interface SDMMCBus {
    sdmmc: boolean;
    cmd: boolean; // Command line
    clk: boolean; // Clock line
    dat0: boolean; // Data0 line
    dat1?: boolean; // Data1 line (Optional)
    dat2?: boolean; // Data2 line (Optional)
    dat3?: boolean; // Data3 line (Optional)
}

type AnalogInputPin = BasePin & { analogInput: true };
