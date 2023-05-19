import DefaultObject from "./DefaultHardwareObject";
import type { IHardwarePatcherObjectMeta } from "./AbstractHardwareObject";

export default class EmptyObject extends DefaultObject<{}, { editing: boolean }, [any], [any]> {
    static author = "Corvus Prudens";
    static version = "1.0.0";
    static description = "Bypass input";
    static ios: IHardwarePatcherObjectMeta["ios"] = [{
        isHot: true,
        type: "anything",
        description: "output same thing"
    },
    {
        isHot: true,
        type: "anything",
        description: "output same thing"
    }];
    state = { editing: false };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.ios = [
                {
                    edge: "T",
                    position: 0.5,
                },
                {
                    edge: "B",
                    position: 0.5,
                }
            ]
        });
        // this.on("inlet", ({ data }) => this.outlet(0, data));
    }
}
