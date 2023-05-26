import DefaultObject from "./DefaultHardwareObject";
import type { IHardwarePatcherObjectMeta } from "./AbstractHardwareObject";

export default class ExampleObject extends DefaultObject<{}, { editing: boolean }, [any], [any]> {
    static author = "Corvus Prudens";
    static version = "1.0.0";
    static description = "Bypass input";
    static ios: IHardwarePatcherObjectMeta["ios"] = [
        {
            isHot: true,
            type: "anything",
            description: "pin 1"
        },
        {
            isHot: true,
            type: "anything",
            description: "pin 2"
        },
        {
            isHot: true,
            type: "anything",
            description: "pin 3"
        },
    ];
    state = { editing: false };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.ios = [
                {
                    edge: "B",
                    position: 0.3,
                },
                {
                    edge: "B",
                    position: 0.5,
                },
                {
                    edge: "B",
                    position: 0.7,
                },
            ]
        });
        // this.on("inlet", ({ data }) => this.outlet(0, data));
    }
}
