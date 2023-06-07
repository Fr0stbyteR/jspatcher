import type { TMetaType } from "../base/AbstractHardwareObject";
import ImageObject from "../base/ImageObject";

export default class Gpio extends ImageObject<{}, {}, any[]> {
    static author = "Corvus Prudens";
    static version = "v1.0.0";
    static description = "Daisy Seed SOM";
    static ios = [
        {
            isHot: true,
            pin: { pinName: "", digitalOutput: true},
            type: "anything" as TMetaType,
            description: "GPIO output",
        },
        {
            isHot: true,
            pin: { pinName: "", digitalOutput: true},
            type: "anything" as TMetaType,
            description: "GPIO output",
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
            this._.key = "https://cdn.discordapp.com/attachments/1049762470694223903/1111057050366132224/pulse.png";
            this._.scale = 0.05;
        });
    }
}
