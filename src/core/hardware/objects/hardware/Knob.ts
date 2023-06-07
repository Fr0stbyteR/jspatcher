import type { TMetaType } from "../base/AbstractHardwareObject";
import ImageObject from "../base/ImageObject";

export default class Knob extends ImageObject<{}, {}, any[]> {
    static author = "Corvus Prudens";
    static version = "v1.0.0";
    static description = "Daisy Seed SOM";
    static ios = [
        {
            isHot: true,
            pin: { pinName: "", analogOutput: true},
            type: "anything" as TMetaType,
            description: "knob signal",
        }
    ];

    subscribe() {
        super.subscribe();

        this.on("preInit", () => {
            this.ios = [
                {
                    edge: 'B',
                    position: 0.5,
                }
            ]
            this._.key = "https://cdn.discordapp.com/attachments/1049762470694223903/1111059092342063215/knob.png";
            this._.scale = 0.066;
        });
    }
}