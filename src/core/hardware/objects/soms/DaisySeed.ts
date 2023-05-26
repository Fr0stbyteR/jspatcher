import type { TMetaType } from "../base/AbstractHardwareObject";
import ImageObject from "../base/ImageObject";

export class DaisySeed extends ImageObject<{}, {}, any[]> {
    static author = "Corvus Prudens";
    static version = "v1.0.0";
    static description = "Daisy Seed SOM";
    static ios = [
        ...Array.from({length: 40}, (_, i) => ({
            isHot: true,
            type: "anything" as TMetaType,
            description: `pin ${i + 1}`,
        }))
    ];

    subscribe() {
        super.subscribe();

        this.on("preInit", () => {

            const spacing = 1.0 / 20.8;
            const offset = 0.6 * spacing;

            this.ios = [
                ...Array.from({length: 20}, (_, i) => ({
                    edge: 'R' as any,
                    position: offset + spacing * (19 - i),
                })),
                ...Array.from({length: 20}, (_, i) => ({
                    edge: 'L' as any,
                    position: offset + spacing * i,
                })),
            ]
            this._.key = "https://cdn.discordapp.com/attachments/1049762470694223903/1111025669544095806/Daisy_Seed_illustrated_top.png";
            this._.scale = 0.28;
        });
    }
}
