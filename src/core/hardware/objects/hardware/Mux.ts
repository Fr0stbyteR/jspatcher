import { IOutletsMeta } from "../../../objects/base/AbstractObject";
import { IoPosition } from "../../types";
import type { IIosMeta, THardwareMetaType } from "../base/AbstractHardwareObject";
import DefaultObject from "../base/DefaultHardwareObject";

export default class AMux extends DefaultObject<{}, {}, any[], any[], []> {
    static author = "Corvus Prudens";
    static version = "v1.0.0";
    static description = "Analog multiplexer";
    static ios: IIosMeta = [
        {
            pin: { pinName: "a0", digitalInput: true },
            type: "anything",
            description: "Address pin 0",
        },
        {
            pin: { pinName: "a1", digitalInput: true },
            type: "anything",
            description: "Address pin 1",
        },
        {
            pin: { pinName: "a2", digitalInput: true },
            type: "anything",
            description: "Address pin 2",
        },
        {
            pin: { pinName: "analogOut", analogOutput: true },
            type: "anything",
            description: "Multiplexed analog signal",
        },
        {
            pin: { pinName: "analogIn0", analogInput: true },
            type: "anything",
            description: "Analog signal 0",
        },
        {
            pin: { pinName: "analogIn1", analogInput: true },
            type: "anything",
            description: "Analog signal 1",
        },
        {
            pin: { pinName: "analogIn2", analogInput: true },
            type: "anything",
            description: "Analog signal 2",
        },
        {
            pin: { pinName: "analogIn3", analogInput: true },
            type: "anything",
            description: "Analog signal 3",
        },
        {
            pin: { pinName: "analogIn4", analogInput: true },
            type: "anything",
            description: "Analog signal 4",
        },
        {
            pin: { pinName: "analogIn5", analogInput: true },
            type: "anything",
            description: "Analog signal 5",
        },
        {
            pin: { pinName: "analogIn6", analogInput: true },
            type: "anything",
            description: "Analog signal 6",
        },
        {
            pin: { pinName: "analogIn7", analogInput: true },
            type: "anything",
            description: "Analog signal 7",
        },
    ];

    subscribe() {
        super.subscribe();

        this.on("preInit", () => {
            this.ios = [
                ...Array.from({ length: 4 }, (_, i) => ({
                    edge: 'T',
                    position: 1 / 5 * i + 1 / 10,
                } as IoPosition)),
                ...Array.from({ length: 8 }, (_, i) => ({
                    edge: 'B',
                    position: 1 / 9 * i + 1 / 18,
                } as IoPosition)),
            ]

            this.box.setWidth(8 * 16);
        });
    }
}
