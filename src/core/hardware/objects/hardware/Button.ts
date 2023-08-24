import { IOutletsMeta } from "../../../objects/base/AbstractObject";
import type { IIosMeta, IPropsMeta, THardwareMetaType } from "../base/AbstractHardwareObject";
import DefaultObject from "../base/DefaultHardwareObject";

export default class Button extends DefaultObject<{}, {}, any[], any[], []> {
    static author = "Corvus Prudens";
    static version = "v1.0.0";
    static description = "Momentary push button";
    static ios: IIosMeta = [
        {
            pin: { pinName: "button", digitalOutput: true },
            type: "anything",
            description: "The button's pin",
        }
    ];

    static patcherOutlets: IOutletsMeta = [
        {
            type: "number",
            description: "Current button state"
        },
        {
            type: "bang",
            description: "Rising edge of button press"
        },
        {
            type: "bang",
            description: "Falling edge of button press"
        }
    ];

    static props: IPropsMeta = {
        polarity: {
            type: "number",
            default: 0,
            description: "determines button polarity (0 = active low, 1 = active high)",
            alwaysSerialize: true,
        },
        pull: {
            type: "number",
            default: 0,
            description: "determines if the pull-up or pull-down state (0 = pull-down, 1 = pull-up, 2 = none)",
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
