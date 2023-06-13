import { IInletsMeta, IOutletsMeta, TMetaType } from "../../../objects/base/AbstractObject";
import type { IIosMeta, THardwareMetaType } from "../base/AbstractHardwareObject";
import ImageObject from "../base/ImageObject";

export default class Knob extends ImageObject<{}, {}, any[], [], any[]> {
    static author = "Corvus Prudens";
    static version = "v1.0.0";
    static description = "Daisy Seed SOM";
    static ios: IIosMeta = [
        {
            pin: { pinName: "", analogOutput: true },
            type: "anything",
            description: "knob signal",
        }
    ];
    static patcherOutlets: IOutletsMeta = [
        {
            type: "number",
            description: "Knob voltage"
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
