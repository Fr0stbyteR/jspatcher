import { IInletsMeta, IOutletsMeta, TMetaType } from "../../../objects/base/AbstractObject";
import type { IIosMeta, IPropsMeta, THardwareMetaType } from "../base/AbstractHardwareObject";
import ImageObject from "../base/ImageObject";

export default class Knob extends ImageObject<{}, {}, any[], [], any[], [HTMLImageElement], Record<string, any>> {
    static author = "Corvus Prudens";
    static version = "v1.0.0";
    static description = "Unipolar Potentiometer";
    static ios: IIosMeta = [
        {
            pin: { pinName: "signal", analogOutput: true },
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

    static props: IPropsMeta = {
        static_threshold: {
            type: "number",
            default: 0.01,
            description: "Threshold beyond which the knob is considered to be moving at rest",
            alwaysSerialize: true,
        },
        dynamic_threshold: {
            type: "number",
            default: 0.001,
            description: "Threshold beyond which the knob remains active while moving",
            alwaysSerialize: true,
        },
        timeout: {
            type: "number",
            default: 500,
            description: "Timeout in ms after which the knob is considered to be at rest",
            alwaysSerialize: true,
        }
    };

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
