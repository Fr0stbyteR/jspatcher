import { IInletsMeta, IOutletsMeta } from "../../../objects/base/AbstractObject";
import { BasePin } from "../../types";
import type { IIosMeta, THardwareMetaType } from "../base/AbstractHardwareObject";
import ImageObject from "../base/ImageObject";


const DaisyPins = [
    {
        pinName: "D0",
        digitalInput: true,
        digitalOutput: true,
        pwmOutput: true,
        busCapabilities: {
            "USB_HS": { usb: true, id: true, dplus: false, dminus: false },
            "UART5": { usart: true, rx: true, tx: false },
            "USART3": { usart: true, cts: false, rts: false, tx: false, rx: false, ck: true },
        }
    },
    {
        pinName: "D1",
        digitalInput: true,
        digitalOutput: true,
        busCapabilities: {
            "SDMMC1": { sdmmc: true, cmd: false, clk: false, dat0: false, dat1: false, dat2: false, dat3: true },
            "USART3": { usart: true, rx: true, tx: false },
            "UART4": { usart: true, rx: true, tx: false },
            "SPI3": { spi: true, miso: true, mosi: false, sck: false, ss: false },
            "I2S3": { i2s: true, sd: true, ws: false, sck: false },
        }
    },
    {
        pinName: "D2",
        digitalInput: true,
        digitalOutput: true,
        busCapabilities: {
            "SDMMC1": { sdmmc: true, cmd: false, clk: false, dat0: false, dat1: false, dat2: true, dat3: false },
            "USART3": { usart: true, rx: false, tx: true },
            "UART4": { usart: true, rx: false, tx: true },
            "SPI3": { spi: true, miso: false, mosi: false, sck: true, ss: false },
            "I2S3": { i2s: true, sd: false, ws: false, sck: true },
        }
    },
    {
        pinName: "D3",
        digitalInput: true,
        digitalOutput: true,
        busCapabilities: {
            "SDMMC1": { sdmmc: true, cmd: false, clk: false, dat0: false, dat1: true, dat2: false, dat3: false },
            "UART5": { usart: true, rx: false, tx: false, cts: true, rts: false },
            "I2S": { i2s: true, sd: false, ws: false, sck: false },
        }
    },
    {
        pinName: "D4",
        digitalInput: true,
        digitalOutput: true,
        busCapabilities: {
            "SDMMC1": { sdmmc: true, cmd: false, clk: false, dat0: true, dat1: false, dat2: false, dat3: false },
            "UART5": { usart: true, rx: false, tx: false, cts: false, rts: true },
        }
    },
    {
        pinName: "D5",
        digitalInput: true,
        digitalOutput: true,
        busCapabilities: {
            "SDMMC1": { sdmmc: true, cmd: true, clk: false, dat0: false, dat1: false, dat2: false, dat3: false },
            "UART5": { usart: true, rx: true, tx: false },
        }
    },
    {
        pinName: "D6",
        digitalInput: true,
        digitalOutput: true,
        busCapabilities: {
            "SDMMC1": { sdmmc: true, cmd: false, clk: true, dat0: false, dat1: false, dat2: false, dat3: false },
            "UART5": { usart: true, rx: false, tx: true },
            "USART3": { usart: true, rx: false, tx: false, cts: false, rts: false, ck: true },
            "SPI3": { spi: true, miso: false, mosi: true, sck: false, ss: false },
            "I2S3": { i2s: true, sd: true, ws: false, sck: false },
        }
    },
    {
        pinName: "D7",
        digitalInput: true,
        digitalOutput: true,
        busCapabilities: {
            "SPI1": { spi: true, miso: false, mosi: false, sck: false, ss: true },
            "I2S1": { i2s: true, sd: false, ws: true, sck: false },
        }
    },
    {
        pinName: "D8",
        digitalInput: true,
        digitalOutput: true,
        busCapabilities: {
            "SPI1": { spi: true, miso: false, mosi: false, sck: true, ss: false },
            "I2S1": { i2s: true, sd: false, ws: false, sck: true },
        }
    },
    {
        pinName: "D9",
        digitalInput: true,
        digitalOutput: true,
        busCapabilities: {
            "SPI1": { spi: true, miso: true, mosi: false, sck: false, ss: false },
            "UART7": { usart: true, rx: false, tx: true },
            "SPI3": { spi: true, miso: true, mosi: false, sck: false, ss: false },
            "I2S1": { i2s: true, sd: true, ws: false, sck: false },
            "SPI6": { spi: true, miso: true, mosi: false, sck: false, ss: false },
        }
    },
    {
        pinName: "D10",
        digitalInput: true,
        digitalOutput: true,
        busCapabilities: {
            "SPI1": { spi: true, mosi: true },
            "UART5": { usart: true, rx: true },
            "I2S1": { i2s: true, sd: true },
            "SPI3": { spi: true, mosi: true },
            "I2S3": { i2s: true, sd: true },
            "SPI6": { spi: true, mosi: true },
            "I2C4": { i2c: true, sda: true }
        }
    },
    {
        pinName: "D11",
        digitalInput: true,
        digitalOutput: true,
        busCapabilities: {
            "I2C1": { i2c: true, scl: true },
            "UART4": { usart: true, rx: true },
            "I2C4": { i2c: true, scl: true }
        }
    },
    {
        pinName: "D12",
        digitalInput: true,
        digitalOutput: true,
        busCapabilities: {
            "I2C1": { i2c: true, sda: true },
            "UART4": { usart: true, tx: true },
            "SPI2": { spi: true, ss: true },
            "I2S2": { i2s: true, ws: true },
            "I2C4": { i2c: true, sda: true }
        }
    },
    {
        pinName: "D13",
        digitalInput: true,
        digitalOutput: true,
        busCapabilities: {
            "USART1": { usart: true, tx: true },
            "LPUART1": { usart: true, tx: true },
            "UART5": { usart: true, tx: true },
            "I2C1": { i2c: true, scl: true },
            "I2C4": { i2c: true, scl: true }
        }
    },
    {
        pinName: "D14",
        digitalInput: true,
        digitalOutput: true,
        busCapabilities: {
            "USART1": { usart: true, rx: true },
            "LPUART1": { usart: true, rx: true },
            "I2C1": { i2c: true, sda: true },
            "I2C4": { i2c: true, sda: true }
        }
    },
    null,
    null,
    null,
    null,
    null,
    null,
    {
        pinName: "A0",
        digitalInput: true,
        digitalOutput: true,
        analogInput: true
    },
    {
        pinName: "A1",
        digitalInput: true,
        digitalOutput: true,
        analogInput: true,
        busCapabilities: {
            "USART2": { usart: true, rx: true }
        }
    },
    {
        pinName: "A2",
        digitalInput: true,
        digitalOutput: true,
        analogInput: true
    },
    {
        pinName: "A3",
        digitalInput: true,
        digitalOutput: true,
        analogInput: true,
        busCapabilities: {
            "SPI1": { spi: true, mosi: true },
            "I2S1": { i2s: true, sd: true },
            "SPI6": { spi: true, mosi: true }
        }
    },
    {
        pinName: "A4",
        digitalInput: true,
        digitalOutput: true,
        analogInput: true,
        busCapabilities: {
            "SPI1": { spi: true, miso: true },
            "I2S1": { i2s: true, sd: true },
            "SPI6": { spi: true, miso: true }
        }
    },
    {
        pinName: "A5",
        digitalInput: true,
        digitalOutput: true,
        analogInput: true
    },
    {
        pinName: "A6",
        digitalInput: true,
        digitalOutput: true,
        analogInput: true,
        busCapabilities: {
            "I2S1": { i2s: true, ws: false, sd: false, sck: true }
        }
    },
    {
        pinName: "A7",
        digitalInput: true,
        digitalOutput: true,
        analogInput: true,
        busCapabilities: {
            "SPI1": { spi: true, mosi: false, miso: false, sck: true, ss: false },
            "SPI6": { spi: true, mosi: false, miso: false, sck: true, ss: false },
            "I2S1": { i2s: true, ws: false, sd: false, sck: true }
        }
    },
    {
        pinName: "A8",
        digitalInput: true,
        digitalOutput: true,
        analogInput: true,
        busCapabilities: {
            "SPI1": { spi: true, mosi: false, miso: false, sck: false, ss: true },
            "SPI3": { spi: true, mosi: false, miso: false, sck: false, ss: true },
            "SPI6": { spi: true, mosi: false, miso: false, sck: false, ss: true },
            "I2S1": { i2s: true, ws: true, sd: false, sck: false },
            "I2S3": { i2s: true, ws: true, sd: false, sck: false }
        }
    },
    {
        pinName: "A9",
        digitalInput: true,
        digitalOutput: true,
        analogInput: true,
        busCapabilities: {
            "UART4": { usart: true, rx: true, tx: false }
        }
    },
    {
        pinName: "A10",
        digitalInput: true,
        digitalOutput: true,
        analogInput: true,
        busCapabilities: {
            "UART4": { usart: true, rx: false, tx: true }
        }
    },
    {
        pinName: "D26",
        digitalInput: true,
        digitalOutput: true,
        busCapabilities: {
            "I2C4": { i2c: true, sda: false, scl: false }
        }
    },
    {
        pinName: "D27",
        digitalInput: true,
        digitalOutput: true,
        busCapabilities: {
            "SAI2": { i2s: true, ws: false, sd: false, sck: false },
            "USART6": { usart: true, rx: true, tx: false },
            "SPI1": { spi: true, mosi: false, miso: true, sck: false, ss: false },
            "I2S1": { i2s: true, ws: false, sd: true, sck: false }
        }
    },
    {
        pinName: "A11",
        digitalInput: true,
        digitalOutput: true,
        analogInput: true,
        busCapabilities: {
            "USART2": { usart: true, rx: false, tx: true }
        }
    },
    {
        pinName: "D29",
        digitalInput: true,
        digitalOutput: true,
        busCapabilities: {
            "USB_HS": { usb: true, dplus: false, dminus: true },
            "USART1": { usart: true, rx: false, tx: true }
        }
    },
    {
        pinName: "D30",
        digitalInput: true,
        digitalOutput: true,
        busCapabilities: {
            "USB_HS": { usb: true, dplus: true, dminus: false },
            "USART1": { usart: true, rx: true, tx: false }
        }
    },
    null,
    null,
    null,
]

export class DaisySeed extends ImageObject<{}, {}, any[], any[], any[]> {
    static author = "Corvus Prudens";
    static version = "v1.0.0";
    static description = "Daisy Seed SOM";
    static ios: IIosMeta = [
        ...DaisyPins.filter(pin => pin != null).map(pin => ({
            type: "anything",
            description: `Pin ${pin.pinName}`,
            pin
        }))
    ];

    static patcherInlets: IInletsMeta = [
        {
            isHot: true,
            type: "signal",
            description: "Audio out left"
        },
        {
            isHot: true,
            type: "signal",
            description: "Audio out right"
        }
    ];

    static patcherOutlets: IOutletsMeta = [
        {
            type: "signal",
            description: "Audio in left"
        },
        {
            type: "signal",
            description: "Audio in right"
        }
    ]

    subscribe() {
        super.subscribe();

        this.on("preInit", () => {

            const spacing = 1.0 / 20.8;
            const offset = 0.6 * spacing;

            const right = [];
            for (let i = 0; i < 20; i++) {
                if (DaisyPins[i] != null) {
                    right.push({
                        edge: "R" as any,
                        position: offset + spacing * i
                    });
                }
            }

            const left = [];
            for (let i = 0; i < 20; i++) {
                if (DaisyPins[20 + i] != null) {
                    left.push({
                        edge: "L" as any,
                        position: offset + spacing * i
                    });
                }
            }

            this.ios = [
                ...right,
                ...left,
            ]
            this._.key = "https://cdn.discordapp.com/attachments/1049762470694223903/1111025669544095806/Daisy_Seed_illustrated_top.png";
            this._.scale = 0.28;
        });

        this.on("postInit", () => this.patcher.changeIO);
    }
}
