import { IInletsMeta, IOutletsMeta, TMetaType } from "../../../objects/base/AbstractObject";
import type { IIosMeta, IPropsMeta, THardwareMetaType } from "../base/AbstractHardwareObject";
import DefaultObject from "../base/DefaultHardwareObject";

export default class Cv extends DefaultObject<{}, {}, any[], [], any[], [HTMLImageElement], Record<string, any>> {
    static author = "Corvus Prudens";
    static version = "v1.0.0";
    static description = "CV Input";
    static ios: IIosMeta = [
        {
            pin: { pinName: "signal", analogOutput: true },
            type: "anything",
            description: "CV signal",
        }
    ];
    static patcherOutlets: IOutletsMeta = [
        {
            type: "number",
            description: "CV level"
        }
    ];

    static props: IPropsMeta = {
        bipolar: {
            type: "number",
            default: 0,
            description: "determines whether the input is bipolar (i.e. if the input voltage can dip below 0 volts)",
            alwaysSerialize: true,
        },
        flip: {
            type: "number",
            default: 0,
            description: "determines whether the input is flipped (i.e. 1.f - input) or not before being processed",
            alwaysSerialize: true,
        },
        invert: {
            type: "number",
            default: 0,
            description: "determines whether the input is inverted (i.e. -1.f * input) or note before being processed",
            alwaysSerialize: true,
        },
        slew_seconds: {
            type: "number",
            default: 0.002,
            description: "the slew time in seconds that it takes for the control to change to a new value",
            alwaysSerialize: true,
        }
    };

    subscribe() {
        super.subscribe();

        this.on("preInit", () => {
            this.ios = [
                {
                    edge: 'T',
                    position: 0.5,
                }
            ]
        });
    }
}
