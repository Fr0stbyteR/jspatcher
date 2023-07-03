import { IInletsMeta } from "../../../objects/base/AbstractObject";
import type { IIosMeta, THardwareMetaType } from "../base/AbstractHardwareObject";
import ImageObject from "../base/ImageObject";

export default class Gpo extends ImageObject<{}, {}, any[], any[], []> {
    static author = "Corvus Prudens";
    static version = "v1.1.0";
    static description = "GPIO output";
    static ios: IIosMeta = [
        {
            pin: { pinName: "gpio", digitalOutput: true },
            type: "anything",
            description: "GPIO pin",
        },
        {
            pin: { pinName: "gpio", digitalOutput: true },
            type: "anything",
            description: "GPIO pin",
        }
    ];

    static patcherInlets: IInletsMeta = [
        {
            isHot: true,
            type: "number",
            description: "Set GPIO output"
        }
    ];

    subscribe() {
        super.subscribe();

        this.on("preInit", () => {
            this.ios = [
                {
                    edge: 'L',
                    position: 0.5,
                },
                {
                    edge: 'R',
                    position: 0.5,
                }
            ]
            this._.key = "https://cdn.discordapp.com/attachments/1049762470694223903/1111057050642960446/switch.png";
            this._.scale = 0.05;
        });
    }
}
